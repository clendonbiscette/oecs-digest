-- OECS Education Data Collection System
-- Database Schema Creation Script
-- PostgreSQL 12+
-- Generated: 2025-10-19

-- =====================================================
-- PART 1: CORE REFERENCE TABLES
-- =====================================================

-- Countries/Member States
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(3) UNIQUE NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Academic Years
CREATE TABLE academic_years (
    id SERIAL PRIMARY KEY,
    year_label VARCHAR(20) UNIQUE NOT NULL,
    start_year INTEGER NOT NULL,
    end_year INTEGER NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects (for examinations)
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    subject_code VARCHAR(20) UNIQUE,
    subject_name VARCHAR(255) NOT NULL,
    examination_type VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PART 2: USER MANAGEMENT
-- =====================================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    country_id INTEGER REFERENCES countries(id),
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PART 3: DATA SUBMISSION TRACKING
-- =====================================================

CREATE TABLE data_submissions (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) NOT NULL,
    worksheet_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'not_started',
    submitted_by INTEGER REFERENCES users(id),
    submitted_at TIMESTAMP,
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_submission UNIQUE(country_id, academic_year_id, worksheet_name)
);

-- =====================================================
-- PART 4: INSTITUTIONS DATA (Sheet 1)
-- =====================================================

CREATE TABLE institutions (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    institution_level VARCHAR(50) NOT NULL,
    ownership_type VARCHAR(50) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_institution UNIQUE(country_id, academic_year, institution_level, ownership_type)
);

-- =====================================================
-- PART 5: STAFF QUALIFICATIONS (Sheet 2)
-- =====================================================

CREATE TABLE staff_qualifications (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    education_level VARCHAR(50) NOT NULL,
    ownership_type VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_graduate BOOLEAN,
    is_trained BOOLEAN,
    gender VARCHAR(10) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
    academic_qualification VARCHAR(50),
    professional_qualification VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_staff_qual UNIQUE(country_id, academic_year, education_level,
        ownership_type, role, is_graduate, is_trained, gender,
        academic_qualification, professional_qualification)
);

CREATE TABLE professional_development (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    education_level VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    participants_count INTEGER NOT NULL DEFAULT 0 CHECK (participants_count >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_prof_dev UNIQUE(country_id, academic_year, education_level, role)
);

-- =====================================================
-- PART 6: STAFF DEMOGRAPHICS (Sheet 3)
-- =====================================================

CREATE TABLE staff_demographics_age (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    staff_category VARCHAR(50) NOT NULL,
    education_level VARCHAR(50) NOT NULL,
    ownership_type VARCHAR(50) NOT NULL,
    age_range VARCHAR(20) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_staff_age UNIQUE(country_id, academic_year, staff_category,
        education_level, ownership_type, age_range, gender)
);

CREATE TABLE staff_demographics_service (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    staff_category VARCHAR(50) NOT NULL,
    education_level VARCHAR(50) NOT NULL,
    ownership_type VARCHAR(50) NOT NULL,
    years_of_service_range VARCHAR(20) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_staff_service UNIQUE(country_id, academic_year, staff_category,
        education_level, ownership_type, years_of_service_range, gender)
);

-- =====================================================
-- PART 7: STUDENT ENROLLMENT (Sheet 4)
-- =====================================================

CREATE TABLE enrollment_early_childhood (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    ownership_type VARCHAR(50) NOT NULL,
    age_years INTEGER CHECK (age_years >= 0 OR age_years IS NULL),
    gender VARCHAR(10) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_enroll_ec UNIQUE(country_id, academic_year, ownership_type,
        age_years, gender)
);

CREATE TABLE enrollment_special_schools (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    ownership_type VARCHAR(50) NOT NULL,
    age_years INTEGER CHECK (age_years >= 0 OR age_years IS NULL),
    gender VARCHAR(10) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_enroll_special UNIQUE(country_id, academic_year, ownership_type,
        age_years, gender)
);

CREATE TABLE enrollment_primary (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    ownership_type VARCHAR(50) NOT NULL,
    grade_level VARCHAR(10) NOT NULL,
    age_years INTEGER CHECK (age_years >= 0 OR age_years IS NULL),
    gender VARCHAR(10) NOT NULL,
    religious_affiliation VARCHAR(100),
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_enroll_primary UNIQUE(country_id, academic_year, ownership_type,
        grade_level, age_years, gender, religious_affiliation)
);

CREATE TABLE enrollment_secondary (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    ownership_type VARCHAR(50) NOT NULL,
    form_level VARCHAR(10) NOT NULL,
    age_years INTEGER CHECK (age_years >= 0 OR age_years IS NULL),
    gender VARCHAR(10) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_enroll_secondary UNIQUE(country_id, academic_year, ownership_type,
        form_level, age_years, gender)
);

CREATE TABLE enrollment_tertiary (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    program_type VARCHAR(50) NOT NULL,
    age_years INTEGER CHECK (age_years >= 0 OR age_years IS NULL),
    gender VARCHAR(10) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_enroll_tertiary UNIQUE(country_id, academic_year, program_type,
        age_years, gender)
);

-- =====================================================
-- PART 8: INTERNAL EFFICIENCY (Sheet 5)
-- =====================================================

CREATE TABLE repeaters (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    education_level VARCHAR(50) NOT NULL,
    grade_or_form VARCHAR(10) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_repeaters UNIQUE(country_id, academic_year, education_level,
        grade_or_form, gender)
);

CREATE TABLE dropout_reasons_secondary (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    reason VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_dropout_reason UNIQUE(country_id, academic_year, reason, gender)
);

CREATE TABLE class_statistics (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    education_level VARCHAR(50) NOT NULL,
    ownership_type VARCHAR(50) NOT NULL,
    total_students INTEGER NOT NULL DEFAULT 0 CHECK (total_students >= 0),
    number_of_classes INTEGER NOT NULL DEFAULT 0 CHECK (number_of_classes >= 0),
    number_of_teachers INTEGER NOT NULL DEFAULT 0 CHECK (number_of_teachers >= 0),
    number_of_specialist_teachers INTEGER DEFAULT 0 CHECK (number_of_specialist_teachers >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_class_stats UNIQUE(country_id, academic_year, education_level,
        ownership_type)
);

CREATE TABLE school_management (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    education_level VARCHAR(50) NOT NULL,
    schools_managed_by_boards INTEGER DEFAULT 0 CHECK (schools_managed_by_boards >= 0),
    schools_with_pta INTEGER DEFAULT 0 CHECK (schools_with_pta >= 0),
    schools_with_guidance_counselors INTEGER DEFAULT 0 CHECK (schools_with_guidance_counselors >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_school_mgmt UNIQUE(country_id, academic_year, education_level)
);

-- =====================================================
-- PART 9: EXAMINATION PERFORMANCE (Sheet 6)
-- =====================================================

CREATE TABLE performance_grade_level (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    grade_level VARCHAR(20) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    count_at_or_above_level INTEGER NOT NULL DEFAULT 0 CHECK (count_at_or_above_level >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_perf_grade UNIQUE(country_id, academic_year, subject,
        grade_level, gender)
);

CREATE TABLE performance_ccslc (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    students_sitting INTEGER NOT NULL DEFAULT 0 CHECK (students_sitting >= 0),
    students_achieving_merit INTEGER DEFAULT 0 CHECK (students_achieving_merit >= 0),
    students_achieving_competent INTEGER DEFAULT 0 CHECK (students_achieving_competent >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_perf_ccslc UNIQUE(country_id, academic_year, subject, gender)
);

CREATE TABLE performance_csec (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    students_sitting INTEGER NOT NULL DEFAULT 0 CHECK (students_sitting >= 0),
    students_achieving_i_iii INTEGER DEFAULT 0 CHECK (students_achieving_i_iii >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_perf_csec UNIQUE(country_id, academic_year, subject, gender)
);

CREATE TABLE performance_csec_trends (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    year INTEGER NOT NULL,
    subject VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    students_sitting INTEGER NOT NULL DEFAULT 0 CHECK (students_sitting >= 0),
    students_achieving_i_iii INTEGER DEFAULT 0 CHECK (students_achieving_i_iii >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_perf_csec_trend UNIQUE(country_id, year, subject, gender)
);

CREATE TABLE performance_csec_five_plus (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    year INTEGER NOT NULL,
    gender VARCHAR(10) NOT NULL,
    students_sitting INTEGER NOT NULL DEFAULT 0 CHECK (students_sitting >= 0),
    students_sitting_five_plus INTEGER DEFAULT 0 CHECK (students_sitting_five_plus >= 0),
    students_achieving_five_plus_excluding_eng_math INTEGER DEFAULT 0,
    students_achieving_five_plus_including_eng_math INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_perf_five_plus UNIQUE(country_id, year, gender)
);

CREATE TABLE performance_cape (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    students_sitting INTEGER NOT NULL DEFAULT 0 CHECK (students_sitting >= 0),
    students_achieving_i_v INTEGER DEFAULT 0 CHECK (students_achieving_i_v >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_perf_cape UNIQUE(country_id, academic_year, subject, unit, gender)
);

-- =====================================================
-- PART 10: FINANCIAL DATA (Sheet 7)
-- =====================================================

CREATE TABLE financial_safety_net_programs (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    program_name VARCHAR(255) NOT NULL,
    target_population VARCHAR(255),
    number_participating INTEGER DEFAULT 0 CHECK (number_participating >= 0),
    total_amount_spent DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'XCD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_safety_net UNIQUE(country_id, academic_year, program_name)
);

CREATE TABLE financial_education_budget (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    fiscal_year VARCHAR(20) NOT NULL,
    education_stage VARCHAR(50) NOT NULL,
    recurrent_budget DECIMAL(15,2) DEFAULT 0,
    capital_budget DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'XCD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_edu_budget UNIQUE(country_id, fiscal_year, education_stage)
);

CREATE TABLE financial_national_context (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    fiscal_year VARCHAR(20) NOT NULL,
    total_national_budget DECIMAL(15,2),
    total_education_budget_recurrent DECIMAL(15,2),
    total_education_budget_capital DECIMAL(15,2),
    total_government_expenditure DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'XCD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_nat_context UNIQUE(country_id, fiscal_year)
);

-- =====================================================
-- PART 11: POPULATION DATA (Sheet 8)
-- =====================================================

CREATE TABLE population_data (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    year INTEGER NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 0 AND age <= 89),
    gender VARCHAR(10) NOT NULL,
    population_count INTEGER NOT NULL DEFAULT 0 CHECK (population_count >= 0),
    data_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_population UNIQUE(country_id, year, age, gender)
);

-- =====================================================
-- PART 12: AUDIT LOG
-- =====================================================

CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    changed_by INTEGER REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- =====================================================
-- PART 13: INDEXES FOR PERFORMANCE
-- =====================================================

-- Core reference indexes
CREATE INDEX idx_countries_code ON countries(country_code);
CREATE INDEX idx_academic_years_label ON academic_years(year_label);
CREATE INDEX idx_subjects_code ON subjects(subject_code);

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_country ON users(country_id);

-- Submission tracking
CREATE INDEX idx_submissions_country_year ON data_submissions(country_id, academic_year_id);
CREATE INDEX idx_submissions_status ON data_submissions(status);

-- Data table indexes (country + year for each table)
CREATE INDEX idx_institutions_country_year ON institutions(country_id, academic_year);
CREATE INDEX idx_staff_qual_country_year ON staff_qualifications(country_id, academic_year);
CREATE INDEX idx_staff_age_country_year ON staff_demographics_age(country_id, academic_year);
CREATE INDEX idx_staff_service_country_year ON staff_demographics_service(country_id, academic_year);
CREATE INDEX idx_enroll_ec_country_year ON enrollment_early_childhood(country_id, academic_year);
CREATE INDEX idx_enroll_primary_country_year ON enrollment_primary(country_id, academic_year);
CREATE INDEX idx_enroll_secondary_country_year ON enrollment_secondary(country_id, academic_year);
CREATE INDEX idx_enroll_tertiary_country_year ON enrollment_tertiary(country_id, academic_year);
CREATE INDEX idx_repeaters_country_year ON repeaters(country_id, academic_year);
CREATE INDEX idx_class_stats_country_year ON class_statistics(country_id, academic_year);
CREATE INDEX idx_perf_csec_country_year ON performance_csec(country_id, academic_year);
CREATE INDEX idx_perf_cape_country_year ON performance_cape(country_id, academic_year);
CREATE INDEX idx_financial_budget_country_year ON financial_education_budget(country_id, fiscal_year);
CREATE INDEX idx_population_country_year ON population_data(country_id, year);

-- Audit log indexes
CREATE INDEX idx_audit_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_changed_at ON audit_log(changed_at);
CREATE INDEX idx_audit_changed_by ON audit_log(changed_by);

-- =====================================================
-- PART 14: SEED DATA
-- =====================================================

-- Insert OECS Member States
INSERT INTO countries (country_code, country_name, is_active) VALUES
('ATG', 'Antigua and Barbuda', true),
('DMA', 'Dominica', true),
('GRD', 'Grenada', true),
('MSR', 'Montserrat', true),
('KNA', 'Saint Kitts and Nevis', true),
('LCA', 'Saint Lucia', true),
('VCT', 'Saint Vincent and the Grenadines', true);

-- Insert Academic Years
INSERT INTO academic_years (year_label, start_year, end_year, is_current) VALUES
('2019-2020', 2019, 2020, false),
('2020-2021', 2020, 2021, false),
('2021-2022', 2021, 2022, false),
('2022-2023', 2022, 2023, false),
('2023-2024', 2023, 2024, true),
('2024-2025', 2024, 2025, false);

-- =====================================================
-- PART 15: VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: Total enrollment by country and year
CREATE VIEW v_total_enrollment AS
SELECT
    c.country_code,
    e.academic_year,
    'early_childhood' as level,
    SUM(e.count) as total_students
FROM enrollment_early_childhood e
JOIN countries c ON e.country_id = c.id
GROUP BY c.country_code, e.academic_year
UNION ALL
SELECT
    c.country_code,
    e.academic_year,
    'primary' as level,
    SUM(e.count) as total_students
FROM enrollment_primary e
JOIN countries c ON e.country_id = c.id
GROUP BY c.country_code, e.academic_year
UNION ALL
SELECT
    c.country_code,
    e.academic_year,
    'secondary' as level,
    SUM(e.count) as total_students
FROM enrollment_secondary e
JOIN countries c ON e.country_id = c.id
GROUP BY c.country_code, e.academic_year;

-- View: Student-Teacher Ratios
CREATE VIEW v_student_teacher_ratios AS
SELECT
    c.country_code,
    cs.academic_year,
    cs.education_level,
    cs.ownership_type,
    cs.total_students,
    cs.number_of_teachers,
    CASE
        WHEN cs.number_of_teachers > 0
        THEN ROUND(cs.total_students::DECIMAL / cs.number_of_teachers, 2)
        ELSE NULL
    END as student_teacher_ratio,
    CASE
        WHEN (cs.number_of_teachers - cs.number_of_specialist_teachers) > 0
        THEN ROUND(cs.total_students::DECIMAL / (cs.number_of_teachers - cs.number_of_specialist_teachers), 2)
        ELSE NULL
    END as effective_ratio
FROM class_statistics cs
JOIN countries c ON cs.country_id = c.id;

-- View: CSEC Pass Rates
CREATE VIEW v_csec_pass_rates AS
SELECT
    c.country_code,
    p.academic_year,
    p.subject,
    p.gender,
    p.students_sitting,
    p.students_achieving_i_iii,
    CASE
        WHEN p.students_sitting > 0
        THEN ROUND((p.students_achieving_i_iii::DECIMAL / p.students_sitting * 100), 2)
        ELSE NULL
    END as pass_rate_percentage
FROM performance_csec p
JOIN countries c ON p.country_id = c.id;

-- =====================================================
-- PART 16: FUNCTIONS FOR CALCULATED FIELDS
-- =====================================================

-- Function: Calculate cost per child for safety net programs
CREATE OR REPLACE FUNCTION calculate_cost_per_child(
    p_total_amount DECIMAL,
    p_participants INTEGER
) RETURNS DECIMAL AS $$
BEGIN
    IF p_participants > 0 THEN
        RETURN ROUND(p_total_amount / p_participants, 2);
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate total education budget
CREATE OR REPLACE FUNCTION get_total_education_budget(
    p_country_id INTEGER,
    p_fiscal_year VARCHAR
) RETURNS DECIMAL AS $$
DECLARE
    total DECIMAL;
BEGIN
    SELECT SUM(recurrent_budget + capital_budget)
    INTO total
    FROM financial_education_budget
    WHERE country_id = p_country_id
    AND fiscal_year = p_fiscal_year;

    RETURN COALESCE(total, 0);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PART 17: UPDATED_AT TRIGGER FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name
        FROM information_schema.columns
        WHERE column_name = 'updated_at'
        AND table_schema = 'public'
    LOOP
        EXECUTE format('
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', t, t);
    END LOOP;
END;
$$;

-- =====================================================
-- PART 18: ROW LEVEL SECURITY (Optional - for multi-tenancy)
-- =====================================================

-- Enable RLS on data tables
-- Uncomment if using PostgreSQL Row Level Security

/*
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment_primary ENABLE ROW LEVEL SECURITY;
-- ... enable for all data tables

-- Create policy for country-based access
CREATE POLICY country_access_policy ON institutions
    USING (country_id = current_setting('app.current_country_id')::INTEGER);

-- Repeat for all tables
*/

-- =====================================================
-- PART 19: GRANT PERMISSIONS
-- =====================================================

-- Create roles
CREATE ROLE oecs_admin;
CREATE ROLE oecs_statistician;
CREATE ROLE oecs_viewer;

-- Grant permissions to admin (full access)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO oecs_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO oecs_admin;

-- Grant permissions to statistician (read/write data, no user management)
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO oecs_statistician;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO oecs_statistician;

-- Grant permissions to viewer (read-only)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO oecs_viewer;

-- =====================================================
-- END OF SCHEMA CREATION
-- =====================================================

-- Verify installation
SELECT 'Schema created successfully!' as status,
       COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';
