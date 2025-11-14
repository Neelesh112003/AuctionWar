CREATE DATABASE IF NOT EXISTS auctionwar;
USE auctionwar;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  points INT DEFAULT 1000,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Auctions table
CREATE TABLE auctions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  starting_bid INT NOT NULL,
  current_bid INT NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(50),
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  seller_id INT NOT NULL,
  winner_id INT,
  end_time DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id),
  FOREIGN KEY (winner_id) REFERENCES users(id)
);

-- Bids table
CREATE TABLE bids (
  id INT PRIMARY KEY AUTO_INCREMENT,
  auction_id INT NOT NULL,
  user_id INT NOT NULL,
  amount INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for better performance
CREATE INDEX idx_auctions_status ON auctions(status);
CREATE INDEX idx_auctions_end_time ON auctions(end_time);
CREATE INDEX idx_bids_auction ON bids(auction_id);
CREATE INDEX idx_bids_user ON bids(user_id);