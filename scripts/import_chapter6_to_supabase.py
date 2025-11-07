"""
Import Chapter 6 data directly to Supabase using the API
"""
import os
import sys
import io
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Load environment variables
env_path = Path(__file__).parent.parent / '.env.local'
load_dotenv(dotenv_path=env_path)

# Get Supabase credentials
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not supabase_url or not supabase_key:
    print("ERROR: Missing Supabase credentials in .env.local")
    sys.exit(1)

# Create Supabase client
supabase: Client = create_client(supabase_url, supabase_key)

print("=" * 80)
print("IMPORTING CHAPTER 6 DATA TO SUPABASE")
print("=" * 80)
print()

# Re-run the import to get fresh data
sys.path.append(str(Path(__file__).parent))
from import_chapter6_historical import Chapter6Importer

# Import data
importer = Chapter6Importer()
importer.import_all_years()

print(f"\nProcessing {len(importer.data)} records...")
print()

# Get country and academic year mappings
countries_response = supabase.table('countries').select('id, country_code').execute()
countries_map = {c['country_code']: c['id'] for c in countries_response.data}

years_response = supabase.table('academic_years').select('id, year_label').execute()
years_map = {y['year_label']: y['id'] for y in years_response.data}

print(f"Found {len(countries_map)} countries: {list(countries_map.keys())}")
print(f"Found {len(years_map)} academic years: {list(years_map.keys())}")
print()

# Insert each record
success_count = 0
error_count = 0
skipped_count = 0

for record in importer.data:
    country_code = record['country_code']
    year_label = record['academic_year']

    # Get IDs
    country_id = countries_map.get(country_code)
    year_id = years_map.get(year_label)

    if not country_id:
        print(f"✗ Skipping {country_code} - country not found in database")
        skipped_count += 1
        continue

    if not year_id:
        print(f"✗ Skipping {year_label} - academic year not found in database")
        skipped_count += 1
        continue

    # Prepare data for insertion
    data = {
        'country_id': country_id,
        'academic_year_id': year_id,
        'national_budget_total': record.get('national_budget_total'),
        'national_budget_recurrent': record.get('national_budget_recurrent'),
        'national_budget_capital': record.get('national_budget_capital'),
        'gdp': record.get('gdp'),
        'education_budget_total': record.get('education_budget_total'),
        'education_budget_recurrent': record.get('education_budget_recurrent'),
        'education_budget_capital': record.get('education_budget_capital'),
        'education_pct_national_budget': record.get('education_pct_national_budget'),
        'education_pct_gdp': record.get('education_pct_gdp'),
        'allocation_early_childhood': record.get('allocation_early_childhood'),
        'allocation_primary': record.get('allocation_primary'),
        'allocation_secondary': record.get('allocation_secondary'),
        'allocation_special_ed': record.get('allocation_special_ed'),
        'allocation_post_secondary': record.get('allocation_post_secondary'),
        'allocation_tertiary': record.get('allocation_tertiary'),
        'allocation_other': record.get('allocation_other')
    }

    try:
        # Try to insert (will fail if exists due to unique constraint)
        result = supabase.table('financial_data').upsert(data).execute()
        budget_str = f"${data['national_budget_total']:,.0f}" if data['national_budget_total'] else "N/A"
        print(f"✓ {country_code} {year_label}: Budget={budget_str}")
        success_count += 1
    except Exception as e:
        print(f"✗ {country_code} {year_label}: Error - {str(e)[:100]}")
        error_count += 1

print()
print("=" * 80)
print(f"IMPORT COMPLETE")
print(f"  Succeeded: {success_count}")
print(f"  Failed: {error_count}")
print(f"  Skipped: {skipped_count}")
print(f"  Total: {len(importer.data)}")
print("=" * 80)

# Verify final count
final_count = supabase.table('financial_data').select('id', count='exact').execute()
print(f"\nTotal financial_data records in database: {final_count.count}")
