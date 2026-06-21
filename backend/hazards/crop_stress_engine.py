class CropStressEngine:
    def calculate_risk(self, temperature: float, soil_moisture: float) -> float:
        # Thermal heat stress + agricultural drought
        thermal_stress = min(1.0, max(0.0, (temperature - 28.0) / 17.0))
        moisture_stress = min(1.0, max(0.0, (55.0 - soil_moisture) / 45.0))
        risk = (thermal_stress * 0.5 + moisture_stress * 0.5) * 100.0
        return round(risk, 1)
