import { useState, useEffect, useMemo } from "react";
import SearchBar from "./SearchBar";
import RowDetailsDrawer from "./RowDetailsDrawer";
import type { MappingEntry } from "../types/mapping";

type SortField = "iso_27001_annex_a_ids" | "label" | "relationship_type" | null;
type SortDirection = "asc" | "desc" | null;

export default function ISOView() {
  const [query, setQuery] = useState("");
  const [allMappings, setAllMappings] = useState<MappingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedEntry, setSelectedEntry] = useState<MappingEntry | null>(null);

  // Load all ISO mappings on mount
  useEffect(() => {
    setLoading(true);
    fetch("/api/iso")
      .then(res => res.json())
      .then(data => {
        setAllMappings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching ISO mappings:", err);
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
      const clauseIds = entry.iso_27001_clause_ids.join(" ").toLowerCase();
      const annexAIds = entry.iso_27001_annex_a_ids.join(" ").toLowerCase();
      const label = entry.label?.toLowerCase() || "";
      const notes = entry.notes?.toLowerCase() || "";
      
      return clauseIds.includes(lowerQuery) || 
             annexAIds.includes(lowerQuery) ||
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
        case "iso_27001_annex_a_ids":
          aVal = (a.iso_27001_annex_a_ids[0] || "").toLowerCase();
          bVal = (b.iso_27001_annex_a_ids[0] || "").toLowerCase();
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

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // Check if any entries have ISO clauses
  const hasClauses = useMemo(() => {
    return allMappings.some(e => e.iso_27001_clause_ids.length > 0);
  }, [allMappings]);

  return (
    <div className="card">
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ marginBottom: "0.5rem", color: "#667eea" }}>ISO/IEC 27001:2022 View</h2>
        <p style={{ color: "#666" }}>
          Browse and search ISO 27001 Annex A controls. See their mappings to CIS Controls and NIS2 Directive.
        </p>
        {!hasClauses && (
          <div style={{ 
            marginTop: "0.75rem", 
            padding: "0.75rem", 
            background: "#fff3cd", 
            borderRadius: "8px", 
            borderLeft: "4px solid #ffc107",
            fontSize: "0.9rem"
          }}>
            <strong>📝 Note about ISO Clauses:</strong> ISO 27001 has two types of identifiers:
            <ul style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
              <li><strong>Main Clauses</strong> (e.g., "5.2", "6.1") - The main sections of the standard</li>
              <li><strong>Annex A Controls</strong> (e.g., "A.5.36", "A.8.8") - Specific security controls</li>
            </ul>
            The CIS mapping documents only map to <strong>Annex A controls</strong>, not to main clauses. 
            That's why the "ISO Clause" column is empty. All mappings shown are to Annex A controls.
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: "1.5rem" }}>
        <SearchBar
          placeholder="Search by Annex A (e.g., 'A.5.36') or title..."
          onSearch={setQuery}
        />
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
                {hasClauses && (
                  <th>ISO Clause</th>
                )}
                <th 
                  onClick={() => handleSort("iso_27001_annex_a_ids")}
                  style={{ cursor: "pointer", userSelect: "none", position: "relative", paddingRight: "1.5rem" }}
                  title="Click to sort"
                >
                  ISO Annex A
                  <span style={{ position: "absolute", right: "0.5rem", fontSize: "0.8rem", opacity: sortField === "iso_27001_annex_a_ids" ? 1 : 0.5 }}>
                    {getSortIcon("iso_27001_annex_a_ids")}
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
                <th>CIS Control</th>
                <th>CIS Safeguard</th>
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
                const isExpanded = expandedRows.has(entry.id);
                return (
                  <>
                    <tr key={entry.id || idx} style={{ cursor: "pointer" }} onClick={() => toggleRow(entry.id)}>
                      {hasClauses && (
                        <td>
                          {entry.iso_27001_clause_ids.length > 0
                            ? entry.iso_27001_clause_ids.map(id => (
                                <span key={id} className="badge badge-primary" style={{ marginRight: "0.25rem", display: "inline-block", marginBottom: "0.25rem" }}>
                                  {id}
                                </span>
                              ))
                            : "-"}
                        </td>
                      )}
                      <td>
                        {entry.iso_27001_annex_a_ids.length > 0
                          ? entry.iso_27001_annex_a_ids.map(id => (
                              <span key={id} className="badge badge-success" style={{ marginRight: "0.25rem", display: "inline-block", marginBottom: "0.25rem" }}>
                                {id}
                              </span>
                            ))
                          : "-"}
                      </td>
                      <td onClick={() => handleRowClick(entry)}>
                        {entry.label ? (
                          <div style={{ color: "#667eea", textDecoration: "underline", cursor: "pointer" }}>
                            <div style={{ fontWeight: "500" }}>{entry.label}</div>
                            {!isExpanded && entry.notes && (
                              <div className="description description-truncate" title={entry.notes}>
                                {entry.notes.substring(0, 60)}...
                              </div>
                            )}
                          </div>
                        ) : "-"}
                      </td>
                      <td><strong>{entry.cis_control_id || "-"}</strong></td>
                      <td><strong>{entry.cis_safeguard_id || "-"}</strong></td>
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
                    {isExpanded && entry.notes && (
                      <tr key={`${entry.id}-expanded`}>
                        <td colSpan={hasClauses ? 9 : 8} style={{ background: "#f8f9fa", padding: "1rem" }}>
                          <div>
                            <strong style={{ color: "#667eea" }}>Description:</strong>
                            <p className="description" style={{ marginTop: "0.5rem", whiteSpace: "pre-wrap" }}>
                              {entry.notes}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
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
