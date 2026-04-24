const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: __dirname + '/.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigration() {
  const sql = `
    -- Add email column to profiles if not exists
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'email'
      ) THEN
        ALTER TABLE profiles ADD COLUMN email TEXT;
      END IF;
    END
    $$;

    -- Backfill email from auth.users
    UPDATE profiles p
    SET email = u.email
    FROM auth.users u
    WHERE p.id = u.id AND p.email IS NULL;

    -- Set NOT NULL constraint
    ALTER TABLE profiles ALTER COLUMN email SET NOT NULL;

    -- Update trigger function to include email
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, name, email, role)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.email,
        'customer'
      );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Recreate trigger
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  `;

  const { error } = await supabase.rpc('pg_execute_sql', { sql });

  if (error) {
    // Try direct query if RPC not available
    const { error: directError } = await supabase.from('profiles').select('count');
    console.log('Migration may need to be run manually:', error.message);
    console.log('Please run the SQL in the Supabase Dashboard SQL Editor.');
    process.exit(1);
  }

  console.log('Migration applied successfully');
  process.exit(0);
}

applyMigration();
