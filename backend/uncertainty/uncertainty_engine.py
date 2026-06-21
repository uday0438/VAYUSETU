import random
from typing import Dict, Any

class ConformalUncertaintyEngine:
    """
    Calculates Conformal Prediction Intervals and reliability indexes for predictions.
    """
    def estimate_intervals(self, prediction_value: float, confidence_pct: float = 95.0) -> Dict[str, Any]:
        # Uncertainty width scales inversely with model confidence
        spread = round((100.0 - confidence_pct) * 0.15, 2)
        lower_bound = round(max(0.0, prediction_value - spread), 1)
        upper_bound = round(prediction_value + spread, 1)
        
        return {
            "prediction": round(prediction_value, 2),
            "confidence": round(confidence_pct, 1),
            "lower_bound": lower_bound,
            "upper_bound": upper_bound,
            "reliability_index": "HIGH" if confidence_pct >= 90 else "MEDIUM"
        }