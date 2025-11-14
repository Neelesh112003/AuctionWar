import React from 'react';
import { FaUser, FaClock } from 'react-icons/fa';

const BidHistory = ({ bids }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const containerStyle = {
    background: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
  };

  const headingStyle = {
    marginBottom: '20px',
    color: '#333',
    fontSize: '22px'
  };

  const listStyle = {
    maxHeight: '400px',
    overflowY: 'auto'
  };

  const bidItemStyle = {
    padding: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    marginBottom: '15px',
    transition: 'all 0.3s ease'
  };

  const highestBidStyle = {
    ...bidItemStyle,
    borderColor: '#667eea',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
  };

  const bidderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '600',
    color: '#333'
  };

  const iconStyle = {
    color: '#667eea'
  };

  const badgeStyle = {
    background: '#667eea',
    color: 'white',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  };

  const amountStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#667eea'
  };

  const timeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#666',
    fontSize: '14px'
  };

  const noBidsStyle = {
    textAlign: 'center',
    padding: '40px',
    color: '#999'
  };

  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Bid History ({bids?.length || 0})</h2>
      {bids && bids.length > 0 ? (
        <div style={listStyle}>
          {bids.map((bid, index) => (
            <div 
              key={bid.id} 
              style={
                index === 0 
                  ? highestBidStyle 
                  : {
                      ...bidItemStyle,
                      borderColor: hoveredIndex === index ? '#667eea' : '#e0e0e0',
                      background: hoveredIndex === index ? '#f8f9fa' : 'transparent'
                    }
              }
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div style={bidderStyle}>
                <FaUser style={iconStyle} />
                <span>{bid.bidder_name}</span>
                {index === 0 && <span style={badgeStyle}>Highest Bid</span>}
              </div>
              <div style={amountStyle}>{bid.amount} Points</div>
              <div style={timeStyle}>
                <FaClock style={iconStyle} />
                <span>{formatDate(bid.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={noBidsStyle}>
          No bids yet. Be the first to bid! 🎯
        </div>
      )}
    </div>
  );
};

export default BidHistory;
