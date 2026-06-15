from fastapi import APIRouter, Query
from typing import Dict, Any
from digital_twin.simulation_engine.runoff_model import run_district_flood_simulation

router = APIRouter()

@router.get("/runoff")
def simulate_runoff(
    precipitation_anomaly_pct: float = Query(20.0, description="Precipitation anomaly percentage (-50 to +100)"),
    urbanization_increase_pct: float = Query(15.0, description="Urban cover shift percentage (0 to 50)"),
    temp_rise_c: float = Query(1.5, description="Global temperature anomaly (0.5 to 5.0)"),
    soil_moisture_pct: float = Query(50.0, description="Soil moisture index percentage (0 to 100)")
) -> Dict[str, Any]:
    """Runs a hydrological simulation based on input What-If scenarios and returns district risk scoring."""
    simulation_results = run_district_flood_simulation(
        precipitation_anomaly_pct=precipitation_anomaly_pct,
        urbanization_increase_pct=urbanization_increase_pct,
        soil_moisture_pct=soil_moisture_pct
    )
    
    # Calculate overall risk score as the max of district scores
    overall_score = max(res["risk_score"] for res in simulation_results.values())
    overall_level = "CRITICAL" if overall_score > 75 else "ELEVATED" if overall_score > 50 else "NORMAL"
    
    return {
        "status": "success",
        "inputs": {
            "precipitation_anomaly_pct": precipitation_anomaly_pct,
            "urbanization_increase_pct": urbanization_increase_pct,
            "temp_rise_c": temp_rise_c,
            "soil_moisture_pct": soil_moisture_pct
        },
        "overall_risk_score": overall_score,
        "overall_level": overall_level,
        "district_breakdown": simulation_results
    }
