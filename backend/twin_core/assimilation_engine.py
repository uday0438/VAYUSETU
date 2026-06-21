from typing import Dict, Any

class KalmanAssimilationEngine:
    """
    Fuses INSAT/MOSDAC satellite observation grids with IMD ground truth measurements.
    Applies a discrete Kalman Filter to update the twin state vector.
    """
    def __init__(self, process_variance: float = 0.15, measurement_variance: float = 0.25):
        self.q = process_variance
        self.r = measurement_variance

    def assimilate(self, predicted_val: float, observed_val: float, prior_covariance: float) -> Dict[str, float]:
        # Kalman Filter update equations
        k_gain = prior_covariance / (prior_covariance + self.r)
        corrected_state = predicted_val + k_gain * (observed_val - predicted_val)
        updated_covariance = (1 - k_gain) * prior_covariance + self.q
        
        return {
            "corrected_state": round(corrected_state, 3),
            "kalman_gain": round(k_gain, 4),
            "updated_covariance": round(updated_covariance, 4)
        }