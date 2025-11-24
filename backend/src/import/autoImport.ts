/**
 * Auto-import mapping files on server start
 */

import { importMappingFile, deduplicateEntries } from "./importer.js";
import type { ImportConfig } from "./importer.js";
import { mappingStore } from "../store/mappingStore.js";
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

/**
 * Auto-import mapping files from the project root
 */
export async function autoImportMappings(): Promise<void> {
  // Get the project root (two levels up from backend/src/import)
  const projectRoot = path.resolve(__dirname, "../../..");
  
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

  console.log("📥 Auto-importing mapping files...");
  
  // Import all files first
  for (const { filename, sourceType } of filesToImport) {
    const filePath = path.join(projectRoot, filename);
    
    // Check if file exists
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
      // Continue with other files even if one fails
    }
  }

  // After all files are imported, merge entries with same CIS control/safeguard
  console.log(`   Merging cross-framework mappings...`);
  const allEntries = mappingStore.getAllEntries();
  const merged = deduplicateEntries(allEntries);
  
  // Clear and re-add merged entries
  mappingStore.clear();
  mappingStore.addEntries(merged);
  
  const totalCount = mappingStore.getCount();
  console.log(`📊 Total mappings loaded: ${totalCount} (after merging)`);
  
  if (totalCount === 0) {
    console.log("⚠️  No mappings were imported. Make sure the XLSX files are in the project root.");
  }
}

