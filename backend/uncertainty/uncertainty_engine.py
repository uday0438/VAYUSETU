"""
VAYUSETU Uncertainty Quantification Engine

Implements ensemble-based uncertainty estimation for climate predictions.
Uses prediction variance across ConvLSTM, Transformer, and XGBoost ensemble
members to compute confidence intervals and prediction reliability scores.

Reference:
    Lakshminarayanan et al. (2017), "Simple and Scalable Predictive Uncertainty
    Estimation using Deep Ensembles", NeurIPS.
"""

import numpy as np
from typing import Dict, Any, Optional, Tuple


class UncertaintyEngine:
    """
    Computes prediction uncertainty from ensemble member disagreement.
    
    Architecture:
        ConvLSTM  ──┐
        Transformer ─┤──► Ensemble Variance ──► Confidence Score ──► Prediction Interval
        XGBoost   ──┘
    """

    # Ensemble weights (must match predict_ensemble.py)
    WEIGHTS = {"convlstm": 0.4, "transformer": 0.4, "xgboost": 0.2}

    # Climatological uncertainty baselines (Visakhapatnam, IMD 1951-2020)
    CLIM_STD = {
        "rainfall": 28.5,      # mm/day std
        "max_temp": 3.2,       # °C std
        "min_temp": 2.8,       # °C std
        "lst": 4.5,            # °C std
        "sst": 1.2,            # °C std
    }

    def quantify(
        self,
        predictions: Dict[str, float],
        parameter: str = "rainfall",
        ensemble_members: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        """
        Compute uncertainty metrics for a prediction.

        Parameters
        ----------
        predictions : dict
            Must contain 'value' (point estimate).
        parameter : str
            Climate variable name ('rainfall', 'max_temp', etc.).
        ensemble_members : dict, optional
            Individual model predictions {'convlstm': v1, 'transformer': v2, 'xgboost': v3}.

        Returns
        -------
        dict with keys: value, confidence_pct, lower_bound, upper_bound,
                        ensemble_spread, reliability_class, method.
        """
        value = predictions.get("value", predictions.get("predicted", 0.0))

        if ensemble_members and len(ensemble_members) >= 2:
            return self._from_ensemble(value, ensemble_members, parameter)
        else:
            return self._from_climatology(value, parameter)

    def _from_ensemble(
        self, value: float, members: Dict[str, float], parameter: str
    ) -> Dict[str, Any]:
        """Uncertainty from real ensemble member disagreement."""
        preds = np.array(list(members.values()))
        weights = np.array([self.WEIGHTS.get(k, 1.0 / len(members)) for k in members])
        weights /= weights.sum()

        # Weighted mean and variance
        weighted_mean = float(np.average(preds, weights=weights))
        weighted_var = float(np.average((preds - weighted_mean) ** 2, weights=weights))
        ensemble_std = float(np.sqrt(weighted_var))

        # 90% prediction interval (z = 1.645)
        z = 1.645
        lower = round(weighted_mean - z * ensemble_std, 2)
        upper = round(weighted_mean + z * ensemble_std, 2)

        # Confidence score: inverse of normalized spread
        clim_std = self.CLIM_STD.get(parameter, 10.0)
        spread_ratio = ensemble_std / max(clim_std, 0.01)
        confidence = max(0.0, min(100.0, (1.0 - spread_ratio) * 100.0))

        return {
            "value": round(value, 2),
            "confidence_pct": round(confidence, 1),
            "lower_bound": max(0.0, lower) if parameter == "rainfall" else lower,
            "upper_bound": round(upper, 2),
            "ensemble_spread": round(ensemble_std, 3),
            "ensemble_members": {k: round(v, 2) for k, v in members.items()},
            "reliability_class": self._classify(confidence),
            "method": "ensemble_variance",
            "interval": "90%",
        }

    def _from_climatology(self, value: float, parameter: str) -> Dict[str, Any]:
        """Fallback uncertainty from climatological variability."""
        clim_std = self.CLIM_STD.get(parameter, 10.0)

        # Scale uncertainty by distance from climatological mean
        # Extreme values → higher uncertainty
        clim_means = {
            "rainfall": 45.0, "max_temp": 33.0, "min_temp": 23.0,
            "lst": 35.0, "sst": 28.5,
        }
        mean = clim_means.get(parameter, value)
        anomaly_factor = 1.0 + 0.3 * abs(value - mean) / max(clim_std, 1.0)
        adjusted_std = clim_std * 0.15 * anomaly_factor  # Model uncertainty << climatological

        z = 1.645
        lower = round(value - z * adjusted_std, 2)
        upper = round(value + z * adjusted_std, 2)
        confidence = max(0.0, min(100.0, (1.0 - adjusted_std / clim_std) * 100.0))

        return {
            "value": round(value, 2),
            "confidence_pct": round(confidence, 1),
            "lower_bound": max(0.0, lower) if parameter == "rainfall" else lower,
            "upper_bound": round(upper, 2),
            "ensemble_spread": round(adjusted_std, 3),
            "reliability_class": self._classify(confidence),
            "method": "climatological_baseline",
            "interval": "90%",
        }

    @staticmethod
    def _classify(confidence: float) -> str:
        if confidence >= 85:
            return "HIGH"
        elif confidence >= 65:
            return "MODERATE"
        elif confidence >= 40:
            return "LOW"
        else:
            return "VERY_LOW"

    def batch_quantify(
        self, predictions_list: list, parameter: str = "rainfall"
    ) -> list:
        """Quantify uncertainty for a batch of predictions."""
        return [self.quantify(p, parameter) for p in predictions_list]