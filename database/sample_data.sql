-- Sample Data for Hyper-Local Micro-Delivery System

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS hlmd_db;
USE hlmd_db;

-- 2. Insert Orders (Hyper-local points around Bangalore)
INSERT INTO orders (customer_name, address, latitude, longitude, status, total_amount, created_at, updated_at) VALUES
('Rahul Sharma', 'MG Road, Bangalore', 12.9716, 77.5946, 'PENDING', 450.00, NOW(), NOW()),
('Anjali Singh', 'Koramangala 5th Block', 12.9352, 77.6245, 'PENDING', 1200.00, NOW(), NOW()),
('Vikram Mehta', 'Indiranagar 100ft Road', 12.9719, 77.6412, 'PENDING', 320.00, NOW(), NOW()),
('Sanjana Rao', 'HSR Layout Sector 2', 12.9128, 77.6387, 'PENDING', 890.00, NOW(), NOW());

-- 3. Insert Users (Password is 'password' BCrypt hashed)
-- Note: In a real app, these would be created via the /register endpoint
-- The hash below corresponds to 'password'
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@fleetopt.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07IxS16.uJ.D9E71j.', 'Super', 'Admin', 'ADMIN'),
('agent1@fleetopt.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07IxS16.uJ.D9E71j.', 'Suresh', 'Kumar', 'DELIVERY_BOY');

-- 4. Link Agent Profile
INSERT INTO delivery_agents (user_id, name, phone, is_available, current_lat, current_lng) VALUES
(2, 'Suresh Kumar', '9876543210', 1, 12.9716, 77.5946);
