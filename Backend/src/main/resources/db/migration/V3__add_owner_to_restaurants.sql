-- Add owner_id to restaurants for restaurant-owner features
ALTER TABLE restaurants ADD COLUMN owner_id BIGINT NULL;
ALTER TABLE restaurants ADD CONSTRAINT fk_restaurant_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL;

-- index for owner lookups
CREATE INDEX IF NOT EXISTS idx_restaurant_owner ON restaurants(owner_id);

