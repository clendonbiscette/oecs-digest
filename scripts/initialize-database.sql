-- Initialize database with all tables and data
-- Run this script to set up the complete database

-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
    country_code VARCHAR(3) PRIMARY KEY,
    country_name VARCHAR(100),
    region VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create early childhood centres table
CREATE TABLE IF NOT EXISTS early_childhood_centres (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(3) NOT NULL,
    daycare_public INT DEFAULT 0,
    daycare_private_church INT DEFAULT 0,
    daycare_private_non_affiliated INT DEFAULT 0,
    daycare_total INT DEFAULT 0,
    preschool_public INT DEFAULT 0,
    preschool_private_church INT DEFAULT 0,
    preschool_private_non_affiliated INT DEFAULT 0,
    preschool_total INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(country_code)
);

-- Create educational institutions table
CREATE TABLE IF NOT EXISTS educational_institutions (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(3) NOT NULL,
    primary_public INT DEFAULT 0,
    primary_private_church INT DEFAULT 0,
    primary_private_non_affiliated INT DEFAULT 0,
    primary_total INT DEFAULT 0,
    secondary_public INT DEFAULT 0,
    secondary_private_church INT DEFAULT 0,
    secondary_private_non_affiliated INT DEFAULT 0,
    secondary_total INT DEFAULT 0,
    special_ed_public INT DEFAULT 0,
    special_ed_private_church INT DEFAULT 0,
    special_ed_private_non_affiliated INT DEFAULT 0,
    special_ed_total INT DEFAULT 0,
    tvet_public INT DEFAULT 0,
    tvet_private_church INT DEFAULT 0,
    tvet_private_non_affiliated INT DEFAULT 0,
    tvet_total INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(country_code)
);

-- Create post-secondary institutions table
CREATE TABLE IF NOT EXISTS post_secondary_institutions (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(3) NOT NULL,
    public_institutions INT DEFAULT 0,
    private_institutions INT DEFAULT 0,
    total INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(country_code)
);

-- Insert countries data
INSERT INTO countries (country_code, country_name, region) VALUES
('ANU', 'Anguilla', 'OECS'),
('A&B', 'Antigua and Barbuda', 'OECS'),
('DOM', 'Dominica', 'OECS'),
('GRD', 'Grenada', 'OECS'),
('MON', 'Montserrat', 'OECS'),
('SKN', 'Saint Kitts and Nevis', 'OECS'),
('SLU', 'Saint Lucia', 'OECS'),
('SVG', 'Saint Vincent and the Grenadines', 'OECS'),
('VI', 'Virgin Islands', 'OECS')
ON CONFLICT (country_code) DO NOTHING;

-- Insert early childhood centres data
INSERT INTO early_childhood_centres 
(country_code, daycare_public, daycare_private_church, daycare_private_non_affiliated, daycare_total, 
 preschool_public, preschool_private_church, preschool_private_non_affiliated, preschool_total) 
VALUES
('ANU', 0, 0, 0, 0, 0, 0, 0, 0),
('A&B', 0, 0, 0, 0, 0, 0, 0, 0),
('DOM', 0, 0, 14, 14, 29, 14, 31, 74),
('GRD', 5, 0, 0, 5, 63, 10, 31, 104),
('MON', 0, 0, 0, 0, 0, 0, 0, 0),
('SKN', 0, 0, 0, 0, 14, 0, 3, 17),
('SLU', 12, 0, 34, 46, 13, 5, 47, 65),
('SVG', 0, 0, 0, 0, 0, 0, 0, 0),
('VI', 0, 6, 20, 26, 1, 9, 20, 30)
ON CONFLICT (country_code) DO NOTHING;

-- Insert educational institutions data
INSERT INTO educational_institutions
(country_code, primary_public, primary_private_church, primary_private_non_affiliated, primary_total,
 secondary_public, secondary_private_church, secondary_private_non_affiliated, secondary_total,
 special_ed_public, special_ed_private_church, special_ed_private_non_affiliated, special_ed_total,
 tvet_public, tvet_private_church, tvet_private_non_affiliated, tvet_total)
VALUES
('ANU', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('A&B', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('DOM', 45, 5, 7, 57, 7, 6, 2, 15, 0, 0, 2, 2, 0, 0, 0, 0),
('GRD', 56, 8, 31, 95, 21, 1, 3, 25, 3, 0, 0, 3, 1, 1, 0, 2),
('MON', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('SKN', 17, 0, 5, 22, 6, 0, 2, 8, 2, 0, 0, 2, 1, 0, 0, 1),
('SLU', 72, 15, 7, 94, 20, 1, 3, 24, 4, 0, 1, 5, 1, 1, 0, 2),
('SVG', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('VI', 13, 3, 8, 24, 4, 2, 2, 8, 1, 0, 0, 1, 1, 0, 0, 1)
ON CONFLICT (country_code) DO NOTHING;

-- Insert post-secondary institutions data
INSERT INTO post_secondary_institutions
(country_code, public_institutions, private_institutions, total)
VALUES
('ANU', 0, 0, 0),
('A&B', 0, 0, 0),
('DOM', 1, 4, 5),
('GRD', 1, 1, 2),
('MON', 0, 0, 0),
('SKN', 2, 2, 4),
('SLU', 1, 0, 1),
('SVG', 2, 0, 2),
('VI', 1, 0, 1)
ON CONFLICT (country_code) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_country_ecc ON early_childhood_centres(country_code);
CREATE INDEX IF NOT EXISTS idx_country_ei ON educational_institutions(country_code);
CREATE INDEX IF NOT EXISTS idx_country_psi ON post_secondary_institutions(country_code);

-- Create views for easier data access
CREATE OR REPLACE VIEW education_summary AS
SELECT 
    c.country_code,
    c.country_name,
    COALESCE(ecc.daycare_total, 0) as total_daycare_centres,
    COALESCE(ecc.preschool_total, 0) as total_preschools,
    COALESCE(ei.primary_total, 0) as total_primary_schools,
    COALESCE(ei.secondary_total, 0) as total_secondary_schools,
    COALESCE(ei.special_ed_total, 0) as total_special_ed_schools,
    COALESCE(ei.tvet_total, 0) as total_tvet_institutions,
    COALESCE(psi.total, 0) as total_post_secondary
FROM countries c
LEFT JOIN early_childhood_centres ecc ON c.country_code = ecc.country_code
LEFT JOIN educational_institutions ei ON c.country_code = ei.country_code
LEFT JOIN post_secondary_institutions psi ON c.country_code = psi.country_code;

-- Create regional summary view
CREATE OR REPLACE VIEW oecs_regional_summary AS
SELECT 
    'OECS' as region,
    -- Early Childhood
    SUM(ecc.daycare_public) as daycare_public,
    SUM(ecc.daycare_private_church) as daycare_private_church,
    SUM(ecc.daycare_private_non_affiliated) as daycare_private_non_affiliated,
    SUM(ecc.daycare_total) as daycare_total,
    SUM(ecc.preschool_public) as preschool_public,
    SUM(ecc.preschool_private_church) as preschool_private_church,
    SUM(ecc.preschool_private_non_affiliated) as preschool_private_non_affiliated,
    SUM(ecc.preschool_total) as preschool_total,
    -- Primary through TVET totals
    SUM(ei.primary_total) as primary_total,
    SUM(ei.secondary_total) as secondary_total,
    SUM(ei.special_ed_total) as special_ed_total,
    SUM(ei.tvet_total) as tvet_total,
    -- Post-secondary
    SUM(psi.public_institutions) as post_secondary_public,
    SUM(psi.private_institutions) as post_secondary_private,
    SUM(psi.total) as post_secondary_total
FROM early_childhood_centres ecc
JOIN educational_institutions ei USING (country_code)
JOIN post_secondary_institutions psi USING (country_code);
