-- Flyway migration: seed restaurants and menu items (deterministic IDs)

-- Insert restaurants with explicit IDs for deterministic tests
INSERT INTO restaurants (id, name, address, created_at) VALUES (1, 'Pizzeria Zomino', '12 Market St', CURRENT_TIMESTAMP);
INSERT INTO restaurants (id, name, address, created_at) VALUES (2, 'Sushi Hub', '45 Ocean Ave', CURRENT_TIMESTAMP);
INSERT INTO restaurants (id, name, address, created_at) VALUES (3, 'Spice Villa', '88 Curry Rd', CURRENT_TIMESTAMP);
INSERT INTO restaurants (id, name, address, created_at) VALUES (4, 'Burger Barn', '7 King St', CURRENT_TIMESTAMP);
INSERT INTO restaurants (id, name, address, created_at) VALUES (5, 'Green Salads', '102 Meadow Ln', CURRENT_TIMESTAMP);
INSERT INTO restaurants (id, name, address, created_at) VALUES (6, 'Taco Town', '9 Fiesta Ave', CURRENT_TIMESTAMP);
INSERT INTO restaurants (id, name, address, created_at) VALUES (7, 'Curry Express', '210 Spice Blvd', CURRENT_TIMESTAMP);
INSERT INTO restaurants (id, name, address, created_at) VALUES (8, 'Noodle Nest', '33 Bamboo St', CURRENT_TIMESTAMP);
INSERT INTO restaurants (id, name, address, created_at) VALUES (9, 'Pizza Palace', '200 Baker St', CURRENT_TIMESTAMP);
INSERT INTO restaurants (id, name, address, created_at) VALUES (10, 'Bistro Bella', '56 Garden Rd', CURRENT_TIMESTAMP);
INSERT INTO restaurants (id, name, address, created_at) VALUES (11, 'Dosa Point', '14 South St', CURRENT_TIMESTAMP);
INSERT INTO restaurants (id, name, address, created_at) VALUES (12, 'BBQ Central', '88 Grill Ave', CURRENT_TIMESTAMP);

-- Menu items for each restaurant (explicit IDs)
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (100, 'Margherita Pizza', 'VEG', 7.50, 1);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (101, 'Pepperoni Pizza', 'NON-VEG', 8.90, 1);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (102, 'Four Cheese Pizza', 'VEG', 9.50, 1);

INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (200, 'Salmon Nigiri', 'NON-VEG', 5.00, 2);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (201, 'Avocado Roll', 'VEG', 4.00, 2);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (202, 'Dragon Roll', 'NON-VEG', 6.75, 2);

INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (300, 'Butter Chicken', 'NON-VEG', 6.50, 3);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (301, 'Paneer Tikka', 'VEG', 5.00, 3);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (302, 'Dal Makhani', 'VEG', 4.50, 3);

INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (400, 'Classic Beef Burger', 'NON-VEG', 6.00, 4);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (401, 'Veggie Burger', 'VEG', 5.50, 4);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (402, 'Fries (Large)', 'VEG', 2.50, 4);

INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (500, 'Caesar Salad', 'VEG', 4.25, 5);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (501, 'Grilled Chicken Salad', 'NON-VEG', 5.75, 5);

INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (600, 'Al Pastor Taco', 'NON-VEG', 2.75, 6);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (601, 'Carnitas Taco', 'NON-VEG', 2.50, 6);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (602, 'Veggie Taco', 'VEG', 2.00, 6);

INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (700, 'Lamb Rogan Josh', 'NON-VEG', 7.00, 7);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (701, 'Chana Masala', 'VEG', 4.00, 7);

INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (800, 'Chicken Hakka Noodles', 'NON-VEG', 5.50, 8);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (801, 'Veg Stir Fry Noodles', 'VEG', 4.50, 8);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (802, 'Spring Rolls', 'VEG', 3.25, 8);

INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (900, 'BBQ Chicken Pizza', 'NON-VEG', 9.00, 9);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (901, 'Truffle Mushroom Pizza', 'VEG', 10.50, 9);

INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (1000, 'Grilled Salmon', 'NON-VEG', 11.00, 10);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (1001, 'Ratatouille', 'VEG', 7.50, 10);

INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (1100, 'Masala Dosa', 'VEG', 3.25, 11);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (1101, 'Set Dosa', 'VEG', 3.75, 11);

INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (1200, 'Smoked Ribs', 'NON-VEG', 12.00, 12);
INSERT INTO menu_items (id, name, type, price, restaurant_id) VALUES (1201, 'Grilled Corn', 'VEG', 2.75, 12);

