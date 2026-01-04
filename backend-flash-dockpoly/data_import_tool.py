#!/usr/bin/env python3
"""
Data Import Tool - Import data from various sources to PostgreSQL
Supports: SQLite, MySQL, PostgreSQL, CSV files
"""

import sys
import os
import pandas as pd
from pathlib import Path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text, inspect, create_engine
from sqlalchemy.exc import SQLAlchemyError
import sqlite3
import pymysql

class DataImporter:
    def __init__(self):
        self.target_engine = engine
        self.target_inspector = inspect(self.target_engine)
        
    def get_target_tables(self):
        """Get all tables in target PostgreSQL database"""
        return self.target_inspector.get_table_names()
    
    def import_from_sqlite(self, sqlite_path):
        """Import data from SQLite database"""
        print(f"📂 Importing from SQLite: {sqlite_path}")
        
        if not os.path.exists(sqlite_path):
            print(f"❌ SQLite file not found: {sqlite_path}")
            return False
            
        try:
            # Connect to SQLite
            sqlite_conn = sqlite3.connect(sqlite_path)
            sqlite_cursor = sqlite_conn.cursor()
            
            # Get all tables
            sqlite_cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            sqlite_tables = [row[0] for row in sqlite_cursor.fetchall()]
            
            print(f"Found {len(sqlite_tables)} tables in SQLite")
            
            imported_count = 0
            for table in sqlite_tables:
                if table in self.get_target_tables():
                    # Read data from SQLite
                    df = pd.read_sql_query(f"SELECT * FROM {table}", sqlite_conn)
                    
                    if len(df) > 0:
                        print(f"  📥 Importing {table}: {len(df)} rows")
                        
                        # Import to PostgreSQL
                        df.to_sql(
                            table, 
                            self.target_engine, 
                            if_exists='append', 
                            index=False
                        )
                        imported_count += len(df)
                    else:
                        print(f"  ⚪ {table}: No data to import")
                else:
                    print(f"  ⚠️ {table}: Table not found in target database")
            
            sqlite_conn.close()
            print(f"✅ Successfully imported {imported_count} total rows")
            return True
            
        except Exception as e:
            print(f"❌ SQLite import failed: {e}")
            return False
    
    def import_from_mysql(self, mysql_config):
        """Import data from MySQL database"""
        print(f"📂 Importing from MySQL: {mysql_config['host']}")
        
        try:
            # Connect to MySQL
            mysql_engine = create_engine(
                f"mysql+pymysql://{mysql_config['user']}:{mysql_config['password']}@"
                f"{mysql_config['host']}:{mysql_config.get('port', 3306)}/{mysql_config['database']}"
            )
            mysql_inspector = inspect(mysql_engine)
            
            # Get all tables
            mysql_tables = mysql_inspector.get_table_names()
            print(f"Found {len(mysql_tables)} tables in MySQL")
            
            imported_count = 0
            for table in mysql_tables:
                if table in self.get_target_tables():
                    # Read data from MySQL
                    df = pd.read_sql_table(table, mysql_engine)
                    
                    if len(df) > 0:
                        print(f"  📥 Importing {table}: {len(df)} rows")
                        
                        # Import to PostgreSQL
                        df.to_sql(
                            table, 
                            self.target_engine, 
                            if_exists='append', 
                            index=False
                        )
                        imported_count += len(df)
                    else:
                        print(f"  ⚪ {table}: No data to import")
                else:
                    print(f"  ⚠️ {table}: Table not found in target database")
            
            print(f"✅ Successfully imported {imported_count} total rows")
            return True
            
        except Exception as e:
            print(f"❌ MySQL import failed: {e}")
            return False
    
    def import_from_csv(self, csv_directory):
        """Import data from CSV files"""
        print(f"📂 Importing from CSV directory: {csv_directory}")
        
        csv_path = Path(csv_directory)
        if not csv_path.exists():
            print(f"❌ CSV directory not found: {csv_directory}")
            return False
        
        csv_files = list(csv_path.glob("*.csv"))
        print(f"Found {len(csv_files)} CSV files")
        
        imported_count = 0
        for csv_file in csv_files:
            table_name = csv_file.stem  # filename without extension
            
            if table_name in self.get_target_tables():
                try:
                    df = pd.read_csv(csv_file)
                    
                    if len(df) > 0:
                        print(f"  📥 Importing {table_name}: {len(df)} rows")
                        
                        # Import to PostgreSQL
                        df.to_sql(
                            table_name, 
                            self.target_engine, 
                            if_exists='append', 
                            index=False
                        )
                        imported_count += len(df)
                    else:
                        print(f"  ⚪ {table_name}: No data to import")
                        
                except Exception as e:
                    print(f"  ❌ Failed to import {csv_file.name}: {e}")
            else:
                print(f"  ⚠️ {table_name}: Table not found in target database")
        
        print(f"✅ Successfully imported {imported_count} total rows")
        return True
    
    def show_import_summary(self):
        """Show summary of imported data"""
        print(f"\n📊 Import Summary:")
        
        with self.target_engine.connect() as connection:
            tables = self.get_target_tables()
            
            for table in sorted(tables):
                try:
                    result = connection.execute(text(f"SELECT COUNT(*) FROM {table}"))
                    count = result.fetchone()[0]
                    
                    if count > 0:
                        print(f"  ✅ {table}: {count} rows")
                    else:
                        print(f"  ⚪ {table}: 0 rows")
                        
                except SQLAlchemyError as e:
                    print(f"  ❌ {table}: Error - {e}")

def main():
    importer = DataImporter()
    
    print("🚀 Data Import Tool for Flash ERP")
    print("=" * 50)
    
    print("\nSelect import source:")
    print("1. SQLite database (.db file)")
    print("2. MySQL database")
    print("3. CSV files")
    print("4. Show current database status")
    
    choice = input("\nEnter your choice (1-4): ").strip()
    
    if choice == "1":
        sqlite_path = input("Enter SQLite database path: ").strip()
        if importer.import_from_sqlite(sqlite_path):
            importer.show_import_summary()
    
    elif choice == "2":
        print("\nEnter MySQL connection details:")
        mysql_config = {
            'host': input("Host: ").strip(),
            'port': int(input("Port (default 3306): ").strip() or "3306"),
            'user': input("Username: ").strip(),
            'password': input("Password: ").strip(),
            'database': input("Database name: ").strip()
        }
        if importer.import_from_mysql(mysql_config):
            importer.show_import_summary()
    
    elif choice == "3":
        csv_dir = input("Enter CSV directory path: ").strip()
        if importer.import_from_csv(csv_dir):
            importer.show_import_summary()
    
    elif choice == "4":
        importer.show_import_summary()
    
    else:
        print("❌ Invalid choice")

if __name__ == "__main__":
    main()
