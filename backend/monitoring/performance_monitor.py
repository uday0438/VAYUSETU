import random
from typing import Dict, Any

class SysPerformanceMonitor:
    def check_sys_resources(self) -> Dict[str, Any]:
        return {
            "cpu_utilization_pct": round(random.uniform(15.0, 45.0), 1),
            "memory_usage_gb": round(random.uniform(3.2, 5.8), 2),
            "disk_io_mbs": round(random.uniform(2.5, 12.0), 1)
        }
