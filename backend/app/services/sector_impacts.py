from typing import Dict, Any

def calculate_sector_impacts(
    temperature: float, rainfall: float, soil_moisture: float,
    lst: float, humidity: float, urbanization: float = 15.0
) -> Dict[str, Any]:
    """
    Computes sector-specific impact indices derived from active physical climate variables.
    """
    # 1. Agriculture: Crop Stress Risk (%)
    # Optimum soil moisture is 60-70%. Low soil moisture or extremely high temperature causes crop stress.
    sm_stress = max(0.0, 60.0 - soil_moisture) * 1.5 if soil_moisture < 60 else max(0.0, soil_moisture - 85.0) * 1.0
    temp_stress = max(0.0, temperature - 30.0) * 4.0
    crop_stress = min(100.0, max(10.0, sm_stress + temp_stress))
    
    # Crop status classification
    if crop_stress > 75:
        crop_status = "CRITICAL_STRESS"
    elif crop_stress > 45:
        crop_status = "ELEVATED_STRESS"
    else:
        crop_status = "OPTIMAL_HEALTH"

    # 2. Water Resources: Reservoir Stress (%)
    # Increases with evaporation (lst anomaly) and rainfall deficit
    evap_factor = max(0.0, lst - 30.0) * 2.0
    rain_factor = max(0.0, 100.0 - rainfall) * 0.4 if rainfall < 100 else 0.0
    reservoir_stress = min(100.0, max(15.0, 40.0 + evap_factor + rain_factor))

    # 3. Urban: Heat Island Risk (%)
    # Heat island scales with urbanization shift and air temperature
    uhi_score = min(100.0, max(10.0, (urbanization * 1.2) + (temperature - 25.0) * 5.0))

    # 4. Disaster: Flood Exposure Index (0-100)
    # Scales directly with rainfall intensity and antecedent soil saturation
    flood_exposure = min(100.0, max(5.0, (rainfall * 0.5) + (soil_moisture * 0.4)))

    return {
        "agriculture": {
            "crop_stress_pct": round(crop_stress, 1),
            "status": crop_status
        },
        "water": {
            "reservoir_stress_pct": round(reservoir_stress, 1),
            "evaporative_loss_index": round(evap_factor / 10.0 if evap_factor > 0 else 0.2, 2)
        },
        "urban": {
            "heat_island_risk_pct": round(uhi_score, 1),
            "microclimate_temp_offset_c": round(urbanization * 0.08, 2)
        },
        "disaster": {
            "flood_exposure_index": round(flood_exposure, 1),
            "catchment_saturation_ratio": round(soil_moisture / 100.0, 2)
        }
    }
