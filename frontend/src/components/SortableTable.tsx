import { useState, useMemo } from "react";
import type { MappingEntry } from "../types/mapping";

type SortField = keyof MappingEntry | "combined";
type SortDirection = "asc" | "desc" | null;

interface SortableTableProps {
  data: MappingEntry[];
  columns: {
    key: string;
    label: string;
    render: (entry: MappingEntry) => React.ReactNode;
    sortValue?: (entry: MappingEntry) => string | number;
  }[];
}

export default function SortableTable({ data, columns }: SortableTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle: asc -> desc -> null
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

  const sortedData = useMemo(() => {
    if (!sortField || !sortDirection) {
      return data;
    }

    const column = columns.find(col => col.key === sortField);
    if (!column || !column.sortValue) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aVal = column.sortValue!(a);
      const bVal = column.sortValue!(b);

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection, columns]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return "⇅";
    }
    if (sortDirection === "asc") {
      return "↑";
    }
    if (sortDirection === "desc") {
      return "↓";
    }
    return "⇅";
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => column.sortValue && handleSort(column.key as SortField)}
                style={{
                  cursor: column.sortValue ? "pointer" : "default",
                  userSelect: "none",
                  position: "relative",
                  paddingRight: column.sortValue ? "1.5rem" : "1rem"
                }}
                title={column.sortValue ? "Click to sort" : undefined}
              >
                {column.label}
                {column.sortValue && (
                  <span style={{
                    position: "absolute",
                    right: "0.5rem",
                    fontSize: "0.8rem",
                    opacity: sortField === column.key ? 1 : 0.5
                  }}>
                    {getSortIcon(column.key as SortField)}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((entry, idx) => (
            <tr key={entry.id || idx}>
              {columns.map((column) => (
                <td key={column.key}>{column.render(entry)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

