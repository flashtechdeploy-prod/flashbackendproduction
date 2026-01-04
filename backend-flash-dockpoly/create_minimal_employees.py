#!/usr/bin/env python3
"""Create minimal employee records to satisfy payroll foreign key constraints"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text

def create_minimal_employees_for_payroll():
    try:
        with engine.connect() as connection:
            print("🔄 Creating minimal employee records for payroll...")
            
            # Get all employee IDs from payroll that need to exist in employees table
            result = connection.execute(text("SELECT DISTINCT employee_db_id FROM payroll_sheet_entries"))
            payroll_employee_ids = [row[0] for row in result.fetchall()]
            
            if not payroll_employee_ids:
                print("✅ No payroll entries found - no action needed")
                return True
            
            print(f"📊 Found {len(payroll_employee_ids)} employee IDs in payroll: {payroll_employee_ids}")
            
            # Get corresponding data from employees2
            if payroll_employee_ids:
                id_list = ', '.join([str(id) for id in payroll_employee_ids])
                result = connection.execute(text(f"SELECT id, name FROM employees2 WHERE id IN ({id_list})"))
                employees2_data = result.fetchall()
                
                created_count = 0
                for emp_id, name in employees2_data:
                    try:
                        # Create minimal employee record with required fields
                        connection.execute(text("""
                            INSERT INTO employees (
                                id, employee_id, first_name, last_name, created_at, updated_at
                            ) VALUES (
                                :id, :employee_id, :first_name, :last_name, :created_at, :updated_at
                            ) ON CONFLICT (id) DO NOTHING
                        """), {
                            'id': emp_id,
                            'employee_id': f'EMP{emp_id:04d}',
                            'first_name': name or f'Employee{emp_id}',
                            'last_name': '',
                            'created_at': '2026-01-04 14:53:33+05',
                            'updated_at': None
                        })
                        
                        created_count += 1
                        print(f"  ✅ Created minimal employee record for ID: {emp_id}")
                        
                    except Exception as e:
                        if "already exists" in str(e):
                            print(f"  ⚠️ Employee ID {emp_id} already exists")
                        else:
                            print(f"  ❌ Error creating employee {emp_id}: {e}")
                
                connection.commit()
                print(f"✅ Successfully created {created_count} minimal employee records")
            
            # Verify the fix
            result = connection.execute(text("SELECT COUNT(*) FROM employees"))
            employees_count = result.fetchone()[0]
            
            print(f"\n📊 Final Status:")
            print(f"  employees table: {employees_count} rows")
            
            # Test if payroll foreign key is now satisfied
            result = connection.execute(text("SELECT employee_db_id, COUNT(*) FROM payroll_sheet_entries GROUP BY employee_db_id"))
            payroll_employees = result.fetchall()
            
            print(f"\n🔍 Payroll Foreign Key Test:")
            all_good = True
            for emp_id, count in payroll_employees:
                # Check if this employee exists in employees table
                check_result = connection.execute(text(f"SELECT COUNT(*) FROM employees WHERE id = {emp_id}"))
                exists = check_result.fetchone()[0] > 0
                status = "✅" if exists else "❌"
                if not exists:
                    all_good = False
                print(f"  {status} Employee ID {emp_id}: {count} payroll entries - {'Exists' if exists else 'Missing'}")
            
            if all_good:
                print(f"\n🎉 All payroll foreign key constraints are now satisfied!")
            else:
                print(f"\n⚠️ Some payroll entries still have missing employee references")
            
            return all_good
            
    except Exception as e:
        print(f"❌ Error creating employees: {e}")
        return False

if __name__ == "__main__":
    create_minimal_employees_for_payroll()
