-- Staff Qualifications Data Tables
-- Run this in Supabase SQL Editor

-- Main staff qualifications table (Tables B1-B4)
CREATE TABLE IF NOT EXISTS staff_qualifications (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) NOT NULL,
    education_level VARCHAR(50) NOT NULL, -- 'pre_primary', 'primary', 'secondary', 'post_secondary'
    ownership_type VARCHAR(50) NOT NULL, -- 'public', 'private'
    role VARCHAR(50) NOT NULL, -- 'principal', 'deputy_principal', 'teacher', 'administrator', 'care_giver'
    qualification_category VARCHAR(50) NOT NULL, -- 'graduate_trained', 'graduate_untrained', 'non_graduate_trained', 'non_graduate_untrained', 'graduate', 'non_graduate', 'unknown'
    gender VARCHAR(10) NOT NULL, -- 'male', 'female'
    count INTEGER DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_staff_qualification UNIQUE(
        country_id, academic_year_id, education_level,
        ownership_type, role, qualification_category, gender
    )
);

-- Leadership degree holders (B2 row 42, B3 row 65)
CREATE TABLE IF NOT EXISTS leadership_degree_holders (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) NOT NULL,
    education_level VARCHAR(50) NOT NULL, -- 'primary', 'secondary'
    role VARCHAR(50) NOT NULL, -- 'principal', 'deputy_principal'
    gender VARCHAR(10) NOT NULL, -- 'male', 'female'
    count INTEGER DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_leadership_degree UNIQUE(country_id, academic_year_id, education_level, role, gender)
);

-- Teachers' highest academic qualifications (Table B5)
CREATE TABLE IF NOT EXISTS teacher_academic_qualifications (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) NOT NULL,
    education_level VARCHAR(50) NOT NULL, -- 'pre_primary', 'primary', 'secondary', 'post_secondary'
    qualification VARCHAR(50) NOT NULL, -- 'csec', 'cape', 'certificate', 'associate', 'bachelors', 'postgraduate', 'masters', 'other', 'unknown'
    gender VARCHAR(10) NOT NULL, -- 'male', 'female'
    count INTEGER DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_teacher_academic_qual UNIQUE(country_id, academic_year_id, education_level, qualification, gender)
);

-- Specialist teachers (Table B6)
CREATE TABLE IF NOT EXISTS specialist_teachers (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) NOT NULL,
    specialization VARCHAR(50) NOT NULL, -- 'agriculture', 'french', 'home_economics', 'it', 'music', 'pe_sports', 'plumbing', 'reading', 'spanish', 'special_education', 'theatre_arts', 'hfle', 'other_1', 'other_2'
    gender VARCHAR(10) NOT NULL, -- 'male', 'female'
    count INTEGER DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_specialist_teacher UNIQUE(country_id, academic_year_id, specialization, gender)
);

-- Professional development participation (Table B7)
CREATE TABLE IF NOT EXISTS professional_development (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) NOT NULL,
    education_level VARCHAR(50) NOT NULL, -- 'primary', 'secondary'
    role VARCHAR(50) NOT NULL, -- 'principal', 'teacher'
    participants_count INTEGER DEFAULT 0 CHECK (participants_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_prof_dev UNIQUE(country_id, academic_year_id, education_level, role)
);

-- Enable RLS
ALTER TABLE staff_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership_degree_holders ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_academic_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialist_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_development ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to allow re-running this script)
DROP POLICY IF EXISTS "select_own_country_staff_qual" ON staff_qualifications;
DROP POLICY IF EXISTS "manage_own_country_staff_qual" ON staff_qualifications;
DROP POLICY IF EXISTS "select_own_country_leadership" ON leadership_degree_holders;
DROP POLICY IF EXISTS "manage_own_country_leadership" ON leadership_degree_holders;
DROP POLICY IF EXISTS "select_own_country_teacher_qual" ON teacher_academic_qualifications;
DROP POLICY IF EXISTS "manage_own_country_teacher_qual" ON teacher_academic_qualifications;
DROP POLICY IF EXISTS "select_own_country_specialist" ON specialist_teachers;
DROP POLICY IF EXISTS "manage_own_country_specialist" ON specialist_teachers;
DROP POLICY IF EXISTS "select_own_country_prof_dev" ON professional_development;
DROP POLICY IF EXISTS "manage_own_country_prof_dev" ON professional_development;

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

-- RLS Policies for leadership_degree_holders
CREATE POLICY "select_own_country_leadership" ON leadership_degree_holders
  FOR SELECT TO authenticated
  USING (
    country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()) OR
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'viewer'))
  );

CREATE POLICY "manage_own_country_leadership" ON leadership_degree_holders
  FOR ALL TO authenticated
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

-- RLS Policies for teacher_academic_qualifications
CREATE POLICY "select_own_country_teacher_qual" ON teacher_academic_qualifications
  FOR SELECT TO authenticated
  USING (
    country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()) OR
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'viewer'))
  );

CREATE POLICY "manage_own_country_teacher_qual" ON teacher_academic_qualifications
  FOR ALL TO authenticated
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

-- RLS Policies for specialist_teachers
CREATE POLICY "select_own_country_specialist" ON specialist_teachers
  FOR SELECT TO authenticated
  USING (
    country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()) OR
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'viewer'))
  );

CREATE POLICY "manage_own_country_specialist" ON specialist_teachers
  FOR ALL TO authenticated
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

-- RLS Policies for professional_development
CREATE POLICY "select_own_country_prof_dev" ON professional_development
  FOR SELECT TO authenticated
  USING (
    country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()) OR
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'viewer'))
  );

CREATE POLICY "manage_own_country_prof_dev" ON professional_development
  FOR ALL TO authenticated
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_staff_qualifications_updated_at ON staff_qualifications;
DROP TRIGGER IF EXISTS update_leadership_degree_updated_at ON leadership_degree_holders;
DROP TRIGGER IF EXISTS update_teacher_academic_qual_updated_at ON teacher_academic_qualifications;
DROP TRIGGER IF EXISTS update_specialist_teachers_updated_at ON specialist_teachers;
DROP TRIGGER IF EXISTS update_professional_development_updated_at ON professional_development;

-- Triggers for updated_at
CREATE TRIGGER update_staff_qualifications_updated_at
  BEFORE UPDATE ON staff_qualifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leadership_degree_updated_at
  BEFORE UPDATE ON leadership_degree_holders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teacher_academic_qual_updated_at
  BEFORE UPDATE ON teacher_academic_qualifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_specialist_teachers_updated_at
  BEFORE UPDATE ON specialist_teachers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_development_updated_at
  BEFORE UPDATE ON professional_development
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_staff_qual_country_year;
DROP INDEX IF EXISTS idx_leadership_country_year;
DROP INDEX IF EXISTS idx_teacher_qual_country_year;
DROP INDEX IF EXISTS idx_specialist_country_year;
DROP INDEX IF EXISTS idx_prof_dev_country_year;

-- Indexes for performance
CREATE INDEX idx_staff_qual_country_year ON staff_qualifications(country_id, academic_year_id);
CREATE INDEX idx_leadership_country_year ON leadership_degree_holders(country_id, academic_year_id);
CREATE INDEX idx_teacher_qual_country_year ON teacher_academic_qualifications(country_id, academic_year_id);
CREATE INDEX idx_specialist_country_year ON specialist_teachers(country_id, academic_year_id);
CREATE INDEX idx_prof_dev_country_year ON professional_development(country_id, academic_year_id);

-- Verify
SELECT 'Staff qualifications tables created successfully' as status;
