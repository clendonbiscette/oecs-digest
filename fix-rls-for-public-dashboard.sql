-- =====================================================
-- FIX: Allow Public Access to Dashboard Data
-- =====================================================
-- The dashboard is a public-facing tool that should show
-- aggregated education statistics to everyone, not just
-- logged-in users.
--
-- Current Problem:
-- RLS policies block anonymous users from viewing institutions
-- and enrollment data.
--
-- Solution:
-- Add policies that allow public read access to data tables
-- while still protecting write operations.
-- =====================================================

-- Drop existing restrictive SELECT policies
DROP POLICY IF EXISTS "Statisticians can view own country institutions" ON institutions;
DROP POLICY IF EXISTS "Statisticians can view own country EC enrollment" ON early_childhood_enrollment;
DROP POLICY IF EXISTS "Statisticians can view own country primary enrollment" ON primary_enrollment;
DROP POLICY IF EXISTS "Statisticians can view own country secondary enrollment" ON secondary_enrollment;
DROP POLICY IF EXISTS "Statisticians can view own country special ed enrollment" ON special_education_enrollment;

-- Create new public read policies for institutions
CREATE POLICY "Public can view all institutions" ON institutions
    FOR SELECT USING (true);

-- Keep write restrictions - only statisticians can modify their country's data
CREATE POLICY "Statisticians can manage own country institutions" ON institutions
    FOR INSERT WITH CHECK (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can update own country institutions" ON institutions
    FOR UPDATE USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can delete own country institutions" ON institutions
    FOR DELETE USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- Create public read policies for enrollment tables
CREATE POLICY "Public can view all early childhood enrollment" ON early_childhood_enrollment
    FOR SELECT USING (true);

CREATE POLICY "Public can view all primary enrollment" ON primary_enrollment
    FOR SELECT USING (true);

CREATE POLICY "Public can view all secondary enrollment" ON secondary_enrollment
    FOR SELECT USING (true);

CREATE POLICY "Public can view all special ed enrollment" ON special_education_enrollment
    FOR SELECT USING (true);

-- Keep write restrictions for enrollment tables
CREATE POLICY "Statisticians can manage own country EC enrollment" ON early_childhood_enrollment
    FOR INSERT WITH CHECK (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can update own country EC enrollment" ON early_childhood_enrollment
    FOR UPDATE USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can manage own country primary enrollment" ON primary_enrollment
    FOR INSERT WITH CHECK (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can update own country primary enrollment" ON primary_enrollment
    FOR UPDATE USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can manage own country secondary enrollment" ON secondary_enrollment
    FOR INSERT WITH CHECK (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can update own country secondary enrollment" ON secondary_enrollment
    FOR UPDATE USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can manage own country special ed enrollment" ON special_education_enrollment
    FOR INSERT WITH CHECK (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can update own country special ed enrollment" ON special_education_enrollment
    FOR UPDATE USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- =====================================================
-- SUMMARY
-- =====================================================
-- ✓ Public users can READ all education data (for dashboard)
-- ✓ Only authenticated statisticians can WRITE data for their country
-- ✓ Admins still have full access via service role key
-- =====================================================
