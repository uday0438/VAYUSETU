import os
import sqlite3
import datetime
from typing import Dict, Any, List

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "vayusetu.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create climate_state table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS climate_state (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            state TEXT NOT NULL,
            district TEXT NOT NULL,
            temperature REAL NOT NULL,
            rainfall REAL NOT NULL,
            humidity REAL NOT NULL,
            soil_moisture REAL NOT NULL,
            sst REAL NOT NULL,
            lst REAL NOT NULL,
            flood_risk REAL NOT NULL,
            drought_risk REAL NOT NULL
        )
    """)
    
    conn.commit()
    seed_db(conn)
    conn.close()

def seed_db(conn):
    cursor = conn.cursor()
    # Check if we already have records
    cursor.execute("SELECT COUNT(*) FROM climate_state")
    if cursor.fetchone()[0] > 0:
        return
        
    # Standard baseline values for seeding
    # District -> [State, Temp, Rain, Hum, Soil, SST, LST, Flood, Drought]
    seed_data = [
        ("New Delhi", "Delhi", 32.5, 12.0, 45.0, 32.0, 0.0, 36.4, 36.4, 42.0),
        ("Mumbai", "Maharashtra", 30.2, 110.0, 85.0, 75.0, 28.5, 31.2, 72.0, 15.0),
        ("Kolkata", "West Bengal", 31.0, 85.0, 80.0, 72.0, 29.0, 31.8, 64.0, 18.0),
        ("Chennai", "Tamil Nadu", 33.4, 45.0, 78.0, 60.0, 29.5, 34.0, 50.0, 28.0),
        ("Bengaluru", "Karnataka", 27.8, 20.0, 65.0, 55.0, 0.0, 28.4, 35.0, 32.0),
        ("Hyderabad", "Telangana", 32.0, 15.0, 58.0, 48.0, 0.0, 33.5, 30.0, 45.0),
        ("Guwahati", "Assam", 29.5, 95.0, 88.0, 78.0, 0.0, 30.1, 78.0, 12.0),
        ("Srinagar", "Jammu and Kashmir", 22.0, 30.0, 70.0, 62.0, 0.0, 23.5, 40.0, 22.0),
        ("Ahmedabad", "Gujarat", 35.5, 10.0, 50.0, 40.0, 28.0, 36.2, 28.0, 55.0),
        ("Bhopal", "Madhya Pradesh", 31.2, 25.0, 60.0, 50.0, 0.0, 32.4, 35.0, 40.0),
        ("Visakhapatnam", "Andhra Pradesh", 31.8, 75.0, 82.0, 68.0, 29.2, 32.5, 58.0, 20.0),
        ("Patna", "Bihar", 32.0, 40.0, 72.0, 58.0, 0.0, 33.0, 45.0, 30.0),
        ("Kochi", "Kerala", 29.8, 120.0, 88.0, 80.0, 28.8, 30.2, 75.0, 10.0),
        ("Thiruvananthapuram", "Kerala", 30.0, 90.0, 85.0, 74.0, 28.7, 30.5, 62.0, 12.0),
        ("Mangaluru", "Karnataka", 30.1, 130.0, 86.0, 78.0, 28.6, 30.4, 78.0, 10.0),
        ("Goa", "Goa", 30.5, 105.0, 84.0, 76.0, 28.4, 30.9, 68.0, 14.0),
        ("Puri", "Odisha", 31.0, 95.0, 85.0, 75.0, 29.1, 31.5, 70.0, 15.0),
        ("Puducherry", "Puducherry", 32.2, 55.0, 80.0, 64.0, 29.4, 33.0, 54.0, 22.0),
        ("Ratnagiri", "Maharashtra", 29.9, 115.0, 85.0, 77.0, 28.3, 30.2, 70.0, 12.0),
        ("Surat", "Gujarat", 32.0, 65.0, 78.0, 65.0, 28.1, 32.8, 52.0, 25.0)
    ]
    
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    
    for dist, state, temp, rain, hum, soil, sst, lst, flood, drought in seed_data:
        cursor.execute("""
            INSERT INTO climate_state 
            (timestamp, state, district, temperature, rainfall, humidity, soil_moisture, sst, lst, flood_risk, drought_risk)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (timestamp, state, dist, temp, rain, hum, soil, sst, lst, flood, drought))
        
    conn.commit()

# Automatically initialize database when config is loaded or on import
init_db()
