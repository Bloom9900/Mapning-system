/**
 * Import pipeline for XLSX and CSV mapping files
 * 
 * This module handles parsing of official mapping documents and
 * converting them into the unified MappingEntry format.
 */

import { createRequire } from "module";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import type { MappingEntry, MappingSource, RelationshipType } from "../models/mapping.js";
import { mappingStore } from "../store/mappingStore.js";

// Use createRequire for CommonJS module compatibility
const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

/**
 * Configuration for mapping file columns to our schema
 */
export interface ImportConfig {
  source: MappingSource;
  sheetName?: string; // Specific sheet name to read (if not provided, uses first sheet)
  columnMapping: {
    cis_control_id?: string;
    cis_safeguard_id?: string;
    iso_27001_clause_ids?: string;
    iso_27001_annex_a_ids?: string;
    nis2_article_ids?: string;
    relationship_type?: string;
    notes?: string;
    label?: string;
  };
  // Function to parse multi-value fields (comma-separated, etc.)
  parseMultiValue?: (value: string) => string[];
}

/**
 * Import an XLSX file
 */
export function importXLSX(filePath: string, config: ImportConfig): MappingEntry[] {
  const workbook = XLSX.readFile(filePath);
  
  // Use specified sheet name or default to first sheet
  let sheetName = config.sheetName;
  if (!sheetName) {
    sheetName = workbook.SheetNames[0];
  } else if (!workbook.SheetNames.includes(sheetName)) {
    throw new Error(`Sheet "${sheetName}" not found. Available sheets: ${workbook.SheetNames.join(", ")}`);
  }

  // TypeScript strict mode: sheetName might technically be undefined here,
  // but logic above ensures it is set to a valid value.
  const worksheet = workbook.Sheets[sheetName as string];
  const data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

  return processRows(data as Record<string, any>[], config);
}

/**
 * Import a CSV file
 */
export function importCSV(filePath: string, config: ImportConfig): MappingEntry[] {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const data = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true
  });
  
  return processRows(data as Record<string, any>[], config);
}

/**
 * Process raw rows from a spreadsheet into MappingEntry objects
 */
function processRows(
  rows: Record<string, any>[],
  config: ImportConfig
): MappingEntry[] {
  const entries: MappingEntry[] = [];
  const parseMultiValue = config.parseMultiValue || defaultParseMultiValue;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Skip empty rows
    if (Object.values(row).every(v => !v || v.toString().trim() === "")) {
      continue;
    }

    // Normalize ISO Annex A identifiers (e.g., "A5.9" -> "A.5.9")
    const normalizeISOAnnexA = (value: string): string => {
      if (!value) return value;
      const trimmed = value.trim();
      // If it starts with A followed by a number (not A.), add the dot
      // Handles both "A5.9" -> "A.5.9" and leaves "A.5.9" as-is
      return trimmed.replace(/^A(\d)/, "A.$1");
    };

    // Normalize NIS2 article identifiers (e.g., "12.4.1" -> "Art 12.4.1" or keep as-is)
    const normalizeNIS2Article = (value: string): string => {
      if (!value) return value;
      // If it's just numbers/dots, optionally prefix with "Art "
      // For now, keep as-is since the format might vary
      return value.trim();
    };

    const isoAnnexAValues = parseMultiValue(
      getColumnValue(row, config.columnMapping.iso_27001_annex_a_ids) || ""
    ).map(normalizeISOAnnexA).filter(v => v);

    const nis2ArticleValues = parseMultiValue(
      getColumnValue(row, config.columnMapping.nis2_article_ids) || ""
    ).map(normalizeNIS2Article).filter(v => v);

    const entry: MappingEntry = {
      id: generateEntryId(config.source, i),
      cis_control_id: getColumnValue(row, config.columnMapping.cis_control_id),
      cis_safeguard_id: getColumnValue(row, config.columnMapping.cis_safeguard_id),
      iso_27001_clause_ids: parseMultiValue(
        getColumnValue(row, config.columnMapping.iso_27001_clause_ids) || ""
      ),
      iso_27001_annex_a_ids: isoAnnexAValues,
      nis2_article_ids: nis2ArticleValues,
      sources: [config.source],
      relationship_type: (getColumnValue(row, config.columnMapping.relationship_type) || "related") as RelationshipType,
      notes: getColumnValue(row, config.columnMapping.notes),
      label: getColumnValue(row, config.columnMapping.label)
    };

    // Only add entries that have at least one framework identifier
    if (entry.cis_control_id || entry.cis_safeguard_id || 
        entry.iso_27001_clause_ids.length > 0 || 
        entry.iso_27001_annex_a_ids.length > 0 ||
        entry.nis2_article_ids.length > 0) {
      entries.push(entry);
    }
  }

  return entries;
}

/**
 * Get a column value from a row, handling various column name formats
 */
function getColumnValue(row: Record<string, any>, columnName?: string): string | undefined {
  if (!columnName) return undefined;
  
  // Try exact match first
  if (row[columnName] !== undefined) {
    return row[columnName]?.toString().trim() || undefined;
  }
  
  // Try case-insensitive match
  const lowerColumnName = columnName.toLowerCase();
  for (const key in row) {
    if (key.toLowerCase() === lowerColumnName) {
      return row[key]?.toString().trim() || undefined;
    }
  }
  
  return undefined;
}

/**
 * Default parser for multi-value fields (comma, semicolon, or pipe separated)
 */
function defaultParseMultiValue(value: string): string[] {
  if (!value || value.trim() === "") return [];
  
  return value
    .split(/[,;|]/)
    .map(v => v.trim())
    .filter(v => v.length > 0);
}

/**
 * Generate a unique ID for a mapping entry
 */
function generateEntryId(source: MappingSource, index: number): string {
  return `${source}_${Date.now()}_${index}`;
}

/**
 * Deduplicate entries when the same relationship appears in multiple sources
 * Also merges entries that share the same CIS control/safeguard to combine cross-framework mappings
 */
export function deduplicateEntries(entries: MappingEntry[]): MappingEntry[] {
  // First pass: exact relationship deduplication
  const exactMatches = new Map<string, MappingEntry>();
  
  for (const entry of entries) {
    const key = createRelationshipKey(entry);
    
    if (exactMatches.has(key)) {
      // Merge sources and notes for exact matches
      const existing = exactMatches.get(key)!;
      existing.sources = [...new Set([...existing.sources, ...entry.sources])];
      if (entry.notes && !existing.notes?.includes(entry.notes)) {
        existing.notes = existing.notes 
          ? `${existing.notes}; ${entry.notes}`
          : entry.notes;
      }
    } else {
      exactMatches.set(key, { ...entry });
    }
  }
  
  // Second pass: merge entries with same CIS control/safeguard but different framework mappings
  const mergedByCIS = new Map<string, MappingEntry>();
  
  for (const entry of Array.from(exactMatches.values())) {
    // Create a key based on CIS control/safeguard only
    const cisKey = createCISKey(entry);
    
    if (cisKey && mergedByCIS.has(cisKey)) {
      // Merge this entry with existing one
      const existing = mergedByCIS.get(cisKey)!;
      
      // Merge ISO mappings
      existing.iso_27001_clause_ids = [...new Set([...existing.iso_27001_clause_ids, ...entry.iso_27001_clause_ids])];
      existing.iso_27001_annex_a_ids = [...new Set([...existing.iso_27001_annex_a_ids, ...entry.iso_27001_annex_a_ids])];
      
      // Merge NIS2 mappings
      existing.nis2_article_ids = [...new Set([...existing.nis2_article_ids, ...entry.nis2_article_ids])];
      
      // Merge sources
      existing.sources = [...new Set([...existing.sources, ...entry.sources])];
      
      // Keep the most descriptive label
      if (entry.label && (!existing.label || entry.label.length > existing.label.length)) {
        existing.label = entry.label;
      }
      
      // Merge notes from different sources (they may contain different framework descriptions)
      // Prefix each description with its source so we can identify which framework it's from
      if (entry.notes) {
        // Determine source label for this entry
        const sourceLabel = entry.sources.includes("CIS_NIS2") ? "[NIS2]" : 
                           entry.sources.includes("CIS_ISO") ? "[CIS]" : "";
        const prefixedNotes = sourceLabel ? `${sourceLabel} ${entry.notes}` : entry.notes;
        
        if (existing.notes) {
          // Check if existing notes already has a prefix, if not add one
          let existingPrefixed = existing.notes;
          if (!existing.notes.startsWith("[CIS]") && !existing.notes.startsWith("[NIS2]")) {
            // Existing doesn't have prefix - determine from existing sources
            const existingSourceLabel = existing.sources.includes("CIS_NIS2") ? "[NIS2]" : 
                                       existing.sources.includes("CIS_ISO") ? "[CIS]" : "";
            if (existingSourceLabel) {
              existingPrefixed = `${existingSourceLabel} ${existing.notes}`;
            }
          }
          
          // Only add if it's different content (not already included)
          if (!existingPrefixed.includes(prefixedNotes) && prefixedNotes !== existingPrefixed) {
            existing.notes = `${existingPrefixed}\n\n---\n\n${prefixedNotes}`;
          } else {
            existing.notes = existingPrefixed;
          }
        } else {
          // First description - add source label
          existing.notes = prefixedNotes;
        }
      }
      
      // Use the most specific relationship type (prefer "covers" > "supports" > "partial" > "related")
      const relationshipPriority: Record<string, number> = {
        covers: 4,
        supports: 3,
        partial: 2,
        related: 1
      };
      if (relationshipPriority[entry.relationship_type] > relationshipPriority[existing.relationship_type]) {
        existing.relationship_type = entry.relationship_type;
      }
    } else if (cisKey) {
      // New CIS entry
      mergedByCIS.set(cisKey, { ...entry });
    } else {
      // Entry without CIS data - keep as is
      mergedByCIS.set(entry.id, { ...entry });
    }
  }
  
  return Array.from(mergedByCIS.values());
}

/**
 * Create a key for deduplication based on the relationship
 */
function createRelationshipKey(entry: MappingEntry): string {
  const parts = [
    entry.cis_control_id || "",
    entry.cis_safeguard_id || "",
    entry.iso_27001_clause_ids.sort().join(","),
    entry.iso_27001_annex_a_ids.sort().join(","),
    entry.nis2_article_ids.sort().join(","),
    entry.relationship_type
  ];
  return parts.join("|");
}

/**
 * Create a key based on CIS control/safeguard for merging cross-framework mappings
 */
function createCISKey(entry: MappingEntry): string | null {
  if (entry.cis_control_id || entry.cis_safeguard_id) {
    return `${entry.cis_control_id || ""}_${entry.cis_safeguard_id || ""}`;
  }
  return null;
}

/**
 * Import and process a mapping file, then add to store
 */
export async function importMappingFile(
  filePath: string,
  config: ImportConfig
): Promise<number> {
  let entries: MappingEntry[];
  
  if (filePath.endsWith(".xlsx") || filePath.endsWith(".xls")) {
    entries = importXLSX(filePath, config);
  } else if (filePath.endsWith(".csv")) {
    entries = importCSV(filePath, config);
  } else {
    throw new Error(`Unsupported file format: ${filePath}`);
  }
  
  // Deduplicate
  const deduplicated = deduplicateEntries(entries);
  
  // Add to store
  mappingStore.addEntries(deduplicated);
  
  return deduplicated.length;
}

