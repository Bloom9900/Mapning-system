import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import CISView from "./components/CISView";
import NIS2View from "./components/NIS2View";
import ISOView from "./components/ISOView";
import HelpGuide from "./components/HelpGuide";
import GlobalSearch from "./components/GlobalSearch";
import QuickStartCard from "./components/QuickStartCard";
import DonationBanner from "./components/DonationBanner";
import AdPlaceholder from "./components/AdPlaceholder";
import AdFreeModal from "./components/AdFreeModal";
import Footer from "./components/Footer";

function Navigation() {
  const location = useLocation();
  
  return (
    <nav style={{ 
      background: "white",
      borderRadius: "12px",
      padding: "1rem 1.5rem",
      marginBottom: "2rem",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)"
    }}>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <Link 
          to="/cis" 
          style={{ 
            textDecoration: "none",
            color: location.pathname === "/cis" ? "#667eea" : "#666",
            fontWeight: location.pathname === "/cis" ? "600" : "400",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            background: location.pathname === "/cis" ? "#f0f4ff" : "transparent",
            transition: "all 0.2s ease"
          }}
        >
          🔷 CIS View
        </Link>
        <Link 
          to="/nis2"
          style={{ 
            textDecoration: "none",
            color: location.pathname === "/nis2" ? "#667eea" : "#666",
            fontWeight: location.pathname === "/nis2" ? "600" : "400",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            background: location.pathname === "/nis2" ? "#f0f4ff" : "transparent",
            transition: "all 0.2s ease"
          }}
        >
          🔷 NIS2 View
        </Link>
        <Link 
          to="/iso"
          style={{ 
            textDecoration: "none",
            color: location.pathname === "/iso" ? "#667eea" : "#666",
            fontWeight: location.pathname === "/iso" ? "600" : "400",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            background: location.pathname === "/iso" ? "#f0f4ff" : "transparent",
            transition: "all 0.2s ease"
          }}
        >
          🔷 ISO View
        </Link>
      </div>
    </nav>
  );
}

function App() {
  const [showAdFreeModal, setShowAdFreeModal] = useState(false);
  const [isAdFree, setIsAdFree] = useState(false);

  // Check ad-free status on mount
  useEffect(() => {
    const adFree = localStorage.getItem("adFree") === "true";
    setIsAdFree(adFree);
  }, []);

  const handleAdFreePurchase = () => {
    setIsAdFree(true);
  };

  return (
    <BrowserRouter>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ 
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "2rem",
                fontWeight: "700",
                marginBottom: "0.5rem"
              }}>
                Security Framework Mapping Tool
              </h1>
              <p style={{ color: "#666", fontSize: "1rem" }}>
                Explore relationships between CIS Controls, ISO 27001:2022, and NIS2 Directive
              </p>
            </div>
            {!isAdFree && (
              <button
                onClick={() => setShowAdFreeModal(true)}
                className="btn-outline btn-small"
                style={{ marginTop: "0.5rem" }}
              >
                Remove Ads
              </button>
            )}
          </div>
        </div>
        
        <DonationBanner />
        <GlobalSearch />
        <QuickStartCard />
        <HelpGuide />
        <Navigation />
        
        {/* Top ad banner */}
        {!isAdFree && <AdPlaceholder position="top" size="medium" />}
        
        <Routes>
          <Route path="/" element={<CISView />} />
          <Route path="/cis" element={<CISView />} />
          <Route path="/nis2" element={<NIS2View />} />
          <Route path="/iso" element={<ISOView />} />
        </Routes>
        
        {/* Bottom ad banner */}
        {!isAdFree && <AdPlaceholder position="bottom" size="medium" />}
        
        <Footer />
        
        <AdFreeModal
          isOpen={showAdFreeModal}
          onClose={() => setShowAdFreeModal(false)}
          onPurchase={handleAdFreePurchase}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;

