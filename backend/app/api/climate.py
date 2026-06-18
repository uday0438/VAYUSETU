from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List
import random
import datetime
from app.services.ingestion import get_latest_state_for_region, run_global_ingestion, simulate_single_ingestion
from app.core.db import get_db_connection
from app.services.advisor import get_climate_advisories
from app.services.data_assimilation import assimilate_climate_state
from app.services.risk_index import calculate_vayusetu_risk_score
from app.services.sector_impacts import calculate_sector_impacts

router = APIRouter()

DISTRICT_CENTERS = {
    "New Delhi": [28.6139, 77.2090],
    "Mumbai": [19.0760, 72.8777],
    "Kolkata": [22.5726, 88.3639],
    "Chennai": [13.0827, 80.2707],
    "Bengaluru": [12.9716, 77.5946],
    "Hyderabad": [17.3850, 78.4867],
    "Guwahati": [26.1445, 91.7362],
    "Srinagar": [34.0837, 74.7973],
    "Ahmedabad": [23.0225, 72.5714],
    "Bhopal": [23.2599, 77.4126],
    "Visakhapatnam": [17.6868, 83.2185],
    "Patna": [25.5941, 85.1376],
    "Kochi": [9.9312, 76.2673],
    "Thiruvananthapuram": [8.5241, 76.9366],
    "Mangaluru": [12.9141, 74.8560],
    "Goa": [15.2993, 74.1240],
    "Puri": [19.8135, 85.8312],
    "Puducherry": [11.9416, 79.8083],
    "Ratnagiri": [16.9902, 73.3120],
    "Surat": [21.1702, 72.8311]
}

@router.get("/live-state")
def get_live_state(district: str = "Visakhapatnam") -> Dict[str, Any]:
    """Returns the latest dynamic climate telemetry, assimilated via Kalman Filter, with risk score and sector impacts."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM climate_state 
        WHERE district = ? 
        ORDER BY timestamp DESC 
        LIMIT 1
    """, (district,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        try:
            state_data = simulate_single_ingestion(district)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        state_data = dict(row)
        
    # Simulate a raw observation feed (e.g. from INSAT/IMD satellite)
    observed_temp = state_data["temperature"] + random.uniform(-1.0, 1.0)
    observed_rain = state_data["rainfall"] + random.uniform(-10.0, 10.0)
    observed_sm = state_data["soil_moisture"] + random.uniform(-5.0, 5.0)
    observed_hum = state_data["humidity"] + random.uniform(-4.0, 4.0)

    # Perform Kalman Filter Assimilation to correct state
    assimilated = assimilate_climate_state(
        predicted_temp=state_data["temperature"], observed_temp=observed_temp,
        predicted_rain=state_data["rainfall"], observed_rain=observed_rain,
        predicted_sm=state_data["soil_moisture"], observed_sm=observed_sm,
        predicted_hum=state_data["humidity"], observed_hum=observed_hum
    )

    # Store corrected/assimilated values back
    state_data["temperature"] = assimilated["temperature"]["corrected_state"]
    state_data["rainfall"] = assimilated["rainfall"]["corrected_state"]
    state_data["soil_moisture"] = assimilated["soil_moisture"]["corrected_state"]
    state_data["humidity"] = assimilated["humidity"]["corrected_state"]
    state_data["kalman_gain"] = assimilated["average_kalman_gain"]
    state_data["kalman_covariance"] = assimilated["temperature"]["updated_covariance"]

    # Compute custom VAYUSETU Risk Score
    risk_data = calculate_vayusetu_risk_score(
        temperature=state_data["temperature"],
        rainfall=state_data["rainfall"],
        soil_moisture=state_data["soil_moisture"],
        humidity=state_data["humidity"],
        lst=state_data["lst"],
        sst=state_data["sst"],
        district=district
    )
    state_data["vayusetu_risk_score"] = risk_data["risk_score"]
    state_data["vayusetu_risk_level"] = risk_data["level"]
    state_data["vayusetu_risk_contributors"] = risk_data["contributors"]

    # Compute Sector-specific impacts
    impacts = calculate_sector_impacts(
        temperature=state_data["temperature"],
        rainfall=state_data["rainfall"],
        soil_moisture=state_data["soil_moisture"],
        lst=state_data["lst"],
        humidity=state_data["humidity"]
    )
    state_data["sector_impacts"] = impacts

    # Calculate heatwave risk dynamically as it is not stored in DB
    heatwave_risk = max(10.0, min(100.0, (state_data["temperature"] - 25.0) * 5.0))
    state_data["heatwave_risk"] = round(heatwave_risk, 1)

    # Include advisories
    advisories = get_climate_advisories(
        flood_risk=state_data["flood_risk"],
        heatwave_risk=state_data["heatwave_risk"],
        drought_risk=state_data["drought_risk"]
    )
    state_data["advisories"] = advisories
    
    return state_data

@router.get("/live-climate/{state_name}")
def get_live_climate(state_name: str) -> List[Dict[str, Any]]:
    """Returns the latest climate twin state records for all districts in a state."""
    data = get_latest_state_for_region(state_name)
    if not data:
        run_global_ingestion()
        data = get_latest_state_for_region(state_name)
    return data

@router.post("/ingest")
def trigger_ingestion():
    """Manually triggers satellite telemetry ingestion pipeline, updating the database."""
    try:
        results = run_global_ingestion()
        return {"status": "success", "ingested_records": len(results)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/monsoon-tracker")
def get_monsoon_tracker() -> Dict[str, Any]:
    """Returns South-West Monsoon status parameters (onset tracking, progression, and withdrawal)."""
    return {
        "monsoon_status": "ONSET_COMPLETED",
        "onset_date_kerala": "2026-06-01",
        "current_progression": "Active over Central & South Peninsula",
        "onset_delay_days": +2,
        "monsoonal_wind_vectors_ms": 14.8,
        "regional_indicators": {
            "south_india": "Active precipitation",
            "central_india": "Normal onset in progress",
            "north_india": "Pre-monsoon showers"
        },
        "projected_withdrawal_start": "2026-09-18"
    }

@router.get("/grid-data")
def get_grid_data(district: str = Query("Visakhapatnam", description="District to generate high-resolution grid for")) -> List[Dict[str, Any]]:
    """Generates a 1 km x 1 km climate grid overlaying the selected district center."""
    center = DISTRICT_CENTERS.get(district, [17.6868, 83.2185])
    
    # Get base district parameters from DB
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM climate_state WHERE district = ? ORDER BY timestamp DESC LIMIT 1", (district,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        base_temp = row["temperature"]
        base_rain = row["rainfall"]
        base_sm = row["soil_moisture"]
        base_hum = row["humidity"]
        base_lst = row["lst"]
        base_sst = row["sst"]
    else:
        base_temp, base_rain, base_sm, base_hum = 30.0, 50.0, 50.0, 75.0
        base_lst, base_sst = 32.0, 28.5
        
    grid_cells = []
    cell_idx = 1
    
    # 5x5 grid cells, spacing of 0.01 (~1.1 km)
    for i in range(-2, 3):
        for j in range(-2, 3):
            lat = center[0] + (i * 0.01)
            lng = center[1] + (j * 0.01)
            
            # Add micro-climatic variance to parameters
            cell_temp = round(base_temp + random.uniform(-0.8, 0.8), 1)
            cell_rain = round(max(0.0, base_rain + random.uniform(-10.0, 15.0)), 1)
            cell_sm = round(max(10.0, min(98.0, base_sm + random.uniform(-6.0, 6.0))), 1)
            cell_hum = round(max(30.0, min(99.0, base_hum + random.uniform(-5.0, 5.0))), 1)
            cell_lst = round(base_lst + random.uniform(-0.5, 0.5), 1)
            
            # Compute custom VAYUSETU Risk Score per cell
            risk_data = calculate_vayusetu_risk_score(
                temperature=cell_temp,
                rainfall=cell_rain,
                soil_moisture=cell_sm,
                humidity=cell_hum,
                lst=cell_lst,
                sst=base_sst,
                district=district
            )
            
            grid_cells.append({
                "cell": f"CELL-{district[:3].upper()}-{cell_idx:02d}",
                "latitude": round(lat, 5),
                "longitude": round(lng, 5),
                "temperature": cell_temp,
                "rainfall": cell_rain,
                "soil_moisture": cell_sm,
                "humidity": cell_hum,
                "flood_risk": risk_data["risk_score"],  # map CRI score as grid risk indicators
                "drought_risk": int(100 - cell_sm),
                "heatwave_risk": int(max(10, min(100, (cell_temp - 25) * 5)))
            })
            cell_idx += 1
            
    return grid_cells
