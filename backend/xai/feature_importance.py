from typing import List, Dict

class FeatureImportanceTracker:
    def get_global_importances(self) -> List[Dict[str, Any]]:
        return [
            {"feature": "SST Anomaly", "importance": 0.38},
            {"feature": "LST Anomaly", "importance": 0.27},
            {"feature": "Soil Moisture", "importance": 0.18},
            {"feature": "Relative Humidity", "importance": 0.11},
            {"feature": "Wind Speed", "importance": 0.06}
        ]