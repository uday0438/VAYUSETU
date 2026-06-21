from app.training.metrics import compute_rmse, compute_mae, compute_r2

def evaluate_all_models():
    actuals = [2.3, 1.8, 3.5, 4.1]
    predictions = [2.2, 1.9, 3.3, 4.2]
    
    rmse = compute_rmse(actuals, predictions)
    mae = compute_mae(actuals, predictions)
    r2 = compute_r2(actuals, predictions)
    
    print("Evaluation results:")
    print(f"RMSE: {rmse}, MAE: {mae}, R2: {r2}")
    return {"rmse": rmse, "mae": mae, "r2_score": r2}

if __name__ == "__main__":
    evaluate_all_models()