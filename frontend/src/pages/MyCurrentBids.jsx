import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import usePageTitle from '../hooks/usePageTitle';

const MyCurrentBids = () => {
  usePageTitle('My Current Bids');
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
      const now = new Date();
      // Only bids on ongoing auctions
      const currentBids = res.data.data.filter(bid => new Date(bid.end_time) > now);
      setBids(currentBids);
    } catch (error) {
      console.error('Error fetching current bids:', error);
      toast.error('Failed to load current bids');
    } finally {
      setLoading(false);
    }
  };

  // Group your bids by auction
  const grouped = bids.reduce((acc, bid) => {
    if (!acc[bid.auction_id]) {
      acc[bid.auction_id] = {
        auction_title: bid.auction_title,
        auction_id: bid.auction_id,
        bids: []
      };
    }
    acc[bid.auction_id].bids.push(bid);
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '20px', color: '#667eea' }}>
        Loading current bids...
      </div>
    );
  }

  if (!Object.keys(grouped).length) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '18px', color: '#666' }}>
        No current bids found.
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 680,
      margin: '32px auto',
      padding: '0 24px 32px 24px',
      borderRadius: '18px',
      background: '#fff',
      boxShadow: '0 6px 36px rgba(102,126,234,0.08)',
      fontFamily: "'Poppins',sans-serif"
    }}>
      <h2 style={{
        margin: '25px 0 32px 0',
        color: '#23294a',
        fontWeight: 700,
        fontSize: '2.1rem'
      }}>Current Bids</h2>
      {Object.values(grouped).map(auction => {
        // sort DESC by amount, then by recency
        const sorted = [...auction.bids].sort((a, b) =>
          b.amount === a.amount
            ? new Date(b.bid_time) - new Date(a.bid_time)
            : b.amount - a.amount
        );
        const highest = sorted.length > 0 ? sorted[0].amount : null;

        return (
          <div
            key={auction.auction_id}
            style={{
              marginBottom: '42px',
              paddingBottom: '14px',
              borderBottom: '2px solid #e4e7f5'
            }}
          >
            <div style={{
              fontSize: '1.36rem', color: '#333', fontWeight: 700, marginBottom: 18
            }}>
              {auction.auction_title}
            </div>
            <div style={{
              maxHeight: 240,
              overflowY: 'auto',
              background: 'linear-gradient(90deg,#f6f8ff 60%,#eef0fe 100%)',
              borderRadius: 14,
              boxShadow: '0 2px 13px rgba(102,126,234,0.09)',
              padding: '7px 0 2px 0',
            }}>
              {sorted.map((bid, idx) => (
                <div
                  key={bid.id}
                  style={{
                    margin: '10px 16px',
                    marginBottom: idx === sorted.length - 1 ? 8 : 0,
                    padding: '16px 16px 12px 16px',
                    borderRadius: '10px',
                    background: idx === 0 ? "#e6ebfe" : "#fff",
                    border: idx === 0 ? '2px solid #667eea' : '1px solid #e0e0e0',
                    color: '#23294a',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '1.13rem', color: '#222' }}>
                    {bid.amount} Points
                  </span>
                  {bid.amount === highest ? (
                    <span
                      style={{
                        background: '#667eea',
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 700,
                        borderRadius: 7,
                        padding: '3px 11px'
                      }}
                    >Highest Bid</span>
                  ) : (
                    <span
                      style={{
                        background: '#eee',
                        color: '#667eea',
                        fontSize: 13,
                        fontWeight: 700,
                        borderRadius: 7,
                        padding: '3px 11px'
                      }}
                    >Outbid</span>
                  )}
                </div>
              ))}
            </div>
            <Link
              to={`/auction/${auction.auction_id}`}
              style={{
                color: '#667eea',
                fontWeight: 600,
                display: 'inline-block',
                marginTop: 16,
                marginLeft: 2,
                textDecoration: 'none'
              }}
            >View Auction &rarr;</Link>
          </div>
        );
      })}
    </div>
  );
};

export default MyCurrentBids;
