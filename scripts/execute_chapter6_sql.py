"""
Execute Chapter 6 SQL file in Supabase
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
print("EXECUTING CHAPTER 6 SQL IN SUPABASE")
print("=" * 80)
print()

# Read SQL file
sql_file = Path(__file__).parent.parent / 'import_chapter6_historical.sql'
with open(sql_file, 'r', encoding='utf-8') as f:
    sql_content = f.read()

print(f"Read SQL file: {sql_file}")
print(f"SQL file size: {len(sql_content)} characters")
print()

# Split into individual statements
statements = []
current_statement = []

for line in sql_content.split('\n'):
    # Skip comments
    if line.strip().startswith('--') or not line.strip():
        continue

    current_statement.append(line)

    if line.strip().endswith(';'):
        # Found end of statement
        stmt = '\n'.join(current_statement)
        if stmt.strip():
            statements.append(stmt)
        current_statement = []

print(f"Found {len(statements)} SQL statements to execute")
print()

# Execute each statement
success_count = 0
error_count = 0

for i, statement in enumerate(statements, 1):
    # Get a preview of the statement
    preview = statement.strip()[:100].replace('\n', ' ')

    try:
        # Execute via Supabase RPC or direct SQL
        result = supabase.rpc('exec_sql', {'sql': statement}).execute()
        success_count += 1
        print(f"[{i}/{len(statements)}] ✓ {preview}...")
    except Exception as e:
        # Try alternative: use postgrest API if RPC not available
        try:
            # For DDL statements (CREATE, ALTER), we need to use a different approach
            if any(keyword in statement.upper() for keyword in ['CREATE TABLE', 'CREATE INDEX', 'ALTER TABLE', 'DROP POLICY', 'CREATE POLICY', 'GRANT']):
                print(f"[{i}/{len(statements)}] ⚠ Skipping DDL (should be done manually): {preview}...")
                continue

            # For INSERT statements, parse and use table API
            if 'INSERT INTO financial_data' in statement:
                # This is an INSERT - we can't execute raw SQL via API
                # We need to parse it or use direct database connection
                print(f"[{i}/{len(statements)}] ⚠ Cannot execute INSERT via API: {preview}...")
                error_count += 1
            else:
                print(f"[{i}/{len(statements)}] ✗ Error: {str(e)[:50]}")
                error_count += 1
        except Exception as e2:
            print(f"[{i}/{len(statements)}] ✗ Error: {str(e2)[:50]}")
            error_count += 1

print()
print("=" * 80)
print(f"EXECUTION COMPLETE: {success_count} succeeded, {error_count} errors")
print("=" * 80)
print()
print("NOTE: You may need to execute the SQL manually in the Supabase SQL Editor")
print("      due to API limitations with DDL and complex statements.")
