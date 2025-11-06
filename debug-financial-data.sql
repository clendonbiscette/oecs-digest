-- =====================================================
-- DEBUG: Check Financial Data Status
-- =====================================================

-- 1. Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'financial_data'
) AS table_exists;

-- 2. Check if RLS is enabled
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'financial_data';

-- 3. Check existing RLS policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'financial_data'
ORDER BY policyname;

-- 4. Count records in financial_data table
SELECT COUNT(*) as total_records FROM financial_data;

-- 5. Check sample data (if any exists)
SELECT
    fd.id,
    c.country_code,
    c.country_name,
    ay.year_label,
    fd.national_budget_total,
    fd.education_budget_total,
    fd.gdp
FROM financial_data fd
LEFT JOIN countries c ON fd.country_id = c.id
LEFT JOIN academic_years ay ON fd.academic_year_id = ay.id
LIMIT 5;

-- 6. Check if academic_years table has the required years
SELECT id, year_label, start_year, end_year, is_active
FROM academic_years
WHERE year_label IN ('2021-2022', '2022-2023')
ORDER BY start_year;

-- 7. Check countries table
SELECT id, country_code, country_name
FROM countries
ORDER BY country_code;

-- 8. Test the exact query used by getFinancialTrendData
SELECT
    fd.*,
    c.country_code,
    c.country_name,
    ay.year_label
FROM financial_data fd
JOIN countries c ON fd.country_id = c.id
JOIN academic_years ay ON fd.academic_year_id = ay.id
ORDER BY ay.year_label, c.country_name;

-- 9. Check grants
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'financial_data';
