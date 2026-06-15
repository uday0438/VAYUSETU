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

if __name__ == "__main__":
    unittest.main()
