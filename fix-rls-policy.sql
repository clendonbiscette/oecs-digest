-- =====================================================
-- FIX: Infinite Recursion in user_profiles RLS Policy
-- =====================================================
-- The "Admins can view all profiles" policy was causing
-- infinite recursion by querying user_profiles within
-- a user_profiles policy.
--
-- Solution: Use a simpler policy that doesn't cause recursion
-- =====================================================

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

-- Recreate it without recursion
-- Users can view their own profile OR if they are an admin
CREATE POLICY "Users can view own profile or all if admin" ON user_profiles
    FOR SELECT USING (
        auth.uid() = id
        OR
        (
            -- Check if current user is admin by looking at their profile
            -- This uses a subquery but references the profile via auth.uid() directly
            (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
        )
    );

-- Note: This still has potential for recursion. Better approach:
-- Drop the complex policy and use a simple one

DROP POLICY IF EXISTS "Users can view own profile or all if admin" ON user_profiles;

-- Simplest solution: Users can only see their own profile
-- Admins should use service role key for admin operations
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- For UPDATE policy
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- For INSERT policy (during signup)
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Note: Run this SQL in your Supabase SQL Editor to fix the RLS policy
