import os
import numpy as np
import pandas as pd
from scipy.io import netcdf

# Paths
BASE_DIR = r"D:\BUNNY\PROJECTS\ISRO\evidence\dataset_inventory"
IMD_DIR = os.path.join(BASE_DIR, "sample_imd_files")
INSAT_DIR = os.path.join(BASE_DIR, "sample_insat_files")

os.makedirs(IMD_DIR, exist_ok=True)
os.makedirs(INSAT_DIR, exist_ok=True)

np.random.seed(42)

# 1. Generate IMD Rainfall (0.25 degree)
dates = pd.date_range("2024-06-01", "2024-06-30")
lats_rf = np.arange(17.5, 18.25, 0.25)
lons_rf = np.arange(83.0, 83.75, 0.25)

rows_rf = []
for d in dates:
    for lat in lats_rf:
        for lon in lons_rf:
            # Realistic monsoon rainfall
            base = 15.0 + 5.0 * np.sin(d.day / 5.0)
            val = max(0.0, base + np.random.normal(0, 10.0))
            rows_rf.append({
                "date": d.strftime("%Y-%m-%d"),
                "latitude": round(lat, 2),
                "longitude": round(lon, 2),
                "rainfall_mm": round(val, 2)
            })

df_rf = pd.DataFrame(rows_rf)
df_rf.to_csv(os.path.join(IMD_DIR, "Rainfall_India_0.25.csv"), index=False)
print("Generated Rainfall_India_0.25.csv")

# 2. Generate IMD Max Temp (1.0 degree)
lats_temp = np.arange(17.0, 19.0, 1.0)
lons_temp = np.arange(83.0, 85.0, 1.0)

rows_max = []
rows_min = []
for d in dates:
    for lat in lats_temp:
        for lon in lons_temp:
            base_max = 34.0 - 0.5 * (lat - 17.0)
            val_max = base_max + np.random.normal(0, 1.5)
            rows_max.append({
                "date": d.strftime("%Y-%m-%d"),
                "latitude": round(lat, 2),
                "longitude": round(lon, 2),
                "max_temp_c": round(val_max, 2)
            })
            
            base_min = 24.0 - 0.3 * (lat - 17.0)
            val_min = base_min + np.random.normal(0, 1.0)
            rows_min.append({
                "date": d.strftime("%Y-%m-%d"),
                "latitude": round(lat, 2),
                "longitude": round(lon, 2),
                "min_temp_c": round(val_min, 2)
            })

df_max = pd.DataFrame(rows_max)
df_max.to_csv(os.path.join(IMD_DIR, "MaxTemp_India_1.0.csv"), index=False)
print("Generated MaxTemp_India_1.0.csv")

df_min = pd.DataFrame(rows_min)
df_min.to_csv(os.path.join(IMD_DIR, "MinTemp_India_1.0.csv"), index=False)
print("Generated MinTemp_India_1.0.csv")


# 3. Generate INSAT NetCDF files
# We will create time (30 days), lat (16), lon (16) dimensions
time_len = 30
lat_len = 16
lon_len = 16

# INSAT LST
lst_file = os.path.join(INSAT_DIR, "INSAT_LST.nc")
with netcdf.netcdf_file(lst_file, "w") as f:
    f.history = "VAYUSETU Sample INSAT LST Dataset"
    f.createDimension("time", time_len)
    f.createDimension("lat", lat_len)
    f.createDimension("lon", lon_len)
    
    time_var = f.createVariable("time", "i", ("time",))
    time_var[:] = np.arange(time_len)
    
    lat_var = f.createVariable("lat", "f", ("lat",))
    lat_var[:] = np.linspace(17.0, 18.5, lat_len)
    
    lon_var = f.createVariable("lon", "f", ("lon",))
    lon_var[:] = np.linspace(83.0, 84.5, lon_len)
    
    lst_var = f.createVariable("LST", "f", ("time", "lat", "lon"))
    # Warm inland, cool coast
    lst_data = np.zeros((time_len, lat_len, lon_len), dtype=np.float32)
    for t in range(time_len):
        for i in range(lat_len):
            for j in range(lon_len):
                lst_data[t, i, j] = 32.0 + 2.0 * np.sin(t / 5.0) - 0.1 * i + 0.15 * j + np.random.normal(0, 0.5)
    lst_var[:] = lst_data
print("Generated INSAT_LST.nc")


# INSAT SST
sst_file = os.path.join(INSAT_DIR, "INSAT_SST.nc")
with netcdf.netcdf_file(sst_file, "w") as f:
    f.history = "VAYUSETU Sample INSAT SST Dataset"
    f.createDimension("time", time_len)
    f.createDimension("lat", lat_len)
    f.createDimension("lon", lon_len)
    
    time_var = f.createVariable("time", "i", ("time",))
    time_var[:] = np.arange(time_len)
    
    lat_var = f.createVariable("lat", "f", ("lat",))
    lat_var[:] = np.linspace(17.0, 18.5, lat_len)
    
    lon_var = f.createVariable("lon", "f", ("lon",))
    lon_var[:] = np.linspace(83.0, 84.5, lon_len)
    
    sst_var = f.createVariable("SST", "f", ("time", "lat", "lon"))
    # Cool ocean temp (Bay of Bengal)
    sst_data = np.zeros((time_len, lat_len, lon_len), dtype=np.float32)
    for t in range(time_len):
        for i in range(lat_len):
            for j in range(lon_len):
                sst_data[t, i, j] = 28.5 + 0.5 * np.cos(t / 10.0) - 0.05 * i + 0.05 * j + np.random.normal(0, 0.2)
    sst_var[:] = sst_data
print("Generated INSAT_SST.nc")


# INSAT Rainfall
rain_file = os.path.join(INSAT_DIR, "INSAT_Rainfall.nc")
with netcdf.netcdf_file(rain_file, "w") as f:
    f.history = "VAYUSETU Sample INSAT Rainfall Dataset"
    f.createDimension("time", time_len)
    f.createDimension("lat", lat_len)
    f.createDimension("lon", lon_len)
    
    time_var = f.createVariable("time", "i", ("time",))
    time_var[:] = np.arange(time_len)
    
    lat_var = f.createVariable("lat", "f", ("lat",))
    lat_var[:] = np.linspace(17.0, 18.5, lat_len)
    
    lon_var = f.createVariable("lon", "f", ("lon",))
    lon_var[:] = np.linspace(83.0, 84.5, lon_len)
    
    rain_var = f.createVariable("Rainfall", "f", ("time", "lat", "lon"))
    rain_data = np.zeros((time_len, lat_len, lon_len), dtype=np.float32)
    for t in range(time_len):
        for i in range(lat_len):
            for j in range(lon_len):
                base_val = 10.0 + 8.0 * np.sin(t / 3.0)
                rain_data[t, i, j] = max(0.0, base_val + np.random.normal(0, 5.0))
    rain_var[:] = rain_data
print("Generated INSAT_Rainfall.nc")

print("All sample files generated successfully.")
