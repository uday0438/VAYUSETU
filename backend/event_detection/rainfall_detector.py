from typing import Dict, Any

class RainfallDetector:
    def detect(self, daily_rain: float) -> Dict[str, Any]:
        active = daily_rain > 64.5
        severity = "None"
        if active:
            if daily_rain > 244.4:
                severity = "Extremely Heavy"
            elif daily_rain > 115.5:
                severity = "Very Heavy"
            else:
                severity = "Heavy"
                
        return {
            "event": "Heavy Rainfall",
            "active": active,
            "severity": severity,
            "rainfall_val": daily_rain
        }
