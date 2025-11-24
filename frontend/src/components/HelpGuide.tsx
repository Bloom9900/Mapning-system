import { useState } from "react";

export default function HelpGuide() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn-outline"
        style={{ marginBottom: "1rem" }}
      >
        📖 How to Use This Tool
      </button>
    );
  }

  return (
    <div className="card" style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ margin: 0, color: "#667eea" }}>📖 How to Use This Tool</h2>
        <button onClick={() => setIsOpen(false)} className="btn-small">✕ Close</button>
      </div>

      <div style={{ lineHeight: "1.8" }}>
        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#667eea", marginBottom: "0.5rem" }}>Overview</h3>
          <p>
            This tool helps you explore relationships between three major security frameworks:
          </p>
          <ul style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
            <li><strong>CIS Controls v8.1</strong> - Industry-standard security controls and safeguards</li>
            <li><strong>ISO/IEC 27001:2022</strong> - International information security management standard</li>
            <li><strong>NIS2 Directive</strong> - EU cybersecurity directive for essential entities</li>
          </ul>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#667eea", marginBottom: "0.5rem" }}>Three Views</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
            <div className="card" style={{ padding: "1rem", background: "#f8f9fa" }}>
              <h4 style={{ marginBottom: "0.5rem" }}>🔷 CIS View</h4>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                Start from a CIS Control or Safeguard. See which ISO clauses/Annex A controls and NIS2 articles relate to it.
              </p>
            </div>
            <div className="card" style={{ padding: "1rem", background: "#f8f9fa" }}>
              <h4 style={{ marginBottom: "0.5rem" }}>🔷 NIS2 View</h4>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                Start from a NIS2 Directive article. See which CIS Controls/Safeguards and ISO controls map to it.
              </p>
            </div>
            <div className="card" style={{ padding: "1rem", background: "#f8f9fa" }}>
              <h4 style={{ marginBottom: "0.5rem" }}>🔷 ISO View</h4>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                Start from an ISO clause or Annex A control. See related CIS and NIS2 mappings.
              </p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#667eea", marginBottom: "0.5rem" }}>Using the Tool</h3>
          <ol style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Browse all mappings:</strong> Each view shows all available mappings by default. Scroll through to explore.
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Search:</strong> Use the search bar to filter by ID (e.g., "6.3", "A.5.36", "12.4.1") or by title/description.
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>View descriptions:</strong> Each mapping includes a title and description (hover or expand to see full text).
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Check sources:</strong> See which official mapping document supports each relationship (CIS_ISO, CIS_NIS2).
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Export data:</strong> Use the Export buttons to download mappings as CSV or JSON for use in other tools.
            </li>
          </ol>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#667eea", marginBottom: "0.5rem" }}>Understanding ISO 27001 Structure</h3>
          <p style={{ marginBottom: "0.5rem" }}>
            ISO/IEC 27001:2022 has two types of identifiers:
          </p>
          <ul style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
            <li><strong>Main Clauses</strong> (e.g., "5.2", "6.1") - The main sections of the standard covering topics like:
              <ul style={{ marginLeft: "1.5rem", marginTop: "0.25rem", fontSize: "0.9rem", color: "#666" }}>
                <li>Clause 5: Leadership and commitment</li>
                <li>Clause 6: Planning</li>
                <li>Clause 7: Support</li>
                <li>Clause 8: Operation</li>
                <li>Clause 9: Performance evaluation</li>
                <li>Clause 10: Improvement</li>
              </ul>
            </li>
            <li><strong>Annex A Controls</strong> (e.g., "A.5.36", "A.8.8") - Specific security controls organized by domain:
              <ul style={{ marginLeft: "1.5rem", marginTop: "0.25rem", fontSize: "0.9rem", color: "#666" }}>
                <li>A.5: Organizational controls</li>
                <li>A.6: People controls</li>
                <li>A.7: Physical controls</li>
                <li>A.8: Technological controls</li>
              </ul>
            </li>
          </ul>
          <p style={{ marginTop: "0.75rem", padding: "0.75rem", background: "#fff3cd", borderRadius: "8px", borderLeft: "4px solid #ffc107", fontSize: "0.9rem" }}>
            <strong>Note:</strong> The CIS mapping documents only map to <strong>Annex A controls</strong>, not to main clauses. 
            That's why you'll see Annex A controls (like A.5.36) but the "ISO Clause" column may be empty in the ISO View.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#667eea", marginBottom: "0.5rem" }}>Sorting Tables</h3>
          <p style={{ marginBottom: "0.5rem" }}>
            Click on any column header with a ⇅ icon to sort the table:
          </p>
          <ul style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
            <li><strong>First click:</strong> Sort ascending (↑)</li>
            <li><strong>Second click:</strong> Sort descending (↓)</li>
            <li><strong>Third click:</strong> Remove sorting (⇅)</li>
          </ul>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
            Sortable columns include: IDs, Titles, and Relationship types.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#667eea", marginBottom: "0.5rem" }}>Understanding Relationship Types</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginTop: "0.5rem" }}>
            <div><span className="badge badge-success">covers</span> - One framework fully covers another</div>
            <div><span className="badge badge-primary">supports</span> - One framework supports another</div>
            <div><span className="badge badge-warning">partial</span> - Partial coverage</div>
            <div><span className="badge badge-info">related</span> - General relationship</div>
          </div>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#667eea", marginBottom: "0.5rem" }}>About Descriptions</h3>
          <p style={{ background: "#fff3cd", padding: "1rem", borderRadius: "8px", borderLeft: "4px solid #ffc107" }}>
            <strong>Note on Copyright:</strong> This tool includes short descriptions and titles from the mapping documents, 
            but does not include full copyrighted control text from ISO 27001. For complete ISO control wording, 
            please refer to the official ISO/IEC 27001:2022 standard.
          </p>
        </section>

        <section>
          <h3 style={{ color: "#667eea", marginBottom: "0.5rem" }}>Data Sources</h3>
          <p>
            Mappings are based on official documents:
          </p>
          <ul style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
            <li>CIS official mapping to ISO 27001:2022</li>
            <li>CIS official mapping to NIS2 Directive</li>
          </ul>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
            The tool automatically imports these files when the server starts. Data is stored in memory and persists while the server is running.
          </p>
        </section>
      </div>
    </div>
  );
}

