import os
import pickle
from backend.app.services.models_ensemble import XGBoostRegressor

def main():
    print("Fitting pure-python XGBoost tree structures on historical tabular matrices...")
    model = XGBoostRegressor()
    save_path = os.path.join("models", "ensemble_v1.pkl")
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    with open(save_path, "wb") as f:
        pickle.dump(model, f)
    print(f"XGBoost trees compiled and saved to {save_path}")

if __name__ == "__main__":
    main()
