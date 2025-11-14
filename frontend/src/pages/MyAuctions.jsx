import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaPlus, FaGavel, FaClock, FaUser, FaTrophy } from "react-icons/fa";
import api from "../services/api";
import { toast } from "react-toastify";
import usePageTitle from "../hooks/usePageTitle";

const MyAuctions = () => {
  usePageTitle("My Auctions");
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchMyAuctions();
    // eslint-disable-next-line
  }, []);

  const fetchMyAuctions = async () => {
    try {
      const res = await api.get("users/my-auctions");
      setAuctions(res.data.data);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      toast.error("Failed to load your auctions");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status, endTime) => {
    const now = new Date();
    const end = new Date(endTime);

    if (status === "completed") return { text: "Completed", color: "#28a745" };
    if (status === "cancelled") return { text: "Cancelled", color: "#dc3545" };
    if (end < now) return { text: "Ended", color: "#6c757d" };
    return { text: "Active", color: "#667eea" };
  };

  const formatTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff < 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return "Ending soon";
  };

  const getFullImageUrl = (url) => {
    if (
      url &&
      typeof url === "string" &&
      !url.startsWith("http") &&
      url.trim() !== "" &&
      url.toLowerCase() !== "null" &&
      url.toLowerCase() !== "undefined"
    ) {
      return `${
        import.meta.env.VITE_API_URL?.replace("/api", "") ||
        "http://localhost:5000"
      }/uploads/${url}`;
    } else if (url && url.startsWith("http")) {
      return url;
    }
    return "https://via.placeholder.com/300x200?text=No+Image";
  };

  // Styles object
  const styles = {
    pageStyle: {
      padding: "20px 0",
      minHeight: "calc(100vh - 150px)",
    },
    containerStyle: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 20px",
    },
    headerStyle: {
      background: "white",
      padding: "40px",
      borderRadius: "20px",
      marginBottom: "30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    },
    headerTextStyle: { flex: 1 },
    titleStyle: {
      fontSize: "36px",
      color: "#333",
      marginBottom: "10px",
    },
    subtitleStyle: {
      color: "#666",
      fontSize: "18px",
    },
    createButtonStyle: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "12px 30px",
      borderRadius: "8px",
      border: "none",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
    },
    statsGridStyle: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginBottom: "30px",
    },
    statCardStyle: {
      background: "white",
      padding: "25px",
      borderRadius: "15px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      display: "flex",
      alignItems: "center",
      gap: "15px",
    },
    statIconStyle: {
      fontSize: "40px",
      color: "#667eea",
    },
    statInfoStyle: { flex: 1 },
    statValueStyle: {
      fontSize: "32px",
      fontWeight: "700",
      color: "#333",
      marginBottom: "5px",
    },
    statLabelStyle: {
      color: "#666",
      fontSize: "14px",
    },
    gridStyle: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: "25px",
    },
    cardStyle: {
      background: "white",
      borderRadius: "15px",
      overflow: "hidden",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      position: "relative",
      display: "flex",
      flexDirection: "column",
    },
    imageContainerStyle: {
      position: "relative",
      height: "200px",
      overflow: "hidden",
    },
    imageStyle: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.3s ease",
    },
    statusBadgeStyle: (color) => ({
      position: "absolute",
      top: "15px",
      right: "15px",
      background: color,
      color: "white",
      padding: "5px 15px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
    }),
    contentStyle: { padding: "20px", flexGrow: 1 },
    cardTitleStyle: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#333",
      marginBottom: "15px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    infoRowStyle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
      fontSize: "14px",
      color: "#666",
    },
    infoLabelStyle: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    infoValueStyle: {
      fontWeight: "600",
      color: "#667eea",
    },
    viewButtonStyle: {
      width: "90%",
      padding: "12px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "15px",
      textDecoration: "none",
      display: "block",
      textAlign: "center",
    },
    loadingStyle: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "400px",
      gap: "20px",
    },
    spinnerStyle: {
      border: "4px solid rgba(102, 126, 234, 0.3)",
      borderTop: "4px solid #667eea",
      borderRadius: "50%",
      width: "50px",
      height: "50px",
      animation: "spin 1s linear infinite",
    },
    emptyStyle: {
      background: "white",
      padding: "60px",
      borderRadius: "15px",
      textAlign: "center",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    },
    emptyIconStyle: {
      fontSize: "80px",
      color: "#e0e0e0",
      marginBottom: "20px",
    },
    emptyTitleStyle: {
      fontSize: "24px",
      color: "#333",
      marginBottom: "10px",
    },
    emptyTextStyle: {
      color: "#666",
      marginBottom: "30px",
    },
  };

  // ---- Statistics Calculation ----
  const activeAuctions = auctions.filter((a) => {
    const status = getStatusBadge(a.status, a.end_time);
    return status.text === "Active";
  });
  const totalBids = auctions.reduce((sum, a) => sum + (a.total_bids || 0), 0);
  const totalRevenue = auctions.reduce(
    (sum, a) => sum + (a.current_bid || a.starting_bid),
    0
  );

  if (loading) {
    return (
      <div style={styles.loadingStyle}>
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
        <div style={styles.spinnerStyle}></div>
        <div>Loading your auctions...</div>
      </div>
    );
  }

  return (
    <div style={styles.pageStyle}>
      <style>
        {`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}
      </style>
      <div style={styles.containerStyle}>
        {/* Header */}
        <div style={styles.headerStyle}>
          <div style={styles.headerTextStyle}>
            <div style={styles.titleStyle}>My Auctions</div>
            <div style={styles.subtitleStyle}>
              Manage and track your listed items
            </div>
          </div>
          <Link
            to="/create-auction"
            style={styles.createButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 5px 15px rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            <FaPlus /> Create New Auction
          </Link>
        </div>

        {/* Statistics */}
        <div style={styles.statsGridStyle}>
          <div style={styles.statCardStyle}>
            <FaGavel style={styles.statIconStyle} />
            <div style={styles.statInfoStyle}>
              <div style={styles.statValueStyle}>{auctions.length}</div>
              <div style={styles.statLabelStyle}>Total Auctions</div>
            </div>
          </div>
          <div style={styles.statCardStyle}>
            <FaClock style={styles.statIconStyle} />
            <div style={styles.statInfoStyle}>
              <div style={styles.statValueStyle}>{activeAuctions.length}</div>
              <div style={styles.statLabelStyle}>Active Auctions</div>
            </div>
          </div>
          <div style={styles.statCardStyle}>
            <FaUser style={styles.statIconStyle} />
            <div style={styles.statInfoStyle}>
              <div style={styles.statValueStyle}>{totalBids}</div>
              <div style={styles.statLabelStyle}>Total Bids</div>
            </div>
          </div>
          <div style={styles.statCardStyle}>
            <FaTrophy style={styles.statIconStyle} />
            <div style={styles.statInfoStyle}>
              <div style={styles.statValueStyle}>{totalRevenue}</div>
              <div style={styles.statLabelStyle}>Total Value (Points)</div>
            </div>
          </div>
        </div>

        {/* Auctions Grid or Empty State */}
        {auctions.length > 0 ? (
          <div style={styles.gridStyle}>
            {auctions.map((auction) => {
              const status = getStatusBadge(auction.status, auction.end_time);
              return (
                <div key={auction.id} style={styles.cardStyle}>
                  <div style={styles.imageContainerStyle}>
                    <img
                      src={getFullImageUrl(auction.image_url)}
                      alt={auction.title}
                      style={styles.imageStyle}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                    <div style={styles.statusBadgeStyle(status.color)}>
                      {status.text}
                    </div>
                  </div>
                  <div style={styles.contentStyle}>
                    <div style={styles.cardTitleStyle} title={auction.title}>
                      {auction.title}
                    </div>
                    <div style={styles.infoRowStyle}>
                      <div style={styles.infoLabelStyle}>Current Bid:</div>
                      <div style={styles.infoValueStyle}>
                        {auction.current_bid} Points
                      </div>
                    </div>
                    <div style={styles.infoRowStyle}>
                      <div style={styles.infoLabelStyle}>Total Bids:</div>
                      <div style={styles.infoValueStyle}>
                        {auction.total_bids || 0}
                      </div>
                    </div>
                    <div style={styles.infoRowStyle}>
                      <div style={styles.infoLabelStyle}>Time:</div>
                      <div style={styles.infoValueStyle}>
                        {formatTimeRemaining(auction.end_time)}
                      </div>
                    </div>
                    {auction.highest_bidder && (
                      <div style={styles.infoRowStyle}>
                        <div style={styles.infoLabelStyle}>Top Bidder:</div>
                        <div style={styles.infoValueStyle}>
                          {auction.highest_bidder}
                        </div>
                      </div>
                    )}
                    <Link
                      to={`/auction/${auction.id}`}
                      style={styles.viewButtonStyle}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 5px 15px rgba(102, 126, 234, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyStyle}>
            <div style={styles.emptyIconStyle}>
              <FaGavel />
            </div>
            <div style={styles.emptyTitleStyle}>No Auctions Yet</div>
            <div style={styles.emptyTextStyle}>
              Start by creating your first auction!
            </div>
            <Link
              to="/create-auction"
              style={styles.createButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 5px 15px rgba(102, 126, 234, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              <FaPlus /> Create Your First Auction
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAuctions;
