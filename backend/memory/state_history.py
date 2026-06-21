import random
import datetime
from typing import List, Dict, Any

class StateHistoryManager:
    """
    Manages and versions the historical records of the digital twin states.
    """
    def __init__(self):
        pass
        
    def get_history(self, district: str) -> List[Dict[str, Any]]:
        # Generates deterministic mock historical data based on district
        seed = sum(ord(c) for c in district)
        random.seed(seed)
        
        base_temp = 28.0 + (seed % 10)
        base_rain = 50.0 + (seed % 150)
        base_sm = 45.0 + (seed % 40)
        
        history = []
        now = datetime.datetime.utcnow()
        
        # Create 30 data points representing daily summaries
        for i in range(30, 0, -1):
            timestamp = (now - datetime.timedelta(days=i)).isoformat() + "Z"
            history.append({
                "timestamp": timestamp,
                "temperature": round(base_temp + random.uniform(-2.0, 2.0), 1),
                "rainfall": round(max(0.0, base_rain + random.uniform(-15.0, 35.0)), 1),
                "soil_moisture": round(max(10.0, min(95.0, base_sm + random.uniform(-8.0, 8.0))), 1),
                "lst": round(base_temp + random.uniform(-1.0, 3.0), 1),
                "sst": round(27.0 + random.uniform(-0.5, 0.5), 1)
            })
        return history
        
    def aggregate_by_window(self, history: List[Dict[str, Any]], days: int) -> Dict[str, Any]:
        subset = history[-days:] if len(history) >= days else history
        if not subset:
            return {}
            
        avg_temp = sum(x["temperature"] for x in subset) / len(subset)
        total_rain = sum(x["rainfall"] for x in subset)
        avg_sm = sum(x["soil_moisture"] for x in subset) / len(subset)
        
        return {
            "avg_temperature": round(avg_temp, 1),
            "total_rainfall": round(total_rain, 1),
            "avg_soil_moisture": round(avg_sm, 1)
        }
