import time
from typing import Callable, Any

class SpeedBenchmarkEngine:
    def measure_execution(self, name: str, task: Callable[[], Any]) -> float:
        t0 = time.time()
        task()
        t1 = time.time()
        return round((t1 - t0) * 1000.0, 2)  # ms
