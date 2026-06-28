import sqlite3
import os

db_path = r"d:\Fitness-AI-Trainer-With-Automatic-Exercise-Recognition-and-Counting-main\backend\users.db"

def check_db():
    if not os.path.exists(db_path):
        print(f"DB not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # List tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print(f"Tables: {tables}")
    
    for table in tables:
        table_name = table[0]
        print(f"\nSchema for {table_name}:")
        cursor.execute(f"PRAGMA table_info({table_name});")
        info = cursor.fetchall()
        for col in info:
            print(col)
            
    conn.close()

if __name__ == "__main__":
    check_db()
