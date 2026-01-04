#!/usr/bin/env python3
"""
Instructions to reset PostgreSQL password on Windows:

Option A: Using psql command line
1. Open Command Prompt as Administrator
2. Navigate to PostgreSQL bin directory (usually):
   cd "C:\Program Files\PostgreSQL\18\bin"
3. Connect to PostgreSQL:
   psql -U postgres
4. Reset password:
   \password postgres
   Enter new password: your_new_password
   Enter it again: your_new_password
   \q

Option B: Using pgAdmin
1. Open pgAdmin (installed with PostgreSQL)
2. Connect to server with current password
3. Right-click on server > Properties
4. Change password in Connection tab

Option C: Reset via Windows services
1. Stop PostgreSQL service:
   net stop postgresql-x64-18
2. Start in single-user mode (advanced)
3. Reset password
4. Restart service

After resetting password, update your .env files with:
DATABASE_URL=postgresql://postgres:YOUR_NEW_PASSWORD@localhost:5432/flash_erp
"""

print(__doc__)
