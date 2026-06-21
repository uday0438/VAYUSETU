from typing import Dict, Any

class CacheManager:
    _in_memory_db = {}
    
    def cache_state(self, district: str, state: Dict[str, Any]):
        self._in_memory_db[district] = state
        
    def get_cached_state(self, district: str) -> Dict[str, Any]:
        return self._in_memory_db.get(district)
