-- Insert Categories
INSERT INTO categories (name, slug) VALUES
('Electronics', 'electronics'),
('Clothing', 'clothing'),
('Home & Garden', 'home-garden');

-- Insert Products
INSERT INTO products (name, description, price, image_url, category_id, is_active) VALUES
(
  'Wireless Headphones',
  'Premium noise-cancelling wireless headphones with 30-hour battery life',
  149.99,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
  (SELECT id FROM categories WHERE slug = 'electronics'),
  true
),
(
  'Smartphone Stand',
  'Adjustable aluminum stand for all smartphones and tablets',
  24.99,
  'https://images.unsplash.com/photo-1591290619762-d31d68c56bf8?w=800',
  (SELECT id FROM categories WHERE slug = 'electronics'),
  true
),
(
  'Laptop Sleeve',
  '13-inch protective laptop sleeve with water-resistant material',
  34.99,
  'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800',
  (SELECT id FROM categories WHERE slug = 'electronics'),
  true
),
(
  'Cotton T-Shirt',
  'Classic crew neck t-shirt made from 100% organic cotton',
  19.99,
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
  (SELECT id FROM categories WHERE slug = 'clothing'),
  true
),
(
  'Denim Jeans',
  'Slim fit denim jeans with stretch fabric for comfort',
  59.99,
  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
  (SELECT id FROM categories WHERE slug = 'clothing'),
  true
),
(
  'Winter Jacket',
  'Waterproof insulated jacket perfect for cold weather',
  129.99,
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
  (SELECT id FROM categories WHERE slug = 'clothing'),
  true
),
(
  'Sneakers',
  'Comfortable running sneakers with breathable mesh',
  79.99,
  'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800',
  (SELECT id FROM categories WHERE slug = 'clothing'),
  true
),
(
  'Plant Pot Set',
  'Set of 3 ceramic plant pots with drainage holes',
  39.99,
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800',
  (SELECT id FROM categories WHERE slug = 'home-garden'),
  true
),
(
  'Garden Tools Kit',
  'Complete 5-piece gardening tool set with carrying case',
  44.99,
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
  (SELECT id FROM categories WHERE slug = 'home-garden'),
  true
),
(
  'LED Desk Lamp',
  'Adjustable LED lamp with 3 brightness levels and USB charging port',
  49.99,
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
  (SELECT id FROM categories WHERE slug = 'home-garden'),
  true
);

-- Note: To create test accounts, run these commands in Supabase Dashboard SQL Editor after schema creation:
--
-- For customer account (customer@test.com / password: Test1234!):
-- 1. Go to Authentication > Users > Add User
-- 2. Email: customer@test.com
-- 3. Password: Test1234!
-- 4. The profile will be auto-created via trigger with role='customer'
--
-- For admin account (admin@test.com / password: Admin1234!):
-- 1. Go to Authentication > Users > Add User
-- 2. Email: admin@test.com
-- 3. Password: Admin1234!
-- 4. After creation, update the profile role manually:
--    UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@test.com');
