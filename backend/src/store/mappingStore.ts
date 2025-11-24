/**
 * In-memory data store for mapping entries
 * 
 * This store maintains all mapping relationships and provides
 * query methods for the API endpoints.
 */

import type { MappingEntry, SearchResult } from "../models/mapping.js";

export class MappingStore {
  private entries: Map<string, MappingEntry> = new Map();
  private cisIndex: Map<string, MappingEntry[]> = new Map();
  private isoIndex: Map<string, MappingEntry[]> = new Map();
  private nis2Index: Map<string, MappingEntry[]> = new Map();

  /**
   * Add or update a mapping entry
   */
  addEntry(entry: MappingEntry): void {
    this.entries.set(entry.id, entry);
    this.updateIndexes(entry);
  }

  /**
   * Add multiple entries (for bulk import)
   */
  addEntries(entries: MappingEntry[]): void {
    entries.forEach(entry => this.addEntry(entry));
  }

  /**
   * Get all entries
   */
  getAllEntries(): MappingEntry[] {
    return Array.from(this.entries.values());
  }

  /**
   * Get entry by ID
   */
  getEntry(id: string): MappingEntry | undefined {
    return this.entries.get(id);
  }

  /**
   * Find entries by CIS control or safeguard
   */
  findByCIS(controlId?: string, safeguardId?: string): MappingEntry[] {
    const key = safeguardId 
      ? `${controlId || ""}_${safeguardId}` 
      : controlId || "";
    
    return this.cisIndex.get(key) || [];
  }

  /**
   * Find entries by ISO clause or Annex A
   */
  findByISO(clauseId?: string, annexAId?: string): MappingEntry[] {
    const key = annexAId 
      ? `${clauseId || ""}_${annexAId}` 
      : clauseId || "";
    
    return this.isoIndex.get(key) || [];
  }

  /**
   * Find entries by NIS2 article
   */
  findByNIS2(articleId: string): MappingEntry[] {
    return this.nis2Index.get(articleId) || [];
  }

  /**
   * Search across all frameworks with fuzzy matching
   */
  search(query: string): SearchResult[] {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search CIS
    for (const entry of this.entries.values()) {
      if (entry.cis_control_id?.toLowerCase().includes(lowerQuery) ||
          entry.cis_safeguard_id?.toLowerCase().includes(lowerQuery)) {
        const id = entry.cis_safeguard_id || entry.cis_control_id || "";
        if (!results.find(r => r.framework === "CIS" && r.id === id)) {
          results.push({
            framework: "CIS",
            id,
            label: entry.label || id,
            relatedMappings: this.findByCIS(entry.cis_control_id, entry.cis_safeguard_id)
          });
        }
      }
    }

    // Search ISO
    for (const entry of this.entries.values()) {
      const isoIds = [...entry.iso_27001_clause_ids, ...entry.iso_27001_annex_a_ids];
      for (const isoId of isoIds) {
        if (isoId.toLowerCase().includes(lowerQuery)) {
          if (!results.find(r => r.framework === "ISO" && r.id === isoId)) {
            results.push({
              framework: "ISO",
              id: isoId,
              label: entry.label || isoId,
              relatedMappings: this.findByISO(
                entry.iso_27001_clause_ids[0],
                entry.iso_27001_annex_a_ids[0]
              )
            });
          }
        }
      }
    }

    // Search NIS2
    for (const entry of this.entries.values()) {
      for (const nis2Id of entry.nis2_article_ids) {
        if (nis2Id.toLowerCase().includes(lowerQuery)) {
          if (!results.find(r => r.framework === "NIS2" && r.id === nis2Id)) {
            results.push({
              framework: "NIS2",
              id: nis2Id,
              label: entry.label || nis2Id,
              relatedMappings: this.findByNIS2(nis2Id)
            });
          }
        }
      }
    }

    return results;
  }

  /**
   * Clear all entries (for re-import)
   */
  clear(): void {
    this.entries.clear();
    this.cisIndex.clear();
    this.isoIndex.clear();
    this.nis2Index.clear();
  }

  /**
   * Get count of entries
   */
  getCount(): number {
    return this.entries.size;
  }

  /**
   * Update search indexes when an entry is added
   */
  private updateIndexes(entry: MappingEntry): void {
    // Index by CIS
    if (entry.cis_control_id || entry.cis_safeguard_id) {
      const key = entry.cis_safeguard_id 
        ? `${entry.cis_control_id || ""}_${entry.cis_safeguard_id}` 
        : entry.cis_control_id || "";
      
      if (!this.cisIndex.has(key)) {
        this.cisIndex.set(key, []);
      }
      this.cisIndex.get(key)!.push(entry);
    }

    // Index by ISO
    entry.iso_27001_clause_ids.forEach(clauseId => {
      const key = clauseId;
      if (!this.isoIndex.has(key)) {
        this.isoIndex.set(key, []);
      }
      this.isoIndex.get(key)!.push(entry);
    });

    entry.iso_27001_annex_a_ids.forEach(annexAId => {
      const key = annexAId;
      if (!this.isoIndex.has(key)) {
        this.isoIndex.set(key, []);
      }
      this.isoIndex.get(key)!.push(entry);
    });

    // Index by NIS2
    entry.nis2_article_ids.forEach(articleId => {
      if (!this.nis2Index.has(articleId)) {
        this.nis2Index.set(articleId, []);
      }
      this.nis2Index.get(articleId)!.push(entry);
    });
  }
}

// Singleton instance
export const mappingStore = new MappingStore();

