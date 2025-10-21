"""
Set academic year 2021-2022 (ID: 10) as active since that's where the data is
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

supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
supabase: Client = create_client(supabase_url, supabase_key)

print("=" * 80)
print("SETTING 2021-2022 (ID: 10) AS ACTIVE")
print("=" * 80)
print()

# Set all to inactive
print("1. Setting all years to inactive...")
supabase.table('academic_years').update({'is_active': False}).neq('id', 0).execute()
print("   ✓ Done")
print()

# Set year 10 to active
print("2. Setting 2021-2022 (ID: 10) as active...")
response = supabase.table('academic_years').update({'is_active': True}).eq('id', 10).execute()
print("   ✓ Done")
print()

# Verify
print("3. Verifying...")
active = supabase.table('academic_years').select('*').eq('is_active', True).single().execute()
print(f"   Active year: {active.data['year_label']} (ID: {active.data['id']})")

# Check data count
inst_count = supabase.table('institutions').select('id').eq('academic_year_id', active.data['id']).execute()
print(f"   Institution records: {len(inst_count.data)}")

print()
print("=" * 80)
print("✓ COMPLETE - Dashboard should now show 2021-2022 data!")
print("=" * 80)
