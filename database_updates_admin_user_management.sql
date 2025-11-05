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

-- Ensure admins can view all data across all countries
-- Add admin bypass to RLS policies on key tables

-- Institutions table
DROP POLICY IF EXISTS "Admins can view all institutions" ON institutions;
CREATE POLICY "Admins can view all institutions" ON institutions
  FOR SELECT
  TO authenticated
  USING (
    country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Population table
DROP POLICY IF EXISTS "Admins can view all population data" ON population;
CREATE POLICY "Admins can view all population data" ON population
  FOR SELECT
  TO authenticated
  USING (
    country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Enrollment tables
DROP POLICY IF EXISTS "Admins can view all early childhood enrollment" ON early_childhood_enrollment;
CREATE POLICY "Admins can view all early childhood enrollment" ON early_childhood_enrollment
  FOR SELECT
  TO authenticated
  USING (
    country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can view all primary enrollment" ON primary_enrollment;
CREATE POLICY "Admins can view all primary enrollment" ON primary_enrollment
  FOR SELECT
  TO authenticated
  USING (
    country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can view all secondary enrollment" ON secondary_enrollment;
CREATE POLICY "Admins can view all secondary enrollment" ON secondary_enrollment
  FOR SELECT
  TO authenticated
  USING (
    country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Staff qualification tables
DROP POLICY IF EXISTS "Admins can view all staff qualifications" ON staff_qualifications;
CREATE POLICY "Admins can view all staff qualifications" ON staff_qualifications
  FOR SELECT
  TO authenticated
  USING (
    country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Staff demographics tables
DROP POLICY IF EXISTS "Admins can view all staff demographics" ON staff_demographics;
CREATE POLICY "Admins can view all staff demographics" ON staff_demographics
  FOR SELECT
  TO authenticated
  USING (
    country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Note: Admins should have read-only access to data for oversight
-- Write permissions should remain restricted to country statisticians only
-- This ensures data integrity while allowing EDMU admins to monitor all submissions

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
