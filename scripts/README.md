# OECS Education Data Import Scripts

This directory contains Python scripts to import historical education data from Excel files into the Supabase database.

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r scripts/requirements.txt
   ```

2. **Set up environment variables:**

   Make sure your `.env.local` file contains:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

   ⚠️ **Important**: You need the `SUPABASE_SERVICE_ROLE_KEY` (not the anon key) for bulk imports.

   Find this in your Supabase dashboard:
   - Go to Project Settings → API
   - Copy the `service_role` key (keep it secret!)

## Running the Import

### Chapter 1: Institutions Data

Import institution counts for all 9 OECS countries across 3 academic years (2020-21, 2021-22, 2022-23):

```bash
python scripts/import_chapter1_institutions.py
```

This will:
- ✅ Create academic years 2020-2021, 2021-2022, 2022-2023 if they don't exist
- ✅ Parse data from `DIGEST_WEB/Extracted Chapters/Chapter 1/` Excel files
- ✅ Extract Early Childhood, Primary, Secondary, and Post-Secondary institution counts
- ✅ Insert ~27 records (9 countries × 3 years) into the `institutions` table
- ✅ Update your dashboard with real metrics

**Expected output:**
```
================================================================================
📊 IMPORTING CHAPTER 1: INSTITUTIONS DATA
================================================================================

📅 Checking academic years...
   ✓ Created: 2020-2021
   ✓ Created: 2021-2022
   ✓ Created: 2022-2023
   • Exists: 2023-2024

📂 Processing: 2022-23.xlsx
   Year: 2022-23
   📋 Parsing Table 1.1: Early Childhood...
      ✓ DOM: Daycare=14, Preschool=45
      ✓ GRD: Daycare=5, Preschool=104
      ...

💾 Inserting 27 records into institutions table...
   ✓ Inserted batch 1/1 (27 records)

✅ Successfully imported 27 institution records!
   📈 Data now available for dashboard visualization

================================================================================
✨ Import complete! Check your dashboard to see the real data.
================================================================================
```

## After Import

1. **Verify the import:**
   - Go to your Supabase dashboard → Table Editor → `institutions`
   - You should see records for 2020-2021, 2021-2022, and 2022-2023

2. **Check your dashboard:**
   - Visit `http://localhost:3000/dashboard`
   - The metrics should now show real data instead of zeros

3. **Check the home page:**
   - Visit `http://localhost:3000`
   - The "Total Institutions" card should show actual counts

## Troubleshooting

### Error: "Missing Supabase credentials"
- Make sure `.env.local` file exists in the project root
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set

### Error: "Country not found"
- Run the main schema setup first: `supabase-schema.sql`
- Ensure the `countries` table is populated with all 9 OECS member states

### Error: "Academic year not found"
- The script automatically creates academic years
- If this fails, check Supabase connection

### No data imported
- Check that Excel files exist in `DIGEST_WEB/Extracted Chapters/Chapter 1/`
- Verify files are named exactly: `2020-21.xlsx`, `2021-22.xlsx`, `2022-23.xlsx`

## Coming Soon

- Chapter 2: Staff Qualifications import
- Chapter 3: Student Enrollment import
- Chapter 4: Student Progression import
- Chapter 5: Student Performance import
- Chapter 6: Government Budget import
