#!/usr/bin/env python3
"""Check table schemas to understand the difference"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text, inspect

def check_table_schemas():
    inspector = inspect(engine)
    
    print('📋 employees table columns:')
    employees_cols = inspector.get_columns('employees')
    for col in employees_cols:
        print(f'  {col["name"]}: {col["type"]}')
    
    print(f'\n📋 employees2 table columns:')
    employees2_cols = inspector.get_columns('employees2')
    for col in employees2_cols[:15]:  # Show first 15
        print(f'  {col["name"]}: {col["type"]}')
    print(f'  ... and {len(employees2_cols) - 15} more columns')
    
    # Find common columns
    employees_col_names = {col["name"] for col in employees_cols}
    employees2_col_names = {col["name"] for col in employees2_cols}
    
    common_cols = employees_col_names & employees2_col_names
    employees_only = employees_col_names - employees2_col_names
    employees2_only = employees2_col_names - employees_col_names
    
    print(f'\n🔍 Column Comparison:')
    print(f'  Common columns: {len(common_cols)}')
    print(f'  Only in employees: {len(employees_only)}')
    print(f'  Only in employees2: {len(employees2_only)}')
    
    print(f'\n✅ Common columns (safe to copy):')
    for col in sorted(common_cols):
        print(f'  - {col}')

if __name__ == "__main__":
    check_table_schemas()
