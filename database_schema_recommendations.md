# OECS Education Data Template - Database Schema Recommendations

## Executive Summary

This document provides comprehensive analysis and database design recommendations for the OECS Member State Education Data Template (Academic Year 2023-2024). The Excel template contains 9 worksheets collecting detailed education statistics across multiple dimensions: institutions, staff, enrollment, performance, finances, and demographics.

## Template Overview

**File:** Blank OECS MS Template.xlsx
**Academic Year:** 2023-2024
**Worksheets:** 9 (8 data sheets + 1 empty sheet)
**Total Data Tables:** 40+ distinct data collection tables

---

## Detailed Worksheet Analysis

### 1. Institutions Sheet

**Purpose:** Collects counts of educational institutions by type and ownership

**Structure:**
- **Dimensions:** Rows 1-1000, Columns A-Z
- **Tables:** 1 primary table (rows 3-12)
- **Formulas:** 7 SUM formulas for calculating totals

**Data Collected:**
- Institution Level: Daycare Centres, Pre-schools, Special schools, Primary, Secondary, Community Colleges-Post Secondary, Off Shore Institutions
- Institution Type: Public, Private/Church-assisted, Private/Non-affiliated, Total
- Academic year reference: 2023-2024

**Granularity:** By institution level and ownership type

**Database Mapping:**
```sql
Table: institutions
- id (primary key)
- country_id (foreign key)
- academic_year (e.g., "2023-2024")
- institution_level (enum: daycare, preschool, special, primary, secondary, post_secondary, offshore)
- ownership_type (enum: public, private_assisted, private_unaffiliated)
- count (integer)
- created_at
- updated_at
```

---

### 2. LeadersTeachersQualifications Sheet

**Purpose:** Collects detailed data on qualifications and training status of educational leaders and teachers

**Structure:**
- **Dimensions:** Rows 1-1001, Columns A-AH (34 columns)
- **Tables:** 7 distinct tables
- **Merged Cells:** 75 (complex nested structure)
- **Formulas:** 284 SUM formulas for gender totals

**Data Tables:**
1. **B1: Pre-schools & Daycares Staff Qualifications** (rows 5-22)
   - Roles: Administrators, Deputy Principal, Care Givers
   - By: Public/Private, Graduate/Non-graduate, Trained/Untrained, Male/Female

2. **B2: Primary School Staff Qualifications** (rows 24-42)
   - Roles: Principal, Deputy Principal, Teachers
   - By: Public/Private, Graduate/Non-graduate, Trained/Untrained, Male/Female

3. **B3: Secondary School Staff Qualifications** (rows 46-65)
   - Same structure as Primary

4. **B4: Post-Secondary/Tertiary Staff Qualifications** (rows 67-75)
   - Roles: Principal, Deputy Principal, Teachers
   - By: Public/Private, Graduate/Non-graduate, Male/Female

5. **B5: Teachers Highest Academic Qualifications** (rows 78-108)
   - Qualifications: CSEC/O-Level, CAPE/A-Levels, Associates, Bachelors, Masters, Doctorate, Other/Unknown
   - By: Pre-schools, Primary, Secondary, Post-secondary/Tertiary, Male/Female

6. **B6: Teachers Professional Qualifications** (Similar structure)

7. **B7: Continuous Professional Development** (rows 111-115)
   - Count of principals and teachers attending professional development
   - By: Primary/Secondary

**Database Mapping:**
```sql
Table: staff_qualifications
- id (primary key)
- country_id (foreign key)
- academic_year
- education_level (enum: preschool, primary, secondary, tertiary)
- ownership_type (enum: public, private)
- role (enum: administrator, principal, deputy_principal, teacher, caregiver)
- is_graduate (boolean)
- is_trained (boolean)
- gender (enum: male, female)
- count (integer)
- academic_qualification (enum: csec, cape, associate, bachelor, master, doctorate, other, unknown)
- professional_qualification (enum: certified, diploma, none, unknown)
- created_at
- updated_at

Table: professional_development
- id (primary key)
- country_id (foreign key)
- academic_year
- education_level (enum: primary, secondary)
- role (enum: principal, teacher)
- participants_count (integer)
- created_at
- updated_at
```

---

### 3. Age & Years of Service Sheet

**Purpose:** Demographics of principals, deputy principals, and teachers by age ranges and years of service

**Structure:**
- **Dimensions:** Rows 1-1000, Columns A-Z
- **Tables:** 11 tables (2 main sections with public/private/totals breakdown)
- **Merged Cells:** 24
- **Formulas:** 505 SUM formulas

**Data Tables:**

**Section 1: Age Range (Tables 1-3, rows 3-28)**
- Age ranges: <19, 20-29, 30-39, 40-49, 50-59, 60+, Unknown
- By: Public/Private/Totals
- By: Pre-schools, Primary, Secondary, Post-secondary/Tertiary
- By: Male/Female

**Section 2: Years of Service (Tables 4-6, rows 31-62)**
- Years: <1, 1-5, 6-10, 11-15, 16-20, 21-25, 26-30, 30+, Unknown
- Same breakdown as Age Range

**Section 3: Teachers Age Range (Tables 7-8, rows 67-92)**
- Repeated structure for teachers only

**Section 4: Teachers Years of Service (Tables 9-11, rows 95-126)**
- Repeated structure for teachers only

**Database Mapping:**
```sql
Table: staff_demographics_age
- id (primary key)
- country_id (foreign key)
- academic_year
- staff_category (enum: principals_deputies, teachers)
- education_level (enum: preschool, primary, secondary, tertiary)
- ownership_type (enum: public, private)
- age_range (enum: under_19, 20_29, 30_39, 40_49, 50_59, 60_plus, unknown)
- gender (enum: male, female)
- count (integer)
- created_at
- updated_at

Table: staff_demographics_service
- id (primary key)
- country_id (foreign key)
- academic_year
- staff_category (enum: principals_deputies, teachers)
- education_level (enum: preschool, primary, secondary, tertiary)
- ownership_type (enum: public, private)
- years_of_service_range (enum: under_1, 1_5, 6_10, 11_15, 16_20, 21_25, 26_30, over_30, unknown)
- gender (enum: male, female)
- count (integer)
- created_at
- updated_at
```

---

### 4. Student Enrolment Sheet

**Purpose:** Comprehensive student enrollment data across all education levels

**Structure:**
- **Dimensions:** Rows 1-1000, Columns A-AJ (36 columns)
- **Tables:** 6 major enrollment tables
- **Merged Cells:** 661 (most complex sheet)
- **Formulas:** 623 formulas for subtotals and cross-tabulations

**Data Tables:**

**D1: Early Childhood Enrollment** (rows 3-22)
- Ages: <1 year, 1, 2, 3, 4, >4, Unknown
- By: Public/Private/Total
- By: Male/Female
- Total enrollment with sex breakdown

**D2: Special Schools Enrollment** (rows 25-42)
- Ages: <5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, >18, Unknown
- By: Public/Private/Total
- By: Male/Female

**D3: Primary Schools Enrollment** (rows 45-79)
- Grades: K, G1, G2, G3, G4, G5, G6
- Ages: <5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, >14, Unknown
- By: Public/Private/Total
- By: Male/Female
- Cross-tabulated: Age x Grade

**D4: Secondary Schools Enrollment** (rows 82-110)
- Forms: 1, 2, 3, 4, 5
- Ages: <11, 11, 12, 13, 14, 15, 16, 17, 18, 19, >19, Unknown
- By: Public/Private/Total
- By: Male/Female
- Cross-tabulated: Age x Form

**D5: Post-Secondary/Tertiary Enrollment** (rows 115-145)
- Programs: TVET, CAPE/A-Levels, Hospitality, Other Post-secondary, Tertiary
- Ages: <16, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25+, Unknown
- By: Male/Female
- Cross-tabulated: Age x Program

**D6: Primary Schools by Religion** (rows 150-184)
- Same structure as D3 but categorized by religious affiliation

**Database Mapping:**
```sql
Table: enrollment_early_childhood
- id (primary key)
- country_id (foreign key)
- academic_year
- ownership_type (enum: public, private)
- age_years (integer, nullable for 'unknown')
- gender (enum: male, female)
- count (integer)
- created_at
- updated_at

Table: enrollment_special_schools
- id (primary key)
- country_id (foreign key)
- academic_year
- ownership_type (enum: public, private)
- age_years (integer, nullable)
- gender (enum: male, female)
- count (integer)
- created_at
- updated_at

Table: enrollment_primary
- id (primary key)
- country_id (foreign key)
- academic_year
- ownership_type (enum: public, private)
- grade_level (enum: k, g1, g2, g3, g4, g5, g6)
- age_years (integer, nullable)
- gender (enum: male, female)
- religious_affiliation (varchar, nullable)
- count (integer)
- created_at
- updated_at

Table: enrollment_secondary
- id (primary key)
- country_id (foreign key)
- academic_year
- ownership_type (enum: public, private)
- form_level (enum: form1, form2, form3, form4, form5)
- age_years (integer, nullable)
- gender (enum: male, female)
- count (integer)
- created_at
- updated_at

Table: enrollment_tertiary
- id (primary key)
- country_id (foreign key)
- academic_year
- program_type (enum: tvet, cape, hospitality, other_post_secondary, tertiary)
- age_years (integer, nullable)
- gender (enum: male, female)
- count (integer)
- created_at
- updated_at
```

---

### 5. Internal Efficiency Sheet

**Purpose:** Tracks repeaters, dropouts, student-teacher ratios, and school management

**Structure:**
- **Dimensions:** Rows 1-1000, Columns A-Z
- **Tables:** 3 main sections
- **Merged Cells:** 45
- **Formulas:** 76 formulas
- **Comments:** 2 (with instructions)

**Data Tables:**

**E1: Repeaters Data (2022-23)** (rows 6-35)
- Primary: By grade (K, 1, 2, 3, 4, 5, 6), by gender
- Secondary: By form (1-5), by gender
- Reasons for Secondary Repeaters:
  - Financial Difficulties
  - Pregnancy
  - Teacher-Pupil relationship
  - Continuous poor performance/failure
  - Insufficient parental control
  - Health
  - Other
  - Unknown

**E2: Dropouts Data (2022-23)** (similar structure)

**E3: Class Size and Ratios** (rows 40-44)
- By: Pre-primary, Primary, Secondary
- By: Public/Private/Totals
- Metrics:
  - Total number of students
  - Number of classes
  - Number of teachers
  - Number of specialist teachers
  - Class size (calculated: students/classes)
  - Student/Teacher ratio (calculated)
  - Effective Student/Teacher ratio (excluding specialists)

**E4: School Management** (rows 49-54)
- Count of schools managed by boards
- Count of schools with Parent-Teacher Associations
- Count of schools with guidance counselors
- By: Primary/Secondary

**Database Mapping:**
```sql
Table: repeaters
- id (primary key)
- country_id (foreign key)
- academic_year (note: this is retrospective - 2022-23 data)
- education_level (enum: primary, secondary)
- grade_or_form (varchar)
- gender (enum: male, female)
- count (integer)
- created_at
- updated_at

Table: dropout_reasons_secondary
- id (primary key)
- country_id (foreign key)
- academic_year
- reason (enum: financial, pregnancy, teacher_relationship, poor_performance,
          insufficient_parental_control, health, other, unknown)
- gender (enum: male, female)
- count (integer)
- created_at
- updated_at

Table: class_statistics
- id (primary key)
- country_id (foreign key)
- academic_year
- education_level (enum: pre_primary, primary, secondary)
- ownership_type (enum: public, private)
- total_students (integer)
- number_of_classes (integer)
- number_of_teachers (integer)
- number_of_specialist_teachers (integer)
- average_class_size (decimal, calculated)
- student_teacher_ratio (decimal, calculated)
- effective_student_teacher_ratio (decimal, calculated)
- created_at
- updated_at

Table: school_management
- id (primary key)
- country_id (foreign key)
- academic_year
- education_level (enum: primary, secondary)
- schools_managed_by_boards (integer)
- schools_with_pta (integer)
- schools_with_guidance_counselors (integer)
- created_at
- updated_at
```

---

### 6. Systems Output Sheet

**Purpose:** Student performance on national and external examinations

**Structure:**
- **Dimensions:** Rows 1-1002, Columns A-Z
- **Tables:** 7 examination performance tables
- **Merged Cells:** 100
- **Formulas:** 24 SUM formulas
- **Academic Year:** 2024 (note: different from other sheets)

**Data Tables:**

**F1: Pupils Performing at Grade Level (2024)** (rows 4-10)
- Subjects: Reading, Mathematics
- Grade levels: 2, 4, 6
- By: Male/Female/Total

**F2: CCSLC Performance (2024)** (rows 13-26)
- Subjects: English, Mathematics, Integrated Science, Social Studies, Spanish, French
- Grades: M (Merit), C (Competent)
- By: Male/Female/All

**F3: CSEC Performance by Subject (2024)** (rows 30-84)
- 50+ subjects listed (English A/B, Mathematics, Sciences, Business, etc.)
- Grades: I-III (passing grades)
- By: Male/Female/Total

**F4: Trends in Core Subject Passes (2020-2024)** (rows 88-95)
- Subjects: English A, Mathematics, Information Technology
- 5-year trend data
- By: Male/Female/Total

**F5: Achievement of 5+ CSEC Passes (2020-2024)** (rows 100-106)
- Students sitting vs achieving 5+ subjects
- Including English and Math
- 5-year trend
- By: Male/Female/Total

**F6: CAPE Performance (2024)** (rows 110-193)
- Unit 1 and Unit 2 separately
- Multiple subjects (Accounting, Biology, Chemistry, etc.)
- Grades: I-V
- By: Male/Female

**Database Mapping:**
```sql
Table: performance_grade_level
- id (primary key)
- country_id (foreign key)
- academic_year
- subject (enum: reading, mathematics)
- grade_level (enum: grade2, grade4, grade6)
- gender (enum: male, female)
- count_at_or_above_level (integer)
- created_at
- updated_at

Table: performance_ccslc
- id (primary key)
- country_id (foreign key)
- academic_year
- subject (enum: english, mathematics, integrated_science, social_studies, spanish, french)
- gender (enum: male, female)
- students_sitting (integer)
- students_achieving_merit (integer)
- students_achieving_competent (integer)
- created_at
- updated_at

Table: performance_csec
- id (primary key)
- country_id (foreign key)
- academic_year
- subject (varchar)
- gender (enum: male, female)
- students_sitting (integer)
- students_achieving_i_iii (integer)
- created_at
- updated_at

Table: performance_csec_trends
- id (primary key)
- country_id (foreign key)
- year (integer)
- subject (enum: english_a, mathematics, information_technology)
- gender (enum: male, female)
- students_sitting (integer)
- students_achieving_i_iii (integer)
- created_at
- updated_at

Table: performance_csec_five_plus
- id (primary key)
- country_id (foreign key)
- year (integer)
- gender (enum: male, female)
- students_sitting (integer)
- students_sitting_five_plus (integer)
- students_achieving_five_plus_excluding_eng_math (integer)
- students_achieving_five_plus_including_eng_math (integer)
- created_at
- updated_at

Table: performance_cape
- id (primary key)
- country_id (foreign key)
- academic_year
- subject (varchar)
- unit (enum: unit1, unit2)
- gender (enum: male, female)
- students_sitting (integer)
- students_achieving_i_v (integer)
- created_at
- updated_at
```

---

### 7. Financial Sheet

**Purpose:** Government expenditure on education programs and budgets

**Structure:**
- **Dimensions:** Rows 1-1000, Columns A-Z
- **Tables:** 5 financial tables
- **Merged Cells:** 11
- **Formulas:** 42 formulas (mostly cost per child calculations)

**Data Tables:**

**G1: Social Safety Net Programs** (rows 6-13)
- Programs:
  - School Feeding Programme
  - Textbook Rental Programme (Primary)
  - Textbook Rental Programme (Secondary)
  - Government Transfer Grant
  - Transportation Subsidy Programme
  - Education Trust Fund - CXC Fees
  - Education Trust Fund - School Registration Fees
- Fields:
  - Target Population
  - Number Participating
  - Total Amount Spent
  - Cost per Child (calculated)

**G2: Education Budget by Stage** (rows 17-26)
- Stages: Pre-Primary/Daycare, Primary, Secondary, TVET, Special Education, Tertiary, Technical Support, Administration, Other
- Categories: Recurrent, Capital, Total

**G3: National Budget Context** (rows 31-42)
- National budget total
- Government allocation for education
- Breakdown: Recurrent vs Capital
- Percentage of budget to education

**G4: Budget Allocation Percentages** (rows 46-62)
- Percentage of education budget by stage

**G5: Expenditure per Child** (rows 64-68)
- Calculated per-student cost by stage

**Database Mapping:**
```sql
Table: financial_safety_net_programs
- id (primary key)
- country_id (foreign key)
- academic_year
- program_name (varchar)
- target_population (varchar)
- number_participating (integer)
- total_amount_spent (decimal)
- cost_per_child (decimal, calculated)
- currency (varchar, default: 'XCD')
- created_at
- updated_at

Table: financial_education_budget
- id (primary key)
- country_id (foreign key)
- fiscal_year (varchar)
- education_stage (enum: pre_primary, primary, secondary, tvet, special_education,
                  tertiary, technical_support, administration, other)
- recurrent_budget (decimal)
- capital_budget (decimal)
- total_budget (decimal, calculated)
- currency (varchar, default: 'XCD')
- created_at
- updated_at

Table: financial_national_context
- id (primary key)
- country_id (foreign key)
- fiscal_year (varchar)
- total_national_budget (decimal)
- total_education_budget_recurrent (decimal)
- total_education_budget_capital (decimal)
- total_government_expenditure (decimal)
- education_percentage_of_budget (decimal, calculated)
- currency (varchar, default: 'XCD')
- created_at
- updated_at

Table: financial_per_student_cost
- id (primary key)
- country_id (foreign key)
- fiscal_year (varchar)
- education_stage (enum: pre_primary, primary, secondary, tertiary)
- total_students (integer)
- total_expenditure (decimal)
- cost_per_student (decimal, calculated)
- currency (varchar, default: 'XCD')
- created_at
- updated_at
```

---

### 8. Population Sheet

**Purpose:** National population figures by age and gender for enrollment rate calculations

**Structure:**
- **Dimensions:** Rows 1-1000, Columns A-K
- **Tables:** 1 comprehensive table
- **Merged Cells:** 3
- **Formulas:** 90 SUM formulas (totals by age)

**Data Collected:**
- Ages: 0 to 89+
- By: Male/Female/Total
- Year: 2023
- Note: Can be estimates, census data, or preliminary data

**Database Mapping:**
```sql
Table: population_data
- id (primary key)
- country_id (foreign key)
- year (integer)
- age (integer) -- 0 to 89, with 89 representing 89+
- gender (enum: male, female)
- population_count (integer)
- data_type (enum: estimate, census, preliminary)
- created_at
- updated_at
```

---

### 9. Sheet1

**Purpose:** Empty/unused sheet

**Structure:**
- Minimal dimensions (A1:H21)
- No meaningful data
- Can be ignored in database design

---

## Comprehensive Database Schema Design

### Core Tables

#### Countries/Member States
```sql
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(3) UNIQUE NOT NULL, -- e.g., 'ATG', 'DMA', 'GRD', etc.
    country_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OECS Member States:
-- Antigua and Barbuda, Dominica, Grenada, Montserrat,
-- St. Kitts and Nevis, Saint Lucia, St. Vincent and the Grenadines
```

#### Academic Years
```sql
CREATE TABLE academic_years (
    id SERIAL PRIMARY KEY,
    year_label VARCHAR(20) UNIQUE NOT NULL, -- e.g., '2023-2024'
    start_year INTEGER NOT NULL,
    end_year INTEGER NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Users (for data entry system)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    country_id INTEGER REFERENCES countries(id),
    role VARCHAR(50) NOT NULL, -- 'statistician', 'admin', 'viewer'
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Data Submission Tracking
```sql
CREATE TABLE data_submissions (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) NOT NULL,
    worksheet_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'not_started', 'in_progress', 'submitted', 'reviewed', 'approved'
    submitted_by INTEGER REFERENCES users(id),
    submitted_at TIMESTAMP,
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(country_id, academic_year_id, worksheet_name)
);
```

### Data Tables (as detailed in each section above)

All data tables follow this pattern:
- Include `country_id` foreign key
- Include `academic_year` or `year` field
- Include appropriate dimensional fields (gender, education level, etc.)
- Include count or value fields
- Include audit fields (created_at, updated_at)
- Include composite unique constraints to prevent duplicate entries

### Indexes

```sql
-- Performance indexes for common queries
CREATE INDEX idx_institutions_country_year ON institutions(country_id, academic_year);
CREATE INDEX idx_staff_qual_country_year ON staff_qualifications(country_id, academic_year);
CREATE INDEX idx_enrollment_country_year ON enrollment_primary(country_id, academic_year);
CREATE INDEX idx_performance_country_year ON performance_csec(country_id, academic_year);
CREATE INDEX idx_financial_country_year ON financial_education_budget(country_id, fiscal_year);

-- User lookup
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_country ON users(country_id);

-- Submission tracking
CREATE INDEX idx_submissions_country_year ON data_submissions(country_id, academic_year_id);
CREATE INDEX idx_submissions_status ON data_submissions(status);
```

### Relationships and Foreign Keys

```
countries (1) -----> (many) data_submissions
countries (1) -----> (many) institutions
countries (1) -----> (many) staff_qualifications
countries (1) -----> (many) enrollment_primary
countries (1) -----> (many) performance_csec
countries (1) -----> (many) financial_education_budget
countries (1) -----> (many) population_data
... (all data tables)

academic_years (1) -----> (many) data_submissions

users (1) -----> (many) data_submissions (submitted_by)
users (1) -----> (many) data_submissions (reviewed_by)

countries (1) -----> (many) users
```

---

## Key Design Patterns and Recommendations

### 1. Normalization vs. Denormalization

**Recommendation:** Use normalized structure for data entry, with option for denormalized views

- **Normalized tables** ensure data integrity and prevent redundancy
- **Materialized views** can provide denormalized data for reporting and analytics
- **Composite keys** prevent duplicate entries for same country/year/dimension

### 2. Handling Academic Year Variations

**Challenge:** Some sheets reference 2023-2024, others 2024, Internal Efficiency references 2022-23

**Recommendation:**
- Store academic year as string (e.g., "2023-2024") for display
- Include year range (start_year, end_year) for queries
- For retrospective data (like repeaters from previous year), include note field
- Allow flexibility for different reference periods

### 3. Handling Unknown/Missing Values

**Recommendation:**
- Use `NULL` for genuinely missing data
- Use specific enum value 'unknown' for categories like age_unknown
- Include validation to distinguish between zero (no students) and null (not reported)

### 4. Gender Data

**Current:** Binary Male/Female throughout template

**Recommendation:**
- Use enum('male', 'female') to match current template
- Consider future extensibility with 'other' or 'prefer_not_to_say' options
- Include 'total' calculations in application layer, not database

### 5. Calculated Fields

**Fields with Formulas in Excel:**
- Totals (Male + Female)
- Class size (Students / Classes)
- Student-teacher ratios
- Cost per child
- Percentages

**Recommendation:**
- Do NOT store calculated values in database
- Calculate on-the-fly in application layer
- Create database views or stored procedures for common calculations
- Exception: Financial totals where audit trail is important

### 6. Data Entry Workflow

**Recommended Flow:**
1. User logs in (assigned to specific country)
2. Selects academic year
3. Views dashboard showing completion status of each worksheet
4. Enters data for specific worksheet/table
5. Data auto-saves to draft state
6. User can submit worksheet when complete
7. Admin reviews and approves
8. Approved data becomes available for reporting

### 7. Data Validation Rules

Implement at database level:
- Check constraints for valid ranges (e.g., age 0-89)
- Foreign key constraints for referential integrity
- Unique constraints for composite keys
- NOT NULL constraints for required fields

Implement at application level:
- Cross-field validations (e.g., total = male + female)
- Sum validations (e.g., grade totals match age totals)
- Year-over-year change warnings (flag large variations)
- Completeness checks (all required fields filled)

### 8. Handling Multiple Programs/Subjects

**Challenge:** CSEC has 50+ subjects, CAPE has many subjects with 2 units each

**Recommendation:**
```sql
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    subject_code VARCHAR(20) UNIQUE,
    subject_name VARCHAR(255) NOT NULL,
    examination_type VARCHAR(50), -- 'CSEC', 'CAPE', 'CCSLC'
    is_active BOOLEAN DEFAULT true
);

-- Then reference in performance tables
ALTER TABLE performance_csec
ADD COLUMN subject_id INTEGER REFERENCES subjects(id);
```

### 9. Multi-tenancy Considerations

**Approach:** Row-level security by country

```sql
-- PostgreSQL Row Level Security example
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY country_isolation_policy ON institutions
    USING (country_id = current_setting('app.current_country_id')::INTEGER);
```

### 10. Audit Trail

**Recommendation:** Track all changes for accountability

```sql
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_values JSONB,
    new_values JSONB,
    changed_by INTEGER REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);
```

---

## Data Types Summary

| Data Category | Type | Examples |
|---------------|------|----------|
| Counts/Quantities | INTEGER | Student counts, teacher counts, institution counts |
| Financial | DECIMAL(12,2) | Budget amounts, expenditures, costs |
| Ratios/Percentages | DECIMAL(5,2) | Student-teacher ratio, percentage of budget |
| Identifiers | VARCHAR | Country codes, academic years, subject codes |
| Categories | ENUM or VARCHAR | Gender, education level, ownership type |
| Dates | TIMESTAMP | Submission dates, review dates |
| Notes/Comments | TEXT | Additional information, special notes |
| Boolean Flags | BOOLEAN | is_graduate, is_trained, is_active |

---

## Migration from Excel Strategy

### Phase 1: Data Model Setup
1. Create database schema
2. Seed reference data (countries, academic years, subjects)
3. Set up user accounts for statisticians

### Phase 2: Build Data Entry Interface
1. Create web forms mirroring Excel structure
2. Implement validation rules
3. Add auto-save functionality
4. Build submission workflow

### Phase 3: Historical Data Import
1. Parse existing Excel files (if any)
2. Validate and clean data
3. Import into database
4. Verify totals and calculations

### Phase 4: Reporting and Analytics
1. Create views matching Excel summary tables
2. Build dashboards for visualization
3. Implement export to Excel functionality
4. Create PDF reports

---

## Complex Structures - Special Handling

### Cross-Tabulated Data (Age x Grade)

**Challenge:** Primary enrollment is cross-tabulated (rows = age, columns = grade)

**Solution 1:** Store in normalized form
```sql
-- Each combination gets its own row
INSERT INTO enrollment_primary (country_id, year, age, grade, gender, count)
VALUES (1, '2023-2024', 6, 'g1', 'male', 150);
```

**Solution 2:** Pivot for display
```sql
-- Query to recreate Excel structure
SELECT age,
    SUM(CASE WHEN grade = 'k' THEN count ELSE 0 END) as k,
    SUM(CASE WHEN grade = 'g1' THEN count ELSE 0 END) as g1,
    SUM(CASE WHEN grade = 'g2' THEN count ELSE 0 END) as g2
    -- ... etc
FROM enrollment_primary
WHERE country_id = 1 AND academic_year = '2023-2024'
GROUP BY age;
```

### Merged Cells and Headers

**Challenge:** Excel uses merged cells for visual hierarchy

**Solution:**
- Ignore merged cells in data import
- Reconstruct hierarchy from context
- Use section/subsection fields in database to preserve structure
- Recreate visual formatting in frontend, not database

### Repeating Table Structures

**Challenge:** Same table structure repeated for Public/Private/Total

**Solution:**
- Store Public and Private as separate rows with ownership_type field
- Calculate Totals in application layer
- Don't store redundant totals in database

---

## Performance Optimization

### Partitioning Strategy

For large datasets across many years:

```sql
-- Partition by academic year
CREATE TABLE enrollment_primary_2023_2024 PARTITION OF enrollment_primary
    FOR VALUES IN ('2023-2024');

CREATE TABLE enrollment_primary_2024_2025 PARTITION OF enrollment_primary
    FOR VALUES IN ('2024-2025');
```

### Caching Strategy

- Cache reference data (countries, subjects, enums) in application
- Cache user permissions by country
- Invalidate cache on data submission/approval

### Query Optimization

- Use appropriate indexes (shown above)
- Avoid SELECT * queries
- Use pagination for large result sets
- Consider read replicas for reporting queries

---

## Data Quality Checks

### Automated Validations

```sql
-- Example: Total enrollment should match sum of public + private
CREATE VIEW enrollment_validation AS
SELECT country_id, academic_year,
    SUM(CASE WHEN ownership_type = 'public' THEN count ELSE 0 END) as public_total,
    SUM(CASE WHEN ownership_type = 'private' THEN count ELSE 0 END) as private_total,
    SUM(count) as grand_total
FROM enrollment_primary
GROUP BY country_id, academic_year;
```

### Cross-Sheet Validations

- Number of institutions should correlate with enrollment data
- Staff counts should align with student-teacher ratios
- Financial per-student costs should align with total budget and enrollment

---

## Security Considerations

### Access Control

1. **Country-level isolation:** Users only see/edit their country's data
2. **Role-based permissions:**
   - Statistician: Enter/edit data for assigned country
   - Reviewer: Approve submissions
   - Admin: Full access, user management
   - Viewer: Read-only access for reporting

### Data Encryption

- Encrypt passwords (bcrypt/Argon2)
- Use HTTPS for all data transmission
- Consider encryption at rest for sensitive fields

### Backup and Recovery

- Daily automated backups
- Point-in-time recovery capability
- Backup retention policy (e.g., 7 daily, 4 weekly, 12 monthly)

---

## Conclusion

This database schema design provides:

1. **Normalized structure** for data integrity
2. **Flexible querying** across dimensions
3. **Audit trail** for accountability
4. **Scalability** for multiple countries and years
5. **Data validation** at multiple levels
6. **Performance optimization** through indexes and partitioning
7. **Security** through row-level policies and access control

The design mirrors the Excel template structure while leveraging relational database benefits of validation, relationships, and efficient querying. The schema supports both data entry workflows and analytical reporting requirements.
