import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaGavel, FaTrophy, FaTimesCircle } from 'react-icons/fa';
import api from '../services/api';
import { toast } from 'react-toastify';
import usePageTitle from '../hooks/usePageTitle';

const MyCompletedBids = () => {
  usePageTitle('My Completed Bids');
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchBids();
    // eslint-disable-next-line
  }, []);

  const fetchBids = async () => {
    try {
      const res = await api.get('bids/my-bids');
      // Filter bids where auction ended
      const now = new Date();
      const completedBids = res.data.data.filter(bid => new Date(bid.end_time) <= now);
      setBids(completedBids);
    } catch (error) {
      console.error('Error fetching completed bids:', error);
      toast.error('Failed to load completed bids');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{textAlign: 'center', marginTop: '50px', fontSize: '20px', color: '#667eea'}}>
        Loading completed bids...
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div style={{textAlign: 'center', marginTop: '50px', fontSize: '18px', color: '#666'}}>
        No completed bids found.
      </div>
    );
  }

  return (
    <div style={{maxWidth: 600, margin: '20px auto', padding: '0 20px'}}>
      <h2 style={{marginBottom: '30px', color: '#333'}}>Completed Bids</h2>
      <div style={{display: 'grid', gap: '20px'}}>
        {bids.map((bid) => (
          <div key={bid.id} style={{padding: 20, borderRadius: 15, boxShadow: '0 4px 16px rgba(102,126,234,0.1)', background: 'white'}}>
            <h3 style={{marginBottom: 10, color: '#4a3c77'}}>{bid.auction_title}</h3>
            <div><b>Your Bid:</b> {bid.amount} Points</div>
            <div><b>Status:</b> {bid.is_winning ? <><FaTrophy color="#28a745" /> Won</> : <><FaTimesCircle color="#6c757d" /> Lost</>}</div>
            <Link to={`/auction/${bid.auction_id}`} style={{color: '#667eea', marginTop: 10, display: 'inline-block'}}>
              View Auction &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCompletedBids;
