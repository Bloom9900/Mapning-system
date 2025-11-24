import { useState, useEffect, useMemo } from "react";
import SearchBar from "./SearchBar";
import RowDetailsDrawer from "./RowDetailsDrawer";
import type { MappingEntry } from "../types/mapping";
import { loadCISMappings, exportAsCSV, exportAsJSON } from "../services/dataService";

type SortField = "cis_control_id" | "cis_safeguard_id" | "label" | "relationship_type" | null;
type SortDirection = "asc" | "desc" | null;

export default function CISView() {
  const [query, setQuery] = useState("");
  const [allMappings, setAllMappings] = useState<MappingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedEntry, setSelectedEntry] = useState<MappingEntry | null>(null);

  // Load all CIS mappings on mount
  useEffect(() => {
    setLoading(true);
    loadCISMappings()
      .then(data => {
        setAllMappings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading CIS mappings:", err);
        setLoading(false);
      });
  }, []);

  // Filter mappings based on search query
  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return allMappings;
    }

    const lowerQuery = query.toLowerCase();
    return allMappings.filter(entry => {
      const controlId = entry.cis_control_id?.toLowerCase() || "";
      const safeguardId = entry.cis_safeguard_id?.toLowerCase() || "";
      const label = entry.label?.toLowerCase() || "";
      const notes = entry.notes?.toLowerCase() || "";
      
      return controlId.includes(lowerQuery) || 
             safeguardId.includes(lowerQuery) ||
             label.includes(lowerQuery) ||
             notes.includes(lowerQuery);
    });
  }, [allMappings, query]);

  // Sort filtered results
  const results = useMemo(() => {
    if (!sortField || !sortDirection) {
      return filteredResults;
    }

    return [...filteredResults].sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      switch (sortField) {
        case "cis_control_id":
          aVal = a.cis_control_id || "";
          bVal = b.cis_control_id || "";
          break;
        case "cis_safeguard_id":
          aVal = a.cis_safeguard_id || "";
          bVal = b.cis_safeguard_id || "";
          break;
        case "label":
          aVal = a.label || "";
          bVal = b.label || "";
          break;
        case "relationship_type":
          aVal = a.relationship_type || "";
          bVal = b.relationship_type || "";
          break;
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredResults, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return "⇅";
    if (sortDirection === "asc") return "↑";
    if (sortDirection === "desc") return "↓";
    return "⇅";
  };

  const handleExport = (format: "csv" | "json") => {
    if (format === "csv") {
      exportAsCSV(allMappings);
    } else {
      exportAsJSON(allMappings);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleRowClick = (entry: MappingEntry) => {
    setSelectedEntry(entry);
  };

  const getRelationshipBadge = (type: string) => {
    const badges: Record<string, string> = {
      covers: "badge-success",
      supports: "badge-primary",
      partial: "badge-warning",
      related: "badge-info"
    };
    return badges[type] || "badge-info";
  };

  return (
    <div className="card">
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ marginBottom: "0.5rem", color: "#667eea" }}>CIS Controls & Safeguards View</h2>
        <p style={{ color: "#666" }}>
          Browse and search CIS Controls and Safeguards. See their mappings to ISO 27001 and NIS2 Directive.
        </p>
      </div>
      
      <div style={{ marginBottom: "1.5rem" }}>
        <SearchBar
          placeholder="Search by ID (e.g., '6.3') or title..."
          onSearch={setQuery}
        />
      </div>

      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button onClick={() => handleExport("csv")} className="btn-secondary">
          📥 Export CSV
        </button>
        <button onClick={() => handleExport("json")} className="btn-secondary">
          📥 Export JSON
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      )}

      {!loading && (
        <div>
          <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, color: "#333" }}>
              {query ? `Found ${results.length} mapping(s)` : `All Mappings (${results.length} total)`}
            </h3>
            {query && (
              <button 
                onClick={() => setQuery("")}
                className="btn-outline btn-small"
              >
                Clear Search
              </button>
            )}
          </div>
          
          {results.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th 
                  onClick={() => handleSort("cis_control_id")}
                  style={{ cursor: "pointer", userSelect: "none", position: "relative", paddingRight: "1.5rem" }}
                  title="Click to sort"
                >
                  CIS Control
                  <span style={{ position: "absolute", right: "0.5rem", fontSize: "0.8rem", opacity: sortField === "cis_control_id" ? 1 : 0.5 }}>
                    {getSortIcon("cis_control_id")}
                  </span>
                </th>
                <th 
                  onClick={() => handleSort("cis_safeguard_id")}
                  style={{ cursor: "pointer", userSelect: "none", position: "relative", paddingRight: "1.5rem" }}
                  title="Click to sort"
                >
                  CIS Safeguard
                  <span style={{ position: "absolute", right: "0.5rem", fontSize: "0.8rem", opacity: sortField === "cis_safeguard_id" ? 1 : 0.5 }}>
                    {getSortIcon("cis_safeguard_id")}
                  </span>
                </th>
                <th 
                  onClick={() => handleSort("label")}
                  style={{ cursor: "pointer", userSelect: "none", position: "relative", paddingRight: "1.5rem" }}
                  title="Click to sort"
                >
                  Title
                  <span style={{ position: "absolute", right: "0.5rem", fontSize: "0.8rem", opacity: sortField === "label" ? 1 : 0.5 }}>
                    {getSortIcon("label")}
                  </span>
                </th>
                <th>ISO Annex A</th>
                <th>NIS2 Articles</th>
                <th 
                  onClick={() => handleSort("relationship_type")}
                  style={{ cursor: "pointer", userSelect: "none", position: "relative", paddingRight: "1.5rem" }}
                  title="Click to sort"
                >
                  Relationship
                  <span style={{ position: "absolute", right: "0.5rem", fontSize: "0.8rem", opacity: sortField === "relationship_type" ? 1 : 0.5 }}>
                    {getSortIcon("relationship_type")}
                  </span>
                </th>
                <th>Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((entry, idx) => {
                return (
                  <>
                    <tr key={entry.id || idx} style={{ cursor: "pointer" }}>
                      <td><strong>{entry.cis_control_id || "-"}</strong></td>
                      <td><strong>{entry.cis_safeguard_id || "-"}</strong></td>
                      <td onClick={() => handleRowClick(entry)}>
                        {entry.label ? (
                          <div style={{ color: "#667eea", textDecoration: "underline", cursor: "pointer" }}>
                            <div style={{ fontWeight: "500" }}>{entry.label}</div>
                            {entry.notes && (
                              <div className="description description-truncate" title={entry.notes}>
                                {entry.notes.substring(0, 60)}...
                              </div>
                            )}
                          </div>
                        ) : "-"}
                      </td>
                      <td>
                        {entry.iso_27001_annex_a_ids.length > 0
                          ? entry.iso_27001_annex_a_ids.map(id => (
                              <span key={id} className="badge badge-primary" style={{ marginRight: "0.25rem", display: "inline-block", marginBottom: "0.25rem" }}>
                                {id}
                              </span>
                            ))
                          : "-"}
                      </td>
                      <td>
                        {entry.nis2_article_ids.length > 0
                          ? entry.nis2_article_ids.map(id => (
                              <span key={id} className="badge badge-info" style={{ marginRight: "0.25rem", display: "inline-block", marginBottom: "0.25rem" }}>
                                {id}
                              </span>
                            ))
                          : "-"}
                      </td>
                      <td>
                        <span className={`badge ${getRelationshipBadge(entry.relationship_type)}`}>
                          {entry.relationship_type}
                        </span>
                      </td>
                      <td>
                        {entry.sources.map(source => (
                          <span key={source} className="badge badge-primary" style={{ marginRight: "0.25rem", display: "inline-block", marginBottom: "0.25rem" }}>
                            {source}
                          </span>
                        ))}
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => copyToClipboard(entry.id)}
                          className="btn-small"
                        >
                          📋 Copy
                        </button>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
          </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <p>
                {query ? `No mappings found for "${query}"` : "No mappings available. Import mapping files first."}
              </p>
            </div>
          )}
        </div>
      )}
      
      {selectedEntry && (
        <>
          <div 
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
              cursor: "pointer"
            }}
            onClick={() => setSelectedEntry(null)}
          />
          <RowDetailsDrawer 
            entry={selectedEntry} 
            onClose={() => setSelectedEntry(null)} 
          />
        </>
      )}
    </div>
  );
}
