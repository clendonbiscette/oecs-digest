-- Chapter 2: Create Missing Tables for Staff Age and Service Demographics
-- FIXED VERSION - Execute this in Supabase SQL Editor

-- 1. Create staff_age_distribution table
CREATE TABLE IF NOT EXISTS staff_age_distribution (
    id SERIAL PRIMARY KEY,
    country_id INTEGER NOT NULL REFERENCES countries(id),
    academic_year_id INTEGER NOT NULL REFERENCES academic_years(id),
    role VARCHAR(50) NOT NULL CHECK (role IN ('principal_deputy', 'teacher')),
    education_level VARCHAR(50) NOT NULL CHECK (education_level IN ('pre_primary', 'primary', 'secondary', 'post_secondary')),
    ownership_type VARCHAR(20) NOT NULL CHECK (ownership_type IN ('public', 'private')),
    age_range VARCHAR(20) NOT NULL CHECK (age_range IN ('under_19', '20_29', '30_39', '40_49', '50_59', '60_plus', 'unknown')),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(country_id, academic_year_id, role, education_level, ownership_type, age_range, gender)
);

CREATE INDEX IF NOT EXISTS idx_staff_age_country_year ON staff_age_distribution(country_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_staff_age_role ON staff_age_distribution(role);

ALTER TABLE staff_age_distribution ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view staff age data" ON staff_age_distribution;
CREATE POLICY "Users can view staff age data" ON staff_age_distribution
    FOR SELECT TO authenticated USING (true);

GRANT SELECT ON staff_age_distribution TO authenticated;


-- 2. Create staff_years_of_service table
CREATE TABLE IF NOT EXISTS staff_years_of_service (
    id SERIAL PRIMARY KEY,
    country_id INTEGER NOT NULL REFERENCES countries(id),
    academic_year_id INTEGER NOT NULL REFERENCES academic_years(id),
    role VARCHAR(50) NOT NULL CHECK (role IN ('principal_deputy', 'teacher')),
    education_level VARCHAR(50) NOT NULL CHECK (education_level IN ('pre_primary', 'primary', 'secondary', 'post_secondary')),
    ownership_type VARCHAR(20) NOT NULL CHECK (ownership_type IN ('public', 'private')),
    service_range VARCHAR(20) NOT NULL CHECK (service_range IN ('under_1', '1_5', '6_10', '11_15', '16_20', '21_25', '26_30', '31_35', 'over_35', 'unknown')),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(country_id, academic_year_id, role, education_level, ownership_type, service_range, gender)
);

CREATE INDEX IF NOT EXISTS idx_staff_service_country_year ON staff_years_of_service(country_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_staff_service_role ON staff_years_of_service(role);

ALTER TABLE staff_years_of_service ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view staff service data" ON staff_years_of_service;
CREATE POLICY "Users can view staff service data" ON staff_years_of_service
    FOR SELECT TO authenticated USING (true);

GRANT SELECT ON staff_years_of_service TO authenticated;
