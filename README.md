# Security Framework Mapping Tool

A local tool for exploring relationships between security frameworks:
- **CIS Controls v8.1** (controls and safeguards)
- **ISO/IEC 27001:2022** (clauses and Annex A)
- **NIS2 Directive 2022/2555**

## Features

- Import official mapping spreadsheets (XLSX/CSV)
- Three search views: CIS-centric, NIS2-centric, ISO-centric
- Fuzzy search with autocomplete
- Export mappings as CSV or JSON
- Completely offline after import
- Clean, minimal UI

## Architecture

- **Backend**: Node.js + TypeScript + Express
- **Frontend**: React + TypeScript + Vite
- **Data Store**: In-memory store with indexing for fast queries

## Project Structure

```
/
├── backend/          # Node.js TypeScript backend
│   ├── src/
│   │   ├── models/   # Core data types
│   │   ├── import/   # XLSX/CSV import pipeline
│   │   ├── store/    # In-memory data store
│   │   ├── api/      # Express API routes
│   │   └── server.ts
│   └── tests/
├── frontend/         # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   └── App.tsx
│   └── public/
└── data/             # Imported mapping data (JSON)
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies for all workspaces
npm install
```

### Development

```bash
# Run both backend and frontend
npm run dev

# The tool will automatically:
# - Start backend on http://localhost:3001
# - Start frontend on http://localhost:3000
# - Auto-import mapping files from project root
```

### First Time Setup

1. **Place your mapping files** in the project root:
   - `CIS_Controls_v8.1_Mapping_to_ISO.IEC_27001.2022_6_2024_07_15.xlsx`
   - `CIS_Controls_v8.1_Mapping_to_NIS2_Directive_2_2025.xlsx`

2. **Start the server**: `npm run dev`

3. **Open your browser**: Navigate to `http://localhost:3000`

The mapping files will be automatically imported when the server starts!

### Auto-Import

Mapping files are **automatically imported** when the server starts! Just place your XLSX files in the project root and start the server.

The column mappings are pre-configured for:
- CIS to ISO mapping (sheet: "All CIS Controls & Safeguards")
- CIS to NIS2 mapping (sheet: "Controls v8.1")

If you need to add new mapping files or change column mappings, edit `backend/src/import/autoImport.ts`.

## Data Model

The unified mapping model (`MappingEntry`) includes:
- CIS control and safeguard IDs
- ISO 27001 clause and Annex A IDs
- NIS2 article IDs
- Source information (which mapping document)
- Relationship type (covers, supports, partial, related)
- Optional notes (non-copyrighted)

## API Endpoints

- `GET /api/search?q=query` - Search across all frameworks
- `GET /api/cis/:controlId?/:safeguardId?` - Get CIS mappings
- `GET /api/iso/:clauseId?/:annexAId?` - Get ISO mappings
- `GET /api/nis2/:articleId` - Get NIS2 mappings
- `GET /api/export/csv` - Export as CSV
- `GET /api/export/json` - Export as JSON
- `GET /api/stats` - Get statistics

## Testing

```bash
cd backend
npm test
```

## Usage Guide

For detailed instructions on how to use the tool, see [USAGE.md](./USAGE.md).

Quick start:
1. Start the server: `npm run dev`
2. Open browser: `http://localhost:3000`
3. Click "📖 How to Use This Tool" for a guide
4. Browse or search mappings in any of the three views

## Monetization

The tool includes optional monetization features:

### Donation System
- Non-invasive donation banner (similar to Wikipedia)
- Users can dismiss the banner
- Footer link for donations
- Configure your PayPal link in `frontend/src/components/DonationBanner.tsx`

### Advertisement System
- Ad placeholders at top and bottom of pages
- Replace `AdPlaceholder` components with your ad network code (Google AdSense, etc.)
- Ad-free purchase option available

### Ad-Free Purchase
- Users can purchase lifetime ad-free access ($9.99)
- Currently uses localStorage (demo mode)
- **To enable real payments**, integrate with:
  - Stripe: Use Stripe Checkout or Payment Intents
  - PayPal: Use PayPal SDK
  - Other: Integrate your preferred payment processor

**Setup Instructions:**
1. **Donations**: Update the PayPal link in `DonationBanner.tsx` (line 40)
2. **Ads**: Replace `AdPlaceholder` components with your ad network code
3. **Payments**: Integrate payment processing in `AdFreeModal.tsx` (replace the demo `handlePurchase` function)

## License

This tool is designed to work with official mapping documents. Ensure you have the right to use the mapping files you import.

**Note on Copyright**: This tool includes short descriptions from mapping documents but does not include full copyrighted ISO 27001 control text. Refer to the official ISO/IEC 27001:2022 standard for complete control wording.

