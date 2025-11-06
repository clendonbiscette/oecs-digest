-- Create academic_years table
-- This table stores the academic year periods for data tracking

CREATE TABLE IF NOT EXISTS academic_years (
    id SERIAL PRIMARY KEY,
    year_label VARCHAR(20) UNIQUE NOT NULL,
    start_year INTEGER NOT NULL,
    end_year INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE academic_years IS 'Academic year periods for tracking educational data across years';

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_academic_years_updated_at ON academic_years;
CREATE TRIGGER update_academic_years_updated_at
    BEFORE UPDATE ON academic_years
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Everyone can read academic years
CREATE POLICY "Anyone can view academic years" ON academic_years
    FOR SELECT
    TO authenticated
    USING (true);

-- RLS Policy: Only admins can modify
CREATE POLICY "Admins can modify academic years" ON academic_years
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Grant permissions
GRANT SELECT ON academic_years TO authenticated;
GRANT ALL ON academic_years TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE academic_years_id_seq TO authenticated;

-- Insert initial academic years
INSERT INTO academic_years (year_label, start_year, end_year, is_active)
VALUES
    ('2020-2021', 2020, 2021, false),
    ('2021-2022', 2021, 2022, false),
    ('2022-2023', 2022, 2023, false),
    ('2023-2024', 2023, 2024, true),
    ('2024-2025', 2024, 2025, false)
ON CONFLICT (year_label) DO NOTHING;

-- Verify
SELECT * FROM academic_years ORDER BY start_year;
