import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

const Home = () => {
  usePageTitle('AuctionWar-Home');
  const { isAuthenticated, username } = useContext(AuthContext);
  const navigate = useNavigate();
  const [floatingItems, setFloatingItems] = useState([]);

  useEffect(() => {
    const items = [
      { icon: '🎨', x: 10, y: 20, delay: 0, duration: 20 },
      { icon: '⌚', x: 80, y: 10, delay: 2, duration: 25 },
      { icon: '💎', x: 15, y: 70, delay: 4, duration: 22 },
      { icon: '🏆', x: 85, y: 60, delay: 1, duration: 24 },
      { icon: '📱', x: 50, y: 15, delay: 3, duration: 23 },
      { icon: '🎮', x: 70, y: 80, delay: 5, duration: 21 },
    ];
    setFloatingItems(items);
  }, []);

  if (isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          padding: '40px 30px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '30px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: Math.random() * 300 + 100 + 'px',
                height: Math.random() * 300 + 100 + 'px',
                borderRadius: '50%',
                background: `rgba(255, 255, 255, ${Math.random() * 0.1})`,
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -30px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          @keyframes slideInDown {
            from { opacity: 0; transform: translateY(-50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>

        <h1
          style={{
            fontSize: '48px',
            fontWeight: '700',
            animation: 'slideInDown 0.8s ease-out',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            position: 'relative',
            zIndex: 10,
          }}
        >
          Welcome back, {username}! 🎉
        </h1>

        <p
          style={{
            fontSize: '20px',
            maxWidth: '600px',
            animation: 'slideInDown 0.8s ease-out 0.2s both',
            opacity: 0.95,
            position: 'relative',
            zIndex: 10,
          }}
        >
          Ready to discover amazing deals and win exciting auctions?
        </p>

        <div
          style={{
            display: 'flex',
            gap: '24px',
            animation: 'slideInUp 0.8s ease-out 0.4s both',
            zIndex: 10,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <button
            style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              padding: '18px 45px',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              animation: 'pulse 2s ease-in-out infinite'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
            }}
            onClick={() => navigate('/dashboard')}
          >
            🎯 Go to Dashboard
          </button>
          <button
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '2px solid white',
              color: 'white',
              padding: '18px 45px',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={() => navigate('/auctions')}
          >
            🔥 Browse Auctions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        color: 'white',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating icons */}
      {floatingItems.map((item, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: '48px',
            animation: `floatItem ${item.duration}s ease-in-out infinite`,
            animationDelay: `${item.delay}s`,
            opacity: 0.6,
            pointerEvents: 'none',
            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))',
          }}
        >
          {item.icon}
        </div>
      ))}

      {/* Background floating circles */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          top: '-200px',
          right: '-200px',
          animation: 'float 15s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          bottom: '-150px',
          left: '-150px',
          animation: 'float 20s ease-in-out infinite',
          animationDelay: '2s',
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          animation: 'fadeInScale 1s ease-out',
        }}
      >
        <div
          style={{
            fontSize: '72px',
            marginBottom: '20px',
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          ⚡
        </div>

        <h1
          style={{
            fontSize: '56px',
            margin: '0 0 20px 0',
            fontWeight: '700',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            background: 'linear-gradient(90deg, #fff, #f0f0f0, #fff)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer 3s linear infinite',
          }}
        >
          Welcome to AuctionWar
        </h1>

        <p
          style={{
            fontSize: '22px',
            fontWeight: '300',
            maxWidth: '550px',
            marginBottom: '50px',
            lineHeight: '1.6',
            opacity: 0.95,
          }}
        >
          Bid on exclusive items with confidence on a secure and transparent platform.{' '}
          <span style={{ display: 'block', marginTop: '10px', fontSize: '18px' }}>
            ✨ Real-time bidding • 🔒 Secure payments • 🏆 Win amazing deals
          </span>
        </p>

        <div
          style={{
            display: 'flex',
            gap: '24px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              padding: '18px 45px',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              animation: 'slideInFromLeft 0.8s ease-out, glow 2s ease-in-out infinite',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
            }}
            onClick={() => navigate('/register')}
          >
            🚀 Get Started - Register
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '2px solid white',
              color: 'white',
              padding: '18px 45px',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              animation: 'slideInFromRight 0.8s ease-out',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
          >
            🔑 Login
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '30px',
            marginTop: '60px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {[
            { icon: '⚡', text: 'Lightning Fast', delay: '0.2s' },
            { icon: '🎯', text: 'Smart Bidding', delay: '0.4s' },
            { icon: '🛡️', text: 'Secure & Safe', delay: '0.6s' },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                padding: '20px 30px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.2)',
                animation: `fadeInScale 0.8s ease-out ${feature.delay} both`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{feature.icon}</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>{feature.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
