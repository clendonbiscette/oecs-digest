# Student Enrollment Worksheet Analysis Created

## Files Created

1. **StudentEnrollment_CellMapping.json** (6.0 KB)
   - Complete JSON mapping of all 8 enrollment tables
   - Cell references for all user input locations
   - Formula specifications for all calculated cells
   - Age groups and data entry patterns

## Analysis Summary

The Student Enrolment worksheet contains 8 comprehensive enrollment tables:

### Current Year (2023-24) - Required
- **Table D1: Early Childhood** (Rows 3-22) - 7 age groups
- **Table D2: Special Schools** (Rows 25-42) - 6 age groups
- **Table D3: Primary Schools** (Rows 45-79) - 14 ages × 7 grades
- **Table D4: Secondary Schools** (Rows 82-110) - 11 ages × 5 forms
- **Table D5: Post-Secondary** (Rows 113-145) - 13 ages × 5 programmes (National level)

### Historical Year (2022-23) - Optional
- **Table D6: Primary 2022-23** (Rows 150-184)
- **Table D7: Secondary 2022-23** (Rows 187-215)
- **Table D8: Post-Secondary 2022-23** (Rows 218-250)

## Key Features

### Gender Disaggregation
- All tables split enrollment data by Male/Female
- Males and Females sum to 'Both' column
- Enables gender parity analysis

### Public/Private Tracking
- Tables D1-D4, D6-D7: Separate PUBLIC and PRIVATE sections
- Tables D5, D8: NATIONAL level only

### Cross-Tabulation Matrices
- **Primary/Secondary**: Age × Grade/Form × Gender
- **Post-Secondary**: Age × Programme × Gender
- **Early Childhood/Special**: Age × Gender

### Automatic Calculations
- Row subtotals across grades/forms/programmes
- Column subtotals across all ages
- Gender subtotals (M + F = Both)
- Grand totals for each section

## Data Entry Summary

| Table | Data Rows | Age Groups | Categories | Input Cells |
|-------|-----------|-----------|------------|------------|
| D1 | 5-21 | 7 | N/A | 28 |
| D2 | 27-41 | 6 | N/A | 24 |
| D3 | 49-76 | 14 | 7 grades | 392 |
| D4 | 86-107 | 11 | 5 forms | 220 |
| D5 | 117-142 | 13 | 5 programmes | 130 |
| **TOTAL** | | | | **794** |

## For Form Development

1. Create separate tabs for Tables D1-D5 (current year)
2. Optional tab for Tables D6-D8 (historical)
3. Use dropdowns for age groups (mutually exclusive)
4. Radio buttons for Sex (M/F)
5. Column headers for Grades/Forms/Programmes
6. Auto-calculate all subtotals
7. Protect formula cells (read-only)
8. Validate non-negative integers only
9. Flag Age Unknown > 2%
10. Support year-over-year comparison

## Data Entry Pattern

**Row Pairing (consistent across all tables):**
- Odd rows = Males
- Even rows = Females
- Example: Row 49 (males < 5yr), Row 50 (females < 5yr), Row 51 (males 5yr), Row 52 (females 5yr)

## Reference

For complete technical details, see StudentEnrollment_CellMapping.json

