"""
Test the exact query structure to see what's being returned
"""
import os
import sys
import io
import json
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

# Create Supabase client
supabase: Client = create_client(supabase_url, supabase_anon_key)

print("=" * 80)
print("DETAILED QUERY TEST")
print("=" * 80)
print()

# Get active year
response = supabase.from_('academic_years').select('id, year_label').eq('is_active', True).single().execute()
active_year = response.data
print(f"Active Year: {active_year['year_label']} (ID: {active_year['id']})")
print()

# Test the EXACT query from the data service
print("Testing query with countries join...")
print("-" * 80)
response = supabase.from_('institutions').select('''
    *,
    countries (
        country_code,
        country_name
    )
''').eq('academic_year_id', active_year['id']).execute()

print(f"Records returned: {len(response.data)}")
print()

if response.data:
    print("First record (RAW JSON):")
    print(json.dumps(response.data[0], indent=2, default=str))
    print()

    # Check if countries data is coming through
    first_record = response.data[0]
    print("Country data check:")
    print(f"  'countries' key exists: {'countries' in first_record}")
    print(f"  'countries' value: {first_record.get('countries')}")
    print()

    # Try to access country data different ways
    countries_data = first_record.get('countries')
    if countries_data:
        if isinstance(countries_data, dict):
            print(f"  Country Name: {countries_data.get('country_name', 'N/A')}")
            print(f"  Country Code: {countries_data.get('country_code', 'N/A')}")
        elif isinstance(countries_data, list) and len(countries_data) > 0:
            print(f"  Country Name: {countries_data[0].get('country_name', 'N/A')}")
            print(f"  Country Code: {countries_data[0].get('country_code', 'N/A')}")
    else:
        print("  ✗ No countries data in response!")
        print()
        print("Checking if country_id exists:")
        print(f"  country_id: {first_record.get('country_id')}")

        # Try direct country lookup
        if first_record.get('country_id'):
            country_response = supabase.from_('countries').select('*').eq('id', first_record.get('country_id')).single().execute()
            if country_response.data:
                print(f"  Direct lookup works: {country_response.data['country_name']}")

print()
print("=" * 80)
