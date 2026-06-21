from typing import Dict, Any
from backend.app.services import models_ensemble

class EnsemblePredictor:
    def predict(self, base_val: float, parameter: str, district: str) -> Dict[str, Any]:
        return models_ensemble.get_ensemble_forecast(base_val, parameter, district)
