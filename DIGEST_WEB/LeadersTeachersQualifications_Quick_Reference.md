# LeadersTeachersQualifications - Quick Reference Guide

## File Information
- **Excel File:** `Blank OECS MS Template.xlsx`
- **Worksheet:** `LeadersTeachersQualifications`
- **Year:** 2023-2024
- **Total Tables:** 7 (B1-B7)
- **Total Input Fields:** 314
- **Total Calculated Fields:** ~155

---

## Table Summary

### B1: Pre-schools Qualifications (Rows 5-22)
**Roles:** Administrators, Deputy Principal, Care Givers
**School Types:** Public, Private, Totals
**Qualifications:** Graduate-Trained, Graduate-Untrained, Non-graduate-Trained, Non-graduate-Untrained, Unknown

```
Columns: E-G (Administrators) | H-J (Deputy Principal) | K-M (Care Givers)
Each role: Male | Female | Total
Input Fields: 60
```

---

### B2: Primary Qualifications (Rows 24-42)
**Roles:** Principal, Deputy Principal, Teachers
**School Types:** Public, Private, Totals
**Qualifications:** Graduate-Trained, Graduate-Untrained, Non-graduate-Trained, Non-graduate-Untrained, Unknown
**Additional:** Leadership/Management Degree (Row 42)

```
Columns: E-G (Principal) | H-J (Deputy Principal) | K-M (Teachers)
Each role: Male | Female | Total
Input Fields: 62 (60 + 2 for leadership)
```

---

### B3: Secondary Qualifications (Rows 46-65)
**Roles:** Principal, Deputy Principal, Teachers
**School Types:** Public, Private, Totals
**Qualifications:** Graduate-Trained, Graduate-Untrained, Non-graduate-Trained, Non-graduate-Untrained, Unknown
**Additional:** Leadership/Management Degree (Row 65) - for Principal AND Deputy Principal

```
Columns: E-G (Principal) | H-J (Deputy Principal) | K-M (Teachers)
Each role: Male | Female | Total
Input Fields: 64 (60 + 4 for leadership)
```

---

### B4: Post-secondary/Tertiary Qualifications (Rows 67-75)
**Roles:** Principal, Deputy Principal, Teachers
**School Types:** Public, Private, Totals
**Qualifications:** Graduate, Non-graduate (NO Trained/Untrained distinction)

```
Columns: D-F (Principal) | G-I (Deputy Principal) | J-L (Teachers)
                ^^^ NOTE: Different column arrangement than B1-B3 ^^^
Each role: Male | Female | Total
Input Fields: 24
```

---

### B5: Teachers - Highest Academic Qualifications (Rows 78-90)
**Education Stages:** Pre-schools & Daycares, Primary, Secondary, Post-secondary/Tertiary
**Qualification Levels:**
1. CSEC/O-Level
2. CAPE/A-Levels
3. Certificate
4. Associate degree
5. Bachelors degree
6. Post-graduate degree
7. Masters degree
8. Other
9. Unknown/Unavailable

```
Layout: 9 qualification rows × 4 education stages × 2 genders

Columns:
B-D: Pre-schools (Male | Female | Total)
E-G: Primary (Male | Female | Total)
H-J: Secondary (Male | Female | Total)
K-M: Post-secondary/Tertiary (Male | Female | Total)

Input Fields: 72 (9 × 4 × 2)
```

---

### B6: Specialist Teachers (Rows 91-108)
**Specialization Areas (14 total):**
1. Agriculture
2. French
3. Home Economics
4. I T (Information Technology)
5. Music
6. PE & Sports
7. Plumbing
8. Reading
9. Spanish
10. Special Education
11. Theatre Arts
12. HFLE (Health and Family Life Education)
13. (Reserved - Additional Specialty 1)
14. (Reserved - Additional Specialty 2)

```
Columns: A (Specialization) | C (Male) | D (Female) | E (Total)
Input Fields: 28 (14 × 2)
```

---

### B7: Continuous Professional Development - CPD (Rows 111-115)
**Metrics (4 total):**
1. Primary school principals - 24+ hours CPD annually
2. Secondary school principals - 24+ hours CPD annually
3. Primary school teachers - 24+ hours CPD annually
4. Secondary school teachers - 24+ hours CPD annually

```
Layout: Simple list with 4 numeric input fields
Input Cell Column: J
Input Fields: 4
```

---

## Column Patterns

### Tables B1, B2, B3 (Standard Pattern)
```
A: Stage/Level
B: Type of School
C: Qualifications
D: Training Status (merged with C)
E-G: Role 1 (Male | Female | Total)
H-J: Role 2 (Male | Female | Total)
K-M: Role 3 (Male | Female | Total)
```

### Table B4 (Different Pattern)
```
A: Stage
B: Type of School
C: Qualifications
D-F: Principal (Male | Female | Total)
G-I: Deputy Principal (Male | Female | Total)
J-L: Teachers (Male | Female | Total)
```

### Table B5 (Grid Pattern)
```
A: Qualification Level
B-D: Pre-schools (M | F | T)
E-G: Primary (M | F | T)
H-J: Secondary (M | F | T)
K-M: Post-secondary (M | F | T)
```

### Table B6 (Simple List)
```
A: Specialization Area
C: Male Count
D: Female Count
E: Total (calculated)
```

### Table B7 (Question List)
```
A-I: Question Text (merged)
J: Numeric Input
```

---

## Data Entry Flow Recommendation

### Phase 1: Pre-schools & Primary
1. **B1 - Pre-schools** (60 fields)
   - Public schools: 15 fields × 2 genders = 30
   - Private schools: 15 fields × 2 genders = 30

2. **B2 - Primary** (62 fields)
   - Public schools: 15 fields × 2 genders = 30
   - Private schools: 15 fields × 2 genders = 30
   - Leadership degrees: 2 fields

### Phase 2: Secondary & Post-secondary
3. **B3 - Secondary** (64 fields)
   - Public schools: 15 fields × 2 genders = 30
   - Private schools: 15 fields × 2 genders = 30
   - Leadership degrees: 4 fields

4. **B4 - Post-secondary** (24 fields)
   - Public schools: 6 fields × 2 genders = 12
   - Private schools: 6 fields × 2 genders = 12

### Phase 3: Teacher Details
5. **B5 - Academic Qualifications** (72 fields)
   - Consider splitting into 4 sub-sections by education stage
   - Or present as a large grid (9 rows × 8 columns)

6. **B6 - Specialist Teachers** (28 fields)
   - Simple list format
   - Could allow adding custom specializations

### Phase 4: Professional Development
7. **B7 - CPD Metrics** (4 fields)
   - Quick 4-field form

---

## Form Field Types

### Numeric Input Fields
- **Type:** Integer (non-negative)
- **Min:** 0
- **Max:** Reasonable limit (e.g., 9999)
- **Default:** Empty or 0 (based on requirements)

### Calculated/Formula Fields
- **Type:** Read-only display
- **Display:** Show calculated value
- **Style:** Distinguished styling (gray background, italic, etc.)

### Required vs Optional
- **Decision needed:** Are all fields required, or can some be left blank?
- **Recommendation:** Allow 0 as valid, make all fields "required" to ensure completeness

---

## Important Notes for Development

### 1. Cell Reference Accuracy
- B1-B3 use columns E-M
- B4 uses columns D-L (shifted left by 1)
- Must map correctly when writing back to Excel

### 2. Formula Preservation
- All "Total" columns contain formulas
- "Totals" rows contain formulas
- These must be preserved exactly when exporting

### 3. Merged Cells
- Many header cells are merged
- Export function must handle merged cell ranges correctly
- See analysis document for complete merged cell list

### 4. Data Validation
- Male + Female should equal Total (via formula)
- Public + Private should equal Totals (via formula)
- Consider frontend validation before allowing save

### 5. User Experience Enhancements
- **Progress indicator:** Show "150/314 fields completed"
- **Section navigation:** Allow jumping between tables
- **Tooltips:** Provide definitions for "Trained" and "Graduate"
- **Save draft:** Allow partial completion and return later
- **Validation warnings:** Alert if data seems unusual (e.g., all zeros)

### 6. Definitions to Display
Include these key definitions prominently:
- **Trained Teacher:** One who has successfully completed a course of study in the methodology and content of teaching at an accredited institution
- **Graduate Teacher:** One who has attained at least an undergraduate degree from an accredited institution

---

## Testing Checklist

- [ ] All 314 input fields map to correct Excel cells
- [ ] All ~155 formula fields are preserved and calculate correctly
- [ ] Public + Private = Totals (verified via formulas)
- [ ] Male + Female = Total (verified via formulas)
- [ ] B4 column mapping (D-L) is correct (not E-M)
- [ ] B5 grid layout works correctly (9 × 4 × 2)
- [ ] B6 specialty list includes all 14 areas
- [ ] B7 CPD fields accept numeric values
- [ ] Merged cells export correctly
- [ ] Excel file opens correctly after export
- [ ] All formulas still work in exported Excel file

---

## JSON Mapping File

The complete cell mapping is available in:
`LeadersTeachersQualifications_CellMapping.json`

This file provides:
- Exact cell references for every input field
- Table structure definitions
- Role and column mappings
- Qualification level mappings
- Formula cell identification

Use this file for programmatic access to the worksheet structure.
