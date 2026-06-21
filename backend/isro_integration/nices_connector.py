import random
from typing import Dict, Any

class NicesConnector:
    def fetch_climate_variables(self) -> Dict[str, Any]:
        return {
            "source": "NICES",
            "connected": True,
            "albedo_fraction": round(random.uniform(0.12, 0.25), 2),
            "soil_moisture_fraction": round(random.uniform(0.15, 0.75), 2),
            "aerosol_optical_depth": round(random.uniform(0.2, 0.8), 2),
            "status": "OPERATIONAL"
        }
