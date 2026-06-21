from app.training.metrics import compute_rmse, compute_mae, compute_r2

def calculate_mape(actual, predicted):
    return round((sum(abs(a - p) / (a + 1e-5) for a, p in zip(actual, predicted)) / len(actual)) * 100.0, 2)