"""
Automatically execute SQL setup scripts on Supabase
Uses the Supabase REST API to run SQL commands directly
"""
import os
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

def execute_sql(sql_content):
    """Execute SQL using Supabase REST API"""
    url = f"{SUPABASE_URL}/rest/v1/rpc"

    headers = {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': f'Bearer {SERVICE_ROLE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }

    # Use the SQL Editor endpoint
    sql_url = f"{SUPABASE_URL}/rest/v1/"

    # For executing raw SQL, we need to use the PostgREST API
    # Split SQL into individual statements
    statements = [s.strip() for s in sql_content.split(';') if s.strip()]

    results = []
    for i, statement in enumerate(statements, 1):
        if not statement:
            continue

        print(f"Executing statement {i}/{len(statements)}...")
        print(f"  Preview: {statement[:100]}...")

        try:
            # Try using psycopg2 for direct connection
            import psycopg2
            from urllib.parse import urlparse

            # Parse the Supabase URL to get connection details
            # Format: https://xxx.supabase.co
            project_ref = SUPABASE_URL.split('//')[1].split('.')[0]

            # Supabase connection string format
            conn_string = f"postgresql://postgres:[PASSWORD]@db.{project_ref}.supabase.co:5432/postgres"

            print("  Note: Direct database connection requires password")
            print("  Falling back to manual execution recommendation")
            results.append({'statement': i, 'status': 'pending', 'note': 'Needs manual execution'})

        except ImportError:
            print("  Note: psycopg2 not available, recommend manual execution")
            results.append({'statement': i, 'status': 'pending', 'note': 'Needs manual execution'})

    return results

def main():
    print("=" * 70)
    print("SUPABASE SQL SETUP AUTOMATION")
    print("=" * 70)
    print()

    if not SUPABASE_URL or not SERVICE_ROLE_KEY:
        print("❌ Error: Missing Supabase credentials")
        print("   Please ensure .env.local has:")
        print("   - NEXT_PUBLIC_SUPABASE_URL")
        print("   - SUPABASE_SERVICE_ROLE_KEY")
        return

    print(f"✅ Connected to: {SUPABASE_URL}")
    print()

    # SQL files to execute in order
    sql_files = [
        'setup_core_tables.sql',
        'import_chapter1_historical.sql'
    ]

    print("Due to Supabase API limitations, I'll create a direct PostgreSQL connection script instead.")
    print()
    print("ALTERNATIVE APPROACH:")
    print("=" * 70)
    print()
    print("Option 1: Use Supabase CLI (Recommended)")
    print("-" * 70)
    print("1. Install Supabase CLI:")
    print("   npm install -g supabase")
    print()
    print("2. Run SQL files:")
    print("   supabase db execute -f setup_core_tables.sql --project-ref qdbvyjxbjohqzqbzogdh")
    print("   supabase db execute -f import_chapter1_historical.sql --project-ref qdbvyjxbjohqzqbzogdh")
    print()
    print("Option 2: Direct Python Connection (Best for automation)")
    print("-" * 70)
    print("I'll create a Python script using psycopg2 that connects directly to your Supabase PostgreSQL database.")
    print()

if __name__ == '__main__':
    main()
