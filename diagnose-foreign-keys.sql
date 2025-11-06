-- =====================================================
-- DIAGNOSE: Check Foreign Key Relationships
-- =====================================================

-- 1. Check financial_data records and their foreign keys
SELECT
    fd.id,
    fd.country_id,
    fd.academic_year_id,
    c.country_code,
    c.country_name,
    ay.year_label,
    fd.education_budget_total
FROM financial_data fd
LEFT JOIN countries c ON fd.country_id = c.id
LEFT JOIN academic_years ay ON fd.academic_year_id = ay.id
ORDER BY fd.id;

-- 2. Find orphaned records (financial_data with invalid foreign keys)
SELECT
    fd.id,
    fd.country_id,
    fd.academic_year_id,
    CASE WHEN c.id IS NULL THEN 'Missing Country' ELSE 'Country OK' END as country_status,
    CASE WHEN ay.id IS NULL THEN 'Missing Year' ELSE 'Year OK' END as year_status
FROM financial_data fd
LEFT JOIN countries c ON fd.country_id = c.id
LEFT JOIN academic_years ay ON fd.academic_year_id = ay.id
WHERE c.id IS NULL OR ay.id IS NULL;

-- 3. Show all academic years
SELECT id, year_label, start_year, end_year, is_active
FROM academic_years
ORDER BY start_year;

-- 4. Show all countries
SELECT id, country_code, country_name
FROM countries
ORDER BY country_code;

-- Expected: All 12 financial_data records should have matching country_id and academic_year_id
-- If query #2 returns any rows, those are orphaned records causing the issue
