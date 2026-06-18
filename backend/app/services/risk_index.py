from typing import Dict, Any

def calculate_vayusetu_risk_score(
    temperature: float, rainfall: float, soil_moisture: float,
    humidity: float, lst: float, sst: float, district: str
) -> Dict[str, Any]:
    """
    Computes the trademark VAYUSETU Climate Risk Score (0-100) combining 
    multiple hazards and vulnerability metrics.
    """
    # 1. Temperature Hazard contribution (0 - 30 points)
    # Penalizes extremely high or low temperatures
    temp_contrib = max(0.0, temperature - 28.0) * 3.5
    temp_contrib = min(30.0, temp_contrib)
    
    # 2. Precipitation Hazard contribution (0 - 30 points)
    # High rainfall (flooding) or low rainfall (drought) both increase risk
    if rainfall > 100:
        precip_contrib = (rainfall - 100) * 0.4
    elif rainfall < 25:
        precip_contrib = (25 - rainfall) * 1.2
    else:
        precip_contrib = 5.0
    precip_contrib = min(30.0, precip_contrib)
    
    # 3. Soil Moisture Deficit contribution (0 - 20 points)
    sm_deficit = max(0.0, 100.0 - soil_moisture)
    sm_contrib = (sm_deficit / 100.0) * 20.0
    
    # 4. Population Exposure multiplier (0 - 20 points)
    # Simulated density exposure factor based on district significance
    dense_districts = ["Mumbai", "New Delhi", "Kolkata", "Chennai", "Bengaluru", "Hyderabad"]
    pop_exposure = 18.0 if district in dense_districts else 10.0
    
    # Sum it up
    risk_score = round(temp_contrib + precip_contrib + sm_contrib + pop_exposure, 1)
    risk_score = max(0.0, min(100.0, risk_score))
    
    # Determine level bracket
    if risk_score > 80:
        level = "CRITICAL"
    elif risk_score > 60:
        level = "SEVERE"
    elif risk_score > 40:
        level = "HIGH"
    elif risk_score > 20:
        level = "MODERATE"
    else:
        level = "SAFE"
        
    return {
        "risk_score": risk_score,
        "level": level,
        "contributors": {
            "temperature_anomaly": round(temp_contrib, 1),
            "precipitation_anomaly": round(precip_contrib, 1),
            "soil_moisture_deficit": round(sm_contrib, 1),
            "population_exposure": pop_exposure
        }
    }
