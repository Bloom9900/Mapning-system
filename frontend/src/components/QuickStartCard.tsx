import { useState } from "react";

export default function QuickStartCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card" style={{ 
      marginBottom: "1.5rem",
      background: "linear-gradient(135deg, #f0f4ff 0%, #e8f2ff 100%)",
      border: "1px solid #667eea"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: "0 0 0.75rem 0", color: "#667eea", fontSize: "1.1rem" }}>
            Quick Start Guide
          </h3>
          <ol style={{ margin: 0, paddingLeft: "1.5rem", lineHeight: "1.8" }}>
            <li>
              <strong>Search globally</strong> using the search bar above, or browse by framework using the tabs
            </li>
            <li>
              <strong>Filter results</strong> by relationship type, source, or show only complete mappings
            </li>
            <li>
              <strong>Click any row</strong> to see full details in the side panel
            </li>
          </ol>
          
          {expanded && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #ccc" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <strong style={{ fontSize: "0.9rem" }}>Framework Icons:</strong>
                  <div style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                    <div>🔷 CIS Controls</div>
                    <div>🔶 ISO 27001</div>
                    <div>🔸 NIS2 Directive</div>
                  </div>
                </div>
                <div>
                  <strong style={{ fontSize: "0.9rem" }}>Relationship Types:</strong>
                  <div style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                    <div><span className="badge badge-success" style={{ marginRight: "0.25rem" }}>covers</span> Full coverage</div>
                    <div><span className="badge badge-primary" style={{ marginRight: "0.25rem" }}>supports</span> Supports</div>
                    <div><span className="badge badge-warning" style={{ marginRight: "0.25rem" }}>partial</span> Partial</div>
                    <div><span className="badge badge-info" style={{ marginRight: "0.25rem" }}>related</span> Related</div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: "0.85rem", color: "#666" }}>
                <strong>Data Sources:</strong> Mappings from official CIS documents (CIS_ISO, CIS_NIS2). 
                See <a href="https://www.cisecurity.org" target="_blank" rel="noopener noreferrer" style={{ color: "#667eea" }}>CIS website</a> for official mapping documents.
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="btn-outline btn-small"
          style={{ marginLeft: "1rem" }}
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      </div>
    </div>
  );
}

