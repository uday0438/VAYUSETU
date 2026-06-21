import numpy as np
from typing import Dict, Any, List

class DataPipeline:
    """
    Scientifically credible data preprocessing pipeline for VAYUSETU.
    Replaces generate_mock_gridded_data with real data cleaning, imputation,
    normalization, and feature engineering steps for IMD and INSAT data.
    """
    def __init__(self):
        # Target Normalization Bounds (Min/Max values derived from historical Indian climate data)
        self.bounds = {
            "rainfall": {"min": 0.0, "max": 350.0},
            "temperature": {"min": 5.0, "max": 50.0},
            "humidity": {"min": 10.0, "max": 100.0},
            "soil_moisture": {"min": 5.0, "max": 100.0},
            "sst": {"min": 20.0, "max": 35.0},
            "lst": {"min": 10.0, "max": 55.0}
        }

    def clean_outliers(self, data: List[float], key: str) -> List[float]:
        """
        Detects and caps outliers using Z-score logic.
        Values exceeding 3 standard deviations are capped at the bounds.
        """
        if len(data) < 3:
            return data
            
        arr = np.array(data, dtype=np.float32)
        mean = np.mean(arr)
        std = np.std(arr)
        if std == 0:
            return data
            
        # Z-score check
        z_scores = (arr - mean) / std
        clipped = np.where(np.abs(z_scores) > 3.0, mean + np.sign(z_scores) * 3.0 * std, arr)
        
        # Keep within logical physical boundaries
        min_b = self.bounds[key]["min"]
        max_b = self.bounds[key]["max"]
        clipped = np.clip(clipped, min_b, max_b)
        return clipped.tolist()

    def handle_missing_values(self, data: List[Any]) -> List[float]:
        """
        Handles missing values using linear interpolation.
        """
        if not data:
            return []
            
        # Convert None to NaN
        arr = np.array([np.nan if x is None else float(x) for x in data], dtype=np.float32)
        nans = np.isnan(arr)
        if not np.any(nans):
            return arr.tolist()
            
        # Indices of non-NaN values
        x = np.arange(len(arr))
        non_nan_idx = x[~nans]
        if len(non_nan_idx) == 0:
            # Fallback if all values are missing
            return [0.0] * len(arr)
            
        # Perform interpolation
        arr[nans] = np.interp(x[nans], non_nan_idx, arr[~nans])
        return arr.tolist()

    def normalize(self, val: float, key: str) -> float:
        """
        MinMax normalization scaling parameter to [0, 1] range.
        """
        min_v = self.bounds[key]["min"]
        max_v = self.bounds[key]["max"]
        norm = (val - min_v) / (max_v - min_v)
        return float(np.clip(norm, 0.0, 1.0))

    def feature_engineering(self, temp: float, rain: float, lst: float, sm: float) -> Dict[str, float]:
        """
        Extracts physics-informed climate indices:
        1. Temperature-Vegetation Dryness Index (TVDI) proxy using LST and SM
        2. Evaporative Stress Index (ESI) proxy using Temp and SM
        3. Rainfall Anomaly Index (RAI)
        """
        # TVDI: Lower soil moisture and higher LST increases dryness
        tvdi = (lst - 15.0) / (sm + 5.0)
        tvdi = min(1.0, max(0.0, tvdi / 2.0))
        
        # ESI: Higher temperature and lower soil moisture leads to evaporative stress
        esi = temp / (sm + 10.0)
        esi = min(1.0, max(0.0, esi))
        
        # Rainfall anomaly index relative to typical 50mm baseline
        rai = (rain - 50.0) / 100.0
        
        return {
            "tvdi": round(tvdi, 3),
            "esi": round(esi, 3),
            "rai": round(rai, 3)
        }

    def process_telemetry(self, raw_telemetry: Dict[str, List[Any]]) -> Dict[str, Any]:
        """
        Executes the entire ingestion and processing pipeline.
        """
        cleaned = {}
        for key in ["temperature", "rainfall", "humidity", "soil_moisture", "sst", "lst"]:
            raw_list = raw_telemetry.get(key, [0.0])
            imputed = self.handle_missing_values(raw_list)
            cleaned_list = self.clean_outliers(imputed, key)
            cleaned[key] = cleaned_list

        # Get latest timestep values
        latest_temp = cleaned["temperature"][-1] if cleaned["temperature"] else 30.0
        latest_rain = cleaned["rainfall"][-1] if cleaned["rainfall"] else 50.0
        latest_sm = cleaned["soil_moisture"][-1] if cleaned["soil_moisture"] else 50.0
        latest_lst = cleaned["lst"][-1] if cleaned["lst"] else 32.0

        # Normalization
        norm_features = {
            f"norm_{k}": self.normalize(cleaned[k][-1], k) for k in cleaned
        }

        # Feature engineering
        engineered = self.feature_engineering(latest_temp, latest_rain, latest_lst, latest_sm)

        # Merge results into final inference-ready state vector
        features = {**norm_features, **engineered}
        features["latest_raw_temp"] = latest_temp
        features["latest_raw_rain"] = latest_rain
        return features
