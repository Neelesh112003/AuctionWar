import { useState, useEffect } from 'react';

const AuctionTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft('EXPIRED');
        clearInterval(timer);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const containerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    borderRadius: '15px',
    textAlign: 'center',
    color: 'white',
    marginBottom: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
  };

  const headingStyle = {
    marginBottom: '15px',
    fontSize: '18px',
    fontWeight: '600'
  };

  const timerDisplayStyle = {
    fontSize: '32px',
    fontWeight: '700',
    fontFamily: "'Courier New', monospace",
    letterSpacing: '2px',
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '15px',
    borderRadius: '10px'
  };

  const expiredStyle = {
    ...timerDisplayStyle,
    background: '#ff4757',
    color: 'white'
  };

  return (
    <div style={containerStyle}>
      <div style={headingStyle}>⏰ Time Remaining</div>
      <div style={timeLeft === 'EXPIRED' ? expiredStyle : timerDisplayStyle}>
        {timeLeft || 'Loading...'}
      </div>
    </div>
  );
};

export default AuctionTimer;
