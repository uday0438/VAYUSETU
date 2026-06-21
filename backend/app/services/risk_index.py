from typing import Dict, Any
from hazards.flood_engine import FloodHazardEngine
from hazards.heat_engine import HeatHazardEngine
from hazards.drought_engine import DroughtHazardEngine
from hazards.water_stress_engine import WaterStressEngine

def calculate_vayusetu_risk_score(
    temperature: float, rainfall: float, soil_moisture: float,
    humidity: float, lst: float, sst: float, district: str
) -> Dict[str, Any]:
    """
    Computes the trademark VAYUSETU Climate Risk Score (0-100) combining 
    multiple hazards and vulnerability metrics.
    """
    f_haz = FloodHazardEngine().calculate_risk(rainfall, soil_moisture)
    h_haz = HeatHazardEngine().calculate_risk(temperature, lst)
    d_haz = DroughtHazardEngine().calculate_risk(soil_moisture, humidity)
    w_stress = WaterStressEngine().calculate_risk(temperature, rainfall)
    
    risk_score = round(0.35 * f_haz + 0.35 * h_haz + 0.15 * d_haz + 0.15 * w_stress, 1)
    risk_score = max(0.0, min(100.0, risk_score))
    
    # Determine level bracket based on:
    # 0-25    Safe
    # 25-50   Moderate
    # 50-75   High
    # 75-100  Critical
    if risk_score > 75:
        level = "CRITICAL"
    elif risk_score > 50:
        level = "HIGH"
    elif risk_score > 25:
        level = "MODERATE"
    else:
        level = "SAFE"
        
    return {
        "risk_score": risk_score,
        "level": level,
        "contributors": {
            "flood_risk": round(f_haz, 1),
            "heat_risk": round(h_haz, 1),
            "drought_risk": round(d_haz, 1),
            "water_stress": round(w_stress, 1)
        }
    }
