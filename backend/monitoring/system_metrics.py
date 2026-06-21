from typing import Dict, Any
import datetime

class SystemMetricsCollector:
    def get_payload(self) -> Dict[str, Any]:
        return {
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "active_connections": 142,
            "requests_processed_count": 8920
        }
