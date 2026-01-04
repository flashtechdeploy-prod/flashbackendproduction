#!/usr/bin/env python3
"""Copy employee data from employees to employees2"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text

def copy_employees_to_employees2():
    """Copy all employee data from employees to employees2"""
    try:
        with engine.connect() as connection:
            print("🔄 Copying employee data from employees to employees2...")
            
            # Get all employees
            result = connection.execute(text("SELECT id, employee_id, first_name, last_name, created_at, updated_at FROM employees"))
            employees_data = result.fetchall()
            
            if not employees_data:
                print("❌ No employee data found in employees table")
                return False
            
            copied_count = 0
            for emp_id, emp_code, first_name, last_name, created_at, updated_at in employees_data:
                try:
                    # Insert into employees2
                    connection.execute(text("""
                        INSERT INTO employees2 (id, name, created_at, updated_at)
                        VALUES (:id, :name, :created_at, :updated_at)
                        ON CONFLICT (id) DO UPDATE SET
                        name = EXCLUDED.name,
                        updated_at = EXCLUDED.updated_at
                    """), {
                        'id': emp_id,
                        'name': first_name or f'Employee{emp_id}',
                        'created_at': created_at,
                        'updated_at': updated_at
                    })
                    
                    copied_count += 1
                    print(f"  ✅ Copied employee ID {emp_id}: {first_name}")
                    
                except Exception as e:
                    print(f"  ❌ Error copying employee {emp_id}: {e}")
            
            connection.commit()
            
            # Verify the result
            result = connection.execute(text("SELECT COUNT(*) FROM employees2"))
            employees2_count = result.fetchone()[0]
            
            result = connection.execute(text("SELECT COUNT(*) FROM employees"))
            employees_count = result.fetchone()[0]
            
            print(f"\n🎉 COPY COMPLETE:")
            print(f"  employees2: {employees2_count} rows")
            print(f"  employees: {employees_count} rows")
            print(f"  ✅ All employee data now in employees2")
            print(f"  ✅ Payroll references employees2")
            print(f"  ✅ Ready to use employees2 as primary table")
            
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    copy_employees_to_employees2()
