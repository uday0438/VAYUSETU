from fastapi import APIRouter, Query, HTTPException
from typing import Dict, Any
from app.services.models_ensemble import get_ensemble_forecast
from app.services.xai_engine import get_xai_attributions
from app.core.db import get_db_connection
from app.services.drift_detector import compute_model_health_and_drift, trigger_model_retrain

router = APIRouter()

@router.get("/forecast")
def get_climate_forecast(district: str = "Visakhapatnam") -> Dict[str, Any]:
    """Returns AI-based rainfall and temperature forecasts with range intervals for uncertainty quantification."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT temperature, rainfall FROM climate_state WHERE district = ? ORDER BY timestamp DESC LIMIT 1", (district,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        base_temp = row["temperature"]
        base_rain = row["rainfall"]
    else:
        base_temp = 31.8
        base_rain = 75.0
        
    # Run multi-model fusion
    rain_forecast = get_ensemble_forecast(base_rain, "rainfall")
    temp_forecast = get_ensemble_forecast(base_temp, "temperature")
    
    # Add explicit range bounds for uncertainty quantification (Prediction Interval)
    # Rainfall range
    rain_val = rain_forecast["ensemble_prediction"]
    rain_range_delta = float(rain_forecast["uncertainty_range"].replace("±", ""))
    rain_forecast["range_bounds"] = [round(max(0.0, rain_val - rain_range_delta), 1), round(rain_val + rain_range_delta, 1)]
    
    # Temperature range
    temp_val = temp_forecast["ensemble_prediction"]
    temp_range_delta = float(temp_forecast["uncertainty_range"].replace("±", ""))
    temp_forecast["range_bounds"] = [round(temp_val - temp_range_delta, 1), round(temp_val + temp_range_delta, 1)]
    
    return {
        "pilot_region": district,
        "models_active": ["ConvLSTM-Precip", "TFT-Temp", "XGBoost-LST"],
        "forecast_horizons": {
            "rainfall": rain_forecast,
            "temperature": temp_forecast
        }
    }

@router.get("/explain")
def get_prediction_explanation(
    district: str = Query("Visakhapatnam", description="District for explanation"),
    target: str = Query("rainfall", description="Target parameter to explain")
) -> Dict[str, Any]:
    """Returns SHAP / Integrated Gradients attribution weights explaining why the models predicted specific risks."""
    try:
        explanation = get_xai_attributions(district, target)
        return explanation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/drift-status")
def get_drift_status() -> Dict[str, Any]:
    """Returns telemetry drift auditing statistics and model health metrics."""
    return compute_model_health_and_drift()

@router.post("/retrain")
def trigger_retraining():
    """Manually triggers model retraining, resetting the drift score indicator."""
    try:
        trigger_model_retrain()
        return {"status": "success", "message": "Model retraining triggered successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

DISTRICT_COORDS = {
    "Visakhapatnam": [17.6868, 83.2185],
    "New Delhi": [28.6139, 77.2090],
    "Mumbai": [19.0760, 72.8777],
    "Kochi": [9.9312, 76.2673],
    "Thiruvananthapuram": [8.5241, 76.9366],
    "Mangaluru": [12.9141, 74.8560],
    "Chennai": [13.0827, 80.2707],
    "Kolkata": [22.5726, 88.3639],
    "Bhopal": [23.2599, 77.4126],
    "Patna": [25.5941, 85.1376],
}

@router.get("/radar-nowcast")
def get_radar_nowcast(
    district: str = Query("Visakhapatnam", description="District for radar nowcasting"),
    time_offset_mins: int = Query(0, description="Time offset in minutes for nowcast animation")
) -> Dict[str, Any]:
    """Returns simulated Doppler Weather Radar (DWR) reflectivity contours and sweep parameters."""
    import numpy as np
    
    lat, lng = DISTRICT_COORDS.get(district, [17.6868, 83.2185])
    
    # Generate deterministic radar cells/rings based on the time offset
    angle_rad = (time_offset_mins * 2.0 * np.pi) / 60.0  # complete rotation every 60 mins
    dx = 0.05 * np.cos(angle_rad)
    dy = 0.05 * np.sin(angle_rad)
    
    contours = [
        {
            "dbz": 20,
            "color": "#3b82f6",  # Blue
            "opacity": 0.35,
            "center": [lat + dy + 0.02, lng + dx + 0.03],
            "radius_km": 25.0
        },
        {
            "dbz": 35,
            "color": "#f59e0b",  # Orange
            "opacity": 0.5,
            "center": [lat + dy, lng + dx],
            "radius_km": 15.0
        },
        {
            "dbz": 50,
            "color": "#ef4444",  # Red
            "opacity": 0.65,
            "center": [lat + dy - 0.01, lng + dx - 0.01],
            "radius_km": 8.0
        }
    ]
    
    return {
        "status": "success",
        "district": district,
        "radar_center": [lat, lng],
        "sweep_radius_km": 120.0,
        "current_sweep_angle": (time_offset_mins * 6) % 360,
        "contours": contours
    }
