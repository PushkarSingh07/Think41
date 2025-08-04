import sqlite3
from pathlib import Path

import pandas as pd


def inspect_csv(file_path):
    """Show the structure of a CSV file"""
    try:
        df = pd.read_csv(file_path, nrows=5)
        print(f"\nStructure of {file_path}:")
        print(df.head())
        print("\nColumn names:", list(df.columns))
        print("Data types:\n", df.dtypes)
        return list(df.columns)
    except Exception as e:
        print(f"Error reading {file_path}: {str(e)}")
        return None

def create_database_schema(cursor, users_cols, orders_cols):
    """Create tables based on actual CSV columns"""
    cursor.execute(f"""
    CREATE TABLE IF NOT EXISTS users (
        {', '.join([f'{col} TEXT' for col in users_cols])}
    )
    """)
    
    cursor.execute(f"""
    CREATE TABLE IF NOT EXISTS orders (
        {', '.join([f'{col} TEXT' for col in orders_cols])}
    )
    """)

def load_csv_to_table(cursor, csv_path, table_name):
    """Load data from CSV to SQLite table"""
    df = pd.read_csv(csv_path)
    df.to_sql(table_name, conn, if_exists='replace', index=False)
    print(f"\nLoaded {len(df)} records into {table_name}")

def verify_data(cursor, table_name):
    """Verify loaded data"""
    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
    count = cursor.fetchone()[0]
    print(f"\n{table_name} contains {count} records")
    
    cursor.execute(f"SELECT * FROM {table_name} LIMIT 3")
    print(f"\nFirst 3 records in {table_name}:")
    for row in cursor.fetchall():
        print(row)

if __name__ == "__main__":
    # File paths - change if your files are elsewhere
    users_csv = Path('users.csv')
    orders_csv = Path('orders.csv')
    
    # Step 1: Inspect CSV structure
    users_cols = inspect_csv(users_csv)
    orders_cols = inspect_csv(orders_csv)
    
    if not users_cols or not orders_cols:
        print("\nERROR: Could not read CSV files. Please check:")
        print("- File paths are correct")
        print("- Files are not open in other programs")
        print("- Files are proper CSVs (open in Notepad to check)")
        exit()
    
    # Step 2: Create database
    conn = sqlite3.connect('ecommerce.db')
    cursor = conn.cursor()
    
    # Step 3: Create tables
    create_database_schema(cursor, users_cols, orders_cols)
    
    # Step 4: Load data
    load_csv_to_table(cursor, users_csv, 'users')
    load_csv_to_table(cursor, orders_csv, 'orders')
    
    # Step 5: Verify
    verify_data(cursor, 'users')
    verify_data(cursor, 'orders')
    
    conn.close()
    print("\nProcess completed successfully!")