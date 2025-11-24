/**
 * Frontend types for mapping entries
 * These mirror the backend types but are defined here for frontend use
 */

export type MappingSource = 
  | "CIS_ISO"
  | "CIS_NIS2"
  | "ENISA_NIS2_ISO";

export type RelationshipType = 
  | "covers"
  | "supports"
  | "partial"
  | "related";

export interface MappingEntry {
  id: string;
  cis_control_id?: string;
  cis_safeguard_id?: string;
  iso_27001_clause_ids: string[];
  iso_27001_annex_a_ids: string[];
  nis2_article_ids: string[];
  sources: MappingSource[];
  relationship_type: RelationshipType;
  notes?: string;
  label?: string;
}

