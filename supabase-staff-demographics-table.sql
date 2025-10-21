-- =====================================================
-- OECS Education Statistical Digest
-- Staff Demographics: Age & Years of Service Tables
-- =====================================================
-- This schema captures comprehensive workforce demographics
-- for educational leaders and teachers across all OECS member states
--
-- Data Sources: Age & Years of Service Worksheet (Excel Template)
-- Tables: C1 (Principals & Deputy Principals), C2 (Teachers)
-- =====================================================

-- =====================================================
-- TABLE: staff_age_distribution
-- Purpose: Track age demographics for principals, deputy principals, and teachers
-- Disaggregation: Gender, School Type, Institution Type (Public/Private)
-- =====================================================

CREATE TABLE IF NOT EXISTS staff_age_distribution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,

    -- Personnel Category
    role VARCHAR(50) NOT NULL CHECK (role IN ('principal_deputy', 'teacher')),

    -- School Classification
    education_level VARCHAR(50) NOT NULL CHECK (education_level IN (
        'pre_primary',
        'primary',
        'secondary',
        'post_secondary'
    )),

    -- Institution Type
    ownership_type VARCHAR(20) NOT NULL CHECK (ownership_type IN ('public', 'private')),

    -- Age Category
    age_range VARCHAR(20) NOT NULL CHECK (age_range IN (
        'under_19',
        '20_29',
        '30_39',
        '40_49',
        '50_59',
        '60_plus',
        'unknown'
    )),

    -- Gender Disaggregation
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),

    -- Data Value
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),

    -- Audit Trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure unique combination per country/year
    CONSTRAINT unique_age_distribution UNIQUE (
        country_id,
        academic_year_id,
        role,
        education_level,
        ownership_type,
        age_range,
        gender
    )
);

-- Add indexes for performance
CREATE INDEX idx_staff_age_country_year ON staff_age_distribution(country_id, academic_year_id);
CREATE INDEX idx_staff_age_role ON staff_age_distribution(role);
CREATE INDEX idx_staff_age_education_level ON staff_age_distribution(education_level);

-- Enable Row Level Security
ALTER TABLE staff_age_distribution ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see data for their country
CREATE POLICY staff_age_country_access ON staff_age_distribution
    FOR ALL
    USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- Add trigger for updated_at
CREATE TRIGGER update_staff_age_updated_at
    BEFORE UPDATE ON staff_age_distribution
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: staff_years_of_service
-- Purpose: Track years of service demographics for educational personnel
-- Disaggregation: Gender, School Type, Institution Type (Public/Private)
-- =====================================================

CREATE TABLE IF NOT EXISTS staff_years_of_service (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,

    -- Personnel Category
    role VARCHAR(50) NOT NULL CHECK (role IN ('principal_deputy', 'teacher')),

    -- School Classification
    education_level VARCHAR(50) NOT NULL CHECK (education_level IN (
        'pre_primary',
        'primary',
        'secondary',
        'post_secondary'
    )),

    -- Institution Type
    ownership_type VARCHAR(20) NOT NULL CHECK (ownership_type IN ('public', 'private')),

    -- Years of Service Category
    service_range VARCHAR(20) NOT NULL CHECK (service_range IN (
        'under_1',
        '1_5',
        '6_10',
        '11_15',
        '16_20',
        '21_25',
        '26_30',
        '31_35',
        'over_35',
        'unknown'
    )),

    -- Gender Disaggregation
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),

    -- Data Value
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),

    -- Audit Trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure unique combination per country/year
    CONSTRAINT unique_service_distribution UNIQUE (
        country_id,
        academic_year_id,
        role,
        education_level,
        ownership_type,
        service_range,
        gender
    )
);

-- Add indexes for performance
CREATE INDEX idx_staff_service_country_year ON staff_years_of_service(country_id, academic_year_id);
CREATE INDEX idx_staff_service_role ON staff_years_of_service(role);
CREATE INDEX idx_staff_service_education_level ON staff_years_of_service(education_level);

-- Enable Row Level Security
ALTER TABLE staff_years_of_service ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see data for their country
CREATE POLICY staff_service_country_access ON staff_years_of_service
    FOR ALL
    USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- Add trigger for updated_at
CREATE TRIGGER update_staff_service_updated_at
    BEFORE UPDATE ON staff_years_of_service
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE staff_age_distribution IS 'Tracks age demographics for educational leaders and teachers across all school types';
COMMENT ON TABLE staff_years_of_service IS 'Tracks years of service demographics for educational leaders and teachers';

COMMENT ON COLUMN staff_age_distribution.role IS 'Personnel category: principal_deputy for C1 table, teacher for C2 table';
COMMENT ON COLUMN staff_age_distribution.age_range IS 'Age band: under_19, 20_29, 30_39, 40_49, 50_59, 60_plus, unknown';

COMMENT ON COLUMN staff_years_of_service.role IS 'Personnel category: principal_deputy for C1 table, teacher for C2 table';
COMMENT ON COLUMN staff_years_of_service.service_range IS 'Years of service: under_1, 1_5, 6_10, 11_15, 16_20, 21_25, 26_30, 31_35, over_35, unknown';

-- =====================================================
-- SETUP VERIFICATION
-- =====================================================
-- To verify these tables are set up correctly, run:
-- SELECT * FROM staff_age_distribution LIMIT 1;
-- SELECT * FROM staff_years_of_service LIMIT 1;
