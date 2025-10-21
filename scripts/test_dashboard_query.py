"""
Test the exact query that the dashboard runs
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

# Get Supabase credentials - USING ANON KEY like dashboard does
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_anon_key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

print("=" * 80)
print("TESTING DASHBOARD QUERY WITH ANON KEY")
print("=" * 80)
print()

if not supabase_url or not supabase_anon_key:
    print("✗ Missing Supabase credentials")
    print(f"URL: {supabase_url[:30]}..." if supabase_url else "MISSING")
    print(f"Anon Key: {supabase_anon_key[:30]}..." if supabase_anon_key else "MISSING")
    sys.exit(1)

print(f"Using URL: {supabase_url}")
print(f"Using Anon Key: {supabase_anon_key[:20]}...")
print()

# Create Supabase client with ANON key (like the dashboard)
supabase: Client = create_client(supabase_url, supabase_anon_key)

# Step 1: Get active academic year
print("Step 1: Get active academic year")
print("-" * 80)
try:
    response = supabase.from_('academic_years').select('id, year_label').eq('is_active', True).single().execute()
    if response.data:
        active_year = response.data
        print(f"✓ Active Year: {active_year['year_label']} (ID: {active_year['id']})")
    else:
        print("✗ No active year found!")
        sys.exit(1)
except Exception as e:
    print(f"✗ ERROR: {e}")
    sys.exit(1)

print()

# Step 2: Get institutions for active year with country join
print("Step 2: Get institutions with country data")
print("-" * 80)
try:
    response = supabase.from_('institutions').select('''
        *,
        countries (
            country_code,
            country_name
        )
    ''').eq('academic_year_id', active_year['id']).execute()

    if response.data:
        print(f"✓ Found {len(response.data)} institution records")
        print()

        # Show first record in detail
        if response.data:
            inst = response.data[0]
            print("Sample Record:")
            print(f"  Country: {inst.get('countries', {}).get('country_name', 'N/A')}")
            print(f"  Country Code: {inst.get('countries', {}).get('country_code', 'N/A')}")
            print(f"  Daycare Public: {inst.get('daycare_public', 0)}")
            print(f"  Daycare Private Church: {inst.get('daycare_private_church', 0)}")
            print(f"  Daycare Private Non-Affiliated: {inst.get('daycare_private_non_affiliated', 0)}")
            daycare_total = inst.get('daycare_public', 0) + inst.get('daycare_private_church', 0) + inst.get('daycare_private_non_affiliated', 0)
            print(f"  → Total Daycare: {daycare_total}")
            print()

            preschool_total = inst.get('preschool_public', 0) + inst.get('preschool_private_church', 0) + inst.get('preschool_private_non_affiliated', 0)
            print(f"  Preschool Total: {preschool_total}")

            primary_total = inst.get('primary_public', 0) + inst.get('primary_private_church', 0) + inst.get('primary_private_non_affiliated', 0)
            print(f"  Primary Total: {primary_total}")

            secondary_total = inst.get('secondary_public', 0) + inst.get('secondary_private_church', 0) + inst.get('secondary_private_non_affiliated', 0)
            print(f"  Secondary Total: {secondary_total}")

            post_sec_total = inst.get('post_secondary_public', 0) + inst.get('post_secondary_private', 0)
            print(f"  Post-Secondary Total: {post_sec_total}")
            print()

        # Calculate totals across all countries
        print("Aggregated Totals Across All Countries:")
        print("-" * 80)
        total_daycare = 0
        total_preschool = 0
        total_primary = 0
        total_secondary = 0
        total_special_ed = 0
        total_tvet = 0
        total_post_sec = 0

        for inst in response.data:
            total_daycare += inst.get('daycare_public', 0) + inst.get('daycare_private_church', 0) + inst.get('daycare_private_non_affiliated', 0)
            total_preschool += inst.get('preschool_public', 0) + inst.get('preschool_private_church', 0) + inst.get('preschool_private_non_affiliated', 0)
            total_primary += inst.get('primary_public', 0) + inst.get('primary_private_church', 0) + inst.get('primary_private_non_affiliated', 0)
            total_secondary += inst.get('secondary_public', 0) + inst.get('secondary_private_church', 0) + inst.get('secondary_private_non_affiliated', 0)
            total_special_ed += inst.get('special_ed_public', 0) + inst.get('special_ed_private_church', 0) + inst.get('special_ed_private_non_affiliated', 0)
            total_tvet += inst.get('tvet_public', 0) + inst.get('tvet_private_church', 0) + inst.get('tvet_private_non_affiliated', 0)
            total_post_sec += inst.get('post_secondary_public', 0) + inst.get('post_secondary_private', 0)

        print(f"Early Childhood (Daycare + Preschool): {total_daycare + total_preschool}")
        print(f"  - Daycare: {total_daycare}")
        print(f"  - Preschool: {total_preschool}")
        print(f"K-12 Education (Primary + Secondary): {total_primary + total_secondary}")
        print(f"  - Primary: {total_primary}")
        print(f"  - Secondary: {total_secondary}")
        print(f"Higher Education: {total_post_sec}")
        print(f"Specialized (Special Ed + TVET): {total_special_ed + total_tvet}")
        print(f"  - Special Ed: {total_special_ed}")
        print(f"  - TVET: {total_tvet}")

    else:
        print("✗ No institutions found for active year!")

except Exception as e:
    print(f"✗ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print()
print("=" * 80)
print("✓ QUERY TEST COMPLETE")
print("=" * 80)
print()
print("If you see totals above but dashboard shows 0, the problem is:")
print("1. Vercel environment variables not set correctly")
print("2. RLS policies blocking anonymous access")
print("3. Dashboard not redeployed yet")
