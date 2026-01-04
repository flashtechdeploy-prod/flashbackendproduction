#!/usr/bin/env python3
"""Create all missing employee records to prevent payroll foreign key errors"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text

def create_all_missing_employees():
    try:
        with engine.connect() as connection:
            print("🔄 Creating all missing employee records...")
            
            # Get all employee IDs from employees2
            result = connection.execute(text("SELECT id, name, created_at, updated_at FROM employees2 ORDER BY id"))
            employees2_data = result.fetchall()
            
            # Get existing employee IDs in employees table
            result = connection.execute(text("SELECT id FROM employees"))
            existing_ids = {row[0] for row in result.fetchall()}
            
            created_count = 0
            for emp_id, name, created_at, updated_at in employees2_data:
                if emp_id not in existing_ids:
                    try:
                        connection.execute(text("""
                            INSERT INTO employees (
                                id, employee_id, first_name, last_name, created_at, updated_at
                            ) VALUES (
                                :id, :employee_id, :first_name, :last_name, :created_at, :updated_at
                            )
                        """), {
                            'id': emp_id,
                            'employee_id': f'EMP{emp_id:04d}',
                            'first_name': name or f'Employee{emp_id}',
                            'last_name': '',
                            'created_at': created_at or '2026-01-04 14:53:33+05',
                            'updated_at': updated_at
                        })
                        
                        created_count += 1
                        print(f"  ✅ Created employee ID {emp_id}: {name}")
                        
                    except Exception as e:
                        if "already exists" in str(e):
                            print(f"  ⚠️ Employee ID {emp_id} already exists")
                        else:
                            print(f"  ❌ Error creating employee {emp_id}: {e}")
                else:
                    print(f"  ⚪ Employee ID {emp_id} already exists")
            
            connection.commit()
            print(f"\n✅ Successfully created {created_count} employee records")
            
            # Final verification
            result = connection.execute(text("SELECT COUNT(*) FROM employees"))
            employees_count = result.fetchone()[0]
            
            result = connection.execute(text("SELECT COUNT(*) FROM employees2"))
            employees2_count = result.fetchone()[0]
            
            print(f"\n📊 Final Status:")
            print(f"  employees table: {employees_count} rows")
            print(f"  employees2 table: {employees2_count} rows")
            
            # Check if all payroll foreign keys are satisfied
            result = connection.execute(text("SELECT DISTINCT employee_db_id FROM payroll_sheet_entries"))
            payroll_ids = [row[0] for row in result.fetchall()]
            
            if payroll_ids:
                print(f"\n🔍 Payroll Foreign Key Check:")
                all_good = True
                for emp_id in payroll_ids:
                    result = connection.execute(text(f"SELECT COUNT(*) FROM employees WHERE id = {emp_id}"))
                    exists = result.fetchone()[0] > 0
                    status = "✅" if exists else "❌"
                    if not exists:
                        all_good = False
                    print(f"  {status} Employee ID {emp_id}: {'Exists' if exists else 'Missing'}")
                
                if all_good:
                    print(f"\n🎉 All payroll foreign key constraints are satisfied!")
                else:
                    print(f"\n⚠️ Some payroll entries still have missing employee references")
            else:
                print(f"\nℹ️ No payroll entries to check")
            
            return True
            
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False

if __name__ == "__main__":
    create_all_missing_employees()
