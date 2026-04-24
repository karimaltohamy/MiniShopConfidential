-- Migration: Enable Supabase Realtime for orders table
-- This allows mobile clients to subscribe to order changes in real-time

BEGIN;

-- Enable Realtime replication for orders table
-- This publishes INSERT, UPDATE, DELETE events to subscribed clients
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Create index for improved realtime query performance
-- This index helps when filtering orders by user_id with recent updates first
CREATE INDEX IF NOT EXISTS idx_orders_user_id_updated_at
  ON orders(user_id, updated_at DESC);

-- Note: RLS policies are already configured to filter events by user_id
-- Existing policy: "Users can view own orders" USING (auth.uid() = user_id)
-- This ensures clients only receive realtime events for their own orders

COMMIT;

-- Verification steps (run in SQL editor):
-- 1. Check if realtime is enabled:
--    SELECT schemaname, tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
-- 2. Verify index creation:
--    SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'orders';
