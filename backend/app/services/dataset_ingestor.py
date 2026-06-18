import os
import numpy as np
from typing import Dict, Any, Optional

class DatasetIngestor:
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        if not os.path.exists(data_dir):
            try:
                os.makedirs(data_dir)
            except Exception:
                pass

    def parse_insat_hdf5(self, filename: str, product_type: str = "LST") -> np.ndarray:
        """
        Parses INSAT-3D L3 HDF5 files.
        Falls back to a realistic mock grid if h5py is not installed or file does not exist.
        """
        filepath = os.path.join(self.data_dir, filename)
        
        # Check if we can use h5py
        try:
            import h5py
            if os.path.exists(filepath):
                with h5py.File(filepath, 'r') as f:
                    if product_type == "LST" and "LST" in f:
                        return np.array(f["LST"])
                    elif product_type == "SST" and "SST" in f:
                        return np.array(f["SST"])
        except ImportError:
            pass
            
        # Fallback Mock generator
        np.random.seed(42)  # Deterministic seed for stability
        if product_type == "LST":
            # Land Surface Temp: 25 to 45 °C
            return np.random.uniform(25.0, 45.0, size=(16, 16))
        elif product_type == "SST":
            # Sea Surface Temp: 24 to 31 °C
            return np.random.uniform(24.0, 31.0, size=(16, 16))
        else:
            return np.random.uniform(0.0, 1.0, size=(16, 16))

    def parse_imd_netcdf(self, filename: str, variable: str = "rainfall") -> np.ndarray:
        """
        Parses IMD NetCDF files.
        Falls back to a realistic mock grid if netCDF4 is not installed or file does not exist.
        """
        filepath = os.path.join(self.data_dir, filename)
        
        try:
            import netCDF4
            if os.path.exists(filepath):
                with netCDF4.Dataset(filepath, 'r') as ds:
                    if variable in ds.variables:
                        # Grab the first time step if 3D
                        data = ds.variables[variable][:]
                        if len(data.shape) == 3:
                            return np.array(data[0])
                        return np.array(data)
        except ImportError:
            pass

        # Fallback Mock generator
        np.random.seed(42)
        if variable == "rainfall":
            # IMD rainfall: 0 to 120 mm
            return np.random.uniform(0.0, 120.0, size=(16, 16))
        elif variable == "temperature":
            return np.random.uniform(18.0, 38.0, size=(16, 16))
        else:
            return np.random.uniform(0.0, 50.0, size=(16, 16))

    def parse_era5_soil_moisture(self, filename: str) -> np.ndarray:
        """
        Parses ERA5-Land Soil Moisture files.
        Falls back to a realistic mock grid.
        """
        filepath = os.path.join(self.data_dir, filename)
        
        try:
            import netCDF4
            if os.path.exists(filepath):
                with netCDF4.Dataset(filepath, 'r') as ds:
                    # Typical ERA5 variable is swvl1
                    for var in ["swvl1", "soil_moisture", "sm"]:
                        if var in ds.variables:
                            data = ds.variables[var][:]
                            if len(data.shape) == 3:
                                return np.array(data[0])
                            return np.array(data)
        except ImportError:
            pass

        # Fallback Mock: Volumetric water content 0.12 to 0.45 m3/m3
        np.random.seed(42)
        return np.random.uniform(0.12, 0.45, size=(16, 16))
