import React, { useState, useEffect } from "react";
import api from "../services/api";
import usePageTitle from "../hooks/usePageTitle";

const AuctionSearch = () => {
  const [query, setQuery] = useState("");
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAuctions = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.append("query", query);
      const res = await api.get(`/auctions/search?${params.toString()}`);
      setAuctions(res.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch auctions");
      setLoading(false);
    }
  };

  usePageTitle('Search Auctions');

  useEffect(() => {
    fetchAuctions();
  }, []); // fetch all auctions on component mount

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAuctions();
  };

  // Styles consistent with your theme
  const containerStyle = {
    maxWidth: "900px",
    margin: "40px auto",
    background: "white",
    borderRadius: "15px",
    padding: "25px",
    fontFamily: "'Poppins', sans-serif",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  };

  const formStyle = {
    display: "flex",
    gap: "15px",
    marginBottom: "25px",
    flexWrap: "wrap",
  };

  const inputStyle = {
    flex: "1",
    padding: "10px 15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
  };

  const buttonStyle = {
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  };

  const auctionItemStyle = {
    borderBottom: "1px solid #eee",
    padding: "15px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const auctionTitleStyle = {
    fontSize: "20px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "5px",
  };

  const auctionInfoStyle = {
    color: "#555",
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#333", marginBottom: "25px" }}>
        Search Auctions
      </h1>

      <form style={formStyle} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search auctions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Search
        </button>
      </form>

      {loading && <p style={{ textAlign: "center" }}>Loading auctions...</p>}
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}
      {!loading && auctions.length === 0 && <p style={{ textAlign: "center" }}>No auctions found</p>}

      {auctions.map((auction) => (
        <div key={auction.id} style={auctionItemStyle}>
          <div>
            <div style={auctionTitleStyle}>{auction.title}</div>
            <div style={auctionInfoStyle}>
              Current Bid: {auction.current_bid || auction.starting_bid} Points | Total Bids: {auction.total_bids}
            </div>
          </div>
          <a
            href={`/auction/${auction.id}`}
            style={{ color: "#667eea", textDecoration: "none", fontWeight: "700" }}
          >
            View Details
          </a>
        </div>
      ))}
    </div>
  );
};

export default AuctionSearch;
