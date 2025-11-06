-- =====================================================
-- TEST: Simulate the exact query from getFinancialTrendData
-- =====================================================

-- This is what the app is trying to fetch
SELECT
    fd.id,
    fd.country_id,
    fd.academic_year_id,
    fd.national_budget_total,
    fd.national_budget_recurrent,
    fd.national_budget_capital,
    fd.gdp,
    fd.education_budget_total,
    fd.education_budget_recurrent,
    fd.education_budget_capital,
    fd.education_pct_national_budget,
    fd.education_pct_gdp,
    fd.allocation_early_childhood,
    fd.allocation_primary,
    fd.allocation_secondary,
    fd.allocation_special_ed,
    fd.allocation_post_secondary,
    fd.allocation_tertiary,
    fd.allocation_other
FROM financial_data fd;

-- If this returns 0 rows, RLS is blocking access
-- If this returns 12 rows, RLS is working correctly
