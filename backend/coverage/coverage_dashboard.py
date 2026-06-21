from typing import Dict, Any
from .dataset_monitor import DatasetMonitor

class CoverageDashboard:
    def __init__(self):
        self.monitor = DatasetMonitor()
        
    def get_dashboard_data(self) -> Dict[str, Any]:
        metrics = self.monitor.check_streams()
        scores = metrics["coverage_scores"]
        return {
            "overall_score": metrics["overall_coverage"],
            "status": metrics["status"],
            "timestamp": metrics["timestamp"],
            "datasets": [
                {"name": "IMD Coverage", "score": scores["IMD"], "expected": "1/day"},
                {"name": "INSAT Coverage", "score": scores["INSAT"], "expected": "48/day"},
                {"name": "MOSDAC Coverage", "score": scores["MOSDAC"], "expected": "24/day"},
                {"name": "Bhuvan Layers", "score": scores["Bhuvan"], "expected": "4/day"},
                {"name": "NICES Products", "score": scores["NICES"], "expected": "1/day"}
            ]
        }
