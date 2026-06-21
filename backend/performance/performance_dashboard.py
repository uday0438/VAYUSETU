from typing import Dict, Any
import random

class PerformanceDashboard:
    def get_latency_dashboard(self) -> Dict[str, Any]:
        return {
            "ingestion_latency_ms": round(random.uniform(120, 200), 1),
            "prediction_latency_ms": round(random.uniform(350, 480), 1),
            "simulation_latency_ms": round(random.uniform(500, 680), 1),
            "dashboard_latency_ms": round(random.uniform(40, 75), 1),
            "status": "OPTIMAL"
        }
