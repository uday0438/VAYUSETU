import random
import datetime
from app.core.db import get_db_connection
from digital_twin.simulation_engine.runoff_model import run_district_flood_simulation

# Metadata mapping of district to state
DISTRICT_STATES = {
    "New Delhi": "Delhi",
    "Mumbai": "Maharashtra",
    "Kolkata": "West Bengal",
    "Chennai": "Tamil Nadu",
    "Bengaluru": "Karnataka",
    "Hyderabad": "Telangana",
    "Guwahati": "Assam",
    "Srinagar": "Jammu and Kashmir",
    "Ahmedabad": "Gujarat",
    "Bhopal": "Madhya Pradesh",
    "Visakhapatnam": "Andhra Pradesh",
    "Patna": "Bihar",
    "Kochi": "Kerala",
    "Thiruvananthapuram": "Kerala",
    "Mangaluru": "Karnataka",
    "Goa": "Goa",
    "Puri": "Odisha",
    "Puducherry": "Puducherry",
    "Ratnagiri": "Maharashtra",
    "Surat": "Gujarat"
}

COASTAL_DISTRICTS = ["Mumbai", "Kolkata", "Chennai", "Visakhapatnam", "Kochi", "Thiruvananthapuram", "Mangaluru", "Goa", "Puri", "Puducherry", "Ratnagiri", "Surat"]

def simulate_single_ingestion(district: str) -> dict:
    state = DISTRICT_STATES.get(district, "Unknown")
    
    # Generate realistic base parameters with small fluctuations
    is_coastal = district in COASTAL_DISTRICTS
    
    # Normal temperature ranges
    base_temp = 32.0 if is_coastal else 34.0
    if district == "Srinagar":
        base_temp = 22.0
    elif district == "Bengaluru":
        base_temp = 27.0
        
    temp = round(base_temp + random.uniform(-2.5, 2.5), 1)
    
    # Rainfall
    base_rain = 80.0 if is_coastal else 20.0
    rain = round(max(0.0, base_rain + random.uniform(-15.0, 35.0)), 1)
    
    # Humidity
    humidity = round(random.uniform(70.0, 95.0) if is_coastal else random.uniform(40.0, 70.0), 1)
    
    # Soil Moisture
    soil_moisture = round(max(10.0, min(98.0, (rain * 0.5) + humidity * 0.4 + random.uniform(-5.0, 5.0))), 1)
    
    # SST (Sea Surface Temp)
    sst = round(28.0 + random.uniform(-1.5, 1.5), 1) if is_coastal else 0.0
    
    # LST (Land Surface Temp)
    lst = round(temp + (3.0 if not is_coastal else 1.0) + random.uniform(-1.0, 2.0), 1)
    
    # Calculate flood risk using rational runoff method simulation
    # Let's run a micro simulation on this district
    # If rainfall is high, risk is higher
    sim_res = run_district_flood_simulation(
        precipitation_anomaly_pct=(rain - 80) / 80 * 100 if rain > 0 else 0,
        urbanization_increase_pct=15.0,
        base_rainfall_mm=rain,
        districts=[district],
        soil_moisture_pct=soil_moisture,
        temp_rise_c=temp - base_temp
    )
    
    flood_risk = 30
    if district in sim_res:
        flood_risk = sim_res[district]["risk_score"]
        
    # Calculate drought risk based on inverse soil moisture and high LST
    temp_anomaly = max(0.0, lst - base_temp)
    drought_score = max(5.0, min(95.0, 100.0 - soil_moisture + (temp_anomaly * 5.0) - (rain * 0.2)))
    drought_risk = round(drought_score, 1)
    
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    
    # Insert to DB
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO climate_state 
        (timestamp, state, district, temperature, rainfall, humidity, soil_moisture, sst, lst, flood_risk, drought_risk)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (timestamp, state, district, temp, rain, humidity, soil_moisture, sst, lst, flood_risk, drought_risk))
    
    conn.commit()
    conn.close()
    
    return {
        "timestamp": timestamp,
        "state": state,
        "district": district,
        "temperature": temp,
        "rainfall": rain,
        "humidity": humidity,
        "soil_moisture": soil_moisture,
        "sst": sst,
        "lst": lst,
        "flood_risk": flood_risk,
        "drought_risk": drought_risk
    }

def run_global_ingestion() -> list:
    results = []
    for district in DISTRICT_STATES.keys():
        res = simulate_single_ingestion(district)
        results.append(res)
    return results

def get_latest_state_for_region(state_name: str) -> list:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get the latest entry for each district in this state
    cursor.execute("""
        SELECT cs.* FROM climate_state cs
        INNER JOIN (
            SELECT district, MAX(timestamp) as max_ts 
            FROM climate_state 
            WHERE state = ?
            GROUP BY district
        ) latest ON cs.district = latest.district AND cs.timestamp = latest.max_ts
    """, (state_name,))
    
    rows = cursor.fetchall()
    conn.close()
    
    # Map to list of dicts
    results = []
    for row in rows:
        results.append(dict(row))
        
    return results
