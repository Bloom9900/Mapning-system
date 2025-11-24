/**
 * Express server for the mapping tool API
 */

import express from "express";
import cors from "cors";
import apiRoutes from "./api/routes.js";
import { autoImportMappings } from "./import/autoImport.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api", apiRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  
  // Auto-import mapping files on startup
  await autoImportMappings();
});

