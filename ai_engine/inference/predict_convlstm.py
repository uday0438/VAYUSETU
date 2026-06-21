import os
import torch
from ai_engine.models.unet_convlstm import UNetConvLSTM

class ConvLSTMPredictor:
    def __init__(self, model_path="models/rainfall_v2.pth"):
        self.model = UNetConvLSTM(in_channels=1, out_channels=1, hidden_dim=16)
        if os.path.exists(model_path):
            try:
                self.model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
            except Exception:
                pass
        self.model.eval()

    def predict(self, features_grid: torch.Tensor) -> torch.Tensor:
        with torch.no_grad():
            return self.model(features_grid)
