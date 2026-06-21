import numpy as np
import xarray as xr
import torch
import torch.nn as nn
from typing import Tuple, Dict, Any

class VayuSetuEngine:
    """Production-grade climate data engineering and structural validation suite."""
    
    def __init__(self, historical_rain_mean: float = 3.2, historical_rain_std: float = 1.4):
        self.rain_mean = historical_rain_mean
        self.rain_std = historical_rain_std

    # =========================================================================
    # FIX 1: CHRONOLOGICAL TIME-SERIES SPLIT (Anti-Temporal Leakage Engine)
    # =========================================================================
    @staticmethod
    def generate_spatiotemporal_split(
        dataset: xr.Dataset, 
        train_end_year: int = 2023, 
        val_year: int = 2024, 
        test_year: int = 2025
    ) -> Tuple[xr.Dataset, xr.Dataset, xr.Dataset]:
        """
        Enforces a strict chronological window split across spatial data grids.
        Eliminates temporal data leakage caused by naive random slicing.
        """
        # Slice chronologically using the xarray datetime indexing framework
        train_slice = dataset.sel(time=slice(None, f"{train_end_year}-12-31"))
        val_slice = dataset.sel(time=slice(f"{val_year}-01-01", f"{val_year}-12-31"))
        test_slice = dataset.sel(time=slice(f"{test_year}-01-01", f"{test_year}-12-31"))
        
        print(f"[SPATIOTEMPORAL SPLIT] Completed -> Train shapes: {train_slice.dims}")
        return train_slice, val_slice, test_slice

    # =========================================================================
    # FIX 2: COVARIATE SHIFT OUTLIER BOUNDARY CLAMPING ENGINE
    # =========================================================================
    def clamp_what_if_anomaly(self, user_input_grid: np.ndarray) -> Tuple[np.ndarray, Dict[str, Any]]:
        """
        Calculates historical deviations and clamps extreme mathematical inputs
        to prevent neural network divergence during out-of-bounds testing.
        """
        # Calculate strict outlier boundaries at +/- 3.5 standard deviations
        max_bound = self.rain_mean + (3.5 * self.rain_std)
        min_bound = max(0.0, self.rain_mean - (3.5 * self.rain_std)) # Rain cannot be negative
        
        # Check if the user simulation triggers a statistical outlier
        outlier_detected = np.any(user_input_grid > max_bound) or np.any(user_input_grid < min_bound)
        
        # Clamp matrix tensors to safe simulation domains
        clamped_grid = np.clip(user_input_grid, min_bound, max_bound)
        
        telemetry_warning = {
            "outlier_triggered": outlier_detected,
            "clamped_max_value": float(max_bound),
            "clamped_min_value": float(min_bound),
            "action_taken": "Matrix values clamped to safe training distributions." if outlier_detected else "Normal"
        }
        
        return clamped_grid, telemetry_warning

    # =========================================================================
    # FIX 3: NETCDF METADATA PRESERVATION ENGINE
    # =========================================================================
    @staticmethod
    def export_to_netcdf(
        grid_data: np.ndarray, 
        latitudes: np.ndarray, 
        longitudes: np.ndarray, 
        output_path: str,
        variable_name: str = "precipitation"
    ) -> None:
        """
        Converts raw tensor matrices back to standard NetCDF4 data structures,
        preserving Coordinate Reference Systems (CRS) and geospatial attributes.
        """
        # Construct the xarray data structure framework
        ds = xr.Dataset(
            data_vars={
                variable_name: (["lat", "lon"], grid_data, {
                    "units": "mm/day",
                    "long_name": f"AI-Predicted {variable_name.capitalize()} Matrix",
                    "standard_name": variable_name
                })
            },
            coords={
                "lat": (["lat"], latitudes, {"units": "degrees_north", "standard_name": "latitude"}),
                "lon": (["lon"], longitudes, {"units": "degrees_east", "standard_name": "longitude"})
            },
            attrs={
                "description": "VAYUSETU AI-Powered Digital Twin Predictive Output Framework Layer.",
                "spatial_ref": "EPSG:4326 (WGS 84 Mapping Standard)",
                "source": "Fused ISRO MOSDAC Satellite and IMD Gridded Observations"
            }
        )
        
        # Export out to disk cleanly
        ds.to_netcdf(output_path, format="NETCDF4")
        print(f"[NETCDF EXPORT] High-Fidelity Spatial NetCDF Layer successfully written to: {output_path}")

# =============================================================================
# FIX 4: PHYSICS-INFORMED LOSS LAYER (Thermodynamic Law Enforcement)
# =============================================================================
class PhysicsInformedLoss(nn.Module):
    """
    Enforces absolute mass-balance and physical boundaries over the system tensors.
    Penalizes the AI if it breaks fundamental thermodynamic laws.
    """
    def __init__(self, lambda_physics: float = 0.5):
        super(PhysicsInformedLoss, self).__init__()
        self.lambda_physics = lambda_physics
        self.mse_loss = nn.MSELoss()

    def forward(
        self, 
        pred_precipitation: torch.Tensor, 
        target_precipitation: torch.Tensor, 
        precipitable_water_ingress: torch.Tensor, 
        evapotranspiration: torch.Tensor
    ) -> torch.Tensor:
        """
        Calculates loss while enforcing: Precipitation <= Water Ingress + Evapotranspiration
        """
        # Standard Data Loss Component
        data_loss = self.mse_loss(pred_precipitation, target_precipitation)
        
        # Thermodynamic Law Constraint Formulation
        # Constraint should theoretically be: pred_precipitation - (ingress + evap) <= 0
        physics_residual = pred_precipitation - (precipitable_water_ingress + evapotranspiration)
        
        # Apply Hinge Loss: Only penalize if the physical constraint boundary is broken (> 0)
        physics_violation = torch.clamp(physics_residual, min=0.0)
        physics_loss = torch.mean(physics_violation ** 2)
        
        # Return total weighted loss matrix
        return data_loss + (self.lambda_physics * physics_loss)
