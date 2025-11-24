/**
 * Script to pre-import mapping data and export to JSON for frontend
 * Run this before building: npm run export-data
 */

import { importMappingFile, deduplicateEntries } from "../backend/src/import/importer.js";
import type { ImportConfig } from "../backend/src/import/importer.js";
import { mappingStore } from "../backend/src/store/mappingStore.js";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Column mappings based on actual spreadsheet structure
const CONFIG_MAP: Record<string, ImportConfig> = {
  CIS_ISO: {
    source: "CIS_ISO",
    sheetName: "All CIS Controls & Safeguards",
    columnMapping: {
      cis_control_id: "CIS Control",
      cis_safeguard_id: "CIS Safeguard",
      iso_27001_annex_a_ids: "Control #",
      relationship_type: "Relationship",
      notes: "Description",
      label: "Title"
    }
  },
  CIS_NIS2: {
    source: "CIS_NIS2",
    sheetName: "Controls v8.1",
    columnMapping: {
      cis_control_id: "CIS Control",
      cis_safeguard_id: "CIS Safeguard",
      nis2_article_ids: "Directive #",
      relationship_type: "Relationship",
      notes: "Directive",
      label: "Title"
    }
  }
};

async function main() {
  console.log("📥 Exporting mapping data for frontend...\n");
  
  // Get the project root
  const projectRoot = path.resolve(__dirname, "..");
  
  // Clear the store
  mappingStore.clear();
  
  const filesToImport = [
    {
      filename: "CIS_Controls_v8.1_Mapping_to_ISO.IEC_27001.2022_6_2024_07_15.xlsx",
      sourceType: "CIS_ISO" as const
    },
    {
      filename: "CIS_Controls_v8.1_Mapping_to_NIS2_Directive_2_2025.xlsx",
      sourceType: "CIS_NIS2" as const
    }
  ];

  // Import all files
  for (const { filename, sourceType } of filesToImport) {
    const filePath = path.join(projectRoot, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filename} (skipping)`);
      continue;
    }

    try {
      const config = CONFIG_MAP[sourceType];
      if (!config) {
        console.error(`❌ Unknown source type: ${sourceType}`);
        continue;
      }

      console.log(`   Importing ${filename}...`);
      const count = await importMappingFile(filePath, config);
      console.log(`   ✅ Imported ${count} entries from ${filename}`);
    } catch (error) {
      console.error(`   ❌ Failed to import ${filename}:`, error);
    }
  }

  // Merge entries with same CIS control/safeguard
  console.log(`\n   Merging cross-framework mappings...`);
  const allEntries = mappingStore.getAllEntries();
  const merged = deduplicateEntries(allEntries);
  
  // Clear and re-add merged entries
  mappingStore.clear();
  mappingStore.addEntries(merged);

  const totalCount = mappingStore.getCount();
  console.log(`📊 Total mappings: ${totalCount} (after merging)\n`);

  if (totalCount === 0) {
    console.error("❌ No mappings were imported. Make sure the XLSX files are in the project root.");
    process.exit(1);
  }

  // Export to JSON files
  const allEntriesFinal = mappingStore.getAllEntries();
  
  // Filter by framework
  const cisEntries = allEntriesFinal.filter(e => e.cis_control_id || e.cis_safeguard_id);
  const isoEntries = allEntriesFinal.filter(e => 
    e.iso_27001_clause_ids.length > 0 || e.iso_27001_annex_a_ids.length > 0
  );
  const nis2Entries = allEntriesFinal.filter(e => e.nis2_article_ids.length > 0);

  // Create public directory if it doesn't exist
  const publicDir = path.join(projectRoot, "frontend", "public", "data");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Export all data
  fs.writeFileSync(
    path.join(publicDir, "all-mappings.json"),
    JSON.stringify(allEntriesFinal, null, 2)
  );
  
  fs.writeFileSync(
    path.join(publicDir, "cis-mappings.json"),
    JSON.stringify(cisEntries, null, 2)
  );
  
  fs.writeFileSync(
    path.join(publicDir, "iso-mappings.json"),
    JSON.stringify(isoEntries, null, 2)
  );
  
  fs.writeFileSync(
    path.join(publicDir, "nis2-mappings.json"),
    JSON.stringify(nis2Entries, null, 2)
  );

  console.log("✅ Exported data files:");
  console.log(`   - ${path.join(publicDir, "all-mappings.json")}`);
  console.log(`   - ${path.join(publicDir, "cis-mappings.json")}`);
  console.log(`   - ${path.join(publicDir, "iso-mappings.json")}`);
  console.log(`   - ${path.join(publicDir, "nis2-mappings.json")}`);
  console.log("\n✨ Data export complete!");
}

main().catch(error => {
  console.error("❌ Export failed:", error);
  process.exit(1);
});

