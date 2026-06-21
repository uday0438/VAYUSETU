import time
from typing import Callable, Any

class RetryHandler:
    def execute_with_retry(self, func: Callable[[], Any], retries: int = 3, delay: float = 1.0) -> Any:
        for attempt in range(retries):
            try:
                return func()
            except Exception as e:
                if attempt == retries - 1:
                    raise e
                time.sleep(delay * (2 ** attempt))
