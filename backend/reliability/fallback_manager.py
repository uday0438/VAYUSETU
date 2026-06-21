import logging
from typing import Dict, Any
from .cache_manager import CacheManager

logger = logging.getLogger(__name__)

class FallbackManager:
    """
    Retrieves backup parameters when telemetry servers are down.
    """
    def __init__(self):
        self.cache = CacheManager()
        
    def get_fallback_state(self, district: str) -> Dict[str, Any]:
        logger.warning(f"Telemetry stream interrupted for {district}. Activating fallbacks.")
        cached_state = self.cache.get_cached_state(district)
        if cached_state:
            cached_state["mode"] = "FALLBACK_CACHED"
            return cached_state
            
        # Fallback values
        return {
            "mode": "FALLBACK_STATIC_CLIMATOLOGY",
            "temperature": 30.5,
            "rainfall": 20.0,
            "humidity": 65.0,
            "soil_moisture": 40.0,
            "lst": 31.0,
            "sst": 28.0
        }
