/**
 * Example import script for mapping files
 * 
 * Usage: tsx src/scripts/import-mappings.ts <file-path> <source-type>
 * 
 * Example:
 *   tsx src/scripts/import-mappings.ts ../CIS_Controls_v8.1_Mapping_to_ISO.IEC_27001.2022_6_2024_07_15.xlsx CIS_ISO
 */

import { importMappingFile } from "../import/importer.js";
import type { ImportConfig } from "../import/importer.js";
import { mappingStore } from "../store/mappingStore.js";

// Column mappings based on actual spreadsheet structure
const CONFIG_MAP: Record<string, ImportConfig> = {
  CIS_ISO: {
    source: "CIS_ISO",
    sheetName: "All CIS Controls & Safeguards",
    columnMapping: {
      cis_control_id: "CIS Control",
      cis_safeguard_id: "CIS Safeguard",
      iso_27001_annex_a_ids: "Control #", // Contains Annex A identifiers like "A5.9"
      relationship_type: "Relationship",
      notes: "Description", // Safeguard description
      label: "Title" // Safeguard title
    }
  },
  CIS_NIS2: {
    source: "CIS_NIS2",
    sheetName: "Controls v8.1",
    columnMapping: {
      cis_control_id: "CIS Control",
      cis_safeguard_id: "CIS Safeguard",
      nis2_article_ids: "Directive #", // Contains article identifiers like "12.4.1"
      relationship_type: "Relationship",
      notes: "Directive", // NIS2 directive text
      label: "Title" // Safeguard title
    }
  }
};

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error("Usage: tsx src/scripts/import-mappings.ts <file-path> <source-type>");
    console.error("Source types: CIS_ISO, CIS_NIS2");
    process.exit(1);
  }

  const filePath = args[0];
  const sourceType = args[1] as keyof typeof CONFIG_MAP;

  if (!CONFIG_MAP[sourceType]) {
    console.error(`Unknown source type: ${sourceType}`);
    console.error("Available types: CIS_ISO, CIS_NIS2");
    process.exit(1);
  }

  const config = CONFIG_MAP[sourceType];

  try {
    console.log(`Importing ${filePath} as ${sourceType}...`);
    const count = await importMappingFile(filePath, config);
    console.log(`✅ Successfully imported ${count} mapping entries`);
    console.log(`📊 Total mappings in store: ${mappingStore.getCount()}`);
  } catch (error) {
    console.error("❌ Import failed:", error);
    process.exit(1);
  }
}

main();

