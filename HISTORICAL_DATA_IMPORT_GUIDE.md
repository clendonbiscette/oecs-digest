# Historical Data Import Guide

## Overview

This guide explains how to import historical OECS education data (2020-21, 2021-22, 2022-23) from Excel files into your Supabase database.

## Prerequisites

### 1. Environment Setup

Ensure you have `.env.local` file with:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Required Python Packages

```bash
pip install openpyxl python-dotenv supabase
```

### 3. Database Tables

Before importing, ensure all database tables are created in Supabase. Run these SQL files in your Supabase SQL Editor:

1. **Core Tables** (if not already done):
   ```sql
   -- Run: supabase-schema.sql
   ```

2. **Chapter-Specific Tables**:
   ```sql
   -- Run: supabase-staff-qualifications-table.sql (Chapter 2)
   -- Run: supabase-staff-demographics-table.sql (Chapter 2)
   -- Run: supabase-enrollment-table.sql (Chapter 3)
   -- Run: database_updates_internal_efficiency.sql (Chapter 4)
   -- Run: database_updates_systems_output.sql (Chapter 5)
   -- Run: database_updates_financial.sql (Chapter 6)
   ```

### 4. Historical Data Files

Verify all Excel files exist in:
```
DIGEST_WEB/Extracted Chapters/
├── Chapter 1/
│   ├── 2020-21.xlsx
│   ├── 2021-22.xlsx
│   └── 2022-23.xlsx
├── Chp 2/
│   ├── 2020-21.xlsx
│   ├── 2021-22.xlsx
│   └── 2022-23.xlsx
├── Chp3/ (Enrollment)
├── Chp 4/ (Internal Efficiency)
├── Chp5/ (Systems Output)
└── Chp 6/ (Financial)
```

## Import Scripts

### Individual Chapter Scripts

Each chapter has its own import script:

| Chapter | Script | Description |
|---------|--------|-------------|
| **Chapter 1** | `import_chapter1_historical.py` | Institutions by type and ownership |
| **Chapter 2** | `import_chapter2_complete.py` | Teachers, leaders, qualifications, age, service |
| **Chapter 3** | `import_chapter3_complete.py` | Student enrollment (all levels) |
| **Chapter 4** | `import_chapter4_complete.py` | Repeaters, dropouts, internal efficiency |
| **Chapter 5** | `import_chapter5_complete.py` | CSEC, CAPE, CCSLC exam results |
| **Chapter 6** | `import_chapter6_historical.py` | Financial data and budget allocation |

### Running Individual Imports

To import a specific chapter:

```bash
# Chapter 1 - Institutions
python scripts/import_chapter1_historical.py

# Chapter 2 - Teachers & Leaders
python scripts/import_chapter2_complete.py

# Chapter 3 - Enrollment
python scripts/import_chapter3_complete.py

# Chapter 4 - Internal Efficiency
python scripts/import_chapter4_complete.py

# Chapter 5 - Systems Output
python scripts/import_chapter5_complete.py

# Chapter 6 - Financial
python scripts/import_chapter6_historical.py
```

### Running All Imports (Recommended)

To import all chapters at once:

```bash
python scripts/import_all_chapters.py
```

This master script will:
1. Import all 6 chapters in sequence
2. Show progress for each chapter
3. Handle errors gracefully
4. Provide a final summary report

**Expected Output:**
```
================================================================================
        OECS EDUCATION DATA - MASTER IMPORT
================================================================================

Starting complete historical data import...
This will import data from 2020-21, 2021-22, and 2022-23

================================================================================
                    CHAPTER 1: INSTITUTIONS
================================================================================

  [OK] 2020-21 imported successfully
  [OK] 2021-22 imported successfully
  [OK] 2022-23 imported successfully

✓ Chapter 1 complete: 243 institutions records

[... continues for all chapters ...]

================================================================================
                        IMPORT SUMMARY
================================================================================

✓ Chapter 1: SUCCESS
  Records imported: 243
✓ Chapter 2: SUCCESS
  Records imported: 1,247
✓ Chapter 3: SUCCESS
  Records imported: 4,891
✓ Chapter 4: SUCCESS
  Records imported: 682
✓ Chapter 5: SUCCESS
  Records imported: 1,523
✓ Chapter 6: SUCCESS

Total chapters processed: 6
Successful: 6
Failed: 0
Time elapsed: 127.45 seconds

================================================================================
                      IMPORT COMPLETE
================================================================================

✓ All imports completed successfully!
Your Supabase database now contains historical data from 2020-2023.
```

## Data Coverage

### Years Imported
- **2020-2021** - Academic year ending 2021
- **2021-2022** - Academic year ending 2022
- **2022-2023** - Academic year ending 2023

### Countries Covered (9 OECS Member States)
- Anguilla (ANG)
- Antigua & Barbuda (ATG)
- Dominica (DMA)
- Grenada (GRD)
- Montserrat (MSR)
- St. Kitts & Nevis (KNA)
- St. Lucia (LCA)
- St. Vincent & the Grenadines (VCT)
- British Virgin Islands (VGB)

### Education Levels
- Early Childhood (Daycare, Preschool)
- Primary (K-Grade 6)
- Secondary (Forms 1-5)
- Post-Secondary/Tertiary
- TVET
- Special Education

## Database Tables Populated

After import completion, these tables will contain data:

### Chapter 1: Institutions
- `institutions`

### Chapter 2: Teachers & Leaders
- `staff_qualifications`
- `leadership_degree_holders`
- `teacher_academic_qualifications`
- `specialist_teachers`
- `professional_development`
- `staff_age_distribution`
- `staff_years_of_service`

### Chapter 3: Enrollment
- `student_enrollment`
- `early_childhood_enrollment`
- `primary_enrollment`
- `secondary_enrollment`
- `special_education_enrollment`

### Chapter 4: Internal Efficiency
- `dropouts`
- `repeaters` (if table exists)
- `school_management`

### Chapter 5: Systems Output
- `performance_grade_level`
- `performance_ccslc`
- `performance_csec`
- `performance_csec_trends`
- `performance_csec_five_plus`
- `performance_cape`

### Chapter 6: Financial
- `social_safety_net_programmes`
- `education_budget_allocation`
- `national_financial_context`
- `financial_data` (legacy)

## Troubleshooting

### Common Issues

#### 1. Missing Supabase Credentials
```
Error: Missing Supabase credentials in .env.local
```
**Solution**: Ensure `.env.local` exists with correct credentials.

#### 2. Table Does Not Exist
```
Error: relation "staff_qualifications" does not exist
```
**Solution**: Run the appropriate SQL file to create the table.

#### 3. File Not Found
```
[!] File not found: DIGEST_WEB/Extracted Chapters/Chp 2/2022-23.xlsx
```
**Solution**: Verify Excel files are in the correct directory.

#### 4. Country/Year Not Found
```
Error: Year 2020-2021 not found in database
```
**Solution**: Ensure `countries` and `academic_years` tables are seeded.

### Verifying Import Success

After import, verify data in Supabase:

```sql
-- Check institutions
SELECT COUNT(*) FROM institutions;
SELECT country_id, COUNT(*) FROM institutions GROUP BY country_id;

-- Check enrollment
SELECT COUNT(*) FROM student_enrollment;
SELECT education_level, COUNT(*) FROM student_enrollment GROUP BY education_level;

-- Check performance data
SELECT COUNT(*) FROM performance_csec;
SELECT COUNT(*) FROM performance_grade_level;

-- Check financial data
SELECT COUNT(*) FROM education_budget_allocation;
```

## Re-Running Imports

**Safe to re-run**: All import scripts use **delete-then-insert** pattern. Running them multiple times will:
1. Delete existing data for that year
2. Re-import fresh data from Excel

This means:
- ✓ No duplicate records
- ✓ Data stays current
- ✓ Safe to fix errors and retry

## Next Steps

After successful import:

1. **Verify Dashboard Data**: Open your dashboard and check that charts populate with historical trends
2. **Test AI Chat**: Ask questions about the data to verify AI integration
3. **Begin Live Data Entry**: Statisticians can now enter 2023-24 and 2024-25 data via web forms

## Support

If you encounter issues:
1. Check the error message in the console output
2. Verify all prerequisites are met
3. Check Supabase SQL Editor for table existence
4. Review the specific chapter import script for logic issues

## Script Architecture

Each import script follows this pattern:

```python
class ChapterXImporter:
    def __init__(self):
        # Connect to Supabase
        # Load country/year mappings

    def import_all_years(self):
        # Loop through 2020-21, 2021-22, 2022-23

    def import_year(self, file_path, year_label):
        # Load Excel workbook
        # Call table-specific import methods

    def import_table_X(self, wb, year_label):
        # Extract data from specific Excel table
        # Transform to database format
        # Delete existing data for this year
        # Insert new data

    def safe_int(self, value):
        # Safely convert Excel values to integers

    def print_summary(self):
        # Display import statistics
```

## Performance Notes

- **Average import time**: 5-10 minutes for all chapters
- **Records per chapter**: 200-5,000 depending on granularity
- **Network speed**: Depends on Supabase connection
- **Memory usage**: Low (processes one workbook at a time)

## Maintenance

### Adding New Years

To import new academic years (e.g., 2023-24):

1. Add Excel file: `DIGEST_WEB/Extracted Chapters/Chp X/2023-24.xlsx`
2. Update script year mapping:
   ```python
   years = {
       '2020-2021': '2020-21',
       '2021-2022': '2021-22',
       '2022-2023': '2022-23',
       '2023-2024': '2023-24'  # Add new year
   }
   ```
3. Re-run import script

### Modifying Imports

To customize data extraction:
1. Open the relevant chapter script
2. Locate the specific table import method
3. Adjust row/column mappings as needed
4. Test with one year before running all years

---

**Last Updated**: November 2024
**Version**: 1.0
**Author**: OECS Education Development Management Unit (EDMU)
