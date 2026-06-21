import datetime
from typing import Dict, Any

class TwinStateManager:
    """
    Manages and versions the virtual gridded climate states of the Digital Twin.
    Saves and loads state vectors to database/storage.
    """
    def __init__(self):
        self.active_states = {}

    def save_state(self, district: str, state_vector: Dict[str, Any]) -> str:
        state_vector["saved_at"] = datetime.datetime.utcnow().isoformat() + "Z"
        self.active_states[district] = state_vector
        return state_vector["saved_at"]

    def load_state(self, district: str) -> Dict[str, Any]:
        return self.active_states.get(district, {
            "temperature": 30.5,
            "rainfall": 60.0,
            "humidity": 75.0,
            "soil_moisture": 50.0,
            "lst": 32.0,
            "sst": 28.5
        })