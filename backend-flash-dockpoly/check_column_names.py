#!/usr/bin/env python3
"""Check employee column names in problematic tables"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text

with engine.connect() as connection:
    # Check column names for problematic tables
    tables_to_check = ['expenses', 'finance_journal_lines', 'general_item_employee_balances']
    
    for table in tables_to_check:
        try:
            result = connection.execute(text(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{table}' AND column_name LIKE '%employee%'"))
            columns = [row[0] for row in result.fetchall()]
            print(f'{table}: {columns}')
        except Exception as e:
            print(f'Error checking {table}: {e}')
