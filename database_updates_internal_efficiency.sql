-- Database Schema Updates for Internal Efficiency Form
-- Run these on your Supabase database

-- 1. Create dropouts table (same structure as repeaters)
CREATE TABLE IF NOT EXISTS dropouts (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) NOT NULL,
    education_level VARCHAR(50) NOT NULL,
    grade_or_form VARCHAR(10) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_dropouts UNIQUE(country_id, academic_year_id, education_level, grade_or_form, gender)
);

-- 2. Create school_management table if it doesn't exist
CREATE TABLE IF NOT EXISTS school_management (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) NOT NULL,
    education_level VARCHAR(50) NOT NULL,
    schools_managed_by_boards INTEGER DEFAULT 0 CHECK (schools_managed_by_boards >= 0),
    schools_with_pta INTEGER DEFAULT 0 CHECK (schools_with_pta >= 0),
    schools_with_guidance_counselors INTEGER DEFAULT 0 CHECK (schools_with_guidance_counselors >= 0),
    schools_with_development_plans INTEGER DEFAULT 0 CHECK (schools_with_development_plans >= 0),
    schools_with_disaster_plans INTEGER DEFAULT 0 CHECK (schools_with_disaster_plans >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_school_mgmt UNIQUE(country_id, academic_year_id, education_level)
);

-- 3. Add RLS policies for dropouts table
ALTER TABLE dropouts ENABLE ROW LEVEL SECURITY;

-- Policy for country admins to see their own country's data
CREATE POLICY "Country admins can view their country dropouts"
    ON dropouts FOR SELECT
    USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- Policy for country admins to insert/update their country's data
CREATE POLICY "Country admins can insert their country dropouts"
    ON dropouts FOR INSERT
    WITH CHECK (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Country admins can update their country dropouts"
    ON dropouts FOR UPDATE
    USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Country admins can delete their country dropouts"
    ON dropouts FOR DELETE
    USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- 4. Add RLS policies for school_management table
ALTER TABLE school_management ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Country admins can view their country school_management"
    ON school_management FOR SELECT
    USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Country admins can insert their country school_management"
    ON school_management FOR INSERT
    WITH CHECK (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Country admins can update their country school_management"
    ON school_management FOR UPDATE
    USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Country admins can delete their country school_management"
    ON school_management FOR DELETE
    USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dropouts_country_year ON dropouts(country_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_dropouts_education_level ON dropouts(education_level);
CREATE INDEX IF NOT EXISTS idx_school_mgmt_country_year ON school_management(country_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_school_mgmt_education_level ON school_management(education_level);

-- 6. Add updated_at trigger for dropouts and school_management
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_dropouts_updated_at BEFORE UPDATE ON dropouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_school_mgmt_updated_at BEFORE UPDATE ON school_management
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON dropouts TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE dropouts_id_seq TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON school_management TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE school_management_id_seq TO authenticated;

-- Verification queries
-- Run these to verify the changes:
-- SELECT * FROM information_schema.tables WHERE table_name IN ('dropouts', 'school_management');
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'school_management';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'dropouts';
