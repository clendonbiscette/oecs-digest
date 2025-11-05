-- Admin User Management Policies
-- This allows admins to create, read, update, and manage all user profiles

-- First, ensure the existing policies are set correctly
-- Drop existing admin policies if they exist
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;

-- Recreate admin policies with proper permissions

-- Allow admins to view all user profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR auth.uid() = id  -- Users can also view their own profile
  );

-- Allow admins to update any user profile
CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR auth.uid() = id  -- Users can also update their own profile
  );

-- Allow admins to insert new user profiles (for manual user creation)
CREATE POLICY "Admins can insert profiles" ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Note: The trigger from supabase-auto-profile-creation.sql will automatically
-- create profiles when users sign up via auth. This policy is for manual admin creation.

-- Note: Additional admin policies for data tables will be added as tables are created
-- Admins will have read-only access to all country data for oversight
-- Write permissions remain restricted to country statisticians for data integrity

-- Grant admins read access to countries table
GRANT SELECT ON countries TO authenticated;
GRANT SELECT ON academic_years TO authenticated;

-- Create a helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the helper function
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
