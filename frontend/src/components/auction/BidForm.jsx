import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const BidForm = ({ auction, onBidPlaced }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, loadUser } = useContext(AuthContext);

  const username = user?.username;
  const coins = user?.points || 0;

  if (!username) {
    return (
      <div style={{
        background: '#ffdddd',
        padding: 20,
        borderRadius: 10,
        color: '#900',
        marginBottom: 20,
        textAlign: 'center'
      }}>
        Please log in to place a bid.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert amount string to number safely
    const bidAmount = Number(amount);

    if (!bidAmount || bidAmount <= auction.current_bid) {
      toast.error(`Bid must be higher than ${auction.current_bid} points`);
      return;
    }

    if (bidAmount > coins) {
      toast.error(`Insufficient points. You have ${coins} points`);
      alert('Insufficient balance to place this bid.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/bids', {
        auction_id: auction.id,
        amount: bidAmount
      });

      toast.success('Bid placed successfully! 🎉');
      setAmount('');
      if (onBidPlaced) onBidPlaced();
      if (loadUser) loadUser();
    } catch (error) {
      // Log detailed error info to console for debugging
      console.error("Bid request error response data:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to place bid');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    background: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px'
  };

  const headingStyle = {
    marginBottom: '20px',
    color: '#333',
    fontSize: '22px',
    textAlign: 'center'
  };

  const infoBoxStyle = {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '16px',
    color: '#555'
  };

  const strongStyle = {
    color: '#667eea',
    fontSize: '18px',
    fontWeight: '700'
  };

  const formGroupStyle = {
    marginBottom: '15px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: "'Poppins', sans-serif",
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px 30px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    opacity: loading ? 0.6 : 1
  };

  return (
    <form onSubmit={handleSubmit} style={containerStyle}>
      <h2 style={headingStyle}>Place Your Bid</h2>
      <div style={infoBoxStyle}>
        <p>
          Current Bid: <strong style={strongStyle}>{auction.current_bid} Points</strong>
        </p>
        <p>
          Your Points: <strong style={strongStyle}>{coins} Points</strong>
        </p>
      </div>
      <div style={formGroupStyle}>
        <input
          type="number"
          style={inputStyle}
          placeholder={`Minimum: ${auction.current_bid + 1}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onFocus={(e) => (e.target.style.borderColor = "#667eea")}
          onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
          min={auction.current_bid + 1}
          required
        />
      </div>
      <button
        type="submit"
        style={buttonStyle}
        disabled={loading}
        onMouseEnter={(e) => {
          if (!loading) {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 5px 15px rgba(102, 126, 234, 0.4)";
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "none";
        }}
      >
        {loading ? "Placing Bid..." : "Place Bid"}
      </button>
    </form>
  );
};

export default BidForm;
