import random
from typing import Dict, Any

class TwinFeedbackEngine:
    """
    Calculates the error between the forecast state and actual observations.
    Updates model calibration and logs data drift to trigger automated retraining.
    """
    def evaluate_forecast_accuracy(self, forecast: Dict[str, Any], observed: Dict[str, Any]) -> Dict[str, Any]:
        f_rain = forecast.get("rainfall", 0.0)
        o_rain = observed.get("rainfall", 0.0)
        error = abs(f_rain - o_rain)
        
        # Calculate drift rating
        drift_index = error / (o_rain + 1.0)
        drift_warning = drift_index > 0.25
        
        return {
            "error_magnitude": round(error, 2),
            "drift_index": round(drift_index, 3),
            "drift_warning": drift_warning,
            "calibration_correction_factor": round(1.0 - (error * 0.02), 3)
        }