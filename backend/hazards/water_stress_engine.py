class WaterStressEngine:
    def calculate_risk(self, temperature: float, rainfall: float) -> float:
        # High temperatures and low rainfall cause high evaporative losses and water stress
        temp_stress = min(1.0, max(0.0, (temperature - 25.0) / 20.0))
        rain_relief = min(1.0, rainfall / 100.0)
        stress = (temp_stress * 0.7 + (1.0 - rain_relief) * 0.3) * 100.0
        return round(stress, 1)
