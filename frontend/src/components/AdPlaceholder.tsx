import { useState, useEffect } from "react";

interface AdPlaceholderProps {
  position: "sidebar" | "top" | "bottom";
  size?: "small" | "medium" | "large";
}

export default function AdPlaceholder({ position, size = "medium" }: AdPlaceholderProps) {
  const [isAdFree, setIsAdFree] = useState(false);

  useEffect(() => {
    // Check if user has purchased ad-free
    const adFree = localStorage.getItem("adFree") === "true";
    setIsAdFree(adFree);
  }, []);

  if (isAdFree) {
    return null;
  }

  const sizes = {
    small: { width: "300px", height: "100px" },
    medium: { width: "728px", height: "90px" },
    large: { width: "970px", height: "250px" }
  };

  const dimensions = sizes[size];

  return (
    <div style={{
      margin: position === "sidebar" ? "1rem 0" : "1.5rem 0",
      padding: "1rem",
      background: "#f8f9fa",
      border: "2px dashed #ccc",
      borderRadius: "8px",
      textAlign: "center",
      minHeight: dimensions.height,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "#999",
      fontSize: "0.85rem"
    }}>
      <div style={{ marginBottom: "0.5rem" }}>📢 Advertisement</div>
      <div style={{ 
        width: dimensions.width, 
        height: dimensions.height,
        background: "#e8ecf1",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.75rem"
      }}>
        Ad Space {dimensions.width} × {dimensions.height}
        <br />
        <span style={{ fontSize: "0.7rem", color: "#999" }}>
          (Replace with your ad network code)
        </span>
      </div>
    </div>
  );
}

