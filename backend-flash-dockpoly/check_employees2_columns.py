#!/usr/bin/env python3
"""Check employees2 table columns"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text

with engine.connect() as connection:
    result = connection.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'employees2' ORDER BY ordinal_position"))
    columns = [row[0] for row in result.fetchall()]
    print('📋 employees2 table columns:')
    for i, col in enumerate(columns, 1):
        print(f'  {i}. {col}')
