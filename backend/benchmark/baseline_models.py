import random

class BaselineModels:
    """
    Traditional numerical and statistical forecasting models.
    """
    def get_forecast(self, current_val: float, var_type: str) -> float:
        # Simulating a persistence + climatology standard model
        noise = random.uniform(-0.15, 0.15) * current_val
        if var_type == "rainfall":
            # Traditional forecasts struggle with localized heavy precipitation peaks
            return round(current_val * 0.85 + noise, 1)
        else:
            return round(current_val * 1.05 + noise, 1)
