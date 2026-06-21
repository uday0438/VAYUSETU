class HeatHazardEngine:
    def calculate_risk(self, temperature: float, lst: float) -> float:
        # Core temperature risk combined with land surface thermal heat
        temp_norm = max(0.0, (temperature - 20.0) / 25.0)  # normalized relative to 45C
        lst_norm = max(0.0, (lst - 22.0) / 28.0)
        return round((temp_norm * 0.7 + lst_norm * 0.3) * 100.0, 1)
