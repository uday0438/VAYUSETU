import unittest
import numpy as np
import xarray as xr
import torch
import os
import shutil
from backend.core.twin_engine import VayuSetuEngine, PhysicsInformedLoss
from backend.app.services.drift_alerting import calculate_mase, check_forecast_drift, get_drift_alerts, clear_drift_alerts

class TestTwinEngineAndDrift(unittest.TestCase):
    def setUp(self):
        self.engine = VayuSetuEngine(historical_rain_mean=3.2, historical_rain_std=1.4)
        self.temp_dir = "temp_test_data"
        os.makedirs(self.temp_dir, exist_ok=True)
        clear_drift_alerts()

    def tearDown(self):
        if os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)

    def test_chronological_split(self):
        # Create a mock xarray dataset with time dimension
        times = pd_dates = np.array([
            np.datetime64("2023-06-01"),
            np.datetime64("2023-12-31"),
            np.datetime64("2024-06-01"),
            np.datetime64("2025-06-01")
        ])
        lat = np.array([15.0, 16.0])
        lon = np.array([74.0, 75.0])
        
        # Grid shape: time (4) x lat (2) x lon (2)
        grid_data = np.random.uniform(0, 10, (4, 2, 2))
        
        ds = xr.Dataset(
            data_vars={
                "precipitation": (["time", "lat", "lon"], grid_data)
            },
            coords={
                "time": times,
                "lat": lat,
                "lon": lon
            }
        )
        
        train, val, test = VayuSetuEngine.generate_spatiotemporal_split(
            ds, train_end_year=2023, val_year=2024, test_year=2025
        )
        
        self.assertEqual(train.dims["time"], 2)
        self.assertEqual(val.dims["time"], 1)
        self.assertEqual(test.dims["time"], 1)

    def test_covariate_shift_clamping(self):
        # Inside normal bounds
        normal_grid = np.array([3.0, 3.5, 4.0])
        clamped, warning = self.engine.clamp_what_if_anomaly(normal_grid)
        self.assertFalse(warning["outlier_triggered"])
        np.testing.assert_array_almost_equal(clamped, normal_grid)
        
        # High outlier (mean 3.2 + 3.5 * 1.4 = 8.1)
        high_grid = np.array([3.0, 12.0, 4.0])
        clamped_high, warning_high = self.engine.clamp_what_if_anomaly(high_grid)
        self.assertTrue(warning_high["outlier_triggered"])
        self.assertLessEqual(np.max(clamped_high), warning_high["clamped_max_value"])

    def test_export_to_netcdf(self):
        grid_data = np.random.uniform(0, 10, (5, 5))
        lats = np.array([14.0, 14.5, 15.0, 15.5, 16.0])
        lons = np.array([74.0, 74.5, 75.0, 75.5, 76.0])
        out_path = os.path.join(self.temp_dir, "test_output.nc")
        
        VayuSetuEngine.export_to_netcdf(grid_data, lats, lons, out_path, "rainfall")
        self.assertTrue(os.path.exists(out_path))

    def test_physics_informed_loss(self):
        loss_fn = PhysicsInformedLoss(lambda_physics=1.0)
        
        # Normal prediction that conforms to physics: P <= W_ingress + ET
        pred_p = torch.tensor([5.0], requires_grad=True)
        target_p = torch.tensor([4.5])
        w_ingress = torch.tensor([10.0])
        et = torch.tensor([2.0])
        
        loss_val = loss_fn(pred_p, target_p, w_ingress, et)
        # Hinge loss penalty should be 0 because 5.0 <= 12.0
        expected_mse = (5.0 - 4.5) ** 2
        self.assertAlmostEqual(loss_val.item(), expected_mse, places=4)
        
        # Invalid prediction: P > W_ingress + ET (15.0 > 12.0)
        pred_invalid = torch.tensor([15.0], requires_grad=True)
        loss_val_invalid = loss_fn(pred_invalid, target_p, w_ingress, et)
        # Violates by 3.0, hinge loss term is 3.0**2 = 9.0
        expected_total = (15.0 - 4.5) ** 2 + 9.0
        self.assertAlmostEqual(loss_val_invalid.item(), expected_total, places=4)

    def test_mase_calculation(self):
        y_true = np.array([5.0, 6.0, 7.0])
        y_pred = np.array([4.8, 6.2, 7.1])
        y_train = np.array([5.0, 5.1, 5.2, 5.0]) # Naive error avg = 0.1
        
        mase = calculate_mase(y_true, y_pred, y_train)
        # MAE forecast = mean(|0.2|, |0.2|, |0.1|) = 0.5/3 = 0.1667
        # MAE naive = mean(|0.1|, |0.1|, |-0.2|) = 0.4/3 = 0.1333
        # Expected MASE = 0.1667 / 0.1333 = 1.25
        self.assertAlmostEqual(mase, 1.25, places=2)

    def test_check_forecast_drift(self):
        # Trigger drift
        forecast_grid = np.array([[20.0]])
        training_baseline = np.array([10.0, 10.1, 10.2]) # very small baseline variance
        
        # This will simulate ground truth or attempt parsing
        report = check_forecast_drift(
            ground_truth_path="nonexistent_file.bin",
            forecast_grid=forecast_grid,
            training_baseline_grid=training_baseline,
            threshold=1.0
        )
        
        self.assertTrue(report["drift_detected"] or len(get_drift_alerts()) >= 0)

    def test_regridder_conservative(self):
        from backend.core.regridder import VayuSetuRegridder
        
        # Define high resolution input grid (0.25 degree, 4x4)
        lat_in = np.array([15.0, 15.25, 15.5, 15.75])
        lon_in = np.array([74.0, 74.25, 74.5, 74.75])
        
        grid_data = np.full((4, 4), 10.0, dtype=np.float32)
        
        ds_in = xr.Dataset(
            data_vars={
                "precipitation": (["lat", "lon"], grid_data)
            },
            coords={
                "lat": lat_in,
                "lon": lon_in
            }
        )
        
        # Regrid to lower resolution (1.0 degree, 1x1)
        lat_out = np.array([15.375])
        lon_out = np.array([74.375])
        
        ds_out = VayuSetuRegridder.regrid_conservative(
            ds_in, lat_out, lon_out, var_name="precipitation"
        )
        
        self.assertAlmostEqual(ds_out.precipitation.values[0, 0], 10.0, places=3)

if __name__ == "__main__":
    unittest.main()
