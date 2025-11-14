import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { FaGavel, FaUser } from "react-icons/fa";
import api from "../services/api";
import AuctionTimer from "../components/auction/AuctionTimer";
import BidForm from "../components/auction/BidForm";
import BidHistory from "../components/auction/BidHistory";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import usePageTitle from "../hooks/usePageTitle";

const AuctionDetail = () => {
 
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidsUpdated, setBidsUpdated] = useState(false);
  const [bids, setBids] = useState([]);
  const [canceling, setCanceling] = useState(false);

   usePageTitle(
  auction && auction.title
    ? `${auction.title} - Auction Details`
    : "Auction Details"
);


  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setLoading(true);
        const res = await api.get(`auctions/${id}`);
        setAuction(res.data.data.auction);
        setLoading(false);
      } catch {
        setError("Failed to load auction details");
        setLoading(false);
      }
    };
    fetchAuction();
  }, [id, bidsUpdated]);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await api.get(`/auctions/${id}/bids`);
        const sortedBids = res.data.data.sort((a, b) => b.amount - a.amount);
        setBids(sortedBids);
      } catch (error) {
        console.error("Failed to fetch bid history:", error);
      }
    };
    fetchBids();
  }, [id, bidsUpdated]);

  // Ends if finished by time or cancelled!
  const isAuctionEndedOrCancelled = () => {
    if (!auction) return false;
    return (
      auction.status === "cancelled" ||
      (auction.end_time && new Date(auction.end_time).getTime() < Date.now())
    );
  };

  const handleCancelAuction = async () => {
    if (!window.confirm("Are you sure you want to cancel this auction?")) return;
    setCanceling(true);
    try {
      await api.patch(`/auctions/${id}/cancel`);
      toast.success("Auction canceled successfully.");
      setBidsUpdated((prev) => !prev);
    } catch (err) {
      console.error("Cancel auction error:", err);
      toast.error("Failed to cancel auction.");
    } finally {
      setCanceling(false);
    }
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading auction details...</p>;
  if (error)
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  if (!auction) return <p style={{ textAlign: "center" }}>Auction not found</p>;

  let imgUrl = "https://via.placeholder.com/500x300?text=No+Image";
  if (
    auction.image_url &&
    typeof auction.image_url === "string" &&
    !auction.image_url.startsWith("http") &&
    auction.image_url.trim() !== "" &&
    auction.image_url.toLowerCase() !== "null" &&
    auction.image_url.toLowerCase() !== "undefined"
  ) {
    imgUrl = `http://localhost:5000/uploads/${auction.image_url}`;
  } else if (auction.image_url && auction.image_url.startsWith("http")) {
    imgUrl = auction.image_url;
  }

  const containerStyle = {
    maxWidth: "900px",
    margin: "40px auto",
    background: "white",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    padding: "25px",
    fontFamily: "'Poppins', sans-serif",
  };

  const imageStyle = {
    width: "100%",
    height: "300px",
    objectFit: "cover",
    borderRadius: "15px",
    marginBottom: "20px",
  };

  const titleStyle = {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "15px",
    color: "#333",
  };

  const descriptionStyle = {
    fontSize: "18px",
    color: "#555",
    marginBottom: "25px",
  };

  const infoStyle = {
    display: "flex",
    gap: "30px",
    marginBottom: "30px",
    fontSize: "16px",
    color: "#666",
  };

  const infoItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const iconStyle = {
    color: "#667eea",
    fontSize: "22px",
  };

  const strongStyle = {
    fontWeight: "700",
    color: "#333",
  };

  const unsoldStyle = {
    color: "#f44336",
    fontWeight: "700",
    fontSize: "20px",
    textAlign: "center",
    margin: "30px 0",
    border: "2px solid #f44336",
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: "#ffebee",
    fontFamily: "'Poppins', sans-serif",
  };

  const cancelButtonStyle = {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: canceling ? "not-allowed" : "pointer",
    fontWeight: "700",
    margin: "20px auto",
    display: "block",
    opacity: canceling ? 0.6 : 1,
  };

  return (
    <div style={containerStyle}>
      <img src={imgUrl} alt={auction.title} style={imageStyle} />
      <h1 style={titleStyle}>{auction.title}</h1>
      <p style={descriptionStyle}>{auction.description || "No description available."}</p>

      <div style={infoStyle}>
        <div style={infoItemStyle}>
          <FaGavel style={iconStyle} />
          <span>
            Current Bid: <strong style={strongStyle}>{auction.current_bid || auction.starting_bid} Points</strong>
          </span>
        </div>
        <div style={infoItemStyle}>
          <FaUser style={iconStyle} />
          <span>
            Total Bids: <strong style={strongStyle}>{auction.total_bids || 0}</strong>
          </span>
        </div>
      </div>

      {/* Only show timer if not cancelled and not ended */}
      {!isAuctionEndedOrCancelled() && <AuctionTimer endTime={auction.end_time} />}

      {/* Show cancel button if you are seller and not ended/cancelled */}
      {user?.id &&
        auction.seller_id &&
        String(user.id) === String(auction.seller_id) &&
        !isAuctionEndedOrCancelled() && (
          <button
            onClick={handleCancelAuction}
            style={cancelButtonStyle}
            disabled={canceling}
          >
            {canceling ? "Cancelling..." : "Cancel Auction"}
          </button>
        )}

      {/* Only show bid form if not ended or cancelled */}
      {!isAuctionEndedOrCancelled() && (
        <BidForm auction={auction} onBidPlaced={() => setBidsUpdated((prev) => !prev)} />
      )}

      {/* Status messages */}
      {auction.status === "cancelled" && (
        <p style={unsoldStyle}>
          Cancelled — This auction has been cancelled by the creator.
        </p>
      )}
      {isAuctionEndedOrCancelled() && auction.status !== "cancelled" && bids.length > 0 && (
        <p style={{ color: "red", textAlign: "center", fontWeight: "bold", margin: "18px 0" }}>
          Bidding has ended for this auction.
        </p>
      )}
      {isAuctionEndedOrCancelled() && auction.status !== "cancelled" && bids.length === 0 && (
        <p style={unsoldStyle}>Unsold — No bids were placed on this auction.</p>
      )}

      {bids.length > 0 && <BidHistory bids={bids} />}
    </div>
  );
};

export default AuctionDetail;
