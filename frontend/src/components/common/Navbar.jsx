import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = ({
  logoText = "AuctionWar",
  tagline = "A secure, transparent platform for conducting\nElectronic Auctions",
  phone = "+91 9131558992",
  email = "226301138@gkv.ac.in",
  theme = "light",
  toggleTheme,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, username, logout } = useContext(AuthContext);

  const navItems = [
    { icon: "🏠", label: "Home", to: "/" },
    { icon: "🔍", label: "Auction Search", to: "/auctions/search" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          background:
            theme === "dark"
              ? "#24243e"
              : "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          paddingBottom: "55px",
          boxShadow: "0 4px 20px rgba(102, 126, 234, 0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ color: "white" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "42px",
                fontWeight: "700",
                lineHeight: "1",
                letterSpacing: "0.5px",
                textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
              }}
            >
              {logoText}
            </h1>
            <p
              style={{
                margin: "6px 0 0 0",
                fontSize: "13px",
                lineHeight: "1.5",
                opacity: 0.95,
                fontWeight: "300",
                letterSpacing: "0.3px",
                whiteSpace: "pre-line",
              }}
            >
              {tagline}
            </p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
            color: "white",
            fontSize: "14px",
            fontWeight: "400",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>📞</span>
            <span style={{ letterSpacing: "0.3px" }}>{phone}</span>
          </div>
          <div
            style={{
              width: "1px",
              height: "24px",
              background: "rgba(255,255,255,0.3)",
            }}
          ></div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>📧</span>
            <span style={{ fontSize: "13px", letterSpacing: "0.2px" }}>
              {email}
            </span>
          </div>
          <button
            style={{
              background: theme === "dark" ? "#444" : "#fff",
              color: theme === "dark" ? "#f8f9fa" : "#764ba2",
              border: "none",
              padding: "7px 16px",
              borderRadius: "8px",
              fontSize: "15px",
              marginLeft: "14px",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(102, 126, 234, 0.1)",
            }}
            onClick={toggleTheme}
          >
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>

      <div
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(180deg, #23232a 0%, #22232b 100%)"
              : "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
          padding: "16px 50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.to)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "none",
                border: "none",
                color: theme === "dark" ? "#f093fb" : "#667eea",
                fontSize: "15px",
                cursor: "pointer",
                padding: 0,
                fontWeight: "500",
                letterSpacing: "0.3px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color =
                  theme === "dark" ? "#a768f3" : "#764ba2";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color =
                  theme === "dark" ? "#f093fb" : "#667eea";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span style={{ fontSize: "20px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/register")}
                style={{
                  background: "none",
                  border: "2px solid #667eea",
                  color: "#667eea",
                  padding: "8px 26px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#667eea";
                  e.currentTarget.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "#667eea";
                }}
              >
                Register
              </button>
              <button
                onClick={() => navigate("/login")}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  padding: "8px 26px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(102, 126, 234, 0.5)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(102, 126, 234, 0.3)";
                }}
              >
                Login
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "8px 26px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#dc2626";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#ef4444";
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
