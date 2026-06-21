"""Generate scientifically accurate IMD sample datasets for Visakhapatnam district."""
import numpy as np
import pandas as pd
import os

np.random.seed(42)

BASE = os.path.dirname(os.path.abspath(__file__))

# === RAINFALL ===
dates = pd.date_range('2024-01-01', periods=365)
monthly_rain_base = {
    1: 3.0, 2: 5.0, 3: 4.0, 4: 8.0, 5: 18.0, 6: 48.0,
    7: 65.0, 8: 55.0, 9: 70.0, 10: 45.0, 11: 30.0, 12: 5.0
}
rainfall = []
for d in dates:
    base = monthly_rain_base[d.month]
    val = base + np.random.normal(0, base * 0.4)
    if d.month in [6,7,8,9] and np.random.rand() < 0.15:
        val = base * 2.5 + np.random.normal(0, 10)  # Heavy rain event
    if d.month in [1,2,3,12] and np.random.rand() < 0.6:
        val = 0.0  # Dry day
    rainfall.append(round(max(0, val), 2))

df_rain = pd.DataFrame({
    "date": dates, "rainfall_mm": rainfall, "district": "Visakhapatnam",
    "station_id": "43150", "latitude": 17.6868, "longitude": 83.2185
})
rf_path = os.path.join(BASE, "imd", "rainfall", "imd_rainfall_2024.csv")
df_rain.to_csv(rf_path, index=False)
print(f"Wrote {rf_path} ({len(df_rain)} records)")

# === MAX TEMP ===
monthly_max_base = {
    1: 29.0, 2: 31.0, 3: 33.5, 4: 36.0, 5: 38.5, 6: 35.0,
    7: 32.5, 8: 32.0, 9: 32.5, 10: 32.0, 11: 30.5, 12: 29.0
}
max_temp = []
for d in dates:
    base = monthly_max_base[d.month]
    val = base + np.random.normal(0, 1.5)
    if d.month == 5 and np.random.rand() < 0.1:
        val = 42.0 + np.random.normal(0, 0.5)  # Heat wave
    max_temp.append(round(val, 2))

df_max = pd.DataFrame({
    "date": dates, "max_temp_c": max_temp, "district": "Visakhapatnam",
    "station_id": "43150", "latitude": 17.6868, "longitude": 83.2185
})
mt_path = os.path.join(BASE, "imd", "max_temp", "imd_max_temp_2024.csv")
df_max.to_csv(mt_path, index=False)
print(f"Wrote {mt_path} ({len(df_max)} records)")

# === MIN TEMP ===
monthly_min_base = {
    1: 17.5, 2: 19.5, 3: 22.0, 4: 25.0, 5: 26.5, 6: 25.5,
    7: 24.5, 8: 24.5, 9: 24.0, 10: 22.5, 11: 20.0, 12: 17.5
}
min_temp = []
for d in dates:
    base = monthly_min_base[d.month]
    val = base + np.random.normal(0, 1.0)
    min_temp.append(round(val, 2))

df_min = pd.DataFrame({
    "date": dates, "min_temp_c": min_temp, "district": "Visakhapatnam",
    "station_id": "43150", "latitude": 17.6868, "longitude": 83.2185
})
mnt_path = os.path.join(BASE, "imd", "min_temp", "imd_min_temp_2024.csv")
df_min.to_csv(mnt_path, index=False)
print(f"Wrote {mnt_path} ({len(df_min)} records)")

print("Done — all 3 IMD datasets generated with realistic climatological patterns.")
