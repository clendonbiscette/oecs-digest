"""
Check what data exists in academic year 10 (2021-2022)
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
print("COMPARING DATA IN DIFFERENT ACADEMIC YEARS")
print("=" * 80)
print()

# Check year 1 (2022-2023) - currently active
print("Academic Year ID 1 (2022-2023) - ACTIVE:")
print("-" * 80)
response1 = supabase.table('institutions').select('*').eq('academic_year_id', 1).execute()
if response1.data:
    sample = response1.data[0]
    total = (sample['daycare_public'] + sample['daycare_private_church'] +
             sample['preschool_public'] + sample['primary_public'] +
             sample['secondary_public'] + sample['post_secondary_public'])
    print(f"  Records: {len(response1.data)}")
    print(f"  Sample totals: {total}")
    print(f"  Daycare public: {sample['daycare_public']}")
    print(f"  Preschool public: {sample['preschool_public']}")
    print(f"  Primary public: {sample['primary_public']}")
print()

# Check year 10 (2021-2022)
print("Academic Year ID 10 (2021-2022):")
print("-" * 80)
response10 = supabase.table('institutions').select('*').eq('academic_year_id', 10).execute()
if response10.data:
    print(f"  Records: {len(response10.data)}")

    # Calculate totals
    total_daycare = 0
    total_preschool = 0
    total_primary = 0
    total_secondary = 0

    for inst in response10.data:
        total_daycare += inst['daycare_public'] + inst['daycare_private_church'] + inst['daycare_private_non_affiliated']
        total_preschool += inst['preschool_public'] + inst['preschool_private_church'] + inst['preschool_private_non_affiliated']
        total_primary += inst['primary_public'] + inst['primary_private_church'] + inst['primary_private_non_affiliated']
        total_secondary += inst['secondary_public'] + inst['secondary_private_church'] + inst['secondary_private_non_affiliated']

    print(f"  Total Daycare: {total_daycare}")
    print(f"  Total Preschool: {total_preschool}")
    print(f"  Total Primary: {total_primary}")
    print(f"  Total Secondary: {total_secondary}")
    print()

    print("  Sample record:")
    sample = response10.data[0]
    print(f"    Country ID: {sample['country_id']}")
    print(f"    Daycare public: {sample['daycare_public']}")
    print(f"    Preschool public: {sample['preschool_public']}")
    print(f"    Primary public: {sample['primary_public']}")

print()
print("=" * 80)
print("SOLUTION: Set academic year 2021-2022 (ID: 10) as active")
print("=" * 80)
