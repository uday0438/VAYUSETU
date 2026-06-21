class FloodHazardEngine:
    def calculate_risk(self, rainfall: float, soil_moisture: float) -> float:
        # Combination of heavy rain + high soil saturation
        rain_factor = min(1.0, rainfall / 150.0) * 60.0
        sm_factor = min(1.0, soil_moisture / 100.0) * 40.0
        return round(rain_factor + sm_factor, 1)
