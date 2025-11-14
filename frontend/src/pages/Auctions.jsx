import React, { useEffect, useState } from "react";
import axios from "axios";
import AuctionCard from "../components/auction/AuctionCard";
import usePageTitle from "../hooks/usePageTitle";

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const fetchAuctions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auctions");
        setAuctions(res.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch auctions", err);
        setError("Failed to load auctions. Please try again later.");
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  usePageTitle('Browse Auctions');

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading auctions...</p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", marginTop: "40px", color: "red" }}>{error}</p>;
  }
  

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "24px", textAlign: "center" }}>
        Browse Auctions
      </h1>
      {auctions.length === 0 ? (
        <p style={{ textAlign: "center" }}>No auctions available right now.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {auctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Auctions;
