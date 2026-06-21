import random
from typing import Dict, Any

class BhuvanConnector:
    def get_geospatial_layers(self, district: str) -> Dict[str, Any]:
        return {
            "source": "Bhuvan Geoportal",
            "connected": True,
            "district": district,
            "lulc_class": random.choice(["Agricultural Land", "Forest", "Urban Build-up", "Water Body"]),
            "soil_type": random.choice(["Clayey", "Loamy", "Alluvial", "Sandy"]),
            "catchment_slope_deg": round(random.uniform(0.5, 8.5), 1),
            "status": "OPERATIONAL"
        }
