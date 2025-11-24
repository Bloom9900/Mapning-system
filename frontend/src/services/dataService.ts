/**
 * Data service for loading mapping data from JSON files
 * Replaces API calls with direct JSON file loading
 */

import type { MappingEntry } from "../types/mapping";

let allMappingsCache: MappingEntry[] | null = null;
let loadingPromise: Promise<MappingEntry[]> | null = null;

/**
 * Load all mappings from JSON file
 */
export async function loadAllMappings(): Promise<MappingEntry[]> {
  if (allMappingsCache) {
    return allMappingsCache;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = fetch("/data/all-mappings.json")
    .then(res => {
      if (!res.ok) {
        throw new Error(`Failed to load mappings: ${res.statusText}`);
      }
      return res.json();
    })
    .then(data => {
      allMappingsCache = data;
      return data;
    })
    .finally(() => {
      loadingPromise = null;
    });

  return loadingPromise;
}

/**
 * Load CIS mappings
 */
export async function loadCISMappings(): Promise<MappingEntry[]> {
  const all = await loadAllMappings();
  return all.filter(e => e.cis_control_id || e.cis_safeguard_id);
}

/**
 * Load ISO mappings
 */
export async function loadISOMappings(): Promise<MappingEntry[]> {
  const all = await loadAllMappings();
  return all.filter(e => 
    e.iso_27001_clause_ids.length > 0 || e.iso_27001_annex_a_ids.length > 0
  );
}

/**
 * Load NIS2 mappings
 */
export async function loadNIS2Mappings(): Promise<MappingEntry[]> {
  const all = await loadAllMappings();
  return all.filter(e => e.nis2_article_ids.length > 0);
}

/**
 * Export mappings as JSON
 */
export function exportAsJSON(entries: MappingEntry[]): void {
  const groupedByCIS: { [key: string]: MappingEntry[] } = {};
  for (const entry of entries) {
    const key = entry.cis_control_id || entry.cis_safeguard_id || "other";
    if (!groupedByCIS[key]) {
      groupedByCIS[key] = [];
    }
    groupedByCIS[key].push(entry);
  }

  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      totalMappings: entries.length
    },
    mappings: entries,
    groupedByCIS
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mappings.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export mappings as CSV
 */
export function exportAsCSV(entries: MappingEntry[]): void {
  const csvRows = entries.map(entry => ({
    cis_control_id: entry.cis_control_id || "",
    cis_safeguard_id: entry.cis_safeguard_id || "",
    iso_27001_clause_ids: entry.iso_27001_clause_ids.join(";"),
    iso_27001_annex_a_ids: entry.iso_27001_annex_a_ids.join(";"),
    nis2_article_ids: entry.nis2_article_ids.join(";"),
    sources: entry.sources.join(";"),
    relationship_type: entry.relationship_type,
    notes: entry.notes || ""
  }));

  const headers = Object.keys(csvRows[0] || {});
  const csvLines = [
    headers.join(","),
    ...csvRows.map(row => 
      headers.map(h => {
        const value = row[h as keyof typeof csvRows[0]] || "";
        return `"${value.toString().replace(/"/g, '""')}"`;
      }).join(",")
    )
  ];

  const csv = csvLines.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mappings.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

