# LeadersTeachersQualifications Worksheet - Complete Structure Analysis

**File:** `C:\Users\Clendon\oecs-education-dashboard\DIGEST_WEB\Blank OECS MS Template.xlsx`
**Worksheet:** LeadersTeachersQualifications
**Academic Year:** 2023-2024 (Cell F1)
**Total Tables:** 7 (B1 through B7)

---

## Overview

This worksheet contains 7 distinct tables tracking teacher and administrator qualifications, training status, and professional development across different education levels (Pre-schools, Primary, Secondary, and Post-secondary/Tertiary).

**Key Definitions (Rows 2-3):**
- **Trained teacher:** One who has successfully completed a course of study in the methodology and content of teaching at an accredited institution
- **Graduate teacher:** One who has attained at least an undergraduate degree from an accredited institution

---

## TABLE B1: Qualifications & Training: Pre-schools

**Location:** Rows 5-22
**Cell Range:** A5:M22

### Header Structure
- **Row 5:** Table title: "B1.Qualifications & Training: Pre-schools"
- **Row 6:** Main column headers
  - Column A: Stage
  - Column B: Type of School
  - Column C: Qualifications
  - Columns E-G: Administrators (Male, Female, Totals)
  - Columns H-J: Deputy Principal (Male, Female, Totals)
  - Columns K-M: Care Givers (Male, Female, Totals)
- **Row 7:** Gender subheaders
  - E: Male, F: Female, G: Totals (Administrators)
  - H: Male, I: Female, J: Totals (Deputy Principal)
  - K: Male, L: Female, M: Totals (Care Givers)

### Data Structure

**School Types:**
1. Public (Rows 8-12)
2. Private (Rows 13-17)
3. Totals (Rows 18-22)

**Qualification Categories (for each school type):**
1. Graduate - Trained
2. Graduate - Untrained
3. Non-graduate - Trained
4. Non-graduate - Untrained
5. Unknown

### Input Cells vs Formula Cells

**Input Cells (user enters data):**
- Male columns: E, H, K
- Female columns: F, I, L

**Formula Cells (auto-calculated):**
- Total columns: G, J, M (all use SUM formulas)
- Totals rows (18-22): Sum corresponding Public + Private rows

### Detailed Row Mapping

| Row | Stage | Type | Qualification | Training Status |
|-----|-------|------|---------------|-----------------|
| 8   | Pre-schools & Daycares | Public | Graduate | Trained |
| 9   | Pre-schools & Daycares | Public | Graduate | Untrained |
| 10  | Pre-schools & Daycares | Public | Non-graduate | Trained |
| 11  | Pre-schools & Daycares | Public | Non-graduate | Untrained |
| 12  | Pre-schools & Daycares | Public | Unknown | - |
| 13  | Pre-schools & Daycares | Private | Graduate | Trained |
| 14  | Pre-schools & Daycares | Private | Graduate | Untrained |
| 15  | Pre-schools & Daycares | Private | Non-graduate | Trained |
| 16  | Pre-schools & Daycares | Private | Non-graduate | Untrained |
| 17  | Pre-schools & Daycares | Private | Unknown | - |
| 18  | Totals | Totals | Graduate | Trained |
| 19  | Totals | Totals | Graduate | Untrained |
| 20  | Totals | Totals | Non-graduate | Trained |
| 21  | Totals | Totals | Non-graduate | Untrained |
| 22  | Totals | Totals | Unknown | - |

**Total Input Fields Required:** 30 (3 roles × 2 genders × 5 qualification types for Public schools) + 30 (same for Private schools) = **60 input fields**

---

## TABLE B2: Qualifications & Training: Primary

**Location:** Rows 24-42
**Cell Range:** A24:M42

### Header Structure
- **Row 24:** Table title: "B2: Qualifications & Training: Primary" | Year: 2023-2024
- **Row 25:** Main column headers
  - Column A: Level
  - Column B: Type of School
  - Column C: Qualifications
  - Columns E-G: Principal (Male, Female, Totals)
  - Columns H-J: Deputy Principal (Male, Female, Totals)
  - Columns K-M: Teachers (Male, Female, Totals)
- **Row 26:** Gender subheaders
  - E: Male, F: Female, G: Totals (Principal)
  - H: Male, I: Female, J: Totals (Deputy Principal)
  - K: Male, L: Female, M: Totals (Teachers)

### Data Structure

**School Types:**
1. Public (Rows 27-31)
2. Private (Rows 32-36)
3. Totals (Rows 37-41)

**Qualification Categories (for each school type):**
1. Graduate - Trained
2. Graduate - Untrained
3. Non-graduate - Trained
4. Non-graduate - Untrained
5. Unknown

**Additional Field:**
- **Row 42:** "No. with at least a degree in leadership/management/Administration"
  - Spans columns B-D
  - Input cells: E (Male), F (Female)
  - Formula cell: G (Total)
  - Additional formulas in H, I, J, M (various totals)

### Input Cells vs Formula Cells

**Input Cells (user enters data):**
- Male columns: E, H, K (for rows 27-36)
- Female columns: F, I, L (for rows 27-36)
- Row 42: E, F (for leadership/management degrees)

**Formula Cells (auto-calculated):**
- Total columns: G, J, M (all use SUM formulas)
- Totals rows (37-41): Sum corresponding Public + Private rows

### Detailed Row Mapping

| Row | Level | Type | Qualification | Training Status |
|-----|-------|------|---------------|-----------------|
| 27  | PRIMARY | Public | Graduate | Trained |
| 28  | PRIMARY | Public | Graduate | Untrained |
| 29  | PRIMARY | Public | Non-graduate | Trained |
| 30  | PRIMARY | Public | Non-graduate | Untrained |
| 31  | PRIMARY | Public | Unknown | - |
| 32  | PRIMARY | Private | Graduate | Trained |
| 33  | PRIMARY | Private | Graduate | Untrained |
| 34  | PRIMARY | Private | Non-graduate | Trained |
| 35  | PRIMARY | Private | Non-graduate | Untrained |
| 36  | PRIMARY | Private | Unknown | - |
| 37  | Totals | Totals | Graduate | Trained |
| 38  | Totals | Totals | Graduate | Untrained |
| 39  | Totals | Totals | Non-graduate | Trained |
| 40  | Totals | Totals | Non-graduate | Untrained |
| 41  | Totals | Totals | Unknown | - |
| 42  | - | Leadership/Management Degree | - | - |

**Total Input Fields Required:** 30 (3 roles × 2 genders × 5 qualification types for Public schools) + 30 (same for Private schools) + 2 (leadership degree) = **62 input fields**

---

## TABLE B3: Qualifications & Training: Secondary

**Location:** Rows 46-65
**Cell Range:** A46:M65

### Header Structure
- **Row 46:** Table title: "B3. Qualifications & Training: Secondary" | Year: 2023-2024
- **Row 47:** Main column headers
  - Column A: Level
  - Column B: Type of School
  - Column C: Qualifications
  - Columns E-G: Principal (Male, Female, Totals)
  - Columns H-J: Deputy Principal (Male, Female, Totals)
  - Columns K-M: Teachers (Male, Female, Totals)
- **Row 48:** Gender subheaders
  - E: Male, F: Female, G: Totals (Principal)
  - H: Male, I: Female, J: Totals (Deputy Principal)
  - K: Male, L: Female, M: Totals (Teachers)

### Data Structure

**School Types:**
1. Public (Rows 49-53)
2. Private (Rows 54-58)
3. Totals (Rows 59-64)

**Qualification Categories (for each school type):**
1. Graduate - Trained
2. Graduate - Untrained
3. Non-graduate - Trained
4. Non-graduate - Untrained
5. Unknown

**Additional Field:**
- **Row 65:** "No. with at least a degree in leadership/management/Administration"
  - Spans columns B-D
  - Input cells: E (Male), F (Female), H (Male), I (Female)
  - Formula cells: G (Principal Total), J (Deputy Principal Total)
  - Note: Contains hardcoded values in sample (E65: 3.0, F65: 5.0)

### Input Cells vs Formula Cells

**Input Cells (user enters data):**
- Male columns: E, H, K (for rows 49-58)
- Female columns: F, I, L (for rows 49-58)
- Row 65: E, F, H, I (for leadership/management degrees)

**Formula Cells (auto-calculated):**
- Total columns: G, J, M (all use SUM formulas)
- Totals rows (59-64): Sum corresponding Public + Private rows
- Row 64: Grand totals for all qualification categories

### Detailed Row Mapping

| Row | Level | Type | Qualification | Training Status |
|-----|-------|------|---------------|-----------------|
| 49  | SECONDARY | Public | Graduate | Trained |
| 50  | SECONDARY | Public | Graduate | Untrained |
| 51  | SECONDARY | Public | Non-graduate | Trained |
| 52  | SECONDARY | Public | Non-graduate | Untrained |
| 53  | SECONDARY | Public | Unknown | - |
| 54  | SECONDARY | Private | Graduate | Trained |
| 55  | SECONDARY | Private | Graduate | Untrained |
| 56  | SECONDARY | Private | Non-graduate | Trained |
| 57  | SECONDARY | Private | Non-graduate | Untrained |
| 58  | SECONDARY | Private | Unknown | - |
| 59  | Totals | Totals | Graduate | Trained |
| 60  | Totals | Totals | Graduate | Untrained |
| 61  | Totals | Totals | Non-graduate | Trained |
| 62  | Totals | Totals | Non-graduate | Untrained |
| 63  | Totals | Totals | Unknown | - |
| 64  | - | Grand Total Row | - | - |
| 65  | - | Leadership/Management Degree | - | - |

**Total Input Fields Required:** 30 (3 roles × 2 genders × 5 qualification types for Public schools) + 30 (same for Private schools) + 4 (leadership degree for Principal & Deputy Principal) = **64 input fields**

---

## TABLE B4: Qualifications & Training: Post-secondary/Tertiary

**Location:** Rows 67-75
**Cell Range:** A67:L75

### Header Structure
- **Row 67:** Table title: "B4. Qualifications & Training: Post-secondary/Tertiary" | Subtitle: "National College (s)" | Year: 2023-2024
- **Row 68:** Main column headers
  - Column A: Stage
  - Column B: Type of School
  - Column C: Qualifications
  - Columns D-F: Principal (Male, Female, Totals)
  - Columns G-I: Deputy Principal (Male, Female, Totals)
  - Columns J-L: Teachers (Male, Female, Totals)
- **Row 69:** Gender subheaders
  - D: Male, E: Female, F: Totals (Principal)
  - G: Male, H: Female, I: Totals (Deputy Principal)
  - J: Male, K: Female, L: Totals (Teachers)

### Data Structure

**NOTE:** This table has a different column arrangement than B1-B3. It uses columns D-F, G-I, J-L instead of E-G, H-J, K-M.

**School Types:**
1. Public (Rows 70-71)
2. Private (Rows 72-73)
3. Totals (Rows 74-75)

**Qualification Categories (for each school type):**
1. Graduate
2. Non-graduate

**NOTE:** This table does NOT track "Trained/Untrained" status like the other tables, only Graduate vs Non-graduate.

### Input Cells vs Formula Cells

**Input Cells (user enters data):**
- Principal: D (Male), E (Female)
- Deputy Principal: G (Male), H (Female)
- Teachers: J (Male), K (Female)

**Formula Cells (auto-calculated):**
- Principal Total: F = SUM(D:E)
- Deputy Principal Total: I = SUM(G:H)
- Teachers Total: L = J+K (note: different formula pattern)

### Detailed Row Mapping

| Row | Stage | Type | Qualification |
|-----|-------|------|---------------|
| 70  | Post-Secondary/Tertiary | Public | Graduate |
| 71  | Post-Secondary/Tertiary | Public | Non-graduate |
| 72  | Post-Secondary/Tertiary | Private | Graduate |
| 73  | Post-Secondary/Tertiary | Private | Non-graduate |
| 74  | Totals | Totals | Graduate |
| 75  | Totals | Totals | Non-graduate |

**Total Input Fields Required:** 12 (3 roles × 2 genders × 2 qualification types for Public schools) + 12 (same for Private schools) = **24 input fields**

---

## TABLE B5: Teachers - Highest Academic Qualifications

**Location:** Rows 78-90
**Cell Range:** A78:M90

### Header Structure
- **Row 78:** Table title: "B5. Teachers: Highest Academic Qualifications" | Year: 2023-2024
- **Row 79:** Education stage headers
  - Column A: Stage/Qualification
  - Columns B-D: Pre-schools & Daycares (Male, Female, Total)
  - Columns E-G: Primary (Male, Female, Total)
  - Columns H-J: Secondary (Male, Female, Total)
  - Columns K-M: Post-secondary/Tertiary (Male, Female, Total - note: only Total shown in header)
- **Row 80:** Gender subheaders
  - B: Male, C: Female, D: Total (Pre-schools)
  - E: Male, F: Female, G: Total (Primary)
  - H: Male, I: Female, J: Total (Secondary)
  - K: Male, L: Female, M: Total (Post-secondary)

### Data Structure

**Academic Qualification Levels (Rows):**
1. Row 81: CSEC/O-Level
2. Row 82: CAPE/A-Levels
3. Row 83: Certificate
4. Row 84: Associate degree
5. Row 85: Bachelors degree
6. Row 86: Post-graduate degree
7. Row 87: Masters degree
8. Row 88: Other
9. Row 89: Unknown/Unavailable

**Row 90:** Total row (sums qualifications for Primary and Secondary only)

### Input Cells vs Formula Cells

**Input Cells (user enters data):**
- Pre-schools: B, C (Male, Female) for rows 81-89
- Primary: E, F (Male, Female) for rows 81-89
- Secondary: H, I (Male, Female) for rows 81-89
- Post-secondary: K, L (Male, Female) for rows 81-89

**Formula Cells (auto-calculated):**
- All Total columns (D, G, J, M) use SUM formulas
- Row 90: G = SUM(G81:G89), J = SUM(J81:J89)

### Column Layout

| Education Stage | Male Column | Female Column | Total Column |
|----------------|-------------|---------------|--------------|
| Pre-schools & Daycares | B | C | D |
| Primary | E | F | G |
| Secondary | H | I | J |
| Post-secondary/Tertiary | K | L | M |

**Total Input Fields Required:** 9 qualifications × 4 education stages × 2 genders = **72 input fields**

---

## TABLE B6: Specialist Teachers

**Location:** Rows 91-108
**Cell Range:** A91:E108

### Header Structure
- **Row 91:** Table title: "B6- Specialist Teachers" | Year: 2023-2024
- **Row 92:** Column headers
  - Columns A-B: Area of Specialization (merged)
  - Columns C-E: Primary Teachers (merged header)
- **Row 93:** Gender subheaders
  - Column C: M (Male)
  - Column D: F (Female)
  - Column E: T (Total)

### Data Structure

**Specialization Areas (Rows 94-107):**
1. Row 94: Agriculture
2. Row 95: French
3. Row 96: Home Economics
4. Row 97: I T (Information Technology)
5. Row 98: Music
6. Row 99: PE & Sports
7. Row 100: Plumbing
8. Row 101: Reading
9. Row 102: Spanish
10. Row 103: Special Education
11. Row 104: Threatre Arts (Theatre Arts)
12. Row 105: HFLE (Health and Family Life Education)
13. Row 106: (Blank - reserved for additional specialty)
14. Row 107: (Blank - reserved for additional specialty)

**Row 108:** Total row (sums all specializations)

### Input Cells vs Formula Cells

**Input Cells (user enters data):**
- Column C: Male count for each specialization
- Column D: Female count for each specialization

**Formula Cells (auto-calculated):**
- Column E: Total = SUM(C:D) for each row
- Row 108: C = SUM(C94:C107), D = SUM(D94:D107), E = SUM(C108:D108)

### Column Layout

| Column | Purpose |
|--------|---------|
| A-B | Specialization area name (merged) |
| C | Male teachers count |
| D | Female teachers count |
| E | Total (calculated) |

**Total Input Fields Required:** 14 specializations × 2 genders = **28 input fields**

---

## TABLE B7: Continuous Professional Development (CPD)

**Location:** Rows 111-115
**Cell Range:** A111:J115

### Header Structure
- **Row 111:** Table title: "B7: Continuous Professional Development (CPD)" | Year: 2023-2024 (Cell E111)

### Data Structure

**CPD Metrics (Rows 112-115):**

Each row contains a question spanning columns A-I (merged), with the input cell in column J.

1. **Row 112:** "Number of Primary school principals engaged in at least 24 number of hours CPD annually"
   - Input cell: J112

2. **Row 113:** "Number of Secondary school principals engaged in at least 24 number of hours CPD annually"
   - Input cell: J113

3. **Row 114:** "Number of Primary school teachers engaged in at least 24 number of hours CPD annually"
   - Input cell: J114

4. **Row 115:** "Number of Secondary school teachers engaged in at least 24 number of hours CPD annually"
   - Input cell: J115

### Input Cells vs Formula Cells

**Input Cells (user enters data):**
- Column J, Rows 112-115: Each cell accepts a numeric value

**Formula Cells:**
- None - all calculations are straightforward counts

### Column Layout

| Columns | Purpose |
|---------|---------|
| A-I | Question text (merged) |
| J | Numeric input (count of individuals) |

**Total Input Fields Required:** 4 CPD metrics = **4 input fields**

---

## Summary of All Input Fields

| Table | Description | Input Fields | Formula Fields | Special Notes |
|-------|-------------|--------------|----------------|---------------|
| B1 | Pre-schools Qualifications | 60 | ~30 totals | 3 roles: Administrators, Deputy Principal, Care Givers |
| B2 | Primary Qualifications | 62 | ~31 totals | 3 roles: Principal, Deputy Principal, Teachers + Leadership degree row |
| B3 | Secondary Qualifications | 64 | ~32 totals | 3 roles: Principal, Deputy Principal, Teachers + Leadership degree row |
| B4 | Post-secondary Qualifications | 24 | ~12 totals | 3 roles, but only 2 qualification levels (Graduate/Non-graduate) |
| B5 | Teachers Academic Qualifications | 72 | ~36 totals | 4 education stages × 9 qualification levels × 2 genders |
| B6 | Specialist Teachers | 28 | ~14 totals | 14 specialization areas × 2 genders |
| B7 | Continuous Professional Development | 4 | 0 | Simple count fields |

**GRAND TOTAL INPUT FIELDS: 314**
**GRAND TOTAL FORMULA FIELDS: ~155**

---

## Data Entry Form Requirements

### Form Organization Recommendation

1. **Tab 1: Pre-schools (B1)**
   - Group by: School Type (Public/Private)
   - Sub-group by: Qualification Level
   - Input grid: 3 roles × 2 genders

2. **Tab 2: Primary (B2)**
   - Group by: School Type (Public/Private)
   - Sub-group by: Qualification Level
   - Input grid: 3 roles × 2 genders
   - Additional section: Leadership/Management degrees

3. **Tab 3: Secondary (B3)**
   - Group by: School Type (Public/Private)
   - Sub-group by: Qualification Level
   - Input grid: 3 roles × 2 genders
   - Additional section: Leadership/Management degrees

4. **Tab 4: Post-secondary (B4)**
   - Group by: School Type (Public/Private)
   - Sub-group by: Qualification Level (Graduate/Non-graduate only)
   - Input grid: 3 roles × 2 genders

5. **Tab 5: Teacher Qualifications (B5)**
   - Grid layout: 9 qualification levels (rows) × 4 education stages (columns) × 2 genders
   - Possibly split into 4 sub-tabs by education stage for better UX

6. **Tab 6: Specialist Teachers (B6)**
   - Simple list: 14 specialization areas × 2 gender columns

7. **Tab 7: Professional Development (B7)**
   - Simple form: 4 numeric fields

### Validation Rules

1. **All numeric fields:** Must be non-negative integers
2. **Total fields:** Auto-calculated, read-only
3. **Required fields:** Consider making all input fields required OR allow 0 as valid
4. **Data consistency:** Public + Private should equal Totals (this happens via formulas)

### Cell Reference Mapping for Excel Export

Each input field should map to its exact Excel cell reference for accurate data export back to the template.

---

## Notes for Development

1. **Merged Cells:** Many headers use merged cells. The export function needs to handle this correctly.

2. **Formula Preservation:** When exporting back to Excel, preserve all formula cells exactly as they appear in the template.

3. **Column Alignment:** Note that B4 uses a different column arrangement (D-F, G-I, J-L) compared to B1-B3 (E-G, H-J, K-M).

4. **Row Types:**
   - Header rows: Display only, no input
   - Data rows: User input cells + calculated totals
   - Total rows: All calculated, no user input
   - Additional fields (leadership degrees): Specific input pattern

5. **User Experience:** Consider providing tooltips with the definitions of "Trained" and "Graduate" throughout the form.

6. **Progress Tracking:** With 314 input fields, consider adding a progress indicator showing completion percentage.

7. **Data Validation:** Consider adding validation to ensure totals make logical sense (e.g., trained + untrained should be reasonable).
