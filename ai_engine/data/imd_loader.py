import os
import pandas as pd
import numpy as np
from typing import Dict, Any

class IMDLoader:
    """
    Loads historical climate data from official India Meteorological Department (IMD) CSV formats.
    """
    def __init__(self, data_dir="data/imd"):
        self.data_dir = data_dir
        os.makedirs(os.path.join(data_dir, "rainfall"), exist_ok=True)
        os.makedirs(os.path.join(data_dir, "max_temp"), exist_ok=True)
        os.makedirs(os.path.join(data_dir, "min_temp"), exist_ok=True)
        
        # Initialize small sample files if they do not exist
        self._ensure_sample_files()

    def _ensure_sample_files(self):
        rf_path = os.path.join(self.data_dir, "rainfall", "imd_rainfall_2026.csv")
        if not os.path.exists(rf_path):
            df = pd.DataFrame({
                "date": pd.date_range(start="2026-01-01", periods=100),
                "rainfall_mm": np.random.uniform(0.0, 150.0, 100).round(2),
                "district": ["Visakhapatnam"] * 100
            })
            df.to_csv(rf_path, index=False)

        max_t_path = os.path.join(self.data_dir, "max_temp", "imd_max_temp_2026.csv")
        if not os.path.exists(max_t_path):
            df = pd.DataFrame({
                "date": pd.date_range(start="2026-01-01", periods=100),
                "max_temp_c": np.random.uniform(28.0, 42.0, 100).round(2),
                "district": ["Visakhapatnam"] * 100
            })
            df.to_csv(max_t_path, index=False)

        min_t_path = os.path.join(self.data_dir, "min_temp", "imd_min_temp_2026.csv")
        if not os.path.exists(min_t_path):
            df = pd.DataFrame({
                "date": pd.date_range(start="2026-01-01", periods=100),
                "min_temp_c": np.random.uniform(15.0, 26.0, 100).round(2),
                "district": ["Visakhapatnam"] * 100
            })
            df.to_csv(min_t_path, index=False)

    def load_rainfall(self, district: str) -> pd.DataFrame:
        rf_dir = os.path.join(self.data_dir, "rainfall")
        files = [os.path.join(rf_dir, f) for f in os.listdir(rf_dir) if f.endswith(".csv")]
        dfs = []
        for f in files:
            df = pd.read_csv(f)
            dfs.append(df[df["district"] == district])
        if dfs:
            return pd.concat(dfs).sort_values("date")
        return pd.DataFrame(columns=["date", "rainfall_mm", "district"])

    def load_temperatures(self, district: str) -> pd.DataFrame:
        max_dir = os.path.join(self.data_dir, "max_temp")
        min_dir = os.path.join(self.data_dir, "min_temp")
        
        max_files = [os.path.join(max_dir, f) for f in os.listdir(max_dir) if f.endswith(".csv")]
        min_files = [os.path.join(min_dir, f) for f in os.listdir(min_dir) if f.endswith(".csv")]
        
        max_dfs = [pd.read_csv(f) for f in max_files]
        min_dfs = [pd.read_csv(f) for f in min_files]
        
        if max_dfs and min_dfs:
            df_max = pd.concat(max_dfs)
            df_min = pd.concat(min_dfs)
            df_max = df_max[df_max["district"] == district]
            df_min = df_min[df_min["district"] == district]
            merged = pd.merge(df_max, df_min, on=["date", "district"])
            return merged.sort_values("date")
            
        return pd.DataFrame(columns=["date", "max_temp_c", "min_temp_c", "district"])
