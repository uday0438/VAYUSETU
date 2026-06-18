import unittest
from fastapi.testclient import TestClient
import sys
import os

# Adjust path to import app correctly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

class TestVayuSetuBackend(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_check_endpoint(self):
        """Test that the core API gateway health check resolves successfully."""
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertEqual(json_data["status"], "healthy")
        self.assertEqual(json_data["service"], "VAYUSETU Climate API Gateway")
        self.assertEqual(json_data["version"], "1.0.0")

    def test_live_state_endpoint(self):
        """Test that the live-state endpoint retrieves dynamic climate data successfully."""
        response = self.client.get("/api/v1/climate/live-state?district=Visakhapatnam")
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertEqual(json_data["district"], "Visakhapatnam")
        self.assertIn("temperature", json_data)
        self.assertIn("rainfall", json_data)
        self.assertIn("heatwave_risk", json_data)
        self.assertIn("sector_impacts", json_data)
        self.assertIn("vayusetu_risk_score", json_data)

    def test_monsoon_tracker_endpoint(self):
        """Test that the monsoon-tracker endpoint serves tracker statistics successfully."""
        response = self.client.get("/api/v1/climate/monsoon-tracker")
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertIn("monsoon_status", json_data)
        self.assertIn("onset_date_kerala", json_data)
        self.assertIn("monsoonal_wind_vectors_ms", json_data)

    def test_forecast_endpoint(self):
        """Test that the forecast endpoint serves multi-model predictions with ranges."""
        response = self.client.get("/api/v1/prediction/forecast?district=Visakhapatnam")
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertIn("forecast_horizons", json_data)
        self.assertIn("rainfall", json_data["forecast_horizons"])
        self.assertIn("range_bounds", json_data["forecast_horizons"]["rainfall"])

    def test_hydraulic_routing_endpoint(self):
        """Test the /hydraulic-routing endpoint returns simulated 2D flood depth grid."""
        response = self.client.get("/api/v1/simulation/hydraulic-routing?district=Visakhapatnam&precipitation_anomaly_pct=30")
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertEqual(json_data["status"], "success")
        self.assertIn("depth_grid", json_data)
        self.assertIn("velocity_x_grid", json_data)
        self.assertEqual(json_data["grid_dims"], [16, 16])

    def test_radar_nowcast_endpoint(self):
        """Test the /radar-nowcast endpoint returns reflectivity contours."""
        response = self.client.get("/api/v1/prediction/radar-nowcast?district=Visakhapatnam&time_offset_mins=15")
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertEqual(json_data["status"], "success")
        self.assertIn("contours", json_data)
        self.assertTrue(len(json_data["contours"]) > 0)
        self.assertIn("current_sweep_angle", json_data)

    def test_climate_timeline_endpoint_upgraded(self):
        """Test that the /climate-timeline endpoint returns gridded crop coefficient projections."""
        response = self.client.get("/api/v1/simulation/climate-timeline?year=2040")
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertEqual(json_data["year"], 2040)
        self.assertIn("crop_kc_projections", json_data)
        self.assertIn("rice", json_data["crop_kc_projections"])
        self.assertTrue(json_data["crop_kc_projections"]["rice"]["irrigation_multiplier"] > 1.0)

if __name__ == "__main__":
    unittest.main()
