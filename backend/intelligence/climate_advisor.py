from typing import List, Dict, Any

class ClimateAdvisor:
    """
    Actionable emergency response advisories for municipal planners.
    """
    def generate_flood_advisory(self, risk_score: float) -> Dict[str, Any]:
        if risk_score > 75:
            return {
                "level": "CRITICAL",
                "actions": [
                    "Deploy NDRF teams to low-lying drainage segment basins.",
                    "Initiate early releases of reservoir canal gates by 15%.",
                    "Close sluices on Pennar/Godavari branches and notify village hubs."
                ]
            }
        elif risk_score > 50:
            return {
                "level": "ELEVATED",
                "actions": [
                    "Monitor minor municipal runoff channels and drainage paths.",
                    "Issue agricultural caution alerts to rural segment offices."
                ]
            }
        return {
            "level": "NORMAL",
            "actions": [
                "Maintain default water conservation protocols."
            ]
        }