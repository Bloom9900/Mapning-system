/**
 * Core data model for security framework mappings
 * 
 * This unified model represents relationships between:
 * - CIS Controls v8.1 (controls and safeguards)
 * - ISO/IEC 27001:2022 (clauses and Annex A)
 * - NIS2 Directive 2022/2555
 */

/**
 * Source identifiers for mapping documents
 */
export type MappingSource = 
  | "CIS_ISO"           // CIS official mapping to ISO 27001
  | "CIS_NIS2"          // CIS official mapping to NIS2
  | "ENISA_NIS2_ISO";   // ENISA mapping between NIS2 and ISO 27001

/**
 * Types of relationships between framework elements
 */
export type RelationshipType = 
  | "covers"      // One framework element fully covers another
  | "supports"    // One framework element supports another
  | "partial"     // Partial coverage
  | "related";    // General relationship

/**
 * Unified mapping entry representing a relationship between framework elements
 */
export interface MappingEntry {
  /** Unique identifier for this mapping entry */
  id: string;
  
  /** CIS Control ID (e.g., "CIS Control 06", "CIS Control 1") */
  cis_control_id?: string;
  
  /** CIS Safeguard ID (e.g., "6.3", "1.1", "1.2") */
  cis_safeguard_id?: string;
  
  /** ISO 27001 clause identifiers (e.g., ["5.2", "6.1"]) */
  iso_27001_clause_ids: string[];
  
  /** ISO 27001 Annex A identifiers (e.g., ["A.5.1", "A.5.36"]) */
  iso_27001_annex_a_ids: string[];
  
  /** NIS2 Directive article identifiers (e.g., ["Art 21(2)(d)", "Art 10(1)"]) */
  nis2_article_ids: string[];
  
  /** Sources that document this mapping */
  sources: MappingSource[];
  
  /** Type of relationship */
  relationship_type: RelationshipType;
  
  /** Optional notes from the mapping document (no copyrighted ISO text) */
  notes?: string;
  
  /** Short label for display (non-copyrighted) */
  label?: string;
}

/**
 * CIS Control metadata (for display and search)
 */
export interface CISControl {
  id: string; // e.g., "CIS Control 06"
  label: string; // Short label
  safeguards: CISSafeguard[];
}

/**
 * CIS Safeguard metadata
 */
export interface CISSafeguard {
  id: string; // e.g., "6.3"
  label: string; // Short label
  control_id: string; // Parent control ID
}

/**
 * ISO 27001 Clause metadata
 */
export interface ISOClause {
  id: string; // e.g., "5.2", "6.1"
  label: string; // Short label
}

/**
 * ISO 27001 Annex A control metadata
 */
export interface ISOAnnexA {
  id: string; // e.g., "A.5.1", "A.5.36"
  label: string; // Short label
}

/**
 * NIS2 Article metadata
 */
export interface NIS2Article {
  id: string; // e.g., "Art 21(2)(d)", "Art 10(1)"
  label: string; // Short label
}

/**
 * Search result for a framework element
 */
export interface SearchResult {
  framework: "CIS" | "ISO" | "NIS2";
  id: string;
  label: string;
  relatedMappings: MappingEntry[];
}

/**
 * Export format for CSV (one row per relationship)
 */
export interface CSVExportRow {
  cis_control_id: string;
  cis_safeguard_id: string;
  iso_27001_clause_ids: string;
  iso_27001_annex_a_ids: string;
  nis2_article_ids: string;
  sources: string;
  relationship_type: string;
  notes: string;
}

/**
 * Export format for JSON (grouped by CIS control)
 */
export interface JSONExport {
  metadata: {
    exportDate: string;
    totalMappings: number;
  };
  mappings: MappingEntry[];
  groupedByCIS?: {
    [controlId: string]: MappingEntry[];
  };
}

