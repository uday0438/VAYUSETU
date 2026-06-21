import random
from typing import Dict, Any

class MosdacConnector:
    def fetch_data(self) -> Dict[str, Any]:
        return {
            "source": "MOSDAC",
            "connected": True,
            "ocean_wind_vectors_ms": round(random.uniform(5.0, 18.0), 1),
            "cloud_motion_vectors": "OK",
            "water_vapor_depth_mm": round(random.uniform(15.0, 60.0), 1),
            "status": "OPERATIONAL"
        }
