from typing import List, Dict, Any

class TrendEngine:
    """
    Analyzes trajectories of historical values to determine climate trends.
    """
    def analyze_trends(self, history: List[Dict[str, Any]]) -> Dict[str, Any]:
        if len(history) < 2:
            return {"temperature_trend": "Stable", "rainfall_trend": "Stable"}
            
        # Linear slope indicator
        temps = [x["temperature"] for x in history]
        rains = [x["rainfall"] for x in history]
        
        t_slope = (temps[-1] - temps[0]) / len(temps)
        r_slope = (rains[-1] - rains[0]) / len(rains)
        
        return {
            "temperature_trend": "Increasing" if t_slope > 0.05 else "Decreasing" if t_slope < -0.05 else "Stable",
            "rainfall_trend": "Increasing" if r_slope > 0.5 else "Decreasing" if r_slope < -0.5 else "Stable",
            "last_30_days_rainfall": round(sum(rains), 1)
        }
