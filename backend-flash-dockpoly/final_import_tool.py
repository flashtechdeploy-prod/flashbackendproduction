#!/usr/bin/env python3
"""
Final Data Import Tool - Handles all constraints and duplicates
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
from datetime import datetime

class FinalDataImporter:
    def __init__(self):
        self.target_engine = engine
        self.target_inspector = inspect(self.target_engine)
        
    def get_target_tables(self):
        """Get all tables in target PostgreSQL database"""
        return self.target_inspector.get_table_names()
    
    def convert_data_types(self, df, table_name):
        """Convert data types to match PostgreSQL schema"""
        # Get target table schema
        columns = self.target_inspector.get_columns(table_name)
        
        for col in columns:
            col_name = col['name']
            col_type = str(col['type'])
            
            if col_name in df.columns:
                # Handle boolean conversion
                if 'BOOLEAN' in col_type.upper():
                    df[col_name] = df[col_name].astype(bool)
                
                # Handle integer conversion
                elif 'INTEGER' in col_type.upper() or 'BIGINT' in col_type.upper() or 'SMALLINT' in col_type.upper():
                    df[col_name] = pd.to_numeric(df[col_name], errors='coerce').fillna(0).astype(int)
                
                # Handle float conversion
                elif 'FLOAT' in col_type.upper() or 'DOUBLE' in col_type.upper() or 'DECIMAL' in col_type.upper():
                    df[col_name] = pd.to_numeric(df[col_name], errors='coerce').fillna(0.0)
                
                # Handle datetime conversion
                elif 'TIMESTAMP' in col_type.upper() or 'DATETIME' in col_type.upper():
                    if df[col_name].dtype == 'object':
                        df[col_name] = pd.to_datetime(df[col_name], errors='coerce')
                
                # Handle date conversion
                elif 'DATE' in col_type.upper():
                    if df[col_name].dtype == 'object':
                        df[col_name] = pd.to_datetime(df[col_name], errors='coerce').dt.date
        
        return df
    
    def get_existing_data(self, table_name, unique_columns):
        """Get existing data to avoid duplicates based on unique columns"""
        try:
            with self.target_engine.connect() as connection:
                if len(unique_columns) == 1:
                    col = unique_columns[0]
                    result = connection.execute(text(f"SELECT {col} FROM {table_name}"))
                    return set(row[0] for row in result.fetchall())
                else:
                    # For multiple columns, create a composite key
                    cols_str = ', '.join(unique_columns)
                    result = connection.execute(text(f"SELECT {cols_str} FROM {table_name}"))
                    return set(tuple(row) for row in result.fetchall())
        except:
            return set()
    
    def import_from_sqlite_final(self, sqlite_path):
        """Final import with all constraint handling"""
        print(f"📂 Final Import from SQLite: {sqlite_path}")
        
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
            
            total_imported = 0
            for table in sqlite_tables:
                if table in self.get_target_tables():
                    # Read data from SQLite
                    df = pd.read_sql_query(f"SELECT * FROM {table}", sqlite_conn)
                    
                    if len(df) > 0:
                        print(f"  📥 Processing {table}: {len(df)} rows")
                        
                        # Convert data types
                        df = self.convert_data_types(df, table)
                        
                        # Handle duplicates based on table-specific unique constraints
                        original_count = len(df)
                        
                        if table == 'permissions':
                            # Check for existing permission keys
                            existing_keys = self.get_existing_data(table, ['key'])
                            df = df[~df['key'].isin(existing_keys)]
                        elif table == 'roles':
                            # Check for existing role names
                            existing_names = self.get_existing_data(table, ['name'])
                            df = df[~df['name'].isin(existing_names)]
                        elif 'id' in df.columns:
                            # Check for existing IDs
                            existing_ids = self.get_existing_data(table, ['id'])
                            df = df[~df['id'].isin(existing_ids)]
                        
                        filtered_count = original_count - len(df)
                        
                        if filtered_count > 0:
                            print(f"    ⚠️ Skipped {filtered_count} duplicate rows")
                        elif filtered_count == 0 and original_count > 0:
                            print(f"    ⚠️ All {original_count} rows already exist, skipping")
                            continue
                        
                        if len(df) > 0:
                            # Import to PostgreSQL
                            df.to_sql(
                                table, 
                                self.target_engine, 
                                if_exists='append', 
                                index=False,
                                method='multi' if len(df) > 100 else None
                            )
                            print(f"    ✅ Imported {len(df)} new rows")
                            total_imported += len(df)
                        else:
                            print(f"    ⚪ No new data to import")
                    else:
                        print(f"  ⚪ {table}: No data to import")
                else:
                    print(f"  ⚠️ {table}: Table not found in target database")
            
            sqlite_conn.close()
            print(f"✅ Successfully imported {total_imported} total new rows")
            return True
            
        except Exception as e:
            print(f"❌ SQLite import failed: {e}")
            return False
    
    def show_import_summary(self):
        """Show summary of imported data"""
        print(f"\n📊 Final Database Summary:")
        
        with self.target_engine.connect() as connection:
            tables = self.get_target_tables()
            
            total_rows = 0
            data_tables = 0
            
            for table in sorted(tables):
                try:
                    result = connection.execute(text(f"SELECT COUNT(*) FROM {table}"))
                    count = result.fetchone()[0]
                    total_rows += count
                    
                    if count > 0:
                        data_tables += 1
                        print(f"  ✅ {table}: {count} rows")
                    else:
                        print(f"  ⚪ {table}: 0 rows")
                        
                except SQLAlchemyError as e:
                    print(f"  ❌ {table}: Error - {e}")
            
            print(f"\n🎉 Database Statistics:")
            print(f"   Total tables: {len(tables)}")
            print(f"   Tables with data: {data_tables}")
            print(f"   Total records: {total_rows}")

def main():
    importer = FinalDataImporter()
    
    print("🚀 Final Data Import Tool for Flash ERP")
    print("=" * 50)
    
    sqlite_path = "C:\\Users\\ahmed\\Desktop\\backend clone\\flash_erp.db"
    
    if importer.import_from_sqlite_final(sqlite_path):
        importer.show_import_summary()
    else:
        print("❌ Import failed")

if __name__ == "__main__":
    main()
