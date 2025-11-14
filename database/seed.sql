USE auctionwar;

-- Sample users (password: password123)
INSERT INTO users (username, email, password, phone, points) VALUES
('john_doe', 'john@example.com', '$2a$10$rBV2KlJ7O6eDyWQjF7XmneYB5wHJxKxVzN7XqKLuYZCfULxT.HV7e', '+919131558992', 5000),
('jane_smith', 'jane@example.com', '$2a$10$rBV2KlJ7O6eDyWQjF7XmneYB5wHJxKxVzN7XqKLuYZCfULxT.HV7e', '+919876543210', 3000);

-- Sample auctions
INSERT INTO auctions (title, description, starting_bid, current_bid, category, seller_id, end_time, image_url) VALUES
('Vintage Camera', 'Classic 35mm film camera in excellent condition', 500, 500, 'Electronics', 1, DATE_ADD(NOW(), INTERVAL 2 DAY), 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f'),
('Antique Watch', 'Beautiful vintage pocket watch from 1920s', 1000, 1000, 'Accessories', 2, DATE_ADD(NOW(), INTERVAL 3 DAY), 'https://images.unsplash.com/photo-1509941943102-10c232535736'),
('Gaming Laptop', 'High-performance gaming laptop, RTX 3060', 2000, 2000, 'Electronics', 1, DATE_ADD(NOW(), INTERVAL 1 DAY), 'https://images.unsplash.com/photo-1603302576837-37561b2e2302');