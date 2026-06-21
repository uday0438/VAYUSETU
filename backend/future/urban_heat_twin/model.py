class UrbanHeatTwinModel:
    def simulate_microclimate(self, lst: float, albedo: float) -> float:
        # Future urban microclimate simulation
        return round(lst * (1.0 - albedo), 2)
