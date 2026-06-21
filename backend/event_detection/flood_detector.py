from typing import Dict, Any

class FloodDetector:
    def detect(self, rainfall: float, soil_moisture: float) -> Dict[str, Any]:
        # High rainfall on saturated soil triggers high flood risk
        active = rainfall > 80.0 and soil_moisture > 75.0
        severity = "None"
        if active:
            if rainfall > 150.0:
                severity = "Critical"
            else:
                severity = "High"
                
        return {
            "event": "Flood",
            "active": active,
            "severity": severity,
            "indicator": f"Rainfall: {rainfall}mm, Soil Saturation: {soil_moisture}%"
        }
