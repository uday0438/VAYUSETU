from typing import List, Dict, Any

class TwinAlertManager:
    def generate_alerts(self, risk_score: float, district: str) -> List[Dict[str, Any]]:
        alerts = []
        if risk_score > 75.0:
            alerts.append({
                "district": district,
                "severity": "CRITICAL",
                "message": f"Critical Climate Hazard Risk: {risk_score}%",
                "recommended_action": "Evacuate low-lying areas and release water from local reservoirs."
            })
        elif risk_score > 50.0:
            alerts.append({
                "district": district,
                "severity": "WARNING",
                "message": f"Elevated Climate Hazard Risk: {risk_score}%",
                "recommended_action": "Alert local response teams and monitor weather radar."
            })
        return alerts
