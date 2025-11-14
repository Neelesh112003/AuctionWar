const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const bidRoutes = require('./routes/bidRoutes');
const userRoutes = require('./routes/userRoutes');

// Import socket handlers
const { setupSocketHandlers } = require('./socket/socketHandlers');

// Import auction scheduler
const { startAuctionScheduler } = require('./utils/auctionScheduler');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder statically for image access
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV 
  });
});

// Scheduler status check
app.get('/api/scheduler/status', (req, res) => {
  res.json({
    status: 'active',
    message: 'Auction scheduler is running',
    checkInterval: 'Every 1 minute',
    timestamp: new Date()
  });
});

// Setup socket handlers
setupSocketHandlers(io);

// Start auction scheduler (checks every minute for expired auctions)
startAuctionScheduler(io);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('\n🎉 ================================');
  console.log('🚀 AuctionWar Server Started!');
  console.log('🎉 ================================');
  console.log(`📡 Server running on port: ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`⚡ Socket.io ready for real-time bidding`);
  console.log(`🕐 Auction scheduler active (checks every 1 min)`);
  console.log(`📁 Static files: /uploads directory`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('================================\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});