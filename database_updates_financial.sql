-- Financial Tables (Government Expenditure on Education)

-- Table 1: Social Safety Net Programmes (G1)
CREATE TABLE IF NOT EXISTS social_safety_net_programmes (
  id SERIAL PRIMARY KEY,
  country_id INTEGER NOT NULL REFERENCES countries(id),
  academic_year_id INTEGER NOT NULL REFERENCES academic_years(id),
  programme_name VARCHAR(200) NOT NULL,
  target_population VARCHAR(200) NOT NULL,
  number_participating INTEGER DEFAULT 0,
  total_amount_spent DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(country_id, academic_year_id, programme_name, target_population)
);

-- Table 2: Education Budget Allocation by Stage (G2)
CREATE TABLE IF NOT EXISTS education_budget_allocation (
  id SERIAL PRIMARY KEY,
  country_id INTEGER NOT NULL REFERENCES countries(id),
  academic_year_id INTEGER NOT NULL REFERENCES academic_years(id),
  education_stage VARCHAR(50) NOT NULL,
  -- 'pre_primary', 'primary', 'secondary', 'tvet', 'special_education',
  -- 'post_secondary', 'tertiary', 'other'
  recurrent_expenditure DECIMAL(15,2) DEFAULT 0,
  capital_expenditure DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(country_id, academic_year_id, education_stage)
);

-- Table 3: National Financial Context (G3 inputs)
CREATE TABLE IF NOT EXISTS national_financial_context (
  id SERIAL PRIMARY KEY,
  country_id INTEGER NOT NULL REFERENCES countries(id),
  academic_year_id INTEGER NOT NULL REFERENCES academic_years(id),
  national_budget_recurrent DECIMAL(15,2) DEFAULT 0,
  national_budget_capital DECIMAL(15,2) DEFAULT 0,
  gdp_estimate DECIMAL(15,2) DEFAULT 0,
  spending_on_education_percent_gdp DECIMAL(5,2) DEFAULT 0,
  tertiary_allocation DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(country_id, academic_year_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_safety_net_country_year
  ON social_safety_net_programmes(country_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_budget_allocation_country_year
  ON education_budget_allocation(country_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_financial_context_country_year
  ON national_financial_context(country_id, academic_year_id);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_safety_net_updated_at BEFORE UPDATE ON social_safety_net_programmes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_allocation_updated_at BEFORE UPDATE ON education_budget_allocation
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_context_updated_at BEFORE UPDATE ON national_financial_context
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE social_safety_net_programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_budget_allocation ENABLE ROW LEVEL SECURITY;
ALTER TABLE national_financial_context ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their country's data

-- Social Safety Net Programmes Policies
CREATE POLICY "Users can view their country's safety net programmes"
  ON social_safety_net_programmes FOR SELECT
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert their country's safety net programmes"
  ON social_safety_net_programmes FOR INSERT
  WITH CHECK (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their country's safety net programmes"
  ON social_safety_net_programmes FOR UPDATE
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete their country's safety net programmes"
  ON social_safety_net_programmes FOR DELETE
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

-- Education Budget Allocation Policies
CREATE POLICY "Users can view their country's budget allocation"
  ON education_budget_allocation FOR SELECT
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert their country's budget allocation"
  ON education_budget_allocation FOR INSERT
  WITH CHECK (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their country's budget allocation"
  ON education_budget_allocation FOR UPDATE
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete their country's budget allocation"
  ON education_budget_allocation FOR DELETE
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

-- National Financial Context Policies
CREATE POLICY "Users can view their country's financial context"
  ON national_financial_context FOR SELECT
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert their country's financial context"
  ON national_financial_context FOR INSERT
  WITH CHECK (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their country's financial context"
  ON national_financial_context FOR UPDATE
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete their country's financial context"
  ON national_financial_context FOR DELETE
  USING (country_id IN (SELECT country_id FROM user_profiles WHERE id = auth.uid()));

-- Grant permissions
GRANT ALL ON social_safety_net_programmes TO authenticated;
GRANT ALL ON education_budget_allocation TO authenticated;
GRANT ALL ON national_financial_context TO authenticated;

GRANT USAGE, SELECT ON SEQUENCE social_safety_net_programmes_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE education_budget_allocation_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE national_financial_context_id_seq TO authenticated;
