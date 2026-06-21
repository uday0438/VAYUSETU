from typing import Dict, Any

class ScenarioSimulationEngine:
    """
    Computes climate twin state updates under user-defined What-If scenarios.
    Processes variations in rainfall, temperature, urbanization, and vegetation.
    """
    def run_scenario(self, base_state: Dict[str, Any], modifiers: Dict[str, float]) -> Dict[str, Any]:
        temp_rise = modifiers.get("temp_rise_c", 0.0)
        rain_shift = modifiers.get("precipitation_shift_pct", 0.0)
        urban_shift = modifiers.get("urbanization_increase_pct", 0.0)
        forest_shift = modifiers.get("vegetation_increase_pct", 0.0)
        
        # Physics-informed modifications
        new_temp = base_state["temperature"] + temp_rise
        new_rain = base_state["rainfall"] * (1.0 + rain_shift / 100.0)
        
        # Clausius-Clapeyron scaling: 7% more capacity per 1C temp rise
        if temp_rise > 0:
            new_rain *= (1.0 + 0.07 * temp_rise)
            
        new_sm = min(98.0, max(10.0, base_state["soil_moisture"] + (rain_shift * 0.15) - (temp_rise * 1.5) + (forest_shift * 0.2)))
        
        # Urbanization increases surface temperature (heat island offset)
        new_lst = base_state["lst"] + temp_rise + (urban_shift * 0.08) - (forest_shift * 0.05)
        
        return {
            "temperature": round(new_temp, 2),
            "rainfall": round(new_rain, 2),
            "soil_moisture": round(new_sm, 2),
            "lst": round(new_lst, 2)
        }