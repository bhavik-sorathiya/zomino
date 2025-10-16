-- Zomino combined DB dump (schema + seed data)
-- Run this against a MySQL database to create schema and seed sample data

-- === SCHEMA ===

CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'USER',
  phone VARCHAR(50),
  address VARCHAR(1024),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurants (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(1024),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(50),
  price DECIMAL(10,2),
  restaurant_id BIGINT,
  CONSTRAINT fk_menu_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS carts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  cart_id BIGINT NOT NULL,
  menu_item_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  CONSTRAINT fk_cartitem_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  CONSTRAINT fk_cartitem_menu FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  restaurant_id BIGINT NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  delivery_charge DECIMAL(12,2) NOT NULL DEFAULT 0,
  grand_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  delivery_address VARCHAR(1024),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  menu_item_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_orderitem_menu FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  restaurant_id BIGINT NOT NULL,
  rating INT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_menu_restaurant ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_order_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_restaurant ON orders(restaurant_id);

-- === SEED DATA ===
-- Users (passwords should be bcrypt encoded in production; these are placeholders)
INSERT INTO users (id, name, email, password, role, phone, address) VALUES (1, 'John Doe', 'john@example.com', 'PASSWORD_PLACEHOLDER', 'USER', '1234567890', '123 Main St, City');
INSERT INTO users (id, name, email, password, role, phone, address) VALUES (2, 'Jane Smith', 'jane@example.com', 'PASSWORD_PLACEHOLDER', 'USER', '9876543210', '456 Oak Ave, Town');
INSERT INTO users (id, name, email, password, role, phone, address) VALUES (3, 'Admin User', 'admin@zomino.com', 'PASSWORD_PLACEHOLDER', 'ADMIN', '5555555555', NULL);

-- Restaurants
INSERT INTO restaurants (id, name, address, created_at) VALUES (1, 'Pizzeria Zomino', '12 Market St', NOW());
INSERT INTO restaurants (id, name, address, created_at) VALUES (2, 'Sushi Hub', '45 Ocean Ave', NOW());
INSERT INTO restaurants (id, name, address, created_at) VALUES (3, 'Spice Villa', '88 Curry Rd', NOW());
INSERT INTO restaurants (id, name, address, created_at) VALUES (4, 'Burger Barn', '7 King St', NOW());
INSERT INTO restaurants (id, name, address, created_at) VALUES (5, 'Green Salads', '102 Meadow Ln', NOW());
INSERT INTO restaurants (id, name, address, created_at) VALUES (6, 'Taco Town', '9 Fiesta Ave', NOW());
INSERT INTO restaurants (id, name, address, created_at) VALUES (7, 'Curry Express', '210 Spice Blvd', NOW());
INSERT INTO restaurants (id, name, address, created_at) VALUES (8, 'Noodle Nest', '33 Bamboo St', NOW());
INSERT INTO restaurants (id, name, address, created_at) VALUES (9, 'Pizza Palace', '200 Baker St', NOW());
INSERT INTO restaurants (id, name, address, created_at) VALUES (10, 'Bistro Bella', '56 Garden Rd', NOW());
INSERT INTO restaurants (id, name, address, created_at) VALUES (11, 'Dosa Point', '14 South St', NOW());
INSERT INTO restaurants (id, name, address, created_at) VALUES (12, 'BBQ Central', '88 Grill Ave', NOW());

-- Menu items (IDs chosen to be deterministic)
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (100, 'Margherita Pizza', 'VEG', 7.50, 1);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (101, 'Pepperoni Pizza', 'NON-VEG', 8.90, 1);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (102, 'Four Cheese Pizza', 'VEG', 9.50, 1);

INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (200, 'Salmon Nigiri', 'NON-VEG', 5.00, 2);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (201, 'Avocado Roll', 'VEG', 4.00, 2);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (202, 'Dragon Roll', 'NON-VEG', 6.75, 2);

-- (additional menu items as per migration V2...)

-- Note: Replace PASSWORD_PLACEHOLDER with bcrypt(password) values or configure the app to create users securely.
ho