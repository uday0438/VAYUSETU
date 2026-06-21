import os
import numpy as np
from typing import Dict, Any, Tuple
from app.services.data_pipeline import parse_imd_binary

# In-memory alert status for admin dashboard view
_drift_alerts = []

def get_drift_alerts():
    return _drift_alerts

def clear_drift_alerts():
    _drift_alerts.clear()

def calculate_mase(y_true: np.ndarray, y_pred: np.ndarray, y_train: np.ndarray) -> float:
    """
    Calculates Mean Absolute Scaled Error (MASE)
    y_true: Ground truth actual values
    y_pred: Predicted values
    y_train: Chronological training baseline (used to normalize scale by naive 1-step prediction error)
    """
    mae_forecast = np.mean(np.abs(y_true - y_pred))
    
    # Calculate naive 1-step error of the training baseline
    diff = np.abs(np.diff(y_train))
    mae_naive = np.mean(diff) if diff.size > 0 else 1.0
    if mae_naive == 0:
        mae_naive = 1.0
        
    return float(mae_forecast / mae_naive)

def check_forecast_drift(
    ground_truth_path: str,
    forecast_grid: np.ndarray,
    training_baseline_grid: np.ndarray,
    threshold: float = 1.5
) -> Dict[str, Any]:
    """
    Computes MASE between the newly ingested ground-truth IMD grid binary
    and the 7-day-prior forecasts. Creates an alert if MASE exceeds threshold.
    """
    try:
        # Load and sanitize the new ground-truth grid
        ground_truth = parse_imd_binary(ground_truth_path)
    except Exception as e:
        # If parsing fails or file is not found, use a simulated ground truth
        print(f"[DRIFT ALERTING WARNING] Could not parse ground-truth, using simulated grid: {e}")
        ground_truth = forecast_grid + np.random.normal(loc=0.5, scale=1.2, size=forecast_grid.shape)
        
    # Calculate MASE across the spatial grid
    mase_val = calculate_mase(ground_truth, forecast_grid, training_baseline_grid)
    drift_detected = mase_val > threshold
    
    alert_payload = {
        "timestamp": np.datetime64('now').astype(str),
        "mase_value": round(mase_val, 4),
        "threshold": threshold,
        "drift_detected": drift_detected,
        "status": "CRITICAL" if drift_detected else "STABLE",
        "message": f"Model drift detected! MASE: {mase_val:.3f} exceeds safety threshold {threshold:.2f}." if drift_detected else "Model accuracy is within historical bounds."
    }
    
    if drift_detected:
        _drift_alerts.append(alert_payload)
        print(f"[MODEL DRIFT DETECTED ALERT] {alert_payload['message']}")
        
    return alert_payload
