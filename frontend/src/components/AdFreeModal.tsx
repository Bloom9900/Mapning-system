import { useState } from "react";

interface AdFreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

export default function AdFreeModal({ isOpen, onClose, onPurchase }: AdFreeModalProps) {
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setProcessing(true);
    // In a real implementation, this would call a payment API (Stripe, PayPal, etc.)
    // For now, we'll simulate a successful purchase
    setTimeout(() => {
      localStorage.setItem("adFree", "true");
      setProcessing(false);
      onPurchase();
      onClose();
      alert("Thank you for your support! Ads have been removed.");
    }, 1500);
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "2rem",
            maxWidth: "500px",
            width: "90%",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            zIndex: 2001
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ margin: "0 0 0.5rem 0", color: "#667eea" }}>
              Remove Ads - Lifetime Purchase
            </h2>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Support the project and enjoy an ad-free experience forever.
            </p>
          </div>

          <div style={{
            padding: "1.5rem",
            background: "#f8f9fa",
            borderRadius: "8px",
            marginBottom: "1.5rem"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#667eea", marginBottom: "0.5rem" }}>
              $9.99
            </div>
            <div style={{ fontSize: "0.85rem", color: "#666" }}>
              One-time payment • Lifetime access
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>What you get:</div>
            <ul style={{ marginLeft: "1.5rem", lineHeight: "1.8", color: "#666" }}>
              <li>No advertisements</li>
              <li>Faster, cleaner interface</li>
              <li>Support continued development</li>
              <li>Lifetime access (no recurring fees)</li>
            </ul>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={handlePurchase}
              disabled={processing}
              style={{
                flex: 1,
                padding: "0.75rem",
                background: processing ? "#ccc" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: processing ? "not-allowed" : "pointer"
              }}
            >
              {processing ? "Processing..." : "Purchase Ad-Free ($9.99)"}
            </button>
            <button
              onClick={onClose}
              className="btn-outline"
              style={{ padding: "0.75rem 1.5rem" }}
            >
              Cancel
            </button>
          </div>

          <div style={{
            marginTop: "1rem",
            padding: "0.75rem",
            background: "#fff3cd",
            borderRadius: "6px",
            fontSize: "0.8rem",
            color: "#666",
            textAlign: "center"
          }}>
            <strong>Note:</strong> This is a demo. In production, integrate with Stripe, PayPal, or your payment processor.
          </div>
        </div>
      </div>
    </>
  );
}

