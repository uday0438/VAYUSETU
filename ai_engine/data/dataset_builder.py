import os
import pandas as pd
from typing import Dict, Any
from ai_engine.data.imd_loader import IMDLoader
from ai_engine.data.insat_loader import INSATLoader

class DatasetBuilder:
    """
    Coordinates IMD and INSAT data loaders to build clean aligned training datasets.
    """
    def __init__(self):
        self.imd = IMDLoader()
        self.insat = INSATLoader()

    def build_aligned_features(self, district: str) -> pd.DataFrame:
        rf = self.imd.load_rainfall(district)
        temp = self.imd.load_temperatures(district)
        
        lst_data = self.insat.load_satellite_grid("lst")
        sst_data = self.insat.load_satellite_grid("sst")
        
        merged = pd.merge(rf, temp, on=["date", "district"], how="outer")
        merged = merged.ffill().fillna(0.0)
        
        merged["lst"] = lst_data["mean_value"]
        merged["sst"] = sst_data["mean_value"]
        
        return merged
