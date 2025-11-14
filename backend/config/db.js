const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'auctionwar',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('📝 Please check your .env file and MySQL server');
    return;
  }
  console.log('✅ MySQL Database connected successfully');
  console.log(`📊 Database: ${process.env.DB_NAME}`);
  connection.release();
});

// Promise wrapper for async/await
const promisePool = pool.promise();

module.exports = promisePool;