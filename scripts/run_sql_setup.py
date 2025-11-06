"""
Execute SQL setup scripts directly on Supabase database
Uses Supabase Python client with service role key for admin access
"""
import os
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent.parent / '.env.local'
load_dotenv(env_path)

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

def execute_sql_file(supabase: Client, file_path: str):
    """Execute a SQL file on Supabase"""
    print(f"\n{'=' * 70}")
    print(f"Executing: {Path(file_path).name}")
    print('=' * 70)

    # Read SQL file
    with open(file_path, 'r', encoding='utf-8') as f:
        sql_content = f.read()

    # Split into individual statements
    # Remove comments and split by semicolon
    statements = []
    current_statement = []

    for line in sql_content.split('\n'):
        # Skip comment lines
        if line.strip().startswith('--'):
            continue

        current_statement.append(line)

        # If line ends with semicolon, this is end of statement
        if line.strip().endswith(';'):
            statement = '\n'.join(current_statement).strip()
            if statement and not statement.startswith('--'):
                statements.append(statement)
            current_statement = []

    print(f"Found {len(statements)} SQL statements to execute")
    print()

    # Execute each statement
    success_count = 0
    error_count = 0

    for i, statement in enumerate(statements, 1):
        # Show preview of statement
        preview = statement[:80].replace('\n', ' ')
        if len(statement) > 80:
            preview += '...'

        print(f"[{i}/{len(statements)}] {preview}")

        try:
            # Execute SQL using Supabase RPC
            result = supabase.rpc('exec_sql', {'query': statement}).execute()
            print(f"  [OK] Success")
            success_count += 1
        except Exception as e:
            error_msg = str(e)

            # Check if this is a "already exists" error (which is OK)
            if 'already exists' in error_msg.lower():
                print(f"  [!] Already exists (skipping)")
                success_count += 1
            elif 'function exec_sql does not exist' in error_msg.lower():
                print(f"  [i] Note: Direct SQL execution via RPC not available")
                print(f"     This is normal - Supabase doesn't expose exec_sql by default")
                error_count += 1
                break
            else:
                print(f"  [X] Error: {error_msg[:100]}")
                error_count += 1

    print()
    print(f"Summary: {success_count} succeeded, {error_count} failed/skipped")

    return success_count, error_count

def main():
    print("=" * 70)
    print("SUPABASE SQL SETUP - AUTOMATED EXECUTION")
    print("=" * 70)
    print()

    if not SUPABASE_URL or not SERVICE_ROLE_KEY:
        print("[ERROR] Missing Supabase credentials")
        print("   Check that .env.local contains:")
        print("   - NEXT_PUBLIC_SUPABASE_URL")
        print("   - SUPABASE_SERVICE_ROLE_KEY")
        return

    print(f"[OK] Supabase URL: {SUPABASE_URL}")
    print(f"[OK] Using Service Role Key (admin access)")
    print()

    # Create Supabase client with service role key
    supabase: Client = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)

    # Project root directory
    project_root = Path(__file__).parent.parent

    # SQL files to execute (in order)
    sql_files = [
        project_root / 'setup_core_tables.sql',
        project_root / 'import_chapter1_historical.sql'
    ]

    total_success = 0
    total_errors = 0

    for sql_file in sql_files:
        if not sql_file.exists():
            print(f"[ERROR] File not found: {sql_file}")
            continue

        success, errors = execute_sql_file(supabase, sql_file)
        total_success += success
        total_errors += errors

        # If we got the "exec_sql not available" error, stop and show manual instructions
        if errors > 0:
            break

    print("\n" + "=" * 70)
    print("EXECUTION COMPLETE")
    print("=" * 70)
    print(f"Total: {total_success} succeeded, {total_errors} failed/skipped")
    print()

    if total_errors > 0:
        print("[!] Some statements couldn't be executed via API")
        print()
        print("MANUAL EXECUTION REQUIRED:")
        print("-" * 70)
        print("Please run these SQL files in Supabase SQL Editor:")
        print()
        for sql_file in sql_files:
            if sql_file.exists():
                print(f"  • {sql_file.name}")
        print()
        print("Steps:")
        print("1. Go to: https://supabase.com/dashboard/project/qdbvyjxbjohqzqbzogdh/sql/new")
        print("2. Copy contents of each SQL file")
        print("3. Paste into SQL Editor")
        print("4. Click 'Run' (or press Ctrl+Enter)")
        print()
        print("Files are located in:")
        print(f"  {project_root}")

if __name__ == '__main__':
    main()
