import unittest
from app.services.data_assimilation import KalmanFilter1D, assimilate_climate_state
from app.services.drift_detector import (
    compute_model_health_and_drift,
    trigger_model_retrain,
    record_prediction_error,
    get_retrain_count
)

class TestDataAssimilationAndDrift(unittest.TestCase):
    def test_kalman_filter_correction(self):
        # Test basic Kalman Filter class
        kf = KalmanFilter1D(process_noise=0.1, measurement_noise=0.5)
        # Prior cov = 1.0, process noise q = 0.1 -> prior p_minus = 1.1
        # Denominator = p_minus + r = 1.1 + 0.5 = 1.6
        # K = 1.1 / 1.6 = 0.6875
        # Corrected state = 30 + 0.6875 * (32 - 30) = 31.375 -> rounded to 31.38
        # Covariance = (1 - 0.6875) * 1.1 = 0.3125 * 1.1 = 0.34375 -> rounded to 0.3438
        res = kf.assimilate(predicted_state=30.0, observation=32.0, prior_covariance=1.0)
        self.assertEqual(res["corrected_state"], 31.38)
        self.assertEqual(res["kalman_gain"], 0.6875)
        self.assertEqual(res["updated_covariance"], 0.3438)

    def test_assimilate_climate_state(self):
        # Run bulk state assimilation
        res = assimilate_climate_state(
            predicted_temp=30.0, observed_temp=31.0,
            predicted_rain=80.0, observed_rain=85.0,
            predicted_sm=50.0, observed_sm=52.0,
            predicted_hum=70.0, observed_hum=72.0
        )
        self.assertIn("temperature", res)
        self.assertIn("rainfall", res)
        self.assertIn("soil_moisture", res)
        self.assertIn("humidity", res)
        self.assertIn("average_kalman_gain", res)
        self.assertGreaterEqual(res["average_kalman_gain"], 0.0)
        self.assertLessEqual(res["average_kalman_gain"], 1.0)

    def test_drift_detection_and_retraining(self):
        initial_status = compute_model_health_and_drift()
        initial_retrains = initial_status["retrains_completed"]
        
        # Test recording errors
        for _ in range(10):
            record_prediction_error(3.5) # Record high error to trigger drift recommendation
            
        drifting_status = compute_model_health_and_drift()
        self.assertIn(drifting_status["drift_status"], ["DRIFTING", "CRITICAL_DRIFT"])
        self.assertTrue(drifting_status["retrain_recommended"])
        
        # Trigger retraining
        trigger_model_retrain()
        after_retrain_status = compute_model_health_and_drift()
        self.assertEqual(after_retrain_status["retrains_completed"], initial_retrains + 1)
        self.assertEqual(after_retrain_status["drift_status"], "STABLE")
        self.assertFalse(after_retrain_status["retrain_recommended"])

if __name__ == "__main__":
    unittest.main()
