# Security Framework Mapping Tool - Usage Guide

## Overview

This tool helps you explore and understand relationships between three major security frameworks:
- **CIS Controls v8.1** - Industry-standard security controls and safeguards
- **ISO/IEC 27001:2022** - International information security management standard
- **NIS2 Directive (2022/2555)** - EU cybersecurity directive for essential entities

## Getting Started

### 1. Start the Application

The tool automatically imports mapping files when the server starts. Simply run:

```bash
npm run dev
```

This starts both the backend (port 3001) and frontend (port 3000). Open your browser to `http://localhost:3000`.

### 2. Understanding the Three Views

The tool provides three different perspectives on the same mapping data:

#### 🔷 CIS View
- **Purpose**: Start from a CIS Control or Safeguard
- **Use case**: "I have implemented CIS Safeguard 6.3. What ISO controls and NIS2 articles does it map to?"
- **Shows**: CIS Control/Safeguard → ISO Annex A controls → NIS2 Articles

#### 🔷 NIS2 View
- **Purpose**: Start from a NIS2 Directive article
- **Use case**: "I need to comply with NIS2 Article 12.4.1. Which CIS Controls and ISO controls help me achieve this?"
- **Shows**: NIS2 Article → CIS Controls/Safeguards → ISO Annex A controls

#### 🔷 ISO View
- **Purpose**: Start from an ISO 27001 clause or Annex A control
- **Use case**: "I'm implementing ISO control A.5.36. What CIS Safeguards and NIS2 articles relate to this?"
- **Shows**: ISO Clause/Annex A → CIS Controls/Safeguards → NIS2 Articles

## How to Use the Tool

### Browsing Mappings

1. **Default View**: Each view shows all available mappings by default. Scroll through the table to explore.

2. **Understanding the Table**:
   - **Title**: Short descriptive title of the control/safeguard/article
   - **Description**: Click on any row to expand and see the full description
   - **Badges**: Framework identifiers are shown as colored badges for easy scanning
   - **Relationship Type**: Shows how frameworks relate (covers, supports, partial, related)
   - **Source**: Indicates which official mapping document supports this relationship

### Searching

1. **Use the Search Bar**: Type any part of:
   - Framework ID (e.g., "6.3", "A.5.36", "12.4.1")
   - Title text
   - Description text

2. **Search is Real-time**: Results filter as you type

3. **Clear Search**: Click "Clear Search" to return to viewing all mappings

### Viewing Descriptions

1. **Click Any Row**: Click on a table row to expand and see the full description
2. **Truncated Preview**: Descriptions show a preview (first 60 characters) when collapsed
3. **Full Text**: Expanded rows show the complete description text

### Understanding Relationship Types

- **covers** (green badge): One framework element fully covers another
- **supports** (blue badge): One framework element supports another
- **partial** (orange badge): Partial coverage between frameworks
- **related** (teal badge): General relationship between frameworks

### Exporting Data

1. **CSV Export**: Click "Export CSV" to download all mappings as a CSV file
   - Useful for importing into Excel, databases, or other tools
   - One row per mapping relationship

2. **JSON Export**: Click "Export JSON" to download all mappings as JSON
   - Useful for programmatic access or importing into other tools
   - Includes metadata and grouped structure

## Common Use Cases

### Use Case 1: Compliance Mapping
**Scenario**: "I need to demonstrate NIS2 compliance. Which CIS Controls should I implement?"

1. Go to **NIS2 View**
2. Search for the specific NIS2 article (e.g., "12.4.1")
3. See which CIS Controls and Safeguards map to it
4. Export the results for documentation

### Use Case 2: Gap Analysis
**Scenario**: "I have ISO 27001 controls in place. What CIS Safeguards am I missing?"

1. Go to **ISO View**
2. Browse your implemented ISO controls
3. Check which CIS Safeguards are mapped
4. Identify gaps where CIS Safeguards exist but you don't have corresponding ISO controls

### Use Case 3: Framework Translation
**Scenario**: "My client uses CIS Controls, but I need to map to ISO 27001 for reporting."

1. Go to **CIS View**
2. Search for the CIS Control/Safeguard in question
3. See the mapped ISO Annex A controls
4. Export the mapping for your report

### Use Case 4: Comprehensive View
**Scenario**: "I want to see all relationships for a specific control across all frameworks."

1. Use the search function in any view
2. Search by the control identifier
3. The tool will show all related mappings across all three frameworks

## Data Sources

The mappings are based on official documents:

- **CIS_ISO**: Official CIS mapping document to ISO/IEC 27001:2022
- **CIS_NIS2**: Official CIS mapping document to NIS2 Directive

These files are automatically imported when the server starts. The data is stored in memory and persists while the server is running.

## Important Notes

### Copyright Considerations

- **Descriptions Included**: The tool includes short descriptions and titles from the mapping documents
- **No Full ISO Text**: Full copyrighted control text from ISO 27001 is NOT included
- **For Complete ISO Controls**: Refer to the official ISO/IEC 27001:2022 standard for complete control wording

### Data Persistence

- **In-Memory Storage**: Data is stored in memory while the server runs
- **Auto-Import on Start**: Mapping files are automatically imported when the server starts
- **No Database**: No persistent database is used - data is loaded fresh on each server restart

### Adding New Mappings

To add new mapping files:

1. Place the XLSX file in the project root
2. Update `backend/src/import/autoImport.ts` to include the new file
3. Configure the column mappings to match your spreadsheet structure
4. Restart the server

## Tips for Effective Use

1. **Start Broad, Then Narrow**: Begin by browsing all mappings, then use search to focus
2. **Use Multiple Views**: Check the same control in different views to see all relationships
3. **Export for Analysis**: Export data to CSV/JSON for deeper analysis in other tools
4. **Expand Descriptions**: Click rows to see full descriptions - they contain valuable context
5. **Check Sources**: Verify which official document supports each mapping relationship

## Troubleshooting

### No Mappings Showing
- Check that the server started successfully
- Verify the XLSX files are in the project root
- Check server console for import errors

### Search Not Working
- Ensure you're typing in the search bar
- Try searching by different terms (ID, title, description)
- Clear search to see all results

### Export Not Working
- Ensure the backend server is running
- Check browser console for errors
- Try a different browser if issues persist

## Support

For issues or questions:
1. Check the server console for error messages
2. Verify your mapping files are in the correct format
3. Ensure column mappings match your spreadsheet structure

---

**Remember**: This tool is designed to help you explore relationships between frameworks. Always refer to official framework documents for authoritative control text and implementation guidance.

