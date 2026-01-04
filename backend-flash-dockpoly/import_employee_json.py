#!/usr/bin/env python3
"""Import employee data from JSON file to employees2 table"""

import sys
import os
import json
import re
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text

def import_employee_json():
    """Import employee data from JSON file"""
    try:
        # Read the JSON file
        json_file_path = "C:\\Users\\ahmed\\Desktop\\backend clone\\Active Employee Data - Sheet1.json"
        
        with open(json_file_path, 'r', encoding='utf-8') as f:
            employee_data = json.load(f)
        
        print(f"📂 Loaded {len(employee_data)} employee records from JSON")
        
        with engine.connect() as connection:
            imported_count = 0
            skipped_count = 0
            
            # Get current max ID from employees2
            result = connection.execute(text("SELECT COALESCE(MAX(id), 0) FROM employees2"))
            max_id = result.fetchone()[0]
            next_id = max_id + 1
            
            for i, employee in enumerate(employee_data):
                # Skip empty records
                if not employee.get('Name', '').strip():
                    skipped_count += 1
                    continue
                
                try:
                    # Clean and extract data
                    name = employee.get('Name', '').strip()
                    father_name = employee.get('Father\'s Name', '').strip()
                    salary = employee.get('Salary', '').strip()
                    rank = employee.get('Rank', [])
                    rank_str = rank[0] if rank and len(rank) > 0 else ''
                    status = employee.get('Status', [])
                    status_str = status[0] if status and len(status) > 0 else ''
                    unit = employee.get('Unit', [])
                    unit_str = unit[0] if unit and len(unit) > 0 else ''
                    blood_group = employee.get('Blood Gp', '').strip()
                    cnic = employee.get('CNIC #', '').strip()
                    mobile = employee.get('Mob #', '').strip()
                    domicile = employee.get('Domicile', '').strip()
                    
                    # Clean salary (remove commas and spaces)
                    if salary:
                        salary = re.sub(r'[,\s]', '', salary)
                    
                    # Insert into employees2
                    connection.execute(text("""
                        INSERT INTO employees2 (
                            id, name, father_name, salary, rank, status, unit, 
                            blood_group, cnic, mobile_number, domicile, created_at
                        ) VALUES (
                            :id, :name, :father_name, :salary, :rank, :status, :unit,
                            :blood_group, :cnic, :mobile, :domicile, :created_at
                        )
                    """), {
                        'id': next_id,
                        'name': name,
                        'father_name': father_name,
                        'salary': salary,
                        'rank': rank_str,
                        'status': status_str,
                        'unit': unit_str,
                        'blood_group': blood_group,
                        'cnic': cnic,
                        'mobile': mobile,
                        'domicile': domicile,
                        'created_at': '2026-01-04 15:00:00+05'
                    })
                    
                    imported_count += 1
                    next_id += 1
                    
                    if imported_count <= 5:  # Show first 5 imports
                        print(f"  ✅ Imported: {name} (ID: {next_id-1})")
                    
                except Exception as e:
                    print(f"  ❌ Error importing {name}: {e}")
                    skipped_count += 1
            
            connection.commit()
            
            # Verify the import
            result = connection.execute(text("SELECT COUNT(*) FROM employees2"))
            total_count = result.fetchone()[0]
            
            print(f"\n🎉 IMPORT COMPLETE:")
            print(f"  Total records in JSON: {len(employee_data)}")
            print(f"  Successfully imported: {imported_count}")
            print(f"  Skipped/Errors: {skipped_count}")
            print(f"  Total employees in database: {total_count}")
            print(f"  ✅ All employee data now in employees2 table")
            
            return True
            
    except FileNotFoundError:
        print(f"❌ File not found: {json_file_path}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error: {e}")
        return False
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

if __name__ == "__main__":
    import_employee_json()
