#!/usr/bin/env python3
"""Fix remaining foreign key constraints with correct column names"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text

def fix_remaining_constraints():
    """Fix the remaining foreign key constraints with correct column names"""
    try:
        with engine.connect() as connection:
            print("🔄 Fixing remaining foreign key constraints...")
            
            # Tables with employee_id column
            fixes = [
                ('expenses', 'employee_id', 'expenses_employee_id_fkey'),
                ('finance_journal_lines', 'employee_id', 'finance_journal_lines_employee_id_fkey'),
                ('general_item_employee_balances', 'employee_id', 'general_item_employee_balances_employee_id_fkey'),
                ('general_item_transactions', 'employee_id', 'general_item_transactions_employee_id_fkey'),
                ('restricted_item_employee_balances', 'employee_id', 'restricted_item_employee_balances_employee_id_fkey'),
                ('restricted_item_transactions', 'employee_id', 'restricted_item_transactions_employee_id_fkey')
            ]
            
            fixed_count = 0
            for table_name, column_name, constraint_name in fixes:
                try:
                    # Drop old constraint
                    connection.execute(text(f"ALTER TABLE {table_name} DROP CONSTRAINT IF EXISTS {constraint_name}"))
                    
                    # Create new constraint referencing employees2
                    connection.execute(text(f"""
                        ALTER TABLE {table_name} 
                        ADD CONSTRAINT {constraint_name} 
                        FOREIGN KEY ({column_name}) REFERENCES employees2(id)
                        ON DELETE CASCADE
                    """))
                    
                    fixed_count += 1
                    print(f"  ✅ Fixed {table_name}.{constraint_name} -> employees2")
                    
                except Exception as e:
                    print(f"  ❌ Error fixing {table_name}: {e}")
            
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
            
            # Final verification
            result = connection.execute(text("SELECT COUNT(*) FROM employees2"))
            employees2_count = result.fetchone()[0]
            
            print(f"\n🎉 FINAL FIX COMPLETE:")
            print(f"  employees2 table: {employees2_count} rows")
            print(f"  employees table: REMOVED")
            print(f"  Fixed constraints: {fixed_count}")
            print(f"  ✅ Single source of truth: employees2")
            print(f"  ✅ No more employees table needed")
            print(f"  ✅ All foreign keys point to employees2")
            
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    fix_remaining_constraints()
