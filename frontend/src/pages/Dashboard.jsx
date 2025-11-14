import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext"; // Use the hook instead of direct context
import { FaGavel, FaTrophy, FaCoins, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import usePageTitle from "../hooks/usePageTitle";

const Dashboard = () => {
  usePageTitle('Dashboard');
  const [activeAuctions, setActiveAuctions] = useState(0);
  const [myBids, setMyBids] = useState(0);
  const [myAuctions, setMyAuctions] = useState(0);
  const { user, loadUser } = useContext(AuthContext);
  const socket = useSocket();

  const fetchDashboardData = async () => {
    try {
      const activeRes = await api.get("/auctions");
      setActiveAuctions(activeRes.data.count || activeRes.data.data.length);

      const bidsRes = await api.get("/bids/my-bids");
      setMyBids(bidsRes.data.count || bidsRes.data.data.length);

      const myAuctionsRes = await api.get("/users/my-auctions");
      setMyAuctions(myAuctionsRes.data.count || myAuctionsRes.data.data.length);

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (socket && user) {
      console.log('📡 Dashboard listening for socket events...');
      socket.on('userNotification', (data) => {
        console.log('📢 Notification received:', data);
        if (data.userId === user.id) {
          if (data.type === 'win' || data.type === 'sale') toast.success(data.message);
          else toast.info(data.message);
          if (loadUser) loadUser();
          fetchDashboardData();
        }
      });

      socket.on('auctionCompleted', (data) => {
        console.log('🎉 Auction completed:', data);
        if (loadUser) loadUser();
        fetchDashboardData();
      });

      return () => {
        socket.off('userNotification');
        socket.off('auctionCompleted');
      };
    }
  }, [socket, user, loadUser]);

  if (!user) {
    return (
      <div style={loadingContainerStyle}>
        <div style={spinnerStyle}></div>
        <p style={{ color: 'white', marginTop: '20px' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .coin-value {
            animation: pulse 2s ease-in-out infinite;
          }
          .action-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
          }
          .stats-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>

      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Welcome back, {user.username}! 👋</h1>
            <p style={subtitleStyle}>Here's what's happening with your auctions</p>
          </div>
          <Link to="/create-auction" style={createButtonStyle}>
            <FaPlus /> Create Auction
          </Link>
        </div>

        <div style={statsGridStyle}>
          <div style={coinsCardStyle} className="stats-card">
            <div style={cardIconStyle}>
              <FaCoins style={{ fontSize: '50px', color: 'white' }} />
            </div>
            <div style={cardContentStyle}>
              <h2 style={cardLabelStyle}>My Points</h2>
              <p style={coinsValueStyle} className="coin-value">
                {user.points || 0}
              </p>
              <p style={cardSubtextStyle}>Available Balance</p>
            </div>
          </div>

          <div style={cardStyle} className="stats-card">
            <div style={cardIconStyle}>
              <FaGavel style={{ fontSize: '50px', color: '#667eea' }} />
            </div>
            <div style={cardContentStyle}>
              <h2 style={{ ...cardLabelStyle, color: '#333' }}>Active Auctions</h2>
              <p style={cardValueStyle}>{activeAuctions}</p>
              <Link to="/auctions" style={cardLinkStyle}>
                Browse →
              </Link>
            </div>
          </div>

          <div style={cardStyle} className="stats-card">
            <div style={cardIconStyle}>
              <FaTrophy style={{ fontSize: '50px', color: '#f093fb' }} />
            </div>
            <div style={cardContentStyle}>
              <h2 style={{ ...cardLabelStyle, color: '#333' }}>My Bids</h2>
              <p style={cardValueStyle}>{myBids}</p>
              <Link to="/my-bids" style={cardLinkStyle}>
                View All →
              </Link>
            </div>
          </div>

          <div style={cardStyle} className="stats-card">
            <div style={cardIconStyle}>
              <FaGavel style={{ fontSize: '50px', color: '#764ba2' }} />
            </div>
            <div style={cardContentStyle}>
              <h2 style={{ ...cardLabelStyle, color: '#333' }}>My Auctions</h2>
              <p style={cardValueStyle}>{myAuctions}</p>
              <Link to="/my-auctions" style={cardLinkStyle}>
                Manage →
              </Link>
            </div>
          </div>
        </div>

        <div style={quickActionsStyle}>
          <h2 style={sectionTitleStyle}>Quick Actions</h2>
          <div style={actionsGridStyle}>
            <Link to="/create-auction" style={actionCardStyle} className="action-card">
              <div style={actionIconStyle}>📝</div>
              <h3>Create Auction</h3>
              <p>List your item for bidding</p>
            </Link>
            <Link to="/auction-search" style={actionCardStyle} className="action-card">
              <div style={actionIconStyle}>🔍</div>
              <h3>Browse Auctions</h3>
              <p>Find items to bid on</p>
            </Link>
            <Link to="/my-bids" style={actionCardStyle} className="action-card">
              <div style={actionIconStyle}>🏆</div>
              <h3>My Bids</h3>
              <p>Track your bidding activity</p>
            </Link>
            <Link to="/my-auctions" style={actionCardStyle} className="action-card">
              <div style={actionIconStyle}>📊</div>
              <h3>My Auctions</h3>
              <p>Manage your listings</p>
            </Link>
          </div>
        </div>

        {socket && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'rgba(102, 126, 234, 0.9)',
            color: 'white',
            padding: '8px 15px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
          }}>
            🟢 Live Updates Active
          </div>
        )}
      </div>
    </div>
  );
};

// Style objects below:

const loadingContainerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "calc(100vh - 150px)",
};

const spinnerStyle = {
  border: "4px solid rgba(255, 255, 255, 0.3)",
  borderTop: "4px solid white",
  borderRadius: "50%",
  width: "50px",
  height: "50px",
  animation: "spin 1s linear infinite",
};

const pageStyle = {
  minHeight: "calc(100vh - 150px)",
  padding: "20px 0",
};

const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 20px",
};

const headerStyle = {
  background: "white",
  padding: "40px",
  borderRadius: "20px",
  marginBottom: "30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
};

const titleStyle = {
  fontSize: "36px",
  color: "#333",
  marginBottom: "10px",
  fontWeight: "700",
};

const subtitleStyle = {
  color: "#666",
  fontSize: "18px",
};

const createButtonStyle = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  padding: "12px 30px",
  borderRadius: "8px",
  border: "none",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  transition: "all 0.3s ease",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "25px",
  marginBottom: "40px",
};

const cardStyle = {
  background: "white",
  borderRadius: "20px",
  padding: "30px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  cursor: "pointer",
};

const coinsCardStyle = {
  ...cardStyle,
  background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
  color: "white",
  position: "relative",
  overflow: "hidden",
};

const cardIconStyle = {
  marginBottom: "15px",
};

const cardContentStyle = {
  textAlign: "center",
};

const cardLabelStyle = {
  fontSize: "16px",
  fontWeight: "600",
  marginBottom: "10px",
  opacity: "0.9",
};

const cardValueStyle = {
  fontSize: "48px",
  fontWeight: "700",
  color: "#667eea",
  marginBottom: "10px",
};

const coinsValueStyle = {
  fontSize: "56px",
  fontWeight: "700",
  color: "white",
  marginBottom: "5px",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
};

const cardSubtextStyle = {
  fontSize: "14px",
  opacity: "0.8",
};

const cardLinkStyle = {
  color: "#667eea",
  fontWeight: "600",
  textDecoration: "none",
  fontSize: "14px",
  transition: "all 0.3s ease",
};

const quickActionsStyle = {
  marginTop: "40px",
};

const sectionTitleStyle = {
  fontSize: "28px",
  color: "white",
  marginBottom: "25px",
  fontWeight: "700",
};

const actionsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
};

const actionCardStyle = {
  background: "white",
  borderRadius: "15px",
  padding: "30px",
  textAlign: "center",
  textDecoration: "none",
  color: "#333",
  transition: "all 0.3s ease",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
};

const actionIconStyle = {
  fontSize: "60px",
  marginBottom: "15px",
};

export default Dashboard;
