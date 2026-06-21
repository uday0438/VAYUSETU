from typing import Dict, Any

class CycloneDetector:
    def detect(self, district: str, sst: float, wind_speed_ms: float) -> Dict[str, Any]:
        # Cyclones generally occur if SST > 26.5 C and high coastal winds
        coastal_districts = ["Visakhapatnam", "Chennai", "Kochi", "Thiruvananthapuram", "Mumbai", "Surat", "Goa", "Puri", "Kolkata"]
        is_coastal = district in coastal_districts
        
        active = is_coastal and sst > 27.5 and wind_speed_ms > 17.0
        severity = "None"
        if active:
            if wind_speed_ms > 33.0:
                severity = "Super Cyclone"
            elif wind_speed_ms > 24.0:
                severity = "Very Severe"
            else:
                severity = "Moderate"
                
        return {
            "event": "Cyclone",
            "active": active,
            "severity": severity,
            "details": f"SST: {sst}°C, Wind Speed: {wind_speed_ms} m/s"
        }
