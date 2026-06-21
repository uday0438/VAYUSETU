from typing import Dict, Any

class HeatwaveDetector:
    def detect(self, temperature: float, base_normal: float = 35.0) -> Dict[str, Any]:
        anomaly = temperature - base_normal
        severity = "None"
        if anomaly >= 6.4:
            severity = "Severe"
        elif anomaly >= 4.5:
            severity = "Moderate"
            
        return {
            "event": "Heatwave",
            "active": severity != "None",
            "severity": severity,
            "anomaly_c": round(anomaly, 1),
            "description": f"Heatwave condition is {severity.lower()} with anomaly {anomaly:.1f}°C"
        }
