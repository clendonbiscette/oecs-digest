-- Staff Qualifications Data Tables
-- Run this in Supabase SQL Editor

-- Main staff qualifications table
CREATE TABLE IF NOT EXISTS staff_qualifications (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) NOT NULL,
    education_level VARCHAR(50) NOT NULL, -- 'pre_primary', 'primary', 'secondary', 'post_secondary'
    ownership_type VARCHAR(50) NOT NULL, -- 'public', 'private'
    role VARCHAR(50) NOT NULL, -- 'principal', 'deputy_principal', 'teacher', 'care_giver'
    qualification_category VARCHAR(50) NOT NULL, -- 'graduate_trained', 'graduate_untrained', 'non_graduate_trained', 'non_graduate_untrained'
    gender VARCHAR(10) NOT NULL, -- 'male', 'female'
    count INTEGER DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_staff_qualification UNIQUE(
        country_id, academic_year_id, education_level,
        ownership_type, role, qualification_category, gender
    )
);

-- Professional development participation
CREATE TABLE IF NOT EXISTS professional_development (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) NOT NULL,
    education_level VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    participants_count INTEGER DEFAULT 0 CHECK (participants_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_prof_dev UNIQUE(country_id, academic_year_id, education_level, role)
);

-- Enable RLS
ALTER TABLE staff_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_development ENABLE ROW LEVEL SECURITY;

-- RLS Policies for staff_qualifications
CREATE POLICY "select_own_country_staff_qual" ON staff_qualifications
  FOR SELECT
  TO authenticated
  USING (
    country_id IN (
      SELECT country_id FROM user_profiles WHERE id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'viewer')
    )
  );

CREATE POLICY "manage_own_country_staff_qual" ON staff_qualifications
  FOR ALL
  TO authenticated
  USING (
    country_id IN (
      SELECT country_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- RLS Policies for professional_development
CREATE POLICY "select_own_country_prof_dev" ON professional_development
  FOR SELECT
  TO authenticated
  USING (
    country_id IN (
      SELECT country_id FROM user_profiles WHERE id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'viewer')
    )
  );

CREATE POLICY "manage_own_country_prof_dev" ON professional_development
  FOR ALL
  TO authenticated
  USING (
    country_id IN (
      SELECT country_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_staff_qualifications_updated_at
  BEFORE UPDATE ON staff_qualifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_development_updated_at
  BEFORE UPDATE ON professional_development
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_staff_qual_country_year ON staff_qualifications(country_id, academic_year_id);
CREATE INDEX idx_prof_dev_country_year ON professional_development(country_id, academic_year_id);

-- Verify
SELECT 'Staff qualifications tables created successfully' as status;
