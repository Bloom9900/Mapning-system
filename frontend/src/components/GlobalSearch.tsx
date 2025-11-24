import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { MappingEntry } from "../types/mapping";

interface GlobalSearchResult {
  framework: "CIS" | "ISO" | "NIS2";
  entry: MappingEntry;
  matchType: string;
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const searchAll = async () => {
      try {
        const [cisRes, isoRes, nis2Res] = await Promise.all([
          fetch("/api/cis"),
          fetch("/api/iso"),
          fetch("/api/nis2")
        ]);

        const [cisData, isoData, nis2Data] = await Promise.all([
          cisRes.json(),
          isoRes.json(),
          nis2Res.json()
        ]);

        const lowerQuery = query.toLowerCase();
        const allResults: GlobalSearchResult[] = [];

        // Search CIS
        cisData.forEach((entry: MappingEntry) => {
          const controlId = entry.cis_control_id?.toLowerCase() || "";
          const safeguardId = entry.cis_safeguard_id?.toLowerCase() || "";
          const label = entry.label?.toLowerCase() || "";
          
          if (controlId.includes(lowerQuery) || safeguardId.includes(lowerQuery) || label.includes(lowerQuery)) {
            allResults.push({
              framework: "CIS",
              entry,
              matchType: controlId.includes(lowerQuery) ? "Control ID" : safeguardId.includes(lowerQuery) ? "Safeguard ID" : "Title"
            });
          }
        });

        // Search ISO
        isoData.forEach((entry: MappingEntry) => {
          const annexAIds = entry.iso_27001_annex_a_ids.join(" ").toLowerCase();
          const label = entry.label?.toLowerCase() || "";
          
          if (annexAIds.includes(lowerQuery) || label.includes(lowerQuery)) {
            allResults.push({
              framework: "ISO",
              entry,
              matchType: annexAIds.includes(lowerQuery) ? "Annex A" : "Title"
            });
          }
        });

        // Search NIS2
        nis2Data.forEach((entry: MappingEntry) => {
          const articleIds = entry.nis2_article_ids.join(" ").toLowerCase();
          const label = entry.label?.toLowerCase() || "";
          
          if (articleIds.includes(lowerQuery) || label.includes(lowerQuery)) {
            allResults.push({
              framework: "NIS2",
              entry,
              matchType: articleIds.includes(lowerQuery) ? "Article ID" : "Title"
            });
          }
        });

        setResults(allResults.slice(0, 10)); // Limit to 10 results
        setShowResults(allResults.length > 0);
      } catch (error) {
        console.error("Error searching:", error);
      }
    };

    const debounce = setTimeout(searchAll, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleResultClick = (result: GlobalSearchResult) => {
    const routes: Record<string, string> = {
      CIS: "/cis",
      ISO: "/iso",
      NIS2: "/nis2"
    };
    navigate(routes[result.framework]);
    setQuery("");
    setShowResults(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && results.length > 0) {
      handleResultClick(results[0]);
    }
  };

  const getFrameworkIcon = (framework: string) => {
    const icons: Record<string, string> = {
      CIS: "🔷",
      ISO: "🔶",
      NIS2: "🔸"
    };
    return icons[framework] || "•";
  };

  return (
    <div style={{ position: "relative", marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <span style={{ fontSize: "1.2rem" }}>🔍</span>
        <input
          type="text"
          placeholder="Search across all frameworks (e.g., '6.3', 'A.5.36', '12.4.1')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowResults(true)}
          style={{ flex: 1, maxWidth: "600px" }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setShowResults(false);
            }}
            className="btn-outline btn-small"
          >
            ✕
          </button>
        )}
      </div>
      
      {showResults && results.length > 0 && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "white",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 1000,
          maxHeight: "400px",
          overflowY: "auto",
          marginTop: "0.5rem"
        }}>
          <div style={{ padding: "0.5rem", borderBottom: "1px solid #e0e0e0", background: "#f8f9fa", fontWeight: "600" }}>
            Found {results.length} result{results.length !== 1 ? "s" : ""}
          </div>
          {results.map((result, idx) => (
            <div
              key={idx}
              onClick={() => handleResultClick(result)}
              style={{
                padding: "0.75rem",
                cursor: "pointer",
                borderBottom: idx < results.length - 1 ? "1px solid #e0e0e0" : "none",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f0f4ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{getFrameworkIcon(result.framework)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "500" }}>
                  {result.framework === "CIS" && (result.entry.cis_control_id || result.entry.cis_safeguard_id)}
                  {result.framework === "ISO" && result.entry.iso_27001_annex_a_ids[0]}
                  {result.framework === "NIS2" && result.entry.nis2_article_ids[0]}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}>
                  {result.entry.label || result.matchType}
                </div>
              </div>
              <span style={{ fontSize: "0.75rem", color: "#999" }}>→ {result.framework} View</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

