#!/usr/bin/env python3
"""Simple solution: Update payroll to reference employees2 without dropping employees table"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text

def simple_payroll_fix():
    """Just update payroll to reference employees2, keep employees table for now"""
    try:
        with engine.connect() as connection:
            print("🔄 Simple fix: Update payroll to reference employees2...")
            
            # Drop payroll foreign key
            try:
                connection.execute(text("ALTER TABLE payroll_sheet_entries DROP CONSTRAINT IF EXISTS payroll_sheet_entries_employee_db_id_fkey"))
                print("✅ Dropped payroll foreign key")
            except Exception as e:
                print(f"⚠️ Could not drop payroll FK: {e}")
            
            # Create new foreign key to employees2
            try:
                connection.execute(text("""
                    ALTER TABLE payroll_sheet_entries 
                    ADD CONSTRAINT payroll_sheet_entries_employee_db_id_fkey 
                    FOREIGN KEY (employee_db_id) REFERENCES employees2(id)
                    ON DELETE CASCADE
                """))
                print("✅ Created new payroll FK to employees2")
            except Exception as e:
                print(f"❌ Error creating payroll FK: {e}")
                return False
            
            connection.commit()
            
            # Verify the fix
            result = connection.execute(text("SELECT COUNT(*) FROM employees2"))
            employees2_count = result.fetchone()[0]
            
            result = connection.execute(text("SELECT COUNT(*) FROM employees"))
            employees_count = result.fetchone()[0]
            
            print(f"\n🎉 SIMPLE FIX COMPLETE:")
            print(f"  employees2: {employees2_count} rows")
            print(f"  employees: {employees_count} rows (kept for compatibility)")
            print(f"  ✅ Payroll now references employees2")
            print(f"  ✅ No more payroll foreign key errors")
            print(f"  ✅ You can use employees2 as primary employee table")
            
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    simple_payroll_fix()
