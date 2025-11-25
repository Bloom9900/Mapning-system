# Deployment Guide for Vercel

This application has been converted to a **frontend-only** application that can be deployed to Vercel as a static site.

## How It Works

- **No backend needed**: All data is pre-processed and stored as JSON files
- **Client-side only**: All filtering, searching, and exporting happens in the browser
- **Static hosting**: Perfect for Vercel's free tier

## Pre-Deployment Steps

### 1. Export Data to JSON (Local Development)

Before deploying, export the mapping data from the XLSX files to JSON:

```bash
npm run export-data
```

This will:
- Read the XLSX files from the project root
- Process and merge the data
- Export JSON files to `frontend/public/data/`

### 2. Commit the Data Files

**IMPORTANT**: Make sure to commit the exported JSON files to git:

```bash
git add frontend/public/data/*.json
git commit -m "Update mapping data"
```

These files are needed for the Vercel build and must be in the repository.

### 3. Build the Frontend (Optional - for testing)

```bash
cd frontend
npm run build
```

Note: The Vercel build will automatically build the frontend. You don't need to build locally before deploying.

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
4. **IMPORTANT**: In Vercel project settings → General → Root Directory:
   - **Option A (Recommended)**: Set **Root Directory** to: `frontend`
     - This tells Vercel to treat the `frontend` folder as the project root
     - Then update `vercel.json` outputDirectory to: `dist` (instead of `frontend/dist`)
   - **Option B**: Leave Root Directory as root (default)
     - Keep `vercel.json` as is with `outputDirectory: "frontend/dist"`
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

