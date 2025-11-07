"""
MASTER IMPORT SCRIPT
Runs all chapter imports in sequence: Chapters 1-6
Imports all historical data (2020-21, 2021-22, 2022-23) into Supabase

Usage:
    python scripts/import_all_chapters.py

Requirements:
    - .env.local file with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
    - All database tables created in Supabase
    - Historical Excel files in DIGEST_WEB/Extracted Chapters/
"""

import sys
import time
from pathlib import Path

# Import all chapter importers
sys.path.append(str(Path(__file__).parent))

from import_chapter1_historical import Chapter1Importer
from import_chapter2_complete import Chapter2CompleteImporter
from import_chapter3_complete import Chapter3CompleteImporter
from import_chapter4_complete import Chapter4CompleteImporter
from import_chapter5_complete import Chapter5CompleteImporter
from import_chapter6_historical import Chapter6Importer

def print_banner(text):
    """Print a formatted banner"""
    width = 80
    print("\n" + "="*width)
    print(text.center(width))
    print("="*width + "\n")

def run_all_imports():
    """Run all chapter imports in sequence"""
    print_banner("OECS EDUCATION DATA - MASTER IMPORT")
    print("Starting complete historical data import...")
    print("This will import data from 2020-21, 2021-22, and 2022-23\n")

    start_time = time.time()
    results = {}

    # Chapter 1: Institutions
    try:
        print_banner("CHAPTER 1: INSTITUTIONS")
        importer1 = Chapter1Importer(
            Path(r'C:\Users\Clendon\oecs-education-dashboard\DIGEST_WEB\Extracted Chapters\Chapter 1')
        )
        data = importer1.import_all_years()
        results['Chapter 1'] = {'status': 'SUCCESS', 'records': len(data)}
        print(f"\n✓ Chapter 1 complete: {len(data)} institutions records\n")
    except Exception as e:
        results['Chapter 1'] = {'status': 'FAILED', 'error': str(e)}
        print(f"\n✗ Chapter 1 FAILED: {e}\n")

    # Chapter 2: Teachers & Leaders
    try:
        print_banner("CHAPTER 2: TEACHERS & LEADERS")
        importer2 = Chapter2CompleteImporter()
        importer2.import_all_years()
        total = sum(importer2.stats.values())
        results['Chapter 2'] = {'status': 'SUCCESS', 'records': total}
        print(f"\n✓ Chapter 2 complete: {total} staff records\n")
    except Exception as e:
        results['Chapter 2'] = {'status': 'FAILED', 'error': str(e)}
        print(f"\n✗ Chapter 2 FAILED: {e}\n")

    # Chapter 3: Enrollment
    try:
        print_banner("CHAPTER 3: STUDENT ENROLLMENT")
        importer3 = Chapter3CompleteImporter()
        importer3.import_all_years()
        total = importer3.stats['total_records']
        results['Chapter 3'] = {'status': 'SUCCESS', 'records': total}
        print(f"\n✓ Chapter 3 complete: {total} enrollment records\n")
    except Exception as e:
        results['Chapter 3'] = {'status': 'FAILED', 'error': str(e)}
        print(f"\n✗ Chapter 3 FAILED: {e}\n")

    # Chapter 4: Internal Efficiency
    try:
        print_banner("CHAPTER 4: INTERNAL EFFICIENCY")
        importer4 = Chapter4CompleteImporter()
        importer4.import_all_years()
        total = sum(importer4.stats.values())
        results['Chapter 4'] = {'status': 'SUCCESS', 'records': total}
        print(f"\n✓ Chapter 4 complete: {total} efficiency records\n")
    except Exception as e:
        results['Chapter 4'] = {'status': 'FAILED', 'error': str(e)}
        print(f"\n✗ Chapter 4 FAILED: {e}\n")

    # Chapter 5: Systems Output
    try:
        print_banner("CHAPTER 5: SYSTEMS OUTPUT")
        importer5 = Chapter5CompleteImporter()
        importer5.import_all_years()
        total = sum(importer5.stats.values())
        results['Chapter 5'] = {'status': 'SUCCESS', 'records': total}
        print(f"\n✓ Chapter 5 complete: {total} performance records\n")
    except Exception as e:
        results['Chapter 5'] = {'status': 'FAILED', 'error': str(e)}
        print(f"\n✗ Chapter 5 FAILED: {e}\n")

    # Chapter 6: Financial
    try:
        print_banner("CHAPTER 6: FINANCIAL DATA")
        importer6 = Chapter6Importer()
        importer6.import_all_years()
        results['Chapter 6'] = {'status': 'SUCCESS', 'records': 'N/A'}
        print(f"\n✓ Chapter 6 complete\n")
    except Exception as e:
        results['Chapter 6'] = {'status': 'FAILED', 'error': str(e)}
        print(f"\n✗ Chapter 6 FAILED: {e}\n")

    # Print summary
    elapsed = time.time() - start_time
    print_banner("IMPORT SUMMARY")

    success_count = sum(1 for r in results.values() if r['status'] == 'SUCCESS')
    failed_count = len(results) - success_count

    for chapter, result in results.items():
        status_icon = "✓" if result['status'] == 'SUCCESS' else "✗"
        print(f"{status_icon} {chapter}: {result['status']}")
        if result['status'] == 'SUCCESS' and 'records' in result:
            if result['records'] != 'N/A':
                print(f"  Records imported: {result['records']}")
        elif result['status'] == 'FAILED':
            print(f"  Error: {result.get('error', 'Unknown')}")

    print(f"\nTotal chapters processed: {len(results)}")
    print(f"Successful: {success_count}")
    print(f"Failed: {failed_count}")
    print(f"Time elapsed: {elapsed:.2f} seconds")

    print_banner("IMPORT COMPLETE")

    if failed_count > 0:
        print("\n⚠ WARNING: Some imports failed. Please check the errors above.")
        return False
    else:
        print("\n✓ All imports completed successfully!")
        print("Your Supabase database now contains historical data from 2020-2023.")
        return True

if __name__ == '__main__':
    print("="*80)
    print("OECS Education Statistical Digest - Historical Data Import".center(80))
    print("="*80)
    print("\nThis script will import all 6 chapters of historical data.")
    print("Estimated time: 5-10 minutes depending on data volume.\n")

    response = input("Proceed with import? (yes/no): ")

    if response.lower() in ['yes', 'y']:
        success = run_all_imports()
        sys.exit(0 if success else 1)
    else:
        print("\nImport cancelled.")
        sys.exit(0)
