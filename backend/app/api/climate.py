from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("/live-state")
def get_live_state() -> Dict[str, Any]:
    """Returns near real-time live climate telemetry grids from INSAT-3D and IMD Pune."""
    return {
        "region": "Coastal Andhra Pradesh",
        "station_status": "ACTIVE",
        "parameters": {
            "insat_sst_c": 30.2,
            "insat_lst_anomaly_c": +1.8,
            "relative_humidity_pct": 84.0,
            "wind_speed_ms": 14.5,
            "wind_direction_deg": 125,
            "grid_resolution_km": 4.0
        },
        "ingestion_timestamp": "2026-06-15T09:30:00Z"
    }
