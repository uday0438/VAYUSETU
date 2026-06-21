from typing import List, Dict, Any

class EnsembleEngine:
    """
    Weighted fusion engine representing:
    ConvLSTM (0.5) + Temporal Transformer (0.3) + XGBoost (0.2)
    """
    def __init__(self, weights: List[float] = [0.5, 0.3, 0.2]):
        self.weights = weights

    def compute_weighted_average(self, convlstm_pred: float, transformer_pred: float, xgboost_pred: float) -> float:
        val = (
            self.weights[0] * convlstm_pred +
            self.weights[1] * transformer_pred +
            self.weights[2] * xgboost_pred
        )
        return round(val, 2)