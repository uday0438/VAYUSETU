import random
from typing import Dict, Any

def get_ensemble_forecast(base_val: float, parameter: str) -> Dict[str, Any]:
    """
    Computes an ensemble average, confidence score, and uncertainty bounds 
    using simulated inputs representing ConvLSTM, TFT, and XGBoost models.
    """
    if parameter == "rainfall":
        # Simulate individual predictions
        convlstm_val = base_val + random.uniform(-4.0, 4.0)
        tft_val = base_val + random.uniform(-6.0, 6.0)
        xgboost_val = base_val + random.uniform(-5.0, 5.0)
        
        ensemble_avg = round((convlstm_val + tft_val + xgboost_val) / 3.0, 1)
        
        # Calculate standard deviation/spread for uncertainty
        vals = [convlstm_val, tft_val, xgboost_val]
        mean = sum(vals) / 3.0
        variance = sum((x - mean) ** 2 for x in vals) / 3.0
        std_dev = (variance) ** 0.5
        
        uncertainty = round(max(2.0, std_dev * 1.96), 1) # 95% confidence bounds
        
        # Confidence increases as uncertainty decreases
        confidence = round(max(75.0, min(99.0, 100.0 - (uncertainty / base_val * 100.0) if base_val > 0 else 95.0)), 1)
        
        return {
            "parameter": "rainfall",
            "unit": "mm",
            "ensemble_prediction": ensemble_avg,
            "confidence_pct": confidence,
            "uncertainty_range": f"±{uncertainty}",
            "models": {
                "ConvLSTM-Precip": round(convlstm_val, 1),
                "TFT-Temp": round(tft_val, 1),
                "XGBoost-LST": round(xgboost_val, 1)
            }
        }
    else: # temperature
        convlstm_val = base_val + random.uniform(-0.4, 0.4)
        tft_val = base_val + random.uniform(-0.8, 0.8)
        xgboost_val = base_val + random.uniform(-0.6, 0.6)
        
        ensemble_avg = round((convlstm_val + tft_val + xgboost_val) / 3.0, 1)
        
        vals = [convlstm_val, tft_val, xgboost_val]
        mean = sum(vals) / 3.0
        variance = sum((x - mean) ** 2 for x in vals) / 3.0
        std_dev = (variance) ** 0.5
        
        uncertainty = round(max(0.2, std_dev * 1.96), 1)
        
        confidence = round(max(75.0, min(99.0, 100.0 - (uncertainty / base_val * 100.0) if base_val > 0 else 96.0)), 1)
        
        return {
            "parameter": "temperature",
            "unit": "°C",
            "ensemble_prediction": ensemble_avg,
            "confidence_pct": confidence,
            "uncertainty_range": f"±{uncertainty}",
            "models": {
                "ConvLSTM-Precip": round(convlstm_val, 1),
                "TFT-Temp": round(tft_val, 1),
                "XGBoost-LST": round(xgboost_val, 1)
            }
        }
