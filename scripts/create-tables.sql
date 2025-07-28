-- Create database tables for OECS Educational Statistics
-- Based on 2022-23 data

-- Table 1: Countries reference table
CREATE TABLE IF NOT EXISTS countries (
    country_code VARCHAR(3) PRIMARY KEY,
    country_name VARCHAR(100),
    region VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: Early Childhood Centres
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
    UNIQUE(country_code),
    FOREIGN KEY (country_code) REFERENCES countries(country_code)
);

-- Table 3: Educational Institutions by Level
CREATE TABLE IF NOT EXISTS educational_institutions (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(3) NOT NULL,
    -- Primary Education
    primary_public INT DEFAULT 0,
    primary_private_church INT DEFAULT 0,
    primary_private_non_affiliated INT DEFAULT 0,
    primary_total INT DEFAULT 0,
    -- Secondary Education
    secondary_public INT DEFAULT 0,
    secondary_private_church INT DEFAULT 0,
    secondary_private_non_affiliated INT DEFAULT 0,
    secondary_total INT DEFAULT 0,
    -- Special Education
    special_ed_public INT DEFAULT 0,
    special_ed_private_church INT DEFAULT 0,
    special_ed_private_non_affiliated INT DEFAULT 0,
    special_ed_total INT DEFAULT 0,
    -- TVET (Technical and Vocational Education and Training)
    tvet_public INT DEFAULT 0,
    tvet_private_church INT DEFAULT 0,
    tvet_private_non_affiliated INT DEFAULT 0,
    tvet_total INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(country_code),
    FOREIGN KEY (country_code) REFERENCES countries(country_code)
);

-- Table 4: Post-Secondary Institutions
CREATE TABLE IF NOT EXISTS post_secondary_institutions (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(3) NOT NULL,
    public_institutions INT DEFAULT 0,
    private_institutions INT DEFAULT 0,
    total INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(country_code),
    FOREIGN KEY (country_code) REFERENCES countries(country_code)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_country_ecc ON early_childhood_centres(country_code);
CREATE INDEX IF NOT EXISTS idx_country_ei ON educational_institutions(country_code);
CREATE INDEX IF NOT EXISTS idx_country_psi ON post_secondary_institutions(country_code);
