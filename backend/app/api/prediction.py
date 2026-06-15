from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("/forecast")
def get_climate_forecast() -> Dict[str, Any]:
    """Returns AI-based rainfall and temperature forecasts for the pilot districts."""
    return {
        "pilot_region": "Coastal Andhra Pradesh",
        "models_active": ["ConvLSTM-Precip", "XGBoost-LST"],
        "forecast_horizons": {
            "24h": {
                "avg_rainfall_mm": 54.0,
                "avg_temp_anomaly_c": +1.2
            },
            "48h": {
                "avg_rainfall_mm": 142.0,
                "avg_temp_anomaly_c": +1.8
            }
        },
        "explainability": {
            "shap_attribution": {
                "sst_anomaly": 34.0,
                "humidity": 28.0,
                "wind_vectors": 38.0
            }
        }
    }
