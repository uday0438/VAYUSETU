class DroughtHazardEngine:
    def calculate_risk(self, soil_moisture: float, relative_humidity: float) -> float:
        # High drought risk when soil moisture is low and air is dry
        sm_deficit = max(0.0, 100.0 - soil_moisture) / 100.0
        rh_deficit = max(0.0, 100.0 - relative_humidity) / 100.0
        return round((sm_deficit * 0.75 + rh_deficit * 0.25) * 100.0, 1)
