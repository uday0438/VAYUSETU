from typing import Dict, Any

class KalmanFilter1D:
    """
    A simple 1D Kalman Filter to assimilate climate observations with model predictions.
    Computes corrected state values, Kalman Gain, and updated error covariances.
    """
    def __init__(self, process_noise: float = 0.1, measurement_noise: float = 0.5):
        self.q = process_noise  # Process noise covariance
        self.r = measurement_noise  # Measurement noise covariance
        
    def assimilate(self, predicted_state: float, observation: float, prior_covariance: float = 1.0) -> Dict[str, Any]:
        """
        Assimilates a single observation with a predicted state.
        
        Args:
            predicted_state (float): Model predicted value (x_minus)
            observation (float): Sensor/satellite observed value (z)
            prior_covariance (float): Prior state error covariance (P_minus)
            
        Returns:
            dict: Corrected state, Kalman Gain, and updated error covariance.
        """
        # Time update (prediction step error propagation)
        p_minus = prior_covariance + self.q
        
        # Measurement update (correction step)
        # Kalman Gain: K = P_minus / (P_minus + R)
        denominator = p_minus + self.r
        kalman_gain = p_minus / denominator if denominator > 0 else 0.0
        
        # Corrected State: x = x_minus + K * (z - x_minus)
        corrected_state = predicted_state + kalman_gain * (observation - predicted_state)
        
        # Updated Error Covariance: P = (1 - K) * P_minus
        updated_covariance = (1.0 - kalman_gain) * p_minus
        
        return {
            "corrected_state": round(corrected_state, 2),
            "kalman_gain": round(kalman_gain, 4),
            "updated_covariance": round(updated_covariance, 4)
        }

# Instantiate standard filters for parameters
temp_filter = KalmanFilter1D(process_noise=0.15, measurement_noise=0.45)
rain_filter = KalmanFilter1D(process_noise=2.0, measurement_noise=5.0)
sm_filter = KalmanFilter1D(process_noise=1.5, measurement_noise=4.0)
humidity_filter = KalmanFilter1D(process_noise=1.0, measurement_noise=3.5)

def assimilate_climate_state(
    predicted_temp: float, observed_temp: float,
    predicted_rain: float, observed_rain: float,
    predicted_sm: float, observed_sm: float,
    predicted_hum: float, observed_hum: float
) -> Dict[str, Any]:
    """
    Runs multi-parameter data assimilation for a district state update.
    """
    temp_res = temp_filter.assimilate(predicted_temp, observed_temp)
    rain_res = rain_filter.assimilate(predicted_rain, observed_rain)
    sm_res = sm_filter.assimilate(predicted_sm, observed_sm)
    hum_res = humidity_filter.assimilate(predicted_hum, observed_hum)
    
    return {
        "temperature": temp_res,
        "rainfall": rain_res,
        "soil_moisture": sm_res,
        "humidity": hum_res,
        "average_kalman_gain": round((temp_res["kalman_gain"] + rain_res["kalman_gain"] + sm_res["kalman_gain"] + hum_res["kalman_gain"]) / 4.0, 4)
    }
