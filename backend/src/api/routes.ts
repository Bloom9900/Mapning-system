/**
 * API routes for the mapping tool
 */

import express from "express";
import type { Request, Response } from "express";
import { mappingStore } from "../store/mappingStore.js";
import type { JSONExport, CSVExportRow } from "../models/mapping.js";

const router = express.Router();

/**
 * GET /api/search?q=query
 * Search across all frameworks
 */
router.get("/search", (req: Request, res: Response) => {
  const query = req.query.q as string;
  if (!query) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }
  
  const results = mappingStore.search(query);
  res.json(results);
});

/**
 * GET /api/cis
 * Get all CIS mappings
 */
router.get("/cis", (req: Request, res: Response) => {
  const allEntries = mappingStore.getAllEntries();
  // Filter to only entries that have CIS data
  const cisEntries = allEntries.filter(e => e.cis_control_id || e.cis_safeguard_id);
  res.json(cisEntries);
});

/**
 * GET /api/cis/:controlId?/:safeguardId?
 * Get mappings for a specific CIS control or safeguard
 */
router.get("/cis/:controlId?", (req: Request, res: Response) => {
  const controlId = req.params.controlId;
  const safeguardId = req.query.safeguardId as string | undefined;
  
  // If no controlId provided, return all CIS entries
  if (!controlId) {
    const allEntries = mappingStore.getAllEntries();
    const cisEntries = allEntries.filter(e => e.cis_control_id || e.cis_safeguard_id);
    return res.json(cisEntries);
  }
  
  const entries = mappingStore.findByCIS(controlId, safeguardId);
  res.json(entries);
});

/**
 * GET /api/iso
 * Get all ISO mappings
 */
router.get("/iso", (req: Request, res: Response) => {
  const allEntries = mappingStore.getAllEntries();
  // Filter to only entries that have ISO data
  const isoEntries = allEntries.filter(e => 
    e.iso_27001_clause_ids.length > 0 || e.iso_27001_annex_a_ids.length > 0
  );
  res.json(isoEntries);
});

/**
 * GET /api/iso/:clauseId?/:annexAId?
 * Get mappings for a specific ISO clause or Annex A
 */
router.get("/iso/:clauseId?", (req: Request, res: Response) => {
  const clauseId = req.params.clauseId;
  const annexAId = req.query.annexAId as string | undefined;
  
  // If no clauseId provided, return all ISO entries
  if (!clauseId) {
    const allEntries = mappingStore.getAllEntries();
    const isoEntries = allEntries.filter(e => 
      e.iso_27001_clause_ids.length > 0 || e.iso_27001_annex_a_ids.length > 0
    );
    return res.json(isoEntries);
  }
  
  const entries = mappingStore.findByISO(clauseId, annexAId);
  res.json(entries);
});

/**
 * GET /api/nis2
 * Get all NIS2 mappings
 */
router.get("/nis2", (req: Request, res: Response) => {
  const allEntries = mappingStore.getAllEntries();
  // Filter to only entries that have NIS2 data
  const nis2Entries = allEntries.filter(e => e.nis2_article_ids.length > 0);
  res.json(nis2Entries);
});

/**
 * GET /api/nis2/:articleId
 * Get mappings for a specific NIS2 article
 */
router.get("/nis2/:articleId", (req: Request, res: Response) => {
  const articleId = req.params.articleId;
  
  // If no articleId provided, return all NIS2 entries
  if (!articleId || articleId === "all") {
    const allEntries = mappingStore.getAllEntries();
    const nis2Entries = allEntries.filter(e => e.nis2_article_ids.length > 0);
    return res.json(nis2Entries);
  }
  
  const entries = mappingStore.findByNIS2(articleId);
  res.json(entries);
});

/**
 * GET /api/export/json
 * Export all mappings as JSON
 */
router.get("/export/json", (req: Request, res: Response) => {
  const entries = mappingStore.getAllEntries();
  
  // Group by CIS control for easier navigation
  const groupedByCIS: { [key: string]: typeof entries } = {};
  for (const entry of entries) {
    const key = entry.cis_control_id || entry.cis_safeguard_id || "other";
    if (!groupedByCIS[key]) {
      groupedByCIS[key] = [];
    }
    groupedByCIS[key].push(entry);
  }
  
  const exportData: JSONExport = {
    metadata: {
      exportDate: new Date().toISOString(),
      totalMappings: entries.length
    },
    mappings: entries,
    groupedByCIS
  };
  
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", "attachment; filename=mappings.json");
  res.json(exportData);
});

/**
 * GET /api/export/csv
 * Export all mappings as CSV
 */
router.get("/export/csv", (req: Request, res: Response) => {
  const entries = mappingStore.getAllEntries();
  
  const csvRows: CSVExportRow[] = entries.map(entry => ({
    cis_control_id: entry.cis_control_id || "",
    cis_safeguard_id: entry.cis_safeguard_id || "",
    iso_27001_clause_ids: entry.iso_27001_clause_ids.join(";"),
    iso_27001_annex_a_ids: entry.iso_27001_annex_a_ids.join(";"),
    nis2_article_ids: entry.nis2_article_ids.join(";"),
    sources: entry.sources.join(";"),
    relationship_type: entry.relationship_type,
    notes: entry.notes || ""
  }));
  
  // Convert to CSV format
  const headers = Object.keys(csvRows[0] || {});
  const csvLines = [
    headers.join(","),
    ...csvRows.map(row => 
      headers.map(h => {
        const value = row[h as keyof CSVExportRow] || "";
        // Escape commas and quotes
        return `"${value.toString().replace(/"/g, '""')}"`;
      }).join(",")
    )
  ];
  
  const csv = csvLines.join("\n");
  
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=mappings.csv");
  res.send(csv);
});

/**
 * GET /api/stats
 * Get statistics about the mapping store
 */
router.get("/stats", (req: Request, res: Response) => {
  const entries = mappingStore.getAllEntries();
  
  const stats = {
    totalMappings: entries.length,
    cisControls: new Set(entries.map(e => e.cis_control_id).filter(Boolean)).size,
    cissafeguards: new Set(entries.map(e => e.cis_safeguard_id).filter(Boolean)).size,
    isoClauses: new Set(entries.flatMap(e => e.iso_27001_clause_ids)).size,
    isoAnnexA: new Set(entries.flatMap(e => e.iso_27001_annex_a_ids)).size,
    nis2Articles: new Set(entries.flatMap(e => e.nis2_article_ids)).size,
    sources: new Set(entries.flatMap(e => e.sources)).size
  };
  
  res.json(stats);
});

export default router;

