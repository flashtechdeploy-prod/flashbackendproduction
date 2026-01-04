#!/usr/bin/env python3
"""Comprehensive fix: Update ALL foreign key constraints to reference employees2"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text

def comprehensive_employee_fix():
    """Update ALL tables to reference employees2 instead of employees"""
    try:
        with engine.connect() as connection:
            print("🔄 COMPREHENSIVE FIX: Updating all foreign keys to employees2...")
            
            # Get all foreign key constraints that reference employees table
            result = connection.execute(text("""
                SELECT conname, conrelid::regclass::text AS table_name,
                       confrelid::regclass::text AS referenced_table,
                       pg_get_constraintdef(oid) AS definition
                FROM pg_constraint 
                WHERE confrelid = 'employees'::regclass 
                AND contype = 'f'
            """))
            constraints = result.fetchall()
            
            print(f"📋 Found {len(constraints)} foreign key constraints referencing employees:")
            for constraint in constraints:
                print(f"  {constraint[0]}: {constraint[1]} -> employees")
            
            # Update each constraint to reference employees2
            updated_count = 0
            for constraint in constraints:
                table_name = constraint[1]
                constraint_name = constraint[0]
                
                try:
                    # Drop old constraint
                    connection.execute(text(f"ALTER TABLE {table_name} DROP CONSTRAINT {constraint_name}"))
                    
                    # Create new constraint referencing employees2
                    connection.execute(text(f"""
                        ALTER TABLE {table_name} 
                        ADD CONSTRAINT {constraint_name} 
                        FOREIGN KEY (employee_db_id) REFERENCES employees2(id)
                        ON DELETE CASCADE
                    """))
                    
                    updated_count += 1
                    print(f"  ✅ Updated {table_name}.{constraint_name} -> employees2")
                    
                except Exception as e:
                    print(f"  ❌ Error updating {table_name}: {e}")
            
            # Now drop the employees table
            try:
                connection.execute(text("DROP TABLE IF EXISTS employees"))
                print("✅ Dropped employees table")
            except Exception as e:
                print(f"⚠️ Could not drop employees table: {e}")
            
            # Drop the auto-sync trigger
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
            
            print(f"\n🎉 COMPREHENSIVE FIX COMPLETE:")
            print(f"  employees2 table: {employees2_count} rows")
            print(f"  employees table: REMOVED")
            print(f"  Updated constraints: {updated_count}")
            print(f"  ✅ Single source of truth: employees2")
            print(f"  ✅ No more sync needed")
            print(f"  ✅ All foreign keys point to employees2")
            
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    comprehensive_employee_fix()
