from typing import Dict, Any
import random

# Global variable to track the number of retrains
_retrain_count = 0
_history_errors = [1.2, 1.4, 1.1, 1.5, 1.8, 1.9, 2.1, 2.3]  # recent prediction errors (MAE in mm/°C)

def get_retrain_count() -> int:
    global _retrain_count
    return _retrain_count

def trigger_model_retrain() -> None:
    global _retrain_count, _history_errors
    _retrain_count += 1
    # Reset error history after retrain to simulate model convergence
    _history_errors = [random.uniform(0.8, 1.2) for _ in range(5)]

def record_prediction_error(error: float) -> None:
    global _history_errors
    _history_errors.append(error)
    if len(_history_errors) > 20:
        _history_errors.pop(0)

def compute_model_health_and_drift() -> Dict[str, Any]:
    global _history_errors
    
    # Calculate average error
    avg_error = sum(_history_errors) / len(_history_errors) if _history_errors else 1.2
    
    # Model health degrades if error is high
    # Baseline error of 1.0 = 98% health. High error degrades it.
    health_pct = round(max(70.0, min(99.0, 98.0 - (avg_error - 1.0) * 12.0)), 1)
    
    # Drift status: Stable (< 2.0 MAE), Warning / Drifting (>= 2.0 MAE)
    if avg_error >= 2.5:
        drift_status = "CRITICAL_DRIFT"
    elif avg_error >= 1.8:
        drift_status = "DRIFTING"
    else:
        drift_status = "STABLE"
        
    # Simulated Kolmogorov-Smirnov p-value for telemetry feature distribution
    # If drifting, p-value decreases below alpha=0.05
    ks_pval = round(0.52 - (avg_error - 1.0) * 0.18, 4)
    ks_pval = max(0.001, min(0.999, ks_pval))
    
    # Retraining trigger threshold
    retrain_recommended = drift_status in ["DRIFTING", "CRITICAL_DRIFT"]
    
    return {
        "model_health_pct": health_pct,
        "drift_status": drift_status,
        "average_error_mae": round(avg_error, 2),
        "ks_test_p_value": ks_pval,
        "retrain_recommended": retrain_recommended,
        "retrains_completed": _retrain_count
    }
