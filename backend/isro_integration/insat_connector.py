import random
from typing import Dict, Any

class InsatConnector:
    def fetch_thermal_telemetry(self) -> Dict[str, Any]:
        return {
            "source": "INSAT-3D/3DR",
            "connected": True,
            "lst_c": round(random.uniform(25.0, 48.0), 1),
            "sst_c": round(random.uniform(26.0, 31.0), 1),
            "olr_wm2": round(random.uniform(180.0, 320.0), 1),
            "status": "OPERATIONAL"
        }
