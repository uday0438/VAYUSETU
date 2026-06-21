import numpy as np
import xarray as xr

class VayuSetuRegridder:
    """
    High-performance mass-conservative grid regridder using xarray.
    Uses xesmf (ESMF) if available, otherwise falls back to a clean,
    vectorized 2D cell-averaging (area-weighted) conservative regridder.
    """
    @staticmethod
    def regrid_conservative(
        ds_in: xr.Dataset,
        grid_out_lat: np.ndarray,
        grid_out_lon: np.ndarray,
        var_name: str = "precipitation"
    ) -> xr.Dataset:
        """
        Regrids a variable to conserve total mass (e.g. sum of rainfall is preserved).
        """
        try:
            import xesmf as xe
            # Define output grid format for xesmf
            ds_out = xr.Dataset(
                coords={
                    "lat": (["lat"], grid_out_lat),
                    "lon": (["lon"], grid_out_lon)
                }
            )
            regridder = xe.Regridder(ds_in, ds_out, method="conservative")
            return regridder(ds_in)
        except ImportError:
            # Fallback: Vectorized 2D area-weighted / bin-averaging conservative regridding
            print("[REGRIDDER INFO] xesmf not found. Executing custom area-weighted conservative fallback.")
            
            # Extract input coordinates and data
            lat_in = ds_in.lat.values
            lon_in = ds_in.lon.values
            data_in = ds_in[var_name].values
            
            # Output shapes
            n_lat_out = len(grid_out_lat)
            n_lon_out = len(grid_out_lon)
            
            # Handle different dimension structures (e.g., time, lat, lon)
            has_time = "time" in ds_in.dims
            if has_time:
                n_time = len(ds_in.time)
                data_out = np.zeros((n_time, n_lat_out, n_lon_out), dtype=np.float32)
            else:
                data_out = np.zeros((n_lat_out, n_lon_out), dtype=np.float32)
                
            # Generate grid cell boundaries (bounds)
            def get_bounds(coords):
                if len(coords) <= 1:
                    return np.array([coords[0] - 0.5, coords[0] + 0.5])
                diffs = np.diff(coords)
                step = diffs[0]
                bounds = np.zeros(len(coords) + 1)
                bounds[0] = coords[0] - step / 2.0
                bounds[1:] = coords + step / 2.0
                return bounds

            lat_in_bounds = get_bounds(lat_in)
            lon_in_bounds = get_bounds(lon_in)
            lat_out_bounds = get_bounds(grid_out_lat)
            lon_out_bounds = get_bounds(grid_out_lon)
            
            # Conservative regridding logic: calculate overlap area weights
            lat_weights = np.zeros((n_lat_out, len(lat_in)))
            for i in range(n_lat_out):
                lo, hi = lat_out_bounds[i], lat_out_bounds[i+1]
                # Ensure correct ordering
                if lo > hi:
                    lo, hi = hi, lo
                for j in range(len(lat_in)):
                    ilo, ihi = lat_in_bounds[j], lat_in_bounds[j+1]
                    if ilo > ihi:
                        ilo, ihi = ihi, ilo
                    # Intersection interval length
                    overlap = max(0, min(hi, ihi) - max(lo, ilo))
                    lat_weights[i, j] = overlap / (hi - lo) if (hi - lo) > 0 else 0
                    
            lon_weights = np.zeros((n_lon_out, len(lon_in)))
            for i in range(n_lon_out):
                lo, hi = lon_out_bounds[i], lon_out_bounds[i+1]
                if lo > hi:
                    lo, hi = hi, lo
                for j in range(len(lon_in)):
                    ilo, ihi = lon_in_bounds[j], lon_in_bounds[j+1]
                    if ilo > ihi:
                        ilo, ihi = ihi, ilo
                    overlap = max(0, min(hi, ihi) - max(lo, ilo))
                    lon_weights[i, j] = overlap / (hi - lo) if (hi - lo) > 0 else 0
                    
            # Apply weights (dot product) to perform mass-conservative mapping
            if has_time:
                for t in range(n_time):
                    # Weighted combination
                    temp_res = np.dot(lat_weights, data_in[t]) # [lat_out, lon_in]
                    data_out[t] = np.dot(temp_res, lon_weights.T) # [lat_out, lon_out]
            else:
                temp_res = np.dot(lat_weights, data_in)
                data_out = np.dot(temp_res, lon_weights.T)
                
            # Construct output xarray Dataset
            coords_out = {
                "lat": (["lat"], grid_out_lat, {"units": "degrees_north"}),
                "lon": (["lon"], grid_out_lon, {"units": "degrees_east"})
            }
            if has_time:
                coords_out["time"] = (["time"], ds_in.time.values)
                dims_out = ["time", "lat", "lon"]
            else:
                dims_out = ["lat", "lon"]
                
            ds_out = xr.Dataset(
                data_vars={
                    var_name: (dims_out, data_out, ds_in[var_name].attrs if var_name in ds_in else {})
                },
                coords=coords_out,
                attrs=ds_in.attrs
            )
            return ds_out
