# Supabase Setup Guide

## Initial Setup

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose organization, set project name
   - Generate a strong database password
   - Select a region close to you
   - Wait for project to be provisioned (2-3 minutes)

2. **Run the migration**
   - Go to SQL Editor in your Supabase dashboard
   - Click "New Query"
   - Copy the entire content of `migrations/001_initial_schema.sql`
   - Paste and click "Run"
   - Verify all tables were created in the Table Editor

3. **Run the seed data**
   - In SQL Editor, create another new query
   - Copy the entire content of `seed.sql`
   - Paste and click "Run"
   - Go to Table Editor and verify:
     - 3 categories were created
     - 10 products were created

4. **Create Storage Bucket for Product Images**
   - Go to Storage in Supabase dashboard
   - Click "New bucket"
   - Name it `product-images`
   - Set it to **Public** (so product images are accessible)
   - Click "Create bucket"

5. **Create Test Accounts**

   **Customer Account:**
   - Go to Authentication > Users
   - Click "Add User" (or "Invite User")
   - Email: `customer@test.com`
   - Password: `Test1234!`
   - Click "Send Invitation" or "Create User"
   - The profile will be auto-created with `role='customer'`

   **Admin Account:**
   - Go to Authentication > Users
   - Click "Add User"
   - Email: `admin@test.com`
   - Password: `Admin1234!`
   - Click "Create User"
   - Go to SQL Editor and run:
     ```sql
     UPDATE profiles SET role = 'admin'
     WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@test.com');
     ```

6. **Get Your Supabase Credentials**
   - Go to Project Settings > API
   - Copy these values for your `.env` files:
     - Project URL (SUPABASE_URL)
     - `anon` `public` key (SUPABASE_ANON_KEY)
     - `service_role` `secret` key (SUPABASE_SERVICE_ROLE_KEY) - **Keep this secret!**

7. **Enable Realtime (Optional - for bonus feature)**
   - Go to Database > Replication
   - Find the `orders` table
   - Toggle on "Realtime"
   - Click "Save"

## Verification

Check that everything is set up correctly:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Should see: profiles, categories, products, orders, order_items

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- All tables should have rowsecurity = true

-- Check data
SELECT COUNT(*) FROM categories; -- Should be 3
SELECT COUNT(*) FROM products;   -- Should be 10
SELECT COUNT(*) FROM profiles;   -- Should be 2 (admin + customer)
```

## Troubleshooting

**Issue: RLS blocks all queries**
- Make sure you're using the correct auth token
- Check that policies are created correctly
- Use `service_role` key for backend admin operations

**Issue: Products not visible**
- Check `is_active = true` on products
- Verify RLS policy allows public SELECT on active products

**Issue: Can't create profile on signup**
- Check that the trigger `on_auth_user_created` exists
- Verify the function `handle_new_user()` is created

**Issue: Images not uploading**
- Verify `product-images` bucket exists and is set to Public
- Check bucket permissions in Storage > Policies
