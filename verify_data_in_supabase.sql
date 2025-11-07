-- =============================================================================
-- SUPABASE DATA VERIFICATION SCRIPT
-- Run these queries in Supabase SQL Editor to verify historical data
-- Expected: Data from 2020-2021, 2021-2022, 2022-2023 across 6 chapters
-- =============================================================================

-- STEP 1: Check Academic Years Setup
-- Expected: 6 years (2020-2021, 2021-2022, 2022-2023, 2023-2024, 2024-2025, 2025-2026)
SELECT
  'ACADEMIC YEARS' as check_name,
  year_label,
  id as year_id,
  is_active,
  start_year
FROM academic_years
ORDER BY start_year;

-- STEP 2: Check Countries Setup
-- Expected: 9 OECS countries
SELECT
  'COUNTRIES' as check_name,
  country_code,
  country_name,
  id as country_id
FROM countries
ORDER BY country_name;

-- =============================================================================
-- CHAPTER 1: INSTITUTIONS
-- Expected: 27 records total (9 countries × 3 years)
-- =============================================================================

-- Count by year
SELECT
  'CHAPTER 1: Institutions by Year' as check_name,
  ay.year_label,
  COUNT(*) as record_count,
  COUNT(DISTINCT i.country_id) as countries_with_data
FROM institutions i
JOIN academic_years ay ON i.academic_year_id = ay.id
WHERE ay.year_label IN ('2020-2021', '2021-2022', '2022-2023')
GROUP BY ay.year_label
ORDER BY ay.year_label;

when

-- =============================================================================
-- CHAPTER 2: TEACHERS & LEADERS
-- Expected: 803 records total (38 CPD + 765 qualifications)
-- =============================================================================

-- Professional Development (CPD)
SELECT
  'CHAPTER 2: Professional Development by Year' as check_name,
  ay.year_label,
  COUNT(*) as record_count,
  COUNT(DISTINCT pd.country_id) as countries_with_data
FROM professional_development pd
JOIN academic_years ay ON pd.academic_year_id = ay.id
WHERE ay.year_label IN ('2020-2021', '2021-2022', '2022-2023')
GROUP BY ay.year_label
ORDER BY ay.year_label;

-- Teacher Academic Qualifications
SELECT
  'CHAPTER 2: Teacher Qualifications by Year' as check_name,
  ay.year_label,
  COUNT(*) as record_count,
  COUNT(DISTINCT taq.country_id) as countries_with_data
FROM teacher_academic_qualifications taq
JOIN academic_years ay ON taq.academic_year_id = ay.id
WHERE ay.year_label IN ('2020-2021', '2021-2022', '2022-2023')
GROUP BY ay.year_label
ORDER BY ay.year_label;

-- Sample CPD data
SELECT
  'CHAPTER 2: Sample CPD Records' as check_name,
  ay.year_label,
  c.country_code,
  pd.education_level,
  pd.role,
  pd.count
FROM professional_development pd
JOIN academic_years ay ON pd.academic_year_id = ay.id
JOIN countries c ON pd.country_id = c.id
WHERE ay.year_label IN ('2020-2021', '2021-2022', '2022-2023')
ORDER BY ay.year_label, c.country_code
LIMIT 10;

-- =============================================================================
-- CHAPTER 3: ENROLLMENT
-- Expected: 289 records total (35 early childhood + 14 special ed + 240 primary)
-- =============================================================================

-- Early Childhood Enrollment
SELECT
  'CHAPTER 3: Early Childhood by Year' as check_name,
  ay.year_label,
  COUNT(*) as record_count,
  COUNT(DISTINCT ec.country_id) as countries_with_data,
  SUM(ec.male + ec.female) as total_students
FROM early_childhood_enrollment ec
JOIN academic_years ay ON ec.academic_year_id = ay.id
WHERE ay.year_label IN ('2020-2021', '2021-2022', '2022-2023')
GROUP BY ay.year_label
ORDER BY ay.year_label;

-- Special Education Enrollment
SELECT
  'CHAPTER 3: Special Education by Year' as check_name,
  ay.year_label,
  COUNT(*) as record_count,
  COUNT(DISTINCT se.country_id) as countries_with_data,
  SUM(se.male + se.female) as total_students
FROM special_education_enrollment se
JOIN academic_years ay ON se.academic_year_id = ay.id
WHERE ay.year_label IN ('2020-2021', '2021-2022', '2022-2023')
GROUP BY ay.year_label
ORDER BY ay.year_label;

-- Primary Enrollment
SELECT
  'CHAPTER 3: Primary Enrollment by Year' as check_name,
  ay.year_label,
  COUNT(*) as record_count,
  COUNT(DISTINCT pe.country_id) as countries_with_data,
  SUM(pe.subtotal_male + pe.subtotal_female) as total_students
FROM primary_enrollment pe
JOIN academic_years ay ON pe.academic_year_id = ay.id
WHERE ay.year_label IN ('2020-2021', '2021-2022', '2022-2023')
GROUP BY ay.year_label
ORDER BY ay.year_label;

-- Sample enrollment data
SELECT
  'CHAPTER 3: Sample Primary Enrollment' as check_name,
  ay.year_label,
  c.country_code,
  pe.school_type,
  pe.age_group,
  pe.k_male + pe.k_female as k_total,
  pe.g1_male + pe.g1_female as g1_total,
  pe.subtotal_male + pe.subtotal_female as total_students
FROM primary_enrollment pe
JOIN academic_years ay ON pe.academic_year_id = ay.id
JOIN countries c ON pe.country_id = c.id
WHERE ay.year_label IN ('2020-2021', '2021-2022', '2022-2023')
ORDER BY ay.year_label, c.country_code
LIMIT 15;

-- =============================================================================
-- CHAPTER 4: INTERNAL EFFICIENCY (DROPOUTS)
-- Expected: 96 records
-- =============================================================================

SELECT
  'CHAPTER 4: Dropouts by Year' as check_name,
  ay.year_label,
  COUNT(*) as record_count,
  COUNT(DISTINCT d.country_id) as countries_with_data,
  SUM(d.male + d.female) as total_dropouts
FROM dropouts d
JOIN academic_years ay ON d.academic_year_id = ay.id
WHERE ay.year_label IN ('2020-2021', '2021-2022', '2022-2023')
GROUP BY ay.year_label
ORDER BY ay.year_label;

-- Sample dropout data
SELECT
  'CHAPTER 4: Sample Dropout Records' as check_name,
  ay.year_label,
  c.country_code,
  d.education_level,
  d.grade_level,
  d.male,
  d.female,
  (d.male + d.female) as total
FROM dropouts d
JOIN academic_years ay ON d.academic_year_id = ay.id
JOIN countries c ON d.country_id = c.id
WHERE ay.year_label IN ('2020-2021', '2021-2022', '2022-2023')
ORDER BY ay.year_label, c.country_code
LIMIT 10;

-- =============================================================================
-- CHAPTER 5: SYSTEMS OUTPUT (PERFORMANCE)
-- Expected: 150 records (96 grade level + 54 CSEC)
-- =============================================================================

-- Grade Level Performance
SELECT
  'CHAPTER 5: Grade Level Performance by Year' as check_name,
  ay.year_label,
  COUNT(*) as record_count,
  COUNT(DISTINCT glp.country_id) as countries_with_data
FROM performance_grade_level glp
JOIN academic_years ay ON glp.academic_year_id = ay.id
WHERE ay.year_label IN ('2020-2021', '2021-2022', '2022-2023')
GROUP BY ay.year_label
ORDER BY ay.year_label;

-- CSEC Five Plus Performance
SELECT
  'CHAPTER 5: CSEC Five Plus by Year' as check_name,
  ay.year_label,
  COUNT(*) as record_count,
  COUNT(DISTINCT cfp.country_id) as countries_with_data
FROM performance_csec_five_plus cfp
JOIN academic_years ay ON cfp.academic_year_id = ay.id
WHERE ay.year_label IN ('2020-2021', '2021-2022', '2022-2023')
GROUP BY ay.year_label
ORDER BY ay.year_label;

-- Sample performance data
SELECT
  'CHAPTER 5: Sample Grade Performance' as check_name,
  ay.year_label,
  c.country_code,
  glp.grade_level,
  glp.subject,
  glp.at_or_above_grade_level,
  glp.total_assessed
FROM performance_grade_level glp
JOIN academic_years ay ON glp.academic_year_id = ay.id
JOIN countries c ON glp.country_id = c.id
WHERE ay.year_label IN ('2020-2021', '2021-2022', '2022-2023')
ORDER BY ay.year_label, c.country_code
LIMIT 10;

-- =============================================================================
-- CHAPTER 6: FINANCIAL DATA
-- Expected: 20 records
-- =============================================================================

SELECT
  'CHAPTER 6: Financial Data by Year' as check_name,
  ay.year_label,
  COUNT(*) as record_count,
  COUNT(DISTINCT fd.country_id) as countries_with_data
FROM financial_data fd
JOIN academic_years ay ON fd.academic_year_id = ay.id
WHERE ay.year_label IN ('2020-2021', '2021-2022', '2022-2023')
GROUP BY ay.year_label
ORDER BY ay.year_label;

-- Sample financial data
SELECT
  'CHAPTER 6: Sample Financial Records' as check_name,
  ay.year_label,
  c.country_code,
  fd.national_budget_total,
  fd.education_budget,
  fd.gdp,
  fd.education_pct_national_budget
FROM financial_data fd
JOIN academic_years ay ON fd.academic_year_id = ay.id
JOIN countries c ON fd.country_id = c.id
WHERE ay.year_label IN ('2020-2021', '2021-2022', '2022-2023')
ORDER BY ay.year_label, c.country_code;

-- =============================================================================
-- OVERALL SUMMARY
-- =============================================================================

SELECT
  'TOTAL RECORDS SUMMARY' as summary,
  (SELECT COUNT(*) FROM institutions WHERE academic_year_id IN (
    SELECT id FROM academic_years WHERE year_label IN ('2020-2021', '2021-2022', '2022-2023')
  )) as institutions,
  (SELECT COUNT(*) FROM professional_development WHERE academic_year_id IN (
    SELECT id FROM academic_years WHERE year_label IN ('2020-2021', '2021-2022', '2022-2023')
  )) as professional_dev,
  (SELECT COUNT(*) FROM teacher_academic_qualifications WHERE academic_year_id IN (
    SELECT id FROM academic_years WHERE year_label IN ('2020-2021', '2021-2022', '2022-2023')
  )) as teacher_quals,
  (SELECT COUNT(*) FROM early_childhood_enrollment WHERE academic_year_id IN (
    SELECT id FROM academic_years WHERE year_label IN ('2020-2021', '2021-2022', '2022-2023')
  )) as early_childhood,
  (SELECT COUNT(*) FROM special_education_enrollment WHERE academic_year_id IN (
    SELECT id FROM academic_years WHERE year_label IN ('2020-2021', '2021-2022', '2022-2023')
  )) as special_ed,
  (SELECT COUNT(*) FROM primary_enrollment WHERE academic_year_id IN (
    SELECT id FROM academic_years WHERE year_label IN ('2020-2021', '2021-2022', '2022-2023')
  )) as primary,
  (SELECT COUNT(*) FROM dropouts WHERE academic_year_id IN (
    SELECT id FROM academic_years WHERE year_label IN ('2020-2021', '2021-2022', '2022-2023')
  )) as dropouts,
  (SELECT COUNT(*) FROM performance_grade_level WHERE academic_year_id IN (
    SELECT id FROM academic_years WHERE year_label IN ('2020-2021', '2021-2022', '2022-2023')
  )) as grade_performance,
  (SELECT COUNT(*) FROM performance_csec_five_plus WHERE academic_year_id IN (
    SELECT id FROM academic_years WHERE year_label IN ('2020-2021', '2021-2022', '2022-2023')
  )) as csec_performance,
  (SELECT COUNT(*) FROM financial_data WHERE academic_year_id IN (
    SELECT id FROM academic_years WHERE year_label IN ('2020-2021', '2021-2022', '2022-2023')
  )) as financial;

-- =============================================================================
-- EXPECTED RESULTS SUMMARY
-- =============================================================================
-- Chapter 1 (Institutions): 27 records (9 countries × 3 years)
-- Chapter 2 (Professional Dev): 38 records
-- Chapter 2 (Teacher Quals): 765 records
-- Chapter 3 (Early Childhood): 35 records
-- Chapter 3 (Special Education): 14 records
-- Chapter 3 (Primary): 240 records
-- Chapter 4 (Dropouts): 96 records
-- Chapter 5 (Grade Performance): 96 records
-- Chapter 5 (CSEC Five Plus): 54 records
-- Chapter 6 (Financial): 20 records
-- =============================================================================
-- TOTAL EXPECTED: 1,385 records
-- =============================================================================
