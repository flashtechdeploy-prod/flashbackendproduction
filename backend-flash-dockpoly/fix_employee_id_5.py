#!/usr/bin/env python3
"""Create missing employee record for payroll foreign key fix"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text

def create_missing_employee():
    try:
        with engine.connect() as connection:
            # Get employee data from employees2 for ID 5
            result = connection.execute(text("SELECT * FROM employees2 WHERE id = 5"))
            employee_data = result.fetchone()
            
            if employee_data:
                # Get column names
                columns = list(result.keys())
                emp_dict = dict(zip(columns, employee_data))
                
                # Create minimal employee record in employees table
                try:
                    connection.execute(text("""
                        INSERT INTO employees (
                            id, employee_id, first_name, last_name, created_at, updated_at
                        ) VALUES (
                            :id, :employee_id, :first_name, :last_name, :created_at, :updated_at
                        )
                    """), {
                        'id': emp_dict['id'],
                        'employee_id': f'EMP{emp_dict["id"]:04d}',
                        'first_name': emp_dict.get('name', f'Employee{emp_dict["id"]}'),
                        'last_name': '',
                        'created_at': emp_dict.get('created_at', '2026-01-04 14:53:33+05'),
                        'updated_at': emp_dict.get('updated_at')
                    })
                    
                    connection.commit()
                    print(f'✅ Created employee record for ID {emp_dict["id"]} in employees table')
                    
                    # Verify the fix
                    result = connection.execute(text("SELECT COUNT(*) FROM employees WHERE id = 5"))
                    exists = result.fetchone()[0] > 0
                    print(f'🔍 Verification: Employee ID 5 {"exists" if exists else "missing"} in employees table')
                    
                except Exception as e:
                    print(f'❌ Error creating employee: {e}')
                    return False
            else:
                print('❌ Employee ID 5 not found in employees2 table')
                return False
                
            return True
            
    except Exception as e:
        print(f'❌ Database error: {e}')
        return False

if __name__ == "__main__":
    create_missing_employee()
