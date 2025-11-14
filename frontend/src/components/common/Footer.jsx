import React from 'react';

const Footer = ({
  logoText = "AuctionWar",
  tagline = "Your trusted platform for secure and transparent auctions",
  phone = "+91 9131558992",
  email = "226301138@gkv.ac.in",
  theme = "light" // 'light' or 'dark'
}) => {
  const year = new Date().getFullYear();

  const isDark = theme === "dark";

  return (
    <footer style={{
      width: "100%",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: isDark ? "#1f2937" : "#fffafaff",
      padding: "10px 30px",
      color: isDark ? "#d1d5db" : "#374151",
      textAlign: "center",
      fontSize: "14px",
      fontWeight: "400",
      borderTop: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
      position: 'relative',
      boxSizing: 'border-box'
    }}>
      <h2 style={{
        fontSize: "24px",
        fontWeight: "700",
        marginBottom: "8px",
        color: isDark ? "#e5e7eb" : "#111827"
      }}>
        {logoText}
      </h2>
      <p style={{
        fontSize: "16px",
        lineHeight: "1.5",
        marginBottom: "15px",
        color: isDark ? "#9ca3af" : "#4b5563"
      }}>
        {tagline}
      </p>
      <p style={{ margin: "4px 0", color: isDark ? "#d1d5db" : undefined }}>
        📞 {phone}
      </p>
      <p style={{ margin: "4px 0", wordBreak: "break-word", color: isDark ? "#d1d5db" : undefined }}>
        📧 {email}
      </p>

      <p style={{ marginTop: "30px", fontSize: "12px", color: isDark ? "#9ca3af" : "#6b7280" }}>
        &copy; {year} {logoText}. All rights reserved.
      </p>

      {/* Bottom small border */}
      <div style={{
        width: '60%',
        height: '1px',
        backgroundColor: isDark ? "#374151" : "#d1d5db",
        margin: '20px auto 0 auto',
        borderRadius: '1px'
      }} />
    </footer>
  );
};

export default Footer;
