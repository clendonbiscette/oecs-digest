-- =====================================================
-- OECS Education Statistical Digest
-- Student Enrollment Tables
-- =====================================================
-- This schema captures comprehensive student enrollment data
-- across all education levels for OECS member states
--
-- Data Sources: Student Enrollment Worksheet (Excel Template)
-- Tables: D1-D5 (Current Year), D6-D8 (Historical Year)
-- =====================================================

-- =====================================================
-- TABLE: student_enrollment
-- Purpose: Universal enrollment table for all education levels
-- Cross-tabulation: Age × Grade/Form/Programme × Gender × Institution Type
-- =====================================================

CREATE TABLE IF NOT EXISTS student_enrollment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,

    -- Education Level
    education_level VARCHAR(50) NOT NULL CHECK (education_level IN (
        'early_childhood',      -- D1: < 5 years
        'special_education',    -- D2: 5-20+ years
        'primary',              -- D3: K-G6
        'secondary',            -- D4: Forms 1-5
        'post_secondary'        -- D5: TVET, CAPE, Tertiary
    )),

    -- Institution Type (NULL for post_secondary as it's national level)
    ownership_type VARCHAR(30) CHECK (ownership_type IN ('public', 'private', NULL)),

    -- Age Category (varies by education level)
    age_group VARCHAR(20) NOT NULL CHECK (age_group IN (
        -- Early Childhood (7 groups)
        'under_1', '1', '2', '3', '4', 'over_4',
        -- Special Education (6 groups)
        '5_8', '9_11', '12_14', '15_17', '18_20', 'over_20',
        -- Primary (14 groups)
        'under_5', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', 'over_15',
        -- Secondary (11 groups)
        'under_11', '11', '12', '13', '14', '15', '16', '17', '18', 'over_18',
        -- Post-secondary (13 groups)
        'under_16', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', 'over_25',
        -- Universal
        'unknown'
    )),

    -- Grade/Form/Programme Category (NULL for early childhood and special education)
    category VARCHAR(50) CHECK (category IN (
        -- Primary Grades
        'K', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6',
        -- Secondary Forms
        'F1', 'F2', 'F3', 'F4', 'F5',
        -- Post-secondary Programmes
        'TVET', 'CAPE', 'Hospitality', 'Other', 'Tertiary',
        NULL
    )),

    -- Gender
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),

    -- Enrollment Count
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),

    -- Audit Trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure unique combination per country/year
    CONSTRAINT unique_enrollment UNIQUE (
        country_id,
        academic_year_id,
        education_level,
        COALESCE(ownership_type, 'national'),
        age_group,
        COALESCE(category, 'none'),
        gender
    )
);

-- Add indexes for performance
CREATE INDEX idx_enrollment_country_year ON student_enrollment(country_id, academic_year_id);
CREATE INDEX idx_enrollment_level ON student_enrollment(education_level);
CREATE INDEX idx_enrollment_ownership ON student_enrollment(ownership_type);
CREATE INDEX idx_enrollment_age_group ON student_enrollment(age_group);
CREATE INDEX idx_enrollment_category ON student_enrollment(category);

-- Enable Row Level Security
ALTER TABLE student_enrollment ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see data for their country
CREATE POLICY enrollment_country_access ON student_enrollment
    FOR ALL
    USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- Add trigger for updated_at
CREATE TRIGGER update_enrollment_updated_at
    BEFORE UPDATE ON student_enrollment
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE student_enrollment IS 'Universal student enrollment table covering all education levels with age×grade/form/programme cross-tabulation';

COMMENT ON COLUMN student_enrollment.education_level IS 'Education level: early_childhood, special_education, primary, secondary, post_secondary';
COMMENT ON COLUMN student_enrollment.ownership_type IS 'Institution type: public, private, or NULL for national-level post-secondary';
COMMENT ON COLUMN student_enrollment.age_group IS 'Age category varying by education level - see CHECK constraint for valid values';
COMMENT ON COLUMN student_enrollment.category IS 'Grade (K-G6), Form (F1-F5), or Programme (TVET, CAPE, etc.) - NULL for early childhood/special ed';
COMMENT ON COLUMN student_enrollment.gender IS 'Student gender: male or female';
COMMENT ON COLUMN student_enrollment.count IS 'Number of enrolled students in this category';

-- =====================================================
-- DATA ENTRY SUMMARY
-- =====================================================
-- Total data entry cells across all tables:
--
-- D1. Early Childhood:     28 cells (7 ages × 2 genders × 2 ownership types)
-- D2. Special Education:   24 cells (6 ages × 2 genders × 2 ownership types)
-- D3. Primary Schools:    392 cells (14 ages × 7 grades × 2 genders × 2 ownership types)
-- D4. Secondary Schools:  220 cells (11 ages × 5 forms × 2 genders × 2 ownership types)
-- D5. Post-Secondary:     130 cells (13 ages × 5 programmes × 2 genders × 1 national level)
--
-- TOTAL CURRENT YEAR:     794 data entry cells
--
-- Historical tables (D6-D8) follow same structure for previous academic year
-- =====================================================

-- =====================================================
-- SETUP VERIFICATION
-- =====================================================
-- To verify this table is set up correctly, run:
-- SELECT * FROM student_enrollment LIMIT 10;
--
-- To check enrollment by education level:
-- SELECT education_level, SUM(count) as total_students
-- FROM student_enrollment
-- GROUP BY education_level;
