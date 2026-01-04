#!/usr/bin/env python3
"""Add missing permissions"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text

with engine.connect() as connection:
    # Add missing permissions
    try:
        connection.execute(text("INSERT INTO permissions (key, description) VALUES ('fleet:view', 'View fleet module')"))
        print('✅ Added fleet:view permission')
    except Exception as e:
        print(f'⚠️ fleet:view already exists: {e}')
    
    try:
        connection.execute(text("INSERT INTO permissions (key, description) VALUES ('inventory:view', 'View inventory module')"))
        print('✅ Added inventory:view permission')
    except Exception as e:
        print(f'⚠️ inventory:view already exists: {e}')
    
    connection.commit()
    print('✅ Permission updates completed')
