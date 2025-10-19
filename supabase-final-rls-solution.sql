-- FINAL SOLUTION: Automatic profile creation with proper RLS
-- Run this in Supabase SQL Editor

-- Step 1: Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER -- This allows the function to bypass RLS
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    country_id,
    role,
    is_active
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'country_id')::integer, NULL),
    COALESCE(NEW.raw_user_meta_data->>'role', 'statistician'),
    true
  );
  RETURN NEW;
END;
$$;

-- Step 2: Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop all old policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for admins" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for admins" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

-- Step 5: Create clean, simple policies
-- Allow users to read their own profile
CREATE POLICY "select_own_profile" ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile (but not role or country_id)
CREATE POLICY "update_own_profile" ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow admins to read all profiles
CREATE POLICY "select_all_profiles_admin" ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to update all profiles
CREATE POLICY "update_all_profiles_admin" ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Note: No INSERT policy needed - the trigger handles all inserts!

-- Verification queries
SELECT 'Trigger created:' as status;
SELECT tgname, tgenabled FROM pg_trigger WHERE tgname = 'on_auth_user_created';

SELECT 'RLS enabled:' as status;
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'user_profiles';

SELECT 'Policies created:' as status;
SELECT schemaname, tablename, policyname, cmd FROM pg_policies WHERE tablename = 'user_profiles';
