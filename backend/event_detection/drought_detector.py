from typing import Dict, Any

class DroughtDetector:
    def detect(self, rainfall_30d: float, soil_moisture: float) -> Dict[str, Any]:
        active = rainfall_30d < 40.0 and soil_moisture < 25.0
        severity = "None"
        if active:
            if soil_moisture < 15.0:
                severity = "Severe"
            else:
                severity = "Moderate"
                
        return {
            "event": "Drought",
            "active": active,
            "severity": severity,
            "description": f"Drought condition {severity.lower()} (Soil Moisture at {soil_moisture}%)"
        }
