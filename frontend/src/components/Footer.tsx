import { useState, useEffect } from "react";
import AdFreeModal from "./AdFreeModal";

export default function Footer() {
  const [isAdFree, setIsAdFree] = useState(false);
  const [showAdFreeModal, setShowAdFreeModal] = useState(false);

  useEffect(() => {
    const adFree = localStorage.getItem("adFree") === "true";
    setIsAdFree(adFree);
  }, []);

  const handleAdFreePurchase = () => {
    setIsAdFree(true);
  };

  return (
    <>
      <footer style={{
        marginTop: "4rem",
        padding: "2rem 0",
        borderTop: "1px solid #e0e0e0",
        textAlign: "center",
        color: "#666",
        fontSize: "0.85rem"
      }}>
        <div style={{ marginBottom: "1rem" }}>
          <a
            href="https://paypal.me/yourdonationlink"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#667eea",
              textDecoration: "none",
              margin: "0 1rem"
            }}
          >
            💝 Support this project
          </a>
          {!isAdFree && (
            <>
              <span style={{ color: "#ccc" }}>•</span>
              <button
                onClick={() => setShowAdFreeModal(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#667eea",
                  cursor: "pointer",
                  textDecoration: "none",
                  margin: "0 1rem",
                  fontSize: "0.85rem"
                }}
              >
                Remove Ads
              </button>
            </>
          )}
        </div>
        <div style={{ color: "#999", fontSize: "0.75rem" }}>
          Security Framework Mapping Tool • Free and open source
        </div>
      </footer>
      <AdFreeModal
        isOpen={showAdFreeModal}
        onClose={() => setShowAdFreeModal(false)}
        onPurchase={handleAdFreePurchase}
      />
    </>
  );
}

