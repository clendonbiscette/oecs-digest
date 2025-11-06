-- =====================================================
-- FIX: Allow Public Access to Financial Data
-- =====================================================
-- The financial_data table RLS policy currently blocks
-- public dashboard access. This fix aligns it with other
-- tables (institutions, enrollment) that allow public READ
-- =====================================================

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view financial data" ON financial_data;

-- Create new policy that allows public SELECT access
CREATE POLICY "Public can view all financial data" ON financial_data
    FOR SELECT USING (true);

-- Keep write restrictions for authenticated statisticians
CREATE POLICY "Statisticians can insert own country financial data" ON financial_data
    FOR INSERT WITH CHECK (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can update own country financial data" ON financial_data
    FOR UPDATE USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can delete own country financial data" ON financial_data
    FOR DELETE USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- Ensure proper grants are in place
GRANT SELECT ON financial_data TO anon;
GRANT SELECT ON financial_data TO authenticated;
GRANT INSERT, UPDATE, DELETE ON financial_data TO authenticated;

-- =====================================================
-- SUMMARY
-- =====================================================
-- ✓ Public (anon) users can READ financial data (for dashboard)
-- ✓ Authenticated statisticians can WRITE data for their country only
-- ✓ Fixes "No Financial Data Available" issue in dashboard
-- =====================================================
