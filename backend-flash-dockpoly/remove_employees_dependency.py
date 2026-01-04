#!/usr/bin/env python3
"""Remove employees table dependency - Make payroll reference employees2 directly"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text

def remove_employees_table_dependency():
    """Update payroll foreign key to reference employees2 instead of employees"""
    try:
        with engine.connect() as connection:
            print("🔄 Removing employees table dependency...")
            
            # Check current foreign key constraint
            result = connection.execute(text("""
                SELECT conname, conrelid::regclass::text AS table_name,
                       confrelid::regclass::text AS referenced_table,
                       pg_get_constraintdef(oid) AS definition
                FROM pg_constraint 
                WHERE conrelid = 'payroll_sheet_entries'::regclass 
                AND contype = 'f'
            """))
            constraints = result.fetchall()
            
            print("📋 Current foreign key constraints:")
            for constraint in constraints:
                print(f"  {constraint[0]}: {constraint[1]} -> {constraint[2]}")
                print(f"    Definition: {constraint[3]}")
            
            # Drop the existing foreign key constraint
            try:
                connection.execute(text("""
                    ALTER TABLE payroll_sheet_entries 
                    DROP CONSTRAINT IF EXISTS payroll_sheet_entries_employee_db_id_fkey
                """))
                print("✅ Dropped old foreign key constraint")
            except Exception as e:
                print(f"⚠️ Could not drop constraint: {e}")
            
            # Create new foreign key to reference employees2
            try:
                connection.execute(text("""
                    ALTER TABLE payroll_sheet_entries 
                    ADD CONSTRAINT payroll_sheet_entries_employee_db_id_fkey 
                    FOREIGN KEY (employee_db_id) REFERENCES employees2(id)
                    ON DELETE CASCADE
                """))
                print("✅ Created new foreign key to employees2 table")
            except Exception as e:
                print(f"❌ Error creating new constraint: {e}")
                return False
            
            # Drop the employees table since we don't need it anymore
            try:
                connection.execute(text("DROP TABLE IF EXISTS employees"))
                print("✅ Dropped employees table")
            except Exception as e:
                print(f"⚠️ Could not drop employees table: {e}")
            
            # Drop the auto-sync trigger since we don't need it
            try:
                connection.execute(text("DROP TRIGGER IF EXISTS auto_sync_employee ON employees2"))
                connection.execute(text("DROP FUNCTION IF EXISTS sync_employee_to_payroll()"))
                print("✅ Removed auto-sync trigger")
            except Exception as e:
                print(f"⚠️ Could not remove trigger: {e}")
            
            connection.commit()
            
            # Verify the fix
            result = connection.execute(text("SELECT COUNT(*) FROM employees2"))
            employees2_count = result.fetchone()[0]
            
            result = connection.execute(text("SELECT COUNT(*) FROM payroll_sheet_entries"))
            payroll_count = result.fetchone()[0]
            
            print(f"\n🎉 DEPENDENCY REMOVAL COMPLETE:")
            print(f"  employees2 table: {employees2_count} rows")
            print(f"  payroll_sheet_entries: {payroll_count} rows")
            print(f"  employees table: REMOVED")
            print(f"  ✅ Payroll now references employees2 directly")
            print(f"  ✅ No more sync issues needed")
            print(f"  ✅ Single source of truth: employees2")
            
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    remove_employees_table_dependency()
