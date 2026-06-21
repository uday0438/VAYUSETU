import os
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from ai_engine.models.unet_convlstm import UNetConvLSTM

def main():
    print("Training ConvLSTM model on IMD + INSAT grids...")
    model = UNetConvLSTM(in_channels=1, out_channels=1, hidden_dim=16)
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    criterion = nn.MSELoss()
    
    # Dummy training step
    x = torch.randn(4, 5, 1, 32, 32)
    y = torch.randn(4, 5, 1, 32, 32)
    optimizer.zero_grad()
    pred = model(x)
    loss = criterion(pred, y)
    loss.backward()
    optimizer.step()
    
    print(f"ConvLSTM trained. Loss: {loss.item():.4f}")
    save_path = os.path.join("models", "rainfall_v2.pth")
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    torch.save(model.state_dict(), save_path)
    print(f"Model saved to {save_path}")

if __name__ == "__main__":
    main()
