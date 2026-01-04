#!/usr/bin/env python3
"""Copy employees from employees2 to employees table to fix payroll foreign key"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text

def copy_employees_to_fix_payroll():
    try:
        with engine.connect() as connection:
            print("🔄 Copying employees from employees2 to employees table...")
            
            # Get employees from employees2
            result = connection.execute(text("SELECT * FROM employees2"))
            employees2_data = result.fetchall()
            
            if not employees2_data:
                print("❌ No employees found in employees2 table")
                return False
            
            # Get column names from cursor before fetching
            columns = list(result.keys())
            
            copied_count = 0
            for employee in employees2_data:
                # Create dict of column: value
                emp_dict = dict(zip(columns, employee))
                
                # Insert into employees table (skip if already exists)
                try:
                    # Build insert statement
                    cols_str = ', '.join(columns)
                    placeholders = ', '.join([f':{col}' for col in columns])
                    
                    connection.execute(
                        text(f"INSERT INTO employees ({cols_str}) VALUES ({placeholders})"),
                        emp_dict
                    )
                    copied_count += 1
                    print(f"  ✅ Copied employee ID: {emp_dict['id']}")
                    
                except Exception as e:
                    if "already exists" in str(e) or "duplicate key" in str(e):
                        print(f"  ⚠️ Employee ID {emp_dict['id']} already exists")
                    else:
                        print(f"  ❌ Error copying employee {emp_dict['id']}: {e}")
            
            connection.commit()
            print(f"✅ Successfully copied {copied_count} employees to employees table")
            
            # Verify the fix
            result = connection.execute(text("SELECT COUNT(*) FROM employees"))
            employees_count = result.fetchone()[0]
            
            result = connection.execute(text("SELECT COUNT(*) FROM employees2"))
            employees2_count = result.fetchone()[0]
            
            print(f"\n📊 Final Status:")
            print(f"  employees table: {employees_count} rows")
            print(f"  employees2 table: {employees2_count} rows")
            
            return True
            
    except Exception as e:
        print(f"❌ Error copying employees: {e}")
        return False

if __name__ == "__main__":
    copy_employees_to_fix_payroll()
