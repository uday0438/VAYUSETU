import os
import torch
import torch.nn as nn
import torch.optim as optim
from backend.app.services.models_ensemble import TemporalTransformer

def main():
    print("Training Temporal Transformer on spatial-temporal climate sequences...")
    model = TemporalTransformer(input_dim=9, embed_dim=16)
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    criterion = nn.MSELoss()
    
    # 5 sequence steps, 9 engineered features
    x = torch.randn(4, 5, 9)
    y = torch.randn(4, 1)
    optimizer.zero_grad()
    pred = model(x)
    loss = criterion(pred, y)
    loss.backward()
    optimizer.step()
    
    print(f"Transformer trained. Loss: {loss.item():.4f}")
    save_path = os.path.join("models", "temperature_v1.pth")
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    torch.save(model.state_dict(), save_path)
    print(f"Model saved to {save_path}")

if __name__ == "__main__":
    main()
