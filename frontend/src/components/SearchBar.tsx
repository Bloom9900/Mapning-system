import { useState, useEffect } from "react";

interface SearchBarProps {
  placeholder: string;
  onSearch: (query: string) => void;
  suggestions?: string[];
}

export default function SearchBar({ placeholder, onSearch, suggestions = [] }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (query.length > 0 && suggestions.length > 0) {
      const filtered = suggestions
        .filter(s => s.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [query, suggestions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  return (
    <div style={{ position: "relative", marginBottom: "1.5rem" }}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onFocus={() => query.length > 0 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            listStyle: "none",
            marginTop: "0.25rem",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          {filteredSuggestions.map((suggestion, idx) => (
            <li
              key={idx}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: "0.5rem",
                cursor: "pointer",
                borderBottom: idx < filteredSuggestions.length - 1 ? "1px solid #e0e0e0" : "none"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f0f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

