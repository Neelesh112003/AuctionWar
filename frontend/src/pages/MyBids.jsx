import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaGavel, FaTrophy } from 'react-icons/fa';
import api from '../services/api';
import { toast } from 'react-toastify';
import usePageTitle from '../hooks/usePageTitle';

const MyBids = () => {
  usePageTitle('My Bids');
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBids();
    // eslint-disable-next-line
  }, []);

  const fetchMyBids = async () => {
    try {
      const res = await api.get('bids/my-bids');
      setBids(res.data.data);
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast.error('Failed to load your bids');
    } finally {
      setLoading(false);
    }
  };

  // Count unique auctions
  const participatedAuctions = new Set(bids.map(b => b.auction_id)).size;
  // Currently winning bids (where end_time > now and is_winning)
  const winningBids = bids.filter(b => b.is_winning && new Date(b.end_time) > new Date()).length;

  const pageStyle = { padding: '20px 0', minHeight: 'calc(100vh - 150px)', background: '#f8fafc' };
  const containerStyle = { maxWidth: '600px', margin: '0 auto', padding: '0 20px' };
  const headerStyle = {
    background: 'white',
    padding: '40px',
    borderRadius: '20px',
    marginBottom: '30px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
  };
  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '30px'
  };
  const statCardStyle = {
    background: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flexDirection: 'column'
  };
  const statValueStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '5px'
  };
  const statLabelStyle = { color: '#666', fontSize: '15px', textAlign: 'center' };

  const buttonRowStyle = { display: 'flex', gap: '20px', justifyContent: 'center' };
  const navButtonStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '16px 40px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '15px',
    textDecoration: 'none',
    display: 'inline-block'
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', margin: '50px 0', color: '#667eea', fontSize: '20px' }}>
            Loading your bids...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={{ fontSize: '36px', color: '#333', marginBottom: '10px' }}>My Bids</h1>
        </div>
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <FaGavel style={{ fontSize: '40px', color: '#667eea' }} />
            <div style={statValueStyle}>{participatedAuctions}</div>
            <div style={statLabelStyle}>Auctions Participated</div>
          </div>
          <div style={statCardStyle}>
            <FaTrophy style={{ fontSize: '40px', color: '#667eea' }} />
            <div style={statValueStyle}>{winningBids}</div>
            <div style={statLabelStyle}>Currently Winning</div>
          </div>
        </div>
        <div style={buttonRowStyle}>
          <button
            style={navButtonStyle}
            onClick={() => navigate('/my-bids/current')}
          >Current Auctions</button>
          <button
            style={navButtonStyle}
            onClick={() => navigate('/my-bids/completed')}
          >Completed Auctions</button>
        </div>
      </div>
    </div>
  );
};

export default MyBids;
