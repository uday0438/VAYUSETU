class AgriTwinModel:
    def estimate_crop_health(self, soil_moisture: float, temperature: float) -> float:
        # Future agricultural yield and crop stress twin extension
        return round(soil_moisture * 0.6 - (temperature - 28.0) * 0.8, 1)
