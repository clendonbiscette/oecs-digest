"""
Complete Chapter 1 import - add 2020-21 data to Supabase
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
print("COMPLETING CHAPTER 1 (INSTITUTIONS) IMPORT")
print("=" * 80)
print()

# Import the existing script
sys.path.append(str(Path(__file__).parent))
from import_chapter1_historical import Chapter1Importer

# Run the import
base_path = r'C:\Users\Clendon\oecs-education-dashboard\DIGEST_WEB\Extracted Chapters\Chapter 1'
importer = Chapter1Importer(base_path)
data = importer.import_all_years()

print(f"\n{len(data)} records extracted")
print()

# Get mappings
countries_response = supabase.table('countries').select('id, country_code').execute()
countries_map = {c['country_code']: c['id'] for c in countries_response.data}

years_response = supabase.table('academic_years').select('id, year_label').execute()
years_map = {y['year_label']: y['id'] for y in years_response.data}

print(f"Database has {len(countries_map)} countries and {len(years_map)} academic years")
print()

# Import only 2020-2021 records
success = 0
error = 0
skipped = 0

for record in data:
    country_code = record['country_code']
    year_label = record['academic_year']

    # Only import 2020-2021
    if year_label != '2020-2021':
        skipped += 1
        continue

    country_id = countries_map.get(country_code)
    year_id = years_map.get(year_label)

    if not country_id or not year_id:
        print(f"Skipping {country_code} {year_label} - not found in database")
        skipped += 1
        continue

    data_to_insert = {
        'country_id': country_id,
        'academic_year_id': year_id,
        'daycare_public': record.get('daycare_public', 0),
        'daycare_private_church': record.get('daycare_private_church', 0),
        'daycare_private_non_affiliated': record.get('daycare_private_non_affiliated', 0),
        'preschool_public': record.get('preschool_public', 0),
        'preschool_private_church': record.get('preschool_private_church', 0),
        'preschool_private_non_affiliated': record.get('preschool_private_non_affiliated', 0),
        'primary_public': record.get('primary_public', 0),
        'primary_private_church': record.get('primary_private_church', 0),
        'primary_private_non_affiliated': record.get('primary_private_non_affiliated', 0),
        'secondary_public': record.get('secondary_public', 0),
        'secondary_private_church': record.get('secondary_private_church', 0),
        'secondary_private_non_affiliated': record.get('secondary_private_non_affiliated', 0),
        'special_ed_public': record.get('special_ed_public', 0),
        'special_ed_private_church': record.get('special_ed_private_church', 0),
        'special_ed_private_non_affiliated': record.get('special_ed_private_non_affiliated', 0),
        'tvet_public': record.get('tvet_public', 0),
        'tvet_private_church': record.get('tvet_private_church', 0),
        'tvet_private_non_affiliated': record.get('tvet_private_non_affiliated', 0),
        'post_secondary_public': record.get('post_secondary_public', 0),
        'post_secondary_private': record.get('post_secondary_private', 0)
    }

    try:
        result = supabase.table('institutions').upsert(data_to_insert).execute()
        print(f"[OK] {country_code} 2020-2021")
        success += 1
    except Exception as e:
        print(f"[ERROR] {country_code} 2020-2021: {str(e)[:100]}")
        error += 1

print()
print("=" * 80)
print(f"IMPORT COMPLETE: {success} succeeded, {error} errors, {skipped} skipped")
print("=" * 80)

# Verify
final_count = supabase.table('institutions').select('id', count='exact').execute()
print(f"\nTotal institutions records: {final_count.count}")
