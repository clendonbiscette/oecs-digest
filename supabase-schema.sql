-- OECS Education Data Collection System - Supabase Schema
-- This schema integrates with Supabase Auth
-- Run this in your Supabase SQL Editor

-- =====================================================
-- PART 1: CORE REFERENCE TABLES
-- =====================================================

-- Countries/Member States
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(3) UNIQUE NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    region VARCHAR(50) DEFAULT 'OECS',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Academic Years
CREATE TABLE IF NOT EXISTS academic_years (
    id SERIAL PRIMARY KEY,
    year_label VARCHAR(20) UNIQUE NOT NULL,
    start_year INTEGER NOT NULL,
    end_year INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PART 2: USER PROFILES (extends Supabase Auth)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    country_id INTEGER REFERENCES countries(id),
    role VARCHAR(50) NOT NULL CHECK (role IN ('statistician', 'admin', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PART 3: DATA SUBMISSION TRACKING
-- =====================================================

CREATE TABLE IF NOT EXISTS data_submissions (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) NOT NULL,
    submitted_by UUID REFERENCES auth.users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_submission UNIQUE(country_id, academic_year_id)
);

-- =====================================================
-- PART 4: INSTITUTIONS DATA
-- =====================================================

CREATE TABLE IF NOT EXISTS institutions (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) NOT NULL,

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

    -- Post-Secondary
    post_secondary_public INTEGER DEFAULT 0 CHECK (post_secondary_public >= 0),
    post_secondary_private INTEGER DEFAULT 0 CHECK (post_secondary_private >= 0),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_institutions UNIQUE(country_id, academic_year_id)
);

-- =====================================================
-- PART 5: STUDENT ENROLLMENT - EARLY CHILDHOOD
-- =====================================================

CREATE TABLE IF NOT EXISTS early_childhood_enrollment (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) NOT NULL,
    institution_type VARCHAR(50) NOT NULL CHECK (institution_type IN ('Public', 'Private/Gov Assisted')),
    age_group VARCHAR(20) NOT NULL,
    male INTEGER DEFAULT 0 CHECK (male >= 0),
    female INTEGER DEFAULT 0 CHECK (female >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_ec_enrollment UNIQUE(country_id, academic_year_id, institution_type, age_group)
);

-- =====================================================
-- PART 6: STUDENT ENROLLMENT - SPECIAL EDUCATION
-- =====================================================

CREATE TABLE IF NOT EXISTS special_education_enrollment (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) NOT NULL,
    institution_type VARCHAR(50) NOT NULL CHECK (institution_type IN ('Public', 'Private/Gov Assisted')),
    age_group VARCHAR(20) NOT NULL,
    male INTEGER DEFAULT 0 CHECK (male >= 0),
    female INTEGER DEFAULT 0 CHECK (female >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_spec_ed_enrollment UNIQUE(country_id, academic_year_id, institution_type, age_group)
);

-- =====================================================
-- PART 7: STUDENT ENROLLMENT - PRIMARY
-- =====================================================

CREATE TABLE IF NOT EXISTS primary_enrollment (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) NOT NULL,
    school_type VARCHAR(20) NOT NULL CHECK (school_type IN ('Public', 'Private')),
    age_group VARCHAR(20) NOT NULL,

    -- Kindergarten
    k_male INTEGER DEFAULT 0 CHECK (k_male >= 0),
    k_female INTEGER DEFAULT 0 CHECK (k_female >= 0),

    -- Grade 1-6
    g1_male INTEGER DEFAULT 0 CHECK (g1_male >= 0),
    g1_female INTEGER DEFAULT 0 CHECK (g1_female >= 0),
    g2_male INTEGER DEFAULT 0 CHECK (g2_male >= 0),
    g2_female INTEGER DEFAULT 0 CHECK (g2_female >= 0),
    g3_male INTEGER DEFAULT 0 CHECK (g3_male >= 0),
    g3_female INTEGER DEFAULT 0 CHECK (g3_female >= 0),
    g4_male INTEGER DEFAULT 0 CHECK (g4_male >= 0),
    g4_female INTEGER DEFAULT 0 CHECK (g4_female >= 0),
    g5_male INTEGER DEFAULT 0 CHECK (g5_male >= 0),
    g5_female INTEGER DEFAULT 0 CHECK (g5_female >= 0),
    g6_male INTEGER DEFAULT 0 CHECK (g6_male >= 0),
    g6_female INTEGER DEFAULT 0 CHECK (g6_female >= 0),

    -- Subtotals
    subtotal_male INTEGER DEFAULT 0 CHECK (subtotal_male >= 0),
    subtotal_female INTEGER DEFAULT 0 CHECK (subtotal_female >= 0),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_primary_enrollment UNIQUE(country_id, academic_year_id, school_type, age_group)
);

-- =====================================================
-- PART 8: STUDENT ENROLLMENT - SECONDARY
-- =====================================================

CREATE TABLE IF NOT EXISTS secondary_enrollment (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) NOT NULL,
    school_type VARCHAR(20) NOT NULL CHECK (school_type IN ('Public', 'Private')),
    age_group VARCHAR(20) NOT NULL,

    -- Form 1-6
    f1_male INTEGER DEFAULT 0 CHECK (f1_male >= 0),
    f1_female INTEGER DEFAULT 0 CHECK (f1_female >= 0),
    f2_male INTEGER DEFAULT 0 CHECK (f2_male >= 0),
    f2_female INTEGER DEFAULT 0 CHECK (f2_female >= 0),
    f3_male INTEGER DEFAULT 0 CHECK (f3_male >= 0),
    f3_female INTEGER DEFAULT 0 CHECK (f3_female >= 0),
    f4_male INTEGER DEFAULT 0 CHECK (f4_male >= 0),
    f4_female INTEGER DEFAULT 0 CHECK (f4_female >= 0),
    f5_male INTEGER DEFAULT 0 CHECK (f5_male >= 0),
    f5_female INTEGER DEFAULT 0 CHECK (f5_female >= 0),
    f6_male INTEGER DEFAULT 0 CHECK (f6_male >= 0),
    f6_female INTEGER DEFAULT 0 CHECK (f6_female >= 0),

    -- Subtotals
    subtotal_male INTEGER DEFAULT 0 CHECK (subtotal_male >= 0),
    subtotal_female INTEGER DEFAULT 0 CHECK (subtotal_female >= 0),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_secondary_enrollment UNIQUE(country_id, academic_year_id, school_type, age_group)
);

-- =====================================================
-- PART 9: SEED DATA
-- =====================================================

-- Insert OECS Member States
INSERT INTO countries (country_code, country_name, region) VALUES
    ('AIA', 'Anguilla', 'OECS'),
    ('ATG', 'Antigua and Barbuda', 'OECS'),
    ('DMA', 'Dominica', 'OECS'),
    ('GRD', 'Grenada', 'OECS'),
    ('MSR', 'Montserrat', 'OECS'),
    ('KNA', 'Saint Kitts and Nevis', 'OECS'),
    ('LCA', 'Saint Lucia', 'OECS'),
    ('VCT', 'Saint Vincent and the Grenadines', 'OECS'),
    ('VGB', 'British Virgin Islands', 'OECS')
ON CONFLICT (country_code) DO NOTHING;

-- Insert Academic Years
INSERT INTO academic_years (year_label, start_year, end_year, is_active) VALUES
    ('2022-2023', 2022, 2023, false),
    ('2023-2024', 2023, 2024, false),
    ('2024-2025', 2024, 2025, true),
    ('2025-2026', 2025, 2026, false)
ON CONFLICT (year_label) DO NOTHING;

-- =====================================================
-- PART 10: ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE early_childhood_enrollment ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_education_enrollment ENABLE ROW LEVEL SECURITY;
ALTER TABLE primary_enrollment ENABLE ROW LEVEL SECURITY;
ALTER TABLE secondary_enrollment ENABLE ROW LEVEL SECURITY;

-- Countries: Everyone can read
CREATE POLICY "Countries are viewable by everyone" ON countries
    FOR SELECT USING (true);

-- Academic Years: Everyone can read
CREATE POLICY "Academic years are viewable by everyone" ON academic_years
    FOR SELECT USING (true);

-- User Profiles: Users can view their own profile
-- Note: Removed admin policy to prevent infinite recursion
-- Admins should use service role key for viewing all profiles
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Data Submissions: Statisticians can view/edit their country, admins can view all
CREATE POLICY "Statisticians can view own country submissions" ON data_submissions
    FOR SELECT USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all submissions" ON data_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Statisticians can insert own country submissions" ON data_submissions
    FOR INSERT WITH CHECK (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can update own country submissions" ON data_submissions
    FOR UPDATE USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- Institutions: Statisticians can view/edit their country, admins can view all
CREATE POLICY "Statisticians can view own country institutions" ON institutions
    FOR SELECT USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'viewer')
        )
    );

CREATE POLICY "Statisticians can manage own country institutions" ON institutions
    FOR ALL USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- Apply similar policies to enrollment tables
CREATE POLICY "Statisticians can view own country EC enrollment" ON early_childhood_enrollment
    FOR SELECT USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'viewer')
        )
    );

CREATE POLICY "Statisticians can manage own country EC enrollment" ON early_childhood_enrollment
    FOR ALL USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can view own country primary enrollment" ON primary_enrollment
    FOR SELECT USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'viewer')
        )
    );

CREATE POLICY "Statisticians can manage own country primary enrollment" ON primary_enrollment
    FOR ALL USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can view own country secondary enrollment" ON secondary_enrollment
    FOR SELECT USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'viewer')
        )
    );

CREATE POLICY "Statisticians can manage own country secondary enrollment" ON secondary_enrollment
    FOR ALL USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can view own country special ed enrollment" ON special_education_enrollment
    FOR SELECT USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'viewer')
        )
    );

CREATE POLICY "Statisticians can manage own country special ed enrollment" ON special_education_enrollment
    FOR ALL USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- =====================================================
-- PART 11: FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_academic_years_updated_at BEFORE UPDATE ON academic_years
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_submissions_updated_at BEFORE UPDATE ON data_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_institutions_updated_at BEFORE UPDATE ON institutions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_early_childhood_enrollment_updated_at BEFORE UPDATE ON early_childhood_enrollment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_special_education_enrollment_updated_at BEFORE UPDATE ON special_education_enrollment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_primary_enrollment_updated_at BEFORE UPDATE ON primary_enrollment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_secondary_enrollment_updated_at BEFORE UPDATE ON secondary_enrollment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_institutions_country_year ON institutions(country_id, academic_year_id);
CREATE INDEX idx_ec_enrollment_country_year ON early_childhood_enrollment(country_id, academic_year_id);
CREATE INDEX idx_primary_enrollment_country_year ON primary_enrollment(country_id, academic_year_id);
CREATE INDEX idx_secondary_enrollment_country_year ON secondary_enrollment(country_id, academic_year_id);
CREATE INDEX idx_spec_ed_enrollment_country_year ON special_education_enrollment(country_id, academic_year_id);
CREATE INDEX idx_data_submissions_country_year ON data_submissions(country_id, academic_year_id);
CREATE INDEX idx_data_submissions_status ON data_submissions(status);
CREATE INDEX idx_user_profiles_country ON user_profiles(country_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
