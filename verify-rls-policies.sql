-- =====================================================
-- VERIFY: Check RLS Policies for financial_data
-- =====================================================

-- Show all policies on financial_data table
SELECT
    policyname,
    permissive,
    roles,
    cmd,
    qual::text as using_expression,
    with_check::text as with_check_expression
FROM pg_policies
WHERE tablename = 'financial_data'
ORDER BY policyname;

-- Expected result should show:
-- "Public can view all financial data" with cmd = 'SELECT' and using_expression = 'true'
