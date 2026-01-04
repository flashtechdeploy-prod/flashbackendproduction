#!/usr/bin/env python3
"""Copy only common columns from employees2 to employees to fix payroll"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text

def copy_common_employee_data():
    try:
        with engine.connect() as connection:
            print("🔄 Copying common employee data from employees2 to employees...")
            
            # Common columns that exist in both tables
            common_columns = [
                'id', 'bank_accounts', 'blood_group', 'cnic', 'created_at', 
                'designation', 'discharge_cause', 'documents_handed_over_to', 
                'domicile', 'enrolled_as', 'eobi_no', 'father_name', 
                'interviewed_by', 'introduced_by', 'medical_category', 
                'payments', 'service_rank', 'social_security', 'updated_at', 
                'verified_by_khidmat_markaz'
            ]
            
            # Get employees from employees2
            result = connection.execute(text(f"SELECT {', '.join(common_columns)} FROM employees2"))
            employees2_data = result.fetchall()
            
            if not employees2_data:
                print("❌ No employees found in employees2 table")
                return False
            
            copied_count = 0
            for employee in employees2_data:
                # Create dict of column: value
                emp_dict = dict(zip(common_columns, employee))
                
                # Insert into employees table (skip if already exists)
                try:
                    # Build insert statement
                    cols_str = ', '.join(common_columns)
                    placeholders = ', '.join([f':{col}' for col in common_columns])
                    
                    connection.execute(
                        text(f"INSERT INTO employees ({cols_str}) VALUES ({placeholders}) ON CONFLICT (id) DO NOTHING"),
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
            print(f"✅ Successfully processed {copied_count} employees")
            
            # Verify the fix
            result = connection.execute(text("SELECT COUNT(*) FROM employees"))
            employees_count = result.fetchone()[0]
            
            result = connection.execute(text("SELECT COUNT(*) FROM employees2"))
            employees2_count = result.fetchone()[0]
            
            print(f"\n📊 Final Status:")
            print(f"  employees table: {employees_count} rows")
            print(f"  employees2 table: {employees2_count} rows")
            
            # Test if payroll foreign key is now satisfied
            result = connection.execute(text("SELECT employee_db_id, COUNT(*) FROM payroll_sheet_entries GROUP BY employee_db_id"))
            payroll_employees = result.fetchall()
            
            print(f"\n🔍 Payroll Foreign Key Test:")
            for emp_id, count in payroll_employees:
                # Check if this employee exists in employees table
                check_result = connection.execute(text(f"SELECT COUNT(*) FROM employees WHERE id = {emp_id}"))
                exists = check_result.fetchone()[0] > 0
                status = "✅" if exists else "❌"
                print(f"  {status} Employee ID {emp_id}: {count} payroll entries - {'Exists' if exists else 'Missing'}")
            
            return True
            
    except Exception as e:
        print(f"❌ Error copying employees: {e}")
        return False

if __name__ == "__main__":
    copy_common_employee_data()
