import os
import pickle
from backend.app.services.models_ensemble import XGBoostRegressor

class XGBoostPredictor:
    def __init__(self, model_path="models/ensemble_v1.pkl"):
        if os.path.exists(model_path):
            try:
                with open(model_path, "rb") as f:
                    self.model = pickle.load(f)
            except Exception:
                self.model = XGBoostRegressor()
        else:
            self.model = XGBoostRegressor()

    def predict(self, features: dict, parameter: str) -> float:
        return self.model.predict(features, parameter)
