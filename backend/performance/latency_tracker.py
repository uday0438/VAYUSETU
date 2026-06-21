import time
from typing import Dict, Any

class LatencyTracker:
    _metrics = {}
    
    def log_latency(self, endpoint: str, start_time: float):
        latency = (time.time() - start_time) * 1000.0  # ms
        self._metrics[endpoint] = round(latency, 2)
        
    def get_metrics(self) -> Dict[str, float]:
        return self._metrics
