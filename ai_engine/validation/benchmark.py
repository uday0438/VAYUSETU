import numpy as np
from benchmark.baseline_models import BaselineModels

class ValidationBenchmark:
    def evaluate_baseline(self, values: np.ndarray, var_type: str) -> np.ndarray:
        baseline = BaselineModels()
        preds = []
        for val in values:
            preds.append(baseline.get_forecast(float(val), var_type))
        return np.array(preds, dtype=np.float32)
