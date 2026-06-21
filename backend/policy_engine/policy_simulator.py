from typing import Dict, Any

class PolicySimulator:
    """
    Simulates macro-policy shifts (afforestation, urbanization, water storage)
    and forecasts impact shifts across multiple climate risks.
    """

    def simulate(
        self,
        base_flood: float,
        base_heat: float,
        base_drought: float,
        base_water: float,
        forest_cover_change_pct: float,
        urbanization_change_pct: float,
        water_storage_change_pct: float
    ) -> Dict[str, Any]:
        """
        Calculates before and after risk shifts based on input policy adjustments.
        Levers operate relative to baselines.
        """
        # Calculate shifts
        # Forest cover increases infiltration and reduces heat island effect
        # Urbanization increases runoff and increases heat island effect
        # Water storage reduces water stress and buffers drought
        
        flood_shift = (urbanization_change_pct * 0.8) - (forest_cover_change_pct * 0.5) - (water_storage_change_pct * 0.2)
        heat_shift = (urbanization_change_pct * 0.6) - (forest_cover_change_pct * 0.7)
        drought_shift = (urbanization_change_pct * 0.2) - (forest_cover_change_pct * 0.3) - (water_storage_change_pct * 0.4)
        water_shift = (urbanization_change_pct * 0.3) - (water_storage_change_pct * 0.6)

        simulated_flood = max(0.0, min(100.0, base_flood + flood_shift))
        simulated_heat = max(0.0, min(100.0, base_heat + heat_shift))
        simulated_drought = max(0.0, min(100.0, base_drought + drought_shift))
        simulated_water = max(0.0, min(100.0, base_water + water_shift))

        base_cri = round(0.35 * base_flood + 0.35 * base_heat + 0.15 * base_drought + 0.15 * base_water, 1)
        simulated_cri = round(0.35 * simulated_flood + 0.35 * simulated_heat + 0.15 * simulated_drought + 0.15 * simulated_water, 1)

        return {
            "before": {
                "flood_risk": round(base_flood, 1),
                "heat_risk": round(base_heat, 1),
                "drought_risk": round(base_drought, 1),
                "water_stress": round(base_water, 1),
                "climate_resilience_index": base_cri
            },
            "after": {
                "flood_risk": round(simulated_flood, 1),
                "heat_risk": round(simulated_heat, 1),
                "drought_risk": round(simulated_drought, 1),
                "water_stress": round(simulated_water, 1),
                "climate_resilience_index": simulated_cri
            },
            "deltas": {
                "flood_risk_change_pct": round(flood_shift, 1),
                "heat_risk_change_pct": round(heat_shift, 1),
                "drought_risk_change_pct": round(drought_shift, 1),
                "water_stress_change_pct": round(water_shift, 1),
                "cri_change": round(simulated_cri - base_cri, 1)
            }
        }
