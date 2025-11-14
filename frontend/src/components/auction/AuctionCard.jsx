import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGavel, FaUser, FaClock } from "react-icons/fa";
import AuctionTimer from "./AuctionTimer"; // Adjust path as necessary

const AuctionCard = ({ auction }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Safety for image URL
  let imgUrl = "https://via.placeholder.com/300x200?text=No+Image";
  if (
    auction.image_url &&
    typeof auction.image_url === "string" &&
    !auction.image_url.startsWith("http") &&
    auction.image_url.trim() !== "" &&
    auction.image_url.toLowerCase() !== "null" &&
    auction.image_url.toLowerCase() !== "undefined"
  ) {
    imgUrl = `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/${auction.image_url}`;
  } else if (auction.image_url && auction.image_url.startsWith("http")) {
    imgUrl = auction.image_url;
  }

  // Styles
  const cardStyle = {
    background: "white",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: isHovered
      ? "0 15px 40px rgba(0, 0, 0, 0.2)"
      : "0 10px 30px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    transform: isHovered ? "translateY(-10px)" : "translateY(0)",
  };

  const imageContainerStyle = {
    position: "relative",
    height: "200px",
    overflow: "hidden",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  };

  const badgeStyle = {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "5px 15px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  };

  const contentStyle = {
    padding: "20px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  };

  const titleStyle = {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#333",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const descriptionStyle = {
    color: "#666",
    fontSize: "14px",
    marginBottom: "15px",
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  };

  const infoStyle = {
    marginBottom: "15px",
  };

  const infoItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
    color: "#555",
    fontSize: "14px",
  };

  const iconStyle = {
    color: "#667eea",
    flexShrink: 0,
  };

  const strongStyle = {
    color: "#667eea",
    fontWeight: "700",
  };

  const buttonStyle = {
    width: "80%",
    textAlign: "center",
    marginTop: "auto",
    padding: "12px 30px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textDecoration: "none",
    display: "inline-block",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={imageContainerStyle}>
        <img
          src={imgUrl}
          alt={auction.title}
          style={{
            ...imageStyle,
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
        <span style={badgeStyle}>{auction.category || "Other"}</span>
      </div>

      <div style={contentStyle}>
        <div style={titleStyle}>{auction.title}</div>
        <div style={descriptionStyle}>
          {auction.description || "No description available"}
        </div>

        <div style={infoStyle}>
          <div style={infoItemStyle}>
            <FaGavel style={iconStyle} />
            <span>
              Current Bid:{" "}
              <span style={strongStyle}>
                {auction.current_bid || auction.starting_bid} Points
              </span>
            </span>
          </div>
          <div style={infoItemStyle}>
            <FaUser style={iconStyle} />
            <span>
              Bids: <span style={strongStyle}>{auction.total_bids || 0}</span>
            </span>
          </div>
          <div style={infoItemStyle}>
            <AuctionTimer endTime={auction.end_time} />
          </div>
        </div>

        <Link
          to={`/auction/${auction.id}`}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 5px 15px rgba(102, 126, 234, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          View & Bid
        </Link>
      </div>
    </div>
  );
};

export default AuctionCard;
