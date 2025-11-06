-- Core Tables Setup for OECS Education Database
-- Run this FIRST before importing historical data

-- =====================================================
-- PART 1: COUNTRIES TABLE (if not exists)
-- =====================================================

CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(3) UNIQUE NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    region VARCHAR(50) DEFAULT 'OECS',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert OECS countries if they don't exist
INSERT INTO countries (country_code, country_name, region)
VALUES
    ('ANG', 'Anguilla', 'OECS'),
    ('ATG', 'Antigua and Barbuda', 'OECS'),
    ('DMA', 'Dominica', 'OECS'),
    ('GRD', 'Grenada', 'OECS'),
    ('MSR', 'Montserrat', 'OECS'),
    ('KNA', 'St. Kitts and Nevis', 'OECS'),
    ('LCA', 'St. Lucia', 'OECS'),
    ('VCT', 'St. Vincent and the Grenadines', 'OECS'),
    ('VGB', 'British Virgin Islands', 'OECS')
ON CONFLICT (country_code) DO NOTHING;

-- Enable RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- Everyone can view countries
DROP POLICY IF EXISTS "Anyone can view countries" ON countries;
CREATE POLICY "Anyone can view countries" ON countries
    FOR SELECT TO authenticated USING (true);

GRANT SELECT ON countries TO authenticated;

-- =====================================================
-- PART 2: ACADEMIC YEARS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS academic_years (
    id SERIAL PRIMARY KEY,
    year_label VARCHAR(20) UNIQUE NOT NULL,
    start_year INTEGER NOT NULL,
    end_year INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert academic years
INSERT INTO academic_years (year_label, start_year, end_year, is_active)
VALUES
    ('2020-2021', 2020, 2021, false),
    ('2021-2022', 2021, 2022, false),
    ('2022-2023', 2022, 2023, false),
    ('2023-2024', 2023, 2024, true),
    ('2024-2025', 2024, 2025, false)
ON CONFLICT (year_label) DO NOTHING;

-- Enable RLS
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;

-- Everyone can view academic years
DROP POLICY IF EXISTS "Anyone can view academic years" ON academic_years;
CREATE POLICY "Anyone can view academic years" ON academic_years
    FOR SELECT TO authenticated USING (true);

GRANT SELECT ON academic_years TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE academic_years_id_seq TO authenticated;

-- =====================================================
-- PART 3: INSTITUTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS institutions (
    id SERIAL PRIMARY KEY,
    country_id INTEGER NOT NULL REFERENCES countries(id),
    academic_year_id INTEGER NOT NULL REFERENCES academic_years(id),

    -- Daycare
    daycare_public INTEGER DEFAULT 0 CHECK (daycare_public >= 0),
    daycare_private_church INTEGER DEFAULT 0 CHECK (daycare_private_church >= 0),
    daycare_private_non_affiliated INTEGER DEFAULT 0 CHECK (daycare_private_non_affiliated >= 0),

    -- Preschool
    preschool_public INTEGER DEFAULT 0 CHECK (preschool_public >= 0),
    preschool_private_church INTEGER DEFAULT 0 CHECK (preschool_private_church >= 0),
    preschool_private_non_affiliated INTEGER DEFAULT 0 CHECK (preschool_private_non_affiliated >= 0),

    -- Primary
    primary_public INTEGER DEFAULT 0 CHECK (primary_public >= 0),
    primary_private_church INTEGER DEFAULT 0 CHECK (primary_private_church >= 0),
    primary_private_non_affiliated INTEGER DEFAULT 0 CHECK (primary_private_non_affiliated >= 0),

    -- Secondary
    secondary_public INTEGER DEFAULT 0 CHECK (secondary_public >= 0),
    secondary_private_church INTEGER DEFAULT 0 CHECK (secondary_private_church >= 0),
    secondary_private_non_affiliated INTEGER DEFAULT 0 CHECK (secondary_private_non_affiliated >= 0),

    -- Special Education
    special_ed_public INTEGER DEFAULT 0 CHECK (special_ed_public >= 0),
    special_ed_private_church INTEGER DEFAULT 0 CHECK (special_ed_private_church >= 0),
    special_ed_private_non_affiliated INTEGER DEFAULT 0 CHECK (special_ed_private_non_affiliated >= 0),

    -- TVET
    tvet_public INTEGER DEFAULT 0 CHECK (tvet_public >= 0),
    tvet_private_church INTEGER DEFAULT 0 CHECK (tvet_private_church >= 0),
    tvet_private_non_affiliated INTEGER DEFAULT 0 CHECK (tvet_private_non_affiliated >= 0),

    -- Post Secondary
    post_secondary_public INTEGER DEFAULT 0 CHECK (post_secondary_public >= 0),
    post_secondary_private INTEGER DEFAULT 0 CHECK (post_secondary_private >= 0),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_country_year UNIQUE(country_id, academic_year_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_institutions_country ON institutions(country_id);
CREATE INDEX IF NOT EXISTS idx_institutions_year ON institutions(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_institutions_country_year ON institutions(country_id, academic_year_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_institutions_updated_at ON institutions;
CREATE TRIGGER update_institutions_updated_at
    BEFORE UPDATE ON institutions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for institutions
DROP POLICY IF EXISTS "Users can view their country institutions" ON institutions;
CREATE POLICY "Users can view their country institutions" ON institutions
    FOR SELECT
    TO authenticated
    USING (
        country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid())
        OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    );

DROP POLICY IF EXISTS "Users can insert their country institutions" ON institutions;
CREATE POLICY "Users can insert their country institutions" ON institutions
    FOR INSERT
    TO authenticated
    WITH CHECK (
        country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can update their country institutions" ON institutions;
CREATE POLICY "Users can update their country institutions" ON institutions
    FOR UPDATE
    TO authenticated
    USING (
        country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can delete their country institutions" ON institutions;
CREATE POLICY "Users can delete their country institutions" ON institutions
    FOR DELETE
    TO authenticated
    USING (
        country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid())
    );

-- Grant permissions
GRANT ALL ON institutions TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE institutions_id_seq TO authenticated;

-- =====================================================
-- VERIFICATION
-- =====================================================

SELECT 'Countries:' as table_name, COUNT(*) as count FROM countries
UNION ALL
SELECT 'Academic Years:', COUNT(*) FROM academic_years
UNION ALL
SELECT 'Institutions:', COUNT(*) FROM institutions;

SELECT 'Setup complete! You can now run import_chapter1_historical.sql' as status;
