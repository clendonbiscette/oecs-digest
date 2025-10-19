-- Complete RLS fix for user signup
-- Run this in your Supabase SQL Editor

-- First, let's see all existing policies
-- SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

-- Drop ALL existing policies on user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Statisticians can view own country submissions" ON user_profiles;
DROP POLICY IF EXISTS "Statisticians can insert own country submissions" ON user_profiles;
DROP POLICY IF EXISTS "Statisticians can update own country submissions" ON user_profiles;

-- IMPORTANT: Allow authenticated users to INSERT their own profile
-- This uses auth.uid() which is the ID from Supabase Auth
CREATE POLICY "Enable insert for authenticated users" ON user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Allow users to SELECT (read) their own profile
CREATE POLICY "Enable read access for own profile" ON user_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Allow users to UPDATE their own profile
CREATE POLICY "Enable update for own profile" ON user_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Allow admins to SELECT all profiles
CREATE POLICY "Enable read access for admins" ON user_profiles
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Allow admins to UPDATE all profiles
CREATE POLICY "Enable update for admins" ON user_profiles
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Verify RLS is enabled (should return true)
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'user_profiles';

-- Check the policies were created
SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename = 'user_profiles';
