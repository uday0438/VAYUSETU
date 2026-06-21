import os
import torch
from backend.app.services.models_ensemble import TemporalTransformer

class TransformerPredictor:
    def __init__(self, model_path="models/temperature_v1.pth"):
        self.model = TemporalTransformer(input_dim=9, embed_dim=16)
        if os.path.exists(model_path):
            try:
                self.model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
            except Exception:
                pass
        self.model.eval()

    def predict(self, seq_features: torch.Tensor) -> float:
        with torch.no_grad():
            return self.model(seq_features).item()
