-- Migration: Add 'shipped' and 'delivered' status values to orders table
-- This extends the existing 4 statuses to 5 for better order tracking
-- Previous statuses: pending, processing, completed, cancelled
-- New statuses: pending, processing, shipped, delivered, cancelled

BEGIN;

-- Drop existing constraint
ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add new constraint with 5 status values
-- Note: 'completed' is replaced by 'delivered' for clarity
-- 'shipped' is added as intermediate status between processing and delivered
ALTER TABLE orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'));

-- Optional: Migrate existing 'completed' orders to 'delivered'
-- Uncomment the line below if you want to update existing data
-- UPDATE orders SET status = 'delivered' WHERE status = 'completed';

COMMIT;
