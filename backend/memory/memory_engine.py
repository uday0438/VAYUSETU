from typing import Dict, Any, List
import datetime
from .state_history import StateHistoryManager
from .trend_engine import TrendEngine

class ClimateMemoryEngine:
    """
    Coordinates the retrieval of Past, Current, and Future Twin States.
    """
    def __init__(self):
        self.history_mgr = StateHistoryManager()
        self.trend_engine = TrendEngine()
        
    def get_district_memory(self, district: str) -> Dict[str, Any]:
        history = self.history_mgr.get_history(district)
        trends = self.trend_engine.analyze_trends(history)
        
        # Latest recorded state
        current = history[-1] if history else {"temperature": 32.0, "rainfall": 80.0}
        
        return {
            "district": district,
            "current_state": current,
            "past_trends": trends,
            "ranges": {
                "last_24_hours": self.history_mgr.aggregate_by_window(history, 1),
                "last_7_days": self.history_mgr.aggregate_by_window(history, 7),
                "last_30_days": self.history_mgr.aggregate_by_window(history, 30),
                "last_1_year": self.history_mgr.aggregate_by_window(history, 365)
            }
        }
