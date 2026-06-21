import os
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from ai_engine.models.unet_convlstm import UNetConvLSTM

# Define training parameters
BATCH_SIZE = 4
SEQ_LEN = 5
CHANNELS = 1
HEIGHT = 32
WIDTH = 32
EPOCHS = 3
LEARNING_RATE = 0.001

def generate_mock_gridded_data(num_samples=40):
    """
    Generates mock gridded spatial-temporal climate sequences representing 
    IMD precipitation grids and sea surface temp anomalies.
    """
    # [Samples, SeqLen, Channels, Height, Width]
    x = np.random.rand(num_samples, SEQ_LEN, CHANNELS, HEIGHT, WIDTH).astype(np.float32) * 50.0
    y = x * 0.95 + np.random.normal(0, 2.0, x.shape).astype(np.float32)
    return torch.tensor(x), torch.tensor(y)

def calculate_validation_metrics(pred, target):
    """Computes MAE, RMSE, and R2 determination coefficient."""
    mae = torch.mean(torch.abs(pred - target)).item()
    rmse = torch.sqrt(torch.mean((pred - target) ** 2)).item()
    
    # R2 Score calculation
    target_mean = torch.mean(target)
    ss_tot = torch.sum((target - target_mean) ** 2).item()
    ss_res = torch.sum((target - pred) ** 2).item()
    r2 = 1.0 - (ss_res / ss_tot) if ss_tot > 0 else 1.0
    
    return mae, rmse, r2

def main():
    print("==============================================================")
    print("      VAYUSETU AI ENGINE: UNet-ConvLSTM TRAINING PIPELINE")
    print("==============================================================")
    
    # 1. Prepare data
    print("Preparing gridded training batches from simulated INSAT & IMD datasets...")
    x_train, y_train = generate_mock_gridded_data(num_samples=32)
    x_val, y_val = generate_mock_gridded_data(num_samples=8)
    
    # 2. Instantiate Model
    print(f"Initializing hybrid UNetConvLSTM model (Channels: {CHANNELS}, Spatial Grid: {HEIGHT}x{WIDTH})...")
    model = UNetConvLSTM(in_channels=CHANNELS, out_channels=CHANNELS, hidden_dim=16)
    
    # 3. Loss & Optimizer
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)
    
    # Create save directory
    save_dir = os.path.join("d:\\BUNNY\\PROJECTS\\ISRO", "models")
    os.makedirs(save_dir, exist_ok=True)
    checkpoint_path = os.path.join(save_dir, "unet_convlstm_checkpoint.pth")
    
    # 4. Training loop
    print("Starting training loop...")
    for epoch in range(1, EPOCHS + 1):
        model.train()
        epoch_loss = 0.0
        
        for i in range(0, len(x_train), BATCH_SIZE):
            batch_x = x_train[i : i + BATCH_SIZE]
            batch_y = y_train[i : i + BATCH_SIZE]
            
            optimizer.zero_grad()
            pred = model(batch_x)
            loss = criterion(pred, batch_y)
            loss.backward()
            optimizer.step()
            
            epoch_loss += loss.item() * batch_x.size(0)
            
        avg_train_loss = epoch_loss / len(x_train)
        
        # Validation
        model.eval()
        with torch.no_grad():
            val_preds = model(x_val)
            val_loss = criterion(val_preds, y_val).item()
            mae, rmse, r2 = calculate_validation_metrics(val_preds, y_val)
            
        print(f"Epoch [{epoch}/{EPOCHS}] | Train MSE: {avg_train_loss:.4f} | Val MSE: {val_loss:.4f} | MAE: {mae:.2f} mm | RMSE: {rmse:.2f} mm | R2: {r2:.3f}")
        
    # Save checkpoint
    print(f"Training completed successfully. Saving weights to: {checkpoint_path}")
    torch.save({
        'model_state_dict': model.state_dict(),
        'optimizer_state_dict': optimizer.state_dict(),
        'validation_metrics': {
            'mae': mae,
            'rmse': rmse,
            'r2': r2
        }
    }, checkpoint_path)
    
    # Create registry.json file
    import json
    registry_path = os.path.join(save_dir, "registry.json")
    registry_data = {
        "model": "unet_convlstm_rainfall",
        "version": "2.1.0-Ensemble",
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
        "r2_score": round(r2, 2),
        "created_at": "2026-06-21T08:33:00Z"
    }
    with open(registry_path, "w") as f:
        json.dump(registry_data, f, indent=2)
    print(f"Saved registry entry to {registry_path}")

if __name__ == "__main__":
    main()
