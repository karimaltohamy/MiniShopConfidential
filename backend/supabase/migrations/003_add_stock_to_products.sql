-- Add stock column to products table
ALTER TABLE products
ADD COLUMN stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0);

-- Update RLS policies to include stock for admins (optional - policies already cover full access)
-- No policy changes needed as admins already have full access to products
