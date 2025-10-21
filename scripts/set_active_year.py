"""
Set 2022-2023 as the active academic year (since that's where our data is)
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
    print("ERROR: Missing Supabase credentials")
    sys.exit(1)

# Create Supabase client
supabase: Client = create_client(supabase_url, supabase_key)

print("=" * 80)
print("SETTING 2022-2023 AS ACTIVE ACADEMIC YEAR")
print("=" * 80)
print()

# First, set all years to inactive
print("1. Setting all academic years to inactive...")
try:
    response = supabase.table('academic_years').update({'is_active': False}).neq('id', 0).execute()
    print(f"   ✓ Updated all years to inactive")
except Exception as e:
    print(f"   ✗ ERROR: {e}")
    sys.exit(1)

# Then, set 2022-2023 to active
print()
print("2. Setting 2022-2023 as active...")
try:
    response = supabase.table('academic_years').update({'is_active': True}).eq('year_label', '2022-2023').execute()
    if response.data:
        print(f"   ✓ Set 2022-2023 (ID: {response.data[0]['id']}) as active")
    else:
        print("   ✗ Could not find 2022-2023 year")
        sys.exit(1)
except Exception as e:
    print(f"   ✗ ERROR: {e}")
    sys.exit(1)

# Verify
print()
print("3. Verifying active year...")
try:
    response = supabase.table('academic_years').select('*').eq('is_active', True).single().execute()
    if response.data:
        year = response.data
        print(f"   ✓ Active year is now: {year['year_label']} (ID: {year['id']})")

        # Check how many institutions for this year
        inst_response = supabase.table('institutions').select('id').eq('academic_year_id', year['id']).execute()
        count = len(inst_response.data) if inst_response.data else 0
        print(f"   ✓ This year has {count} institution records")
    else:
        print("   ✗ No active year found")
except Exception as e:
    print(f"   ✗ ERROR: {e}")

print()
print("=" * 80)
print("✓ COMPLETE - Dashboard should now display 2022-2023 data!")
print("=" * 80)
