"""
Quick diagnostic script to check what data exists in Supabase
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
    print(f"NEXT_PUBLIC_SUPABASE_URL: {'Found' if supabase_url else 'MISSING'}")
    print(f"SUPABASE_SERVICE_ROLE_KEY: {'Found' if supabase_key else 'MISSING'}")
    sys.exit(1)

# Create Supabase client
supabase: Client = create_client(supabase_url, supabase_key)

print("=" * 80)
print("SUPABASE DATABASE DIAGNOSTICS")
print("=" * 80)
print()

# Check academic years
print("1. ACADEMIC YEARS:")
print("-" * 80)
try:
    response = supabase.table('academic_years').select('*').order('start_year').execute()
    if response.data:
        for year in response.data:
            active = "✓ ACTIVE" if year['is_active'] else ""
            print(f"   {year['year_label']:15} (ID: {year['id']:2}) {active}")
    else:
        print("   ⚠ No academic years found!")
except Exception as e:
    print(f"   ✗ ERROR: {e}")
print()

# Check countries
print("2. COUNTRIES:")
print("-" * 80)
try:
    response = supabase.table('countries').select('id, country_code, country_name').order('country_name').execute()
    if response.data:
        print(f"   Found {len(response.data)} countries:")
        for country in response.data:
            print(f"   {country['country_code']:5} - {country['country_name']:30} (ID: {country['id']})")
    else:
        print("   ⚠ No countries found!")
except Exception as e:
    print(f"   ✗ ERROR: {e}")
print()

# Check institutions data
print("3. INSTITUTIONS DATA:")
print("-" * 80)
try:
    response = supabase.table('institutions').select('id, country_id, academic_year_id').execute()
    if response.data:
        print(f"   Found {len(response.data)} institution records")

        # Group by academic year
        by_year = {}
        for inst in response.data:
            year_id = inst['academic_year_id']
            if year_id not in by_year:
                by_year[year_id] = []
            by_year[year_id].append(inst)

        print(f"   Records by academic year:")
        for year_id, records in by_year.items():
            print(f"      Academic Year ID {year_id}: {len(records)} records")
    else:
        print("   ⚠ No institution data found!")
except Exception as e:
    print(f"   ✗ ERROR: {e}")
print()

# Check detailed data for active year
print("4. DETAILED CHECK - ACTIVE ACADEMIC YEAR:")
print("-" * 80)
try:
    # Get active year
    active_year_response = supabase.table('academic_years').select('*').eq('is_active', True).execute()

    if not active_year_response.data:
        print("   ✗ No active academic year found!")
        print("   This is the problem - dashboard queries for is_active=true")
        print()

        # Show what years exist
        all_years = supabase.table('academic_years').select('*').order('start_year', desc=True).execute()
        if all_years.data:
            print("   Available academic years:")
            for year in all_years.data:
                print(f"      {year['year_label']} (ID: {year['id']}, is_active: {year['is_active']})")
    else:
        active_year = active_year_response.data[0]
        print(f"   Active Year: {active_year['year_label']} (ID: {active_year['id']})")

        # Get institutions for active year
        inst_response = supabase.table('institutions').select('*').eq('academic_year_id', active_year['id']).execute()

        if inst_response.data:
            print(f"   ✓ Found {len(inst_response.data)} institution records for active year")

            # Show sample data
            if inst_response.data:
                print()
                print("   Sample record:")
                sample = inst_response.data[0]
                print(f"      Country ID: {sample['country_id']}")
                print(f"      Daycare total: {sample['daycare_public'] + sample['daycare_private_church'] + sample['daycare_private_non_affiliated']}")
                print(f"      Preschool total: {sample['preschool_public'] + sample['preschool_private_church'] + sample['preschool_private_non_affiliated']}")
                print(f"      Primary total: {sample['primary_public'] + sample['primary_private_church'] + sample['primary_private_non_affiliated']}")
        else:
            print(f"   ✗ No institution data for active year {active_year['year_label']}!")
            print()
            print("   Checking which years DO have data...")
            all_inst = supabase.table('institutions').select('academic_year_id').execute()
            year_ids = set(inst['academic_year_id'] for inst in all_inst.data)
            print(f"   Data exists for academic year IDs: {year_ids}")

except Exception as e:
    print(f"   ✗ ERROR: {e}")

print()
print("=" * 80)
print("DIAGNOSIS COMPLETE")
print("=" * 80)
