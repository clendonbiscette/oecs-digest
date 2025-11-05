-- Systems Output (Student Performance & Examinations) Tables

-- Table 1: Grade Level Performance (F1)
CREATE TABLE IF NOT EXISTS performance_grade_level (
  id SERIAL PRIMARY KEY,
  country_id INTEGER NOT NULL REFERENCES countries(id),
  academic_year_id INTEGER NOT NULL REFERENCES academic_years(id),
  subject VARCHAR(50) NOT NULL, -- 'reading' or 'mathematics'
  grade_level VARCHAR(20) NOT NULL, -- 'grade_2', 'grade_4', 'grade_6'
  gender VARCHAR(10) NOT NULL, -- 'male', 'female', 'total'
  count_at_or_above_level INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(country_id, academic_year_id, subject, grade_level, gender)
);

-- Table 2: CCSLC Performance (F2)
CREATE TABLE IF NOT EXISTS performance_ccslc (
  id SERIAL PRIMARY KEY,
  country_id INTEGER NOT NULL REFERENCES countries(id),
  academic_year_id INTEGER NOT NULL REFERENCES academic_years(id),
  subject VARCHAR(100) NOT NULL,
  gender VARCHAR(10) NOT NULL, -- 'male', 'female', 'total'
  students_sitting INTEGER DEFAULT 0,
  students_achieving_merit INTEGER DEFAULT 0,
  students_achieving_competent INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(country_id, academic_year_id, subject, gender)
);

-- Table 3: CSEC Performance (F3)
CREATE TABLE IF NOT EXISTS performance_csec (
  id SERIAL PRIMARY KEY,
  country_id INTEGER NOT NULL REFERENCES countries(id),
  academic_year_id INTEGER NOT NULL REFERENCES academic_years(id),
  subject VARCHAR(100) NOT NULL,
  gender VARCHAR(10) NOT NULL, -- 'male', 'female', 'total'
  students_sitting INTEGER DEFAULT 0,
  students_achieving_i_iii INTEGER DEFAULT 0, -- Grades I-III
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(country_id, academic_year_id, subject, gender)
);

-- Table 4: CSEC Trends (F4)
CREATE TABLE IF NOT EXISTS performance_csec_trends (
  id SERIAL PRIMARY KEY,
  country_id INTEGER NOT NULL REFERENCES countries(id),
  year INTEGER NOT NULL, -- 2020, 2021, 2022, 2023
  subject VARCHAR(100) NOT NULL, -- 'English A', 'Mathematics', 'Information Technology'
  gender VARCHAR(10) NOT NULL, -- 'male', 'female', 'total'
  students_sitting INTEGER DEFAULT 0,
  students_achieving_i_iii INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(country_id, year, subject, gender)
);

-- Table 5: CSEC Five Plus Achievement (F5)
CREATE TABLE IF NOT EXISTS performance_csec_five_plus (
  id SERIAL PRIMARY KEY,
  country_id INTEGER NOT NULL REFERENCES countries(id),
  year INTEGER NOT NULL, -- 2020, 2021, 2022, 2023
  gender VARCHAR(10) NOT NULL, -- 'male', 'female', 'total'
  students_sitting INTEGER DEFAULT 0,
  students_sitting_five_plus INTEGER DEFAULT 0,
  students_achieving_five_plus_excluding_eng_math INTEGER DEFAULT 0,
  students_achieving_five_plus_including_eng_math INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(country_id, year, gender)
);

-- Table 6: CAPE Performance (F6)
CREATE TABLE IF NOT EXISTS performance_cape (
  id SERIAL PRIMARY KEY,
  country_id INTEGER NOT NULL REFERENCES countries(id),
  academic_year_id INTEGER NOT NULL REFERENCES academic_years(id),
  subject VARCHAR(100) NOT NULL,
  unit VARCHAR(20) NOT NULL, -- 'Unit 1' or 'Unit 2'
  gender VARCHAR(10) NOT NULL, -- 'male', 'female', 'total'
  students_sitting INTEGER DEFAULT 0,
  students_achieving_i_v INTEGER DEFAULT 0, -- Grades I-V
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(country_id, academic_year_id, subject, unit, gender)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_perf_grade_level_country_year
  ON performance_grade_level(country_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_perf_ccslc_country_year
  ON performance_ccslc(country_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_perf_csec_country_year
  ON performance_csec(country_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_perf_csec_trends_country_year
  ON performance_csec_trends(country_id, year);
CREATE INDEX IF NOT EXISTS idx_perf_csec_five_plus_country_year
  ON performance_csec_five_plus(country_id, year);
CREATE INDEX IF NOT EXISTS idx_perf_cape_country_year
  ON performance_cape(country_id, academic_year_id);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_performance_grade_level_updated_at BEFORE UPDATE ON performance_grade_level
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_performance_ccslc_updated_at BEFORE UPDATE ON performance_ccslc
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_performance_csec_updated_at BEFORE UPDATE ON performance_csec
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_performance_csec_trends_updated_at BEFORE UPDATE ON performance_csec_trends
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_performance_csec_five_plus_updated_at BEFORE UPDATE ON performance_csec_five_plus
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_performance_cape_updated_at BEFORE UPDATE ON performance_cape
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE performance_grade_level ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_ccslc ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_csec ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_csec_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_csec_five_plus ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_cape ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their country's data
CREATE POLICY "Users can view their country's grade level performance"
  ON performance_grade_level FOR SELECT
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert their country's grade level performance"
  ON performance_grade_level FOR INSERT
  WITH CHECK (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their country's grade level performance"
  ON performance_grade_level FOR UPDATE
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete their country's grade level performance"
  ON performance_grade_level FOR DELETE
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

-- CCSLC Policies
CREATE POLICY "Users can view their country's CCSLC performance"
  ON performance_ccslc FOR SELECT
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert their country's CCSLC performance"
  ON performance_ccslc FOR INSERT
  WITH CHECK (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their country's CCSLC performance"
  ON performance_ccslc FOR UPDATE
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete their country's CCSLC performance"
  ON performance_ccslc FOR DELETE
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

-- CSEC Policies
CREATE POLICY "Users can view their country's CSEC performance"
  ON performance_csec FOR SELECT
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert their country's CSEC performance"
  ON performance_csec FOR INSERT
  WITH CHECK (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their country's CSEC performance"
  ON performance_csec FOR UPDATE
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete their country's CSEC performance"
  ON performance_csec FOR DELETE
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

-- CSEC Trends Policies
CREATE POLICY "Users can view their country's CSEC trends"
  ON performance_csec_trends FOR SELECT
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert their country's CSEC trends"
  ON performance_csec_trends FOR INSERT
  WITH CHECK (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their country's CSEC trends"
  ON performance_csec_trends FOR UPDATE
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete their country's CSEC trends"
  ON performance_csec_trends FOR DELETE
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

-- CSEC Five Plus Policies
CREATE POLICY "Users can view their country's CSEC five plus data"
  ON performance_csec_five_plus FOR SELECT
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert their country's CSEC five plus data"
  ON performance_csec_five_plus FOR INSERT
  WITH CHECK (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their country's CSEC five plus data"
  ON performance_csec_five_plus FOR UPDATE
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete their country's CSEC five plus data"
  ON performance_csec_five_plus FOR DELETE
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

-- CAPE Policies
CREATE POLICY "Users can view their country's CAPE performance"
  ON performance_cape FOR SELECT
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert their country's CAPE performance"
  ON performance_cape FOR INSERT
  WITH CHECK (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their country's CAPE performance"
  ON performance_cape FOR UPDATE
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete their country's CAPE performance"
  ON performance_cape FOR DELETE
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

-- Grant permissions
GRANT ALL ON performance_grade_level TO authenticated;
GRANT ALL ON performance_ccslc TO authenticated;
GRANT ALL ON performance_csec TO authenticated;
GRANT ALL ON performance_csec_trends TO authenticated;
GRANT ALL ON performance_csec_five_plus TO authenticated;
GRANT ALL ON performance_cape TO authenticated;

GRANT USAGE, SELECT ON SEQUENCE performance_grade_level_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE performance_ccslc_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE performance_csec_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE performance_csec_trends_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE performance_csec_five_plus_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE performance_cape_id_seq TO authenticated;
