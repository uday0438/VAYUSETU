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
        self.assertIn("New Delhi", results)
        self.assertIn("Mumbai", results)
        
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

    def test_saint_venant_solver_2d(self):
        """Test Saint-Venant 2D hydraulic flood routing solver matrix outputs."""
        import numpy as np
        from app.services.hydraulic_routing import SaintVenantSolver2D
        
        nx, ny = 8, 8
        elevation = np.ones((nx, ny)) * 10.0
        # Create a slope in elevation
        for i in range(nx):
            elevation[i, :] = 10.0 - i * 0.5
            
        runoff = np.zeros((nx, ny))
        runoff[3, 3] = 0.5  # Input runoff in the center
        
        solver = SaintVenantSolver2D(nx=nx, ny=ny, dx=10.0, dy=10.0, dt=0.01)
        h, u, v = solver.solve(elevation, runoff, steps=5)
        
        self.assertEqual(h.shape, (nx, ny))
        self.assertEqual(u.shape, (nx, ny))
        self.assertEqual(v.shape, (nx, ny))
        # Water should flow down the slope (positive u-velocity in x-direction due to elevation difference)
        self.assertTrue(np.any(u > 0.0))

    def test_dataset_ingestor(self):
        """Test dataset ingestor parsing functions and fallback generation."""
        from app.services.dataset_ingestor import DatasetIngestor
        
        ingestor = DatasetIngestor(data_dir="temp_test_data")
        
        lst_grid = ingestor.parse_insat_hdf5("mock_insat.h5", product_type="LST")
        self.assertEqual(lst_grid.shape, (16, 16))
        
        sst_grid = ingestor.parse_insat_hdf5("mock_insat.h5", product_type="SST")
        self.assertEqual(sst_grid.shape, (16, 16))
        
        rain_grid = ingestor.parse_imd_netcdf("mock_imd.nc", variable="rainfall")
        self.assertEqual(rain_grid.shape, (16, 16))
        
        sm_grid = ingestor.parse_era5_soil_moisture("mock_era5.nc")
        self.assertEqual(sm_grid.shape, (16, 16))

    def test_parse_imd_binary(self):
        """Test parser for raw IMD gridded binary files (.bin)."""
        import numpy as np
        from app.services.data_pipeline import parse_imd_binary
        
        file_path = "temp_test_imd.bin"
        lat_points, lon_points = 135, 129
        expected_size = lat_points * lon_points
        
        # Create test grid data with nan, 99.9 and -99.9 values
        test_data = np.random.rand(expected_size).astype(np.float32)
        test_data[10] = -99.9
        test_data[20] = 99.9
        test_data[30] = np.nan
        
        # Write to temporary file
        test_data.tofile(file_path)
        
        try:
            grid = parse_imd_binary(file_path, lat_points, lon_points)
            self.assertEqual(grid.shape, (lat_points, lon_points))
            # Check sanitization
            self.assertEqual(grid[0, 10], 0.0) # 10th index fits in first row
            self.assertEqual(grid[0, 20], 0.0)
            self.assertEqual(grid[0, 30], 0.0)
        finally:
            if os.path.exists(file_path):
                os.remove(file_path)

    def test_daily_ingestion_worker(self):
        """Test daily scheduler ingestion pipeline and logging."""
        from app.services.daily_ingestion_worker import DailyIngestionWorker
        worker = DailyIngestionWorker(data_dir="temp_test_data")
        res = worker.run_daily_update("2026-06-21")
        self.assertEqual(res["status"], "SUCCESS")
        self.assertIn("twin_version", res)
        self.assertIn("assimilation_run_id", res)
        self.assertIn("drift_report", res)

if __name__ == "__main__":
    unittest.main()
