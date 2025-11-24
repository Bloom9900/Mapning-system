import { useState, useEffect } from "react";

export default function DonationBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner (stored in localStorage)
    const dismissed = localStorage.getItem("donationBannerDismissed");
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("donationBannerDismissed", "true");
  };

  if (isDismissed) {
    return (
      <div style={{
        padding: "0.5rem 1rem",
        background: "#f0f4ff",
        borderRadius: "8px",
        marginBottom: "1rem",
        textAlign: "center",
        fontSize: "0.85rem"
      }}>
        <button
          onClick={() => {
            setIsDismissed(false);
            localStorage.removeItem("donationBannerDismissed");
          }}
          style={{
            background: "none",
            border: "none",
            color: "#667eea",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: "0.85rem"
          }}
        >
          Support this project
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: "1rem",
      background: "linear-gradient(135deg, #f0f4ff 0%, #e8f2ff 100%)",
      borderRadius: "8px",
      marginBottom: "1.5rem",
      border: "1px solid #667eea",
      position: "relative"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "600", marginBottom: "0.5rem", color: "#667eea" }}>
            {showFull ? "Help keep this tool free and accessible" : "Support this project"}
          </div>
          {showFull && (
            <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.75rem", lineHeight: "1.5" }}>
              This mapping tool is provided free of charge. Your donation helps cover hosting costs and 
              supports continued development and maintenance.
            </p>
          )}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => window.open("https://paypal.me/yourdonationlink", "_blank")}
              className="btn-secondary"
              style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
            >
              💝 Donate
            </button>
            {!showFull && (
              <button
                onClick={() => setShowFull(true)}
                className="btn-outline btn-small"
              >
                Learn more
              </button>
            )}
          </div>
        </div>
        <button
          onClick={handleDismiss}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            color: "#999",
            padding: "0",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          title="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}

