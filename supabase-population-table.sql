-- Population Data Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS population_data (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 0 AND age <= 100),
    male INTEGER DEFAULT 0 CHECK (male >= 0),
    female INTEGER DEFAULT 0 CHECK (female >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_population UNIQUE(country_id, academic_year_id, age)
);

-- Enable RLS
ALTER TABLE population_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Statisticians can manage own country data
CREATE POLICY "select_own_country_population" ON population_data
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

CREATE POLICY "manage_own_country_population" ON population_data
  FOR ALL
  TO authenticated
  USING (
    country_id IN (
      SELECT country_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_population_data_updated_at
  BEFORE UPDATE ON population_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for performance
CREATE INDEX idx_population_country_year ON population_data(country_id, academic_year_id);

-- Verify
SELECT 'Population table created successfully' as status;
