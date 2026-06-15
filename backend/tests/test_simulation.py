import unittest
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from digital_twin.simulation_engine.runoff_model import calculate_rational_runoff, assess_flood_hazard, run_district_flood_simulation

class TestHydrologicalSimulation(unittest.TestCase):
    def test_rational_runoff_calculation(self):
        """Test the standard rational runoff Q = C * I * A * conversion."""
        # C = 0.6, I = 20 mm/hr, A = 100 km2
        # Q = 0.6 * 20 * 100 * 0.2778 = 333.36
        q = calculate_rational_runoff(20, 100, 0.6)
        self.assertAlmostEqual(q, 333.36, places=1)

    def test_flood_hazard_assessment(self):
        """Test flood hazard level and score assignments."""
        # Discharge (150) / Capacity (300) = 0.5 (< 0.6) -> LOW hazard
        low_hazard = assess_flood_hazard(150, 300)
        self.assertEqual(low_hazard["hazard_level"], "LOW")
        self.assertEqual(low_hazard["risk_score"], 40) # 0.5 * 100 * 0.8
        
        # Discharge (270) / Capacity (300) = 0.9 (>= 0.9) -> CRITICAL hazard
        crit_hazard = assess_flood_hazard(270, 300)
        self.assertEqual(crit_hazard["hazard_level"], "CRITICAL")
        self.assertEqual(crit_hazard["risk_score"], 90)

    def test_district_simulation_scenarios(self):
        """Test dynamic simulations under what-if input vectors."""
        results = run_district_flood_simulation(
            precipitation_anomaly_pct=20.0, # +20% rain
            urbanization_increase_pct=15.0 # +15% urban
        )
        
        # Ensure all pilot districts exist in output
        self.assertIn("Visakhapatnam", results)
        self.assertIn("Nellore", results)
        self.assertIn("Vijayawada", results)
        
        # Visakhapatnam base area is 540km2, capacity 250.
        # With +20% precipitation, rainfall goes from 120 to 144mm.
        # Intensity = 144 / 6 = 24 mm/hr.
        # Simulated C = 0.65 + 15 * 0.005 = 0.725
        # Q = 0.725 * 24 * 540 * 0.2778 = 261.02 m3s
        # Q (261) / Cap (250) = 1.04 -> CRITICAL hazard
        viz_res = results["Visakhapatnam"]
        self.assertEqual(viz_res["rainfall_mm"], 144.0)
        self.assertEqual(viz_res["runoff_coefficient"], 0.72) # Rounded
        self.assertEqual(viz_res["hazard_level"], "CRITICAL")
        self.assertTrue(viz_res["risk_score"] > 80)

if __name__ == "__main__":
    unittest.main()
