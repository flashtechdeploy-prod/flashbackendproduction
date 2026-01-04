#!/usr/bin/env python3
"""Check current database status"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text

with engine.connect() as connection:
    # Check current status
    try:
        result = connection.execute(text("SELECT COUNT(*) FROM employees2"))
        employees2_count = result.fetchone()[0]
        
        result = connection.execute(text("SELECT COUNT(*) FROM employees"))
        employees_count = result.fetchone()[0]
        
        print('📊 Current Status:')
        print(f'  employees2: {employees2_count} rows')
        print(f'  employees: {employees_count} rows')
        
        # Check if employees table still exists
        result = connection.execute(text("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employees')"))
        employees_exists = result.fetchone()[0]
        print(f'  employees table exists: {employees_exists}')
        
        # Check payroll foreign key
        result = connection.execute(text('''
            SELECT conname, conrelid::regclass::text AS table_name,
                   confrelid::regclass::text AS referenced_table
            FROM pg_constraint 
            WHERE conrelid = 'payroll_sheet_entries'::regclass 
            AND contype = 'f'
        '''))
        payroll_fk = result.fetchone()
        
        if payroll_fk:
            print(f'  Payroll FK: {payroll_fk[1]} -> {payroll_fk[2]}')
        
    except Exception as e:
        print(f'Error: {e}')
