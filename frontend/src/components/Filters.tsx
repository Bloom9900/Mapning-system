import { useState, useEffect } from "react";
import type { MappingEntry, RelationshipType, MappingSource } from "../types/mapping";

interface FiltersProps {
  entries: MappingEntry[];
  onFiltered: (filtered: MappingEntry[]) => void;
}

export default function Filters({ entries, onFiltered }: FiltersProps) {
  const [relationshipType, setRelationshipType] = useState<RelationshipType | "all">("all");
  const [sources, setSources] = useState<Set<MappingSource>>(new Set());
  const [allThreeFrameworks, setAllThreeFrameworks] = useState(false);

  // Get unique values
  const relationshipTypes = Array.from(new Set(entries.map(e => e.relationship_type)));
  const availableSources = Array.from(new Set(entries.flatMap(e => e.sources)));

  const applyFilters = () => {
    let filtered = [...entries];

    // Relationship type filter
    if (relationshipType !== "all") {
      filtered = filtered.filter(e => e.relationship_type === relationshipType);
    }

    // Source filter
    if (sources.size > 0) {
      filtered = filtered.filter(e => 
        e.sources.some(s => sources.has(s))
      );
    }

    // All three frameworks filter
    if (allThreeFrameworks) {
      filtered = filtered.filter(e => {
        const hasCIS = !!(e.cis_control_id || e.cis_safeguard_id);
        const hasISO = e.iso_27001_annex_a_ids.length > 0 || e.iso_27001_clause_ids.length > 0;
        const hasNIS2 = e.nis2_article_ids.length > 0;
        return hasCIS && hasISO && hasNIS2;
      });
    }

    onFiltered(filtered);
  };

  const toggleSource = (source: MappingSource) => {
    const newSources = new Set(sources);
    if (newSources.has(source)) {
      newSources.delete(source);
    } else {
      newSources.add(source);
    }
    setSources(newSources);
  };

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [relationshipType, sources, allThreeFrameworks, entries]);

  return (
    <div style={{
      display: "flex",
      gap: "1rem",
      flexWrap: "wrap",
      padding: "1rem",
      background: "#f8f9fa",
      borderRadius: "8px",
      marginBottom: "1rem"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <label style={{ fontSize: "0.9rem", fontWeight: "500" }}>Relationship:</label>
        <select
          value={relationshipType}
          onChange={(e) => {
            setRelationshipType(e.target.value as RelationshipType | "all");
            applyFilters();
          }}
          style={{
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "0.9rem"
          }}
        >
          <option value="all">All</option>
          {relationshipTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <label style={{ fontSize: "0.9rem", fontWeight: "500" }}>Source:</label>
        {availableSources.map(source => (
          <label key={source} style={{ display: "flex", alignItems: "center", gap: "0.25rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={sources.has(source)}
              onChange={() => {
                toggleSource(source);
                applyFilters();
              }}
            />
            <span style={{ fontSize: "0.85rem" }}>{source}</span>
          </label>
        ))}
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={allThreeFrameworks}
          onChange={(e) => {
            setAllThreeFrameworks(e.target.checked);
            applyFilters();
          }}
        />
        <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>
          Show only items with mappings in all three frameworks
        </span>
      </label>
    </div>
  );
}

