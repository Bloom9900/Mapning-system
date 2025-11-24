import type { MappingEntry } from "../types/mapping";

interface RowDetailsDrawerProps {
  entry: MappingEntry | null;
  onClose: () => void;
}

export default function RowDetailsDrawer({ entry, onClose }: RowDetailsDrawerProps) {
  if (!entry) return null;

  const copyVariants = {
    cisOnly: () => {
      const text = `CIS Control: ${entry.cis_control_id || ""}\nCIS Safeguard: ${entry.cis_safeguard_id || ""}\nTitle: ${entry.label || ""}`;
      navigator.clipboard.writeText(text);
      alert("Copied CIS information!");
    },
    nis2Only: () => {
      const text = `NIS2 Articles: ${entry.nis2_article_ids.join(", ")}\nTitle: ${entry.label || ""}`;
      navigator.clipboard.writeText(text);
      alert("Copied NIS2 information!");
    },
    isoOnly: () => {
      const text = `ISO Annex A: ${entry.iso_27001_annex_a_ids.join(", ")}\nISO Clauses: ${entry.iso_27001_clause_ids.join(", ")}\nTitle: ${entry.label || ""}`;
      navigator.clipboard.writeText(text);
      alert("Copied ISO information!");
    },
    allPlain: () => {
      const text = `CIS Control: ${entry.cis_control_id || "-"}\nCIS Safeguard: ${entry.cis_safeguard_id || "-"}\nISO Annex A: ${entry.iso_27001_annex_a_ids.join(", ") || "-"}\nISO Clauses: ${entry.iso_27001_clause_ids.join(", ") || "-"}\nNIS2 Articles: ${entry.nis2_article_ids.join(", ") || "-"}\nRelationship: ${entry.relationship_type}\nSources: ${entry.sources.join(", ")}\nTitle: ${entry.label || ""}\nDescription: ${entry.notes || ""}`;
      navigator.clipboard.writeText(text);
      alert("Copied all information!");
    },
    markdown: () => {
      const rows = [];
      if (entry.cis_control_id) rows.push(`| CIS Control | ${entry.cis_control_id} |`);
      if (entry.cis_safeguard_id) rows.push(`| CIS Safeguard | ${entry.cis_safeguard_id} |`);
      if (entry.iso_27001_annex_a_ids.length > 0) rows.push(`| ISO Annex A | ${entry.iso_27001_annex_a_ids.join(", ")} |`);
      if (entry.iso_27001_clause_ids.length > 0) rows.push(`| ISO Clauses | ${entry.iso_27001_clause_ids.join(", ")} |`);
      if (entry.nis2_article_ids.length > 0) rows.push(`| NIS2 Articles | ${entry.nis2_article_ids.join(", ")} |`);
      
      const text = `## ${entry.label || "Mapping"}\n\n${rows.join("\n")}\n\n**Relationship:** ${entry.relationship_type}\n**Sources:** ${entry.sources.join(", ")}\n\n${entry.notes ? `### Description\n\n${entry.notes}` : ""}`;
      navigator.clipboard.writeText(text);
      alert("Copied as Markdown!");
    }
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

  const getRelationshipTooltip = (type: string) => {
    const tooltips: Record<string, string> = {
      covers: "One framework fully covers another",
      supports: "One framework supports another",
      partial: "Partial coverage between frameworks",
      related: "General relationship between frameworks"
    };
    return tooltips[type] || "Relationship";
  };

  const coverageCount = {
    cis: (entry.cis_control_id ? 1 : 0) + (entry.cis_safeguard_id ? 1 : 0),
    iso: entry.iso_27001_annex_a_ids.length + entry.iso_27001_clause_ids.length,
    nis2: entry.nis2_article_ids.length
  };

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        width: "500px",
        background: "white",
        boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      <div style={{
        padding: "1.5rem",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h3 style={{ margin: 0, color: "#667eea" }}>Mapping Details</h3>
        <button onClick={onClose} className="btn-outline btn-small">✕ Close</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
        {/* Coverage Indicator */}
        <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#f8f9fa", borderRadius: "8px" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem" }}>Coverage</div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {coverageCount.cis > 0 && (
              <span className="badge badge-primary">
                {coverageCount.cis} CIS
              </span>
            )}
            {coverageCount.iso > 0 && (
              <span className="badge badge-success">
                {coverageCount.iso} ISO
              </span>
            )}
            {coverageCount.nis2 > 0 && (
              <span className="badge badge-info">
                {coverageCount.nis2} NIS2
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        {entry.label && (
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem", color: "#667eea" }}>Title</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "500" }}>{entry.label}</div>
          </div>
        )}

        {/* CIS Information */}
        {(entry.cis_control_id || entry.cis_safeguard_id) && (
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem", color: "#667eea" }}>
              🔷 CIS Controls
            </div>
            {entry.cis_control_id && (
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>Control:</strong> {entry.cis_control_id}
              </div>
            )}
            {entry.cis_safeguard_id && (
              <div>
                <strong>Safeguard:</strong> {entry.cis_safeguard_id}
              </div>
            )}
          </div>
        )}

        {/* ISO Information */}
        {(entry.iso_27001_annex_a_ids.length > 0 || entry.iso_27001_clause_ids.length > 0) && (
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem", color: "#667eea" }}>
              🔶 ISO/IEC 27001:2022
            </div>
            {entry.iso_27001_annex_a_ids.length > 0 && (
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>Annex A:</strong> {entry.iso_27001_annex_a_ids.map(id => (
                  <span key={id} className="badge badge-success" style={{ marginLeft: "0.25rem" }}>{id}</span>
                ))}
              </div>
            )}
            {entry.iso_27001_clause_ids.length > 0 && (
              <div>
                <strong>Clauses:</strong> {entry.iso_27001_clause_ids.map(id => (
                  <span key={id} className="badge badge-primary" style={{ marginLeft: "0.25rem" }}>{id}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NIS2 Information */}
        {entry.nis2_article_ids.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem", color: "#667eea" }}>
              🔸 NIS2 Directive
            </div>
            <div>
              <strong>Articles:</strong> {entry.nis2_article_ids.map(id => (
                <span key={id} className="badge badge-info" style={{ marginLeft: "0.25rem" }}>{id}</span>
              ))}
            </div>
          </div>
        )}

        {/* Relationship */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem", color: "#667eea" }}>
            Relationship
          </div>
          <span 
            className={`badge ${getRelationshipBadge(entry.relationship_type)}`}
            title={getRelationshipTooltip(entry.relationship_type)}
          >
            {entry.relationship_type}
          </span>
          <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
            {getRelationshipTooltip(entry.relationship_type)}
          </div>
        </div>

        {/* Sources */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem", color: "#667eea" }}>
            Sources
          </div>
          {entry.sources.map(source => (
            <span key={source} className="badge badge-primary" style={{ marginRight: "0.5rem" }}>
              {source}
            </span>
          ))}
        </div>

        {/* Descriptions by Framework */}
        {entry.notes && (() => {
          // Split by "---" separator (used when merging from different sources)
          const descriptions = entry.notes.split(/\n\n---\n\n/);
          
          // Determine which source each description comes from
          const hasCIS_ISO = entry.sources.includes("CIS_ISO");
          const hasCIS_NIS2 = entry.sources.includes("CIS_NIS2");
          
          return (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.75rem", color: "#667eea" }}>
                Framework Descriptions
              </div>
              
              {descriptions.length > 1 ? (
                // Multiple descriptions from different sources
                descriptions.map((desc, idx) => {
                  let trimmedDesc = desc.trim();
                  if (!trimmedDesc) return null;
                  
                  // Check for source prefix [CIS] or [NIS2]
                  let frameworkLabel = "";
                  let frameworkIcon = "";
                  let borderColor = "";
                  let sourceLabel = "";
                  
                  if (trimmedDesc.startsWith("[CIS]")) {
                    frameworkLabel = "CIS Safeguard";
                    frameworkIcon = "🔷";
                    borderColor = "#667eea";
                    sourceLabel = "From CIS_ISO mapping";
                    trimmedDesc = trimmedDesc.replace(/^\[CIS\]\s*/, "");
                  } else if (trimmedDesc.startsWith("[NIS2]")) {
                    frameworkLabel = "NIS2 Directive";
                    frameworkIcon = "🔸";
                    borderColor = "#4299e1";
                    sourceLabel = "From CIS_NIS2 mapping";
                    trimmedDesc = trimmedDesc.replace(/^\[NIS2\]\s*/, "");
                  } else {
                    // Fallback: determine from sources and content
                    if (hasCIS_ISO && hasCIS_NIS2) {
                      // We have both sources - determine by position and content
                      if (idx === 0 || trimmedDesc.toLowerCase().includes("establish") || 
                          trimmedDesc.toLowerCase().includes("ensure") ||
                          trimmedDesc.toLowerCase().includes("maintain")) {
                        // Likely CIS description
                        frameworkLabel = "CIS Safeguard";
                        frameworkIcon = "🔷";
                        borderColor = "#667eea";
                        sourceLabel = "From CIS_ISO mapping";
                      } else {
                        // Likely NIS2 description
                        frameworkLabel = "NIS2 Directive";
                        frameworkIcon = "🔸";
                        borderColor = "#4299e1";
                        sourceLabel = "From CIS_NIS2 mapping";
                      }
                    } else if (hasCIS_ISO) {
                      frameworkLabel = "CIS Safeguard";
                      frameworkIcon = "🔷";
                      borderColor = "#667eea";
                      sourceLabel = "From CIS_ISO mapping";
                    } else if (hasCIS_NIS2) {
                      frameworkLabel = "NIS2 Directive";
                      frameworkIcon = "🔸";
                      borderColor = "#4299e1";
                      sourceLabel = "From CIS_NIS2 mapping";
                    } else {
                      frameworkLabel = "Description";
                      frameworkIcon = "📄";
                      borderColor = "#667eea";
                      sourceLabel = "";
                    }
                  }
                  
                  return (
                    <div key={idx} style={{ 
                      marginBottom: "1rem", 
                      padding: "1rem", 
                      background: "#f8f9fa", 
                      borderRadius: "8px",
                      borderLeft: `4px solid ${borderColor}`
                    }}>
                      <div style={{ 
                        fontSize: "0.85rem", 
                        fontWeight: "600", 
                        marginBottom: "0.5rem",
                        color: borderColor,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}>
                        <span style={{ fontSize: "1.1rem" }}>{frameworkIcon}</span>
                        <span>{frameworkLabel} Description</span>
                      </div>
                      {sourceLabel && (
                        <div style={{ 
                          fontSize: "0.75rem", 
                          color: "#999",
                          marginBottom: "0.75rem",
                          fontStyle: "italic"
                        }}>
                          {sourceLabel}
                        </div>
                      )}
                      <p style={{ lineHeight: "1.7", color: "#333", whiteSpace: "pre-wrap", margin: 0, fontSize: "0.95rem" }}>
                        {trimmedDesc}
                      </p>
                    </div>
                  );
                })
              ) : (
                // Single description - determine from sources
                (() => {
                  let frameworkLabel = "Description";
                  let frameworkIcon = "📄";
                  let borderColor = "#667eea";
                  let sourceLabel = "";
                  let displayNotes = entry.notes;
                  
                  // Check for source prefix
                  if (entry.notes.startsWith("[CIS]")) {
                    frameworkLabel = "CIS Safeguard";
                    frameworkIcon = "🔷";
                    borderColor = "#667eea";
                    sourceLabel = "From CIS_ISO mapping";
                    displayNotes = entry.notes.replace(/^\[CIS\]\s*/, "");
                  } else if (entry.notes.startsWith("[NIS2]")) {
                    frameworkLabel = "NIS2 Directive";
                    frameworkIcon = "🔸";
                    borderColor = "#4299e1";
                    sourceLabel = "From CIS_NIS2 mapping";
                    displayNotes = entry.notes.replace(/^\[NIS2\]\s*/, "");
                  } else if (hasCIS_ISO && !hasCIS_NIS2) {
                    frameworkLabel = "CIS Safeguard";
                    frameworkIcon = "🔷";
                    borderColor = "#667eea";
                    sourceLabel = "From CIS_ISO mapping";
                  } else if (hasCIS_NIS2 && !hasCIS_ISO) {
                    frameworkLabel = "NIS2 Directive";
                    frameworkIcon = "🔸";
                    borderColor = "#4299e1";
                    sourceLabel = "From CIS_NIS2 mapping";
                  } else if (hasCIS_ISO && hasCIS_NIS2) {
                    // Both sources but only one description - try to detect
                    const isNIS2Desc = entry.notes.toLowerCase().includes("directive") || 
                                      entry.notes.toLowerCase().includes("entity") ||
                                      entry.notes.toLowerCase().includes("relevant entities") ||
                                      entry.notes.toLowerCase().includes("shall");
                    
                    if (isNIS2Desc) {
                      frameworkLabel = "NIS2 Directive";
                      frameworkIcon = "🔸";
                      borderColor = "#4299e1";
                      sourceLabel = "From CIS_NIS2 mapping";
                    } else {
                      frameworkLabel = "CIS Safeguard";
                      frameworkIcon = "🔷";
                      borderColor = "#667eea";
                      sourceLabel = "From CIS_ISO mapping";
                    }
                  }
                  
                  return (
                    <div style={{ 
                      padding: "1rem", 
                      background: "#f8f9fa", 
                      borderRadius: "8px",
                      borderLeft: `4px solid ${borderColor}`
                    }}>
                      <div style={{ 
                        fontSize: "0.85rem", 
                        fontWeight: "600", 
                        marginBottom: "0.5rem",
                        color: borderColor,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}>
                        <span style={{ fontSize: "1.1rem" }}>{frameworkIcon}</span>
                        <span>{frameworkLabel} Description</span>
                      </div>
                      {sourceLabel && (
                        <div style={{ 
                          fontSize: "0.75rem", 
                          color: "#999",
                          marginBottom: "0.75rem",
                          fontStyle: "italic"
                        }}>
                          {sourceLabel}
                        </div>
                      )}
                      <p style={{ lineHeight: "1.7", color: "#333", whiteSpace: "pre-wrap", margin: 0, fontSize: "0.95rem" }}>
                        {displayNotes}
                      </p>
                    </div>
                  );
                })()
              )}
            </div>
          );
        })()}
        
        {/* Show message if no description but has mappings */}
        {!entry.notes && (entry.cis_control_id || entry.iso_27001_annex_a_ids.length > 0 || entry.nis2_article_ids.length > 0) && (
          <div style={{ 
            marginBottom: "1.5rem", 
            padding: "1rem", 
            background: "#fff3cd", 
            borderRadius: "8px",
            fontSize: "0.9rem",
            color: "#666"
          }}>
            <strong>Note:</strong> No description available for this mapping. Refer to the official framework documents for control text.
          </div>
        )}
      </div>

      {/* Copy Actions */}
      <div style={{
        padding: "1rem",
        borderTop: "1px solid #e0e0e0",
        background: "#f8f9fa"
      }}>
        <div style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.75rem" }}>Copy Options</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button onClick={copyVariants.cisOnly} className="btn-small">📋 Copy CIS Only</button>
          <button onClick={copyVariants.isoOnly} className="btn-small">📋 Copy ISO Only</button>
          <button onClick={copyVariants.nis2Only} className="btn-small">📋 Copy NIS2 Only</button>
          <button onClick={copyVariants.allPlain} className="btn-small">📋 Copy All (Plain Text)</button>
          <button onClick={copyVariants.markdown} className="btn-small">📋 Copy as Markdown</button>
        </div>
      </div>
    </div>
  );
}

