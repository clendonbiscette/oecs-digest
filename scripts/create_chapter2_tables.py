"""
Create missing Chapter 2 database tables in Supabase
Executes the staff demographics SQL file
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
print("CREATING CHAPTER 2 MISSING DATABASE TABLES")
print("=" * 80)
print()

# Read SQL file
sql_file = Path(__file__).parent.parent / 'supabase-staff-demographics-table.sql'
with open(sql_file, 'r', encoding='utf-8') as f:
    sql_content = f.read()

print(f"Read SQL file: {sql_file}")
print(f"File size: {len(sql_content)} characters")
print()

print("NOTE: This SQL needs to be executed manually in Supabase SQL Editor")
print("      due to API limitations with DDL statements.")
print()
print("INSTRUCTIONS:")
print("1. Go to your Supabase project dashboard")
print("2. Navigate to SQL Editor")
print("3. Create a new query")
print("4. Copy the contents of 'supabase-staff-demographics-table.sql'")
print("5. Run the query")
print()
print("Tables to be created:")
print("  - staff_age_distribution")
print("  - staff_years_of_service")
print()

# Try to check if tables already exist
print("Checking if tables already exist...")
print()

try:
    age_check = supabase.table('staff_age_distribution').select('id').limit(1).execute()
    print("[OK] staff_age_distribution table exists")
except Exception as e:
    print("[!] staff_age_distribution table does NOT exist - needs creation")

try:
    service_check = supabase.table('staff_years_of_service').select('id').limit(1).execute()
    print("[OK] staff_years_of_service table exists")
except Exception as e:
    print("[!] staff_years_of_service table does NOT exist - needs creation")

print()
print("=" * 80)
print("Please execute the SQL manually, then run the import script")
print("=" * 80)
