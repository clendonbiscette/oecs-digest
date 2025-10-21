"""
Apply RLS policy fixes to allow public dashboard access
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

# Get Supabase credentials - need service role for policy changes
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not supabase_url or not supabase_key:
    print("ERROR: Missing Supabase credentials")
    sys.exit(1)

# Create Supabase client
supabase: Client = create_client(supabase_url, supabase_key)

print("=" * 80)
print("APPLYING RLS POLICY FIXES FOR PUBLIC DASHBOARD ACCESS")
print("=" * 80)
print()

# Read the SQL file
sql_file = Path(__file__).parent.parent / 'fix-rls-for-public-dashboard.sql'
with open(sql_file, 'r', encoding='utf-8') as f:
    sql_content = f.read()

print("This will:")
print("  1. Drop restrictive SELECT policies that block anonymous users")
print("  2. Create new policies allowing public READ access to education data")
print("  3. Keep WRITE restrictions (only authenticated users can modify)")
print()

print("NOTE: You need to run this SQL in your Supabase SQL Editor")
print("      Python Supabase client doesn't support raw SQL execution")
print()
print("Instructions:")
print("  1. Go to your Supabase dashboard: https://supabase.com/dashboard")
print(f"  2. Select your project")
print("  3. Go to SQL Editor")
print("  4. Click 'New Query'")
print("  5. Copy and paste the contents of: fix-rls-for-public-dashboard.sql")
print("  6. Click 'Run'")
print()
print("=" * 80)
print("SQL FILE LOCATION:")
print(f"  {sql_file}")
print("=" * 80)
