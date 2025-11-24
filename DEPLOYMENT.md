# Deployment Guide for Vercel

This application has been converted to a **frontend-only** application that can be deployed to Vercel as a static site.

## How It Works

- **No backend needed**: All data is pre-processed and stored as JSON files
- **Client-side only**: All filtering, searching, and exporting happens in the browser
- **Static hosting**: Perfect for Vercel's free tier

## Pre-Deployment Steps

### 1. Export Data to JSON

Before building, you need to export the mapping data from the XLSX files to JSON:

```bash
npm run export-data
```

This will:
- Read the XLSX files from the project root
- Process and merge the data
- Export JSON files to `frontend/public/data/`

### 2. Build the Frontend

```bash
npm run build
```

This automatically runs `export-data` first, then builds the frontend.

## Deploying to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production:
   ```bash
   vercel --prod
   ```

### Option 2: Using GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. **Important**: In Vercel project settings, set:
   - **Root Directory**: Leave as root (don't change to `frontend`)
   - **Build Command**: `npm run build` (should auto-detect from vercel.json)
   - **Output Directory**: `frontend/dist` (should auto-detect from vercel.json)
5. Deploy!

## Important Notes

- **XLSX files are NOT deployed**: Only the exported JSON files are included
- **Data is static**: To update the data, re-run `npm run export-data` and redeploy
- **No backend required**: The entire app runs client-side

## File Structure

```
frontend/
  ├── public/
  │   └── data/
  │       ├── all-mappings.json      # All mappings
  │       ├── cis-mappings.json     # CIS-only mappings
  │       ├── iso-mappings.json     # ISO-only mappings
  │       └── nis2-mappings.json    # NIS2-only mappings
  └── dist/                          # Built files (generated)
```

## Updating Data

If you need to update the mapping data:

1. Place new XLSX files in the project root
2. Run `npm run export-data`
3. Commit the updated JSON files in `frontend/public/data/`
4. Redeploy to Vercel

## Troubleshooting

### Build fails with "File not found"
- Make sure the XLSX files are in the project root before running `export-data`
- Check that the file names match exactly (case-sensitive)

### Data not loading in production
- Verify that `frontend/public/data/*.json` files exist
- Check browser console for 404 errors
- Ensure the files are committed to git

### Export script fails
- Make sure you've run `npm install` in the root directory
- Ensure the backend workspace has `tsx` installed
- Check that Node.js version is 18+

