from typing import Dict, Any

def get_scientist_view(state: Dict[str, Any]) -> Dict[str, Any]:
    """Provides detailed physical and scientific telemetry for climate researchers."""
    return {
        "role": "Scientist",
        "district": state.get("district", "Visakhapatnam"),
        "raw_observations": {
            "temperature_c": state.get("temperature", 31.8),
            "rainfall_mm": state.get("rainfall", 75.0),
            "soil_moisture_pct": state.get("soil_moisture", 68.0),
            "humidity_pct": state.get("humidity", 82.0),
            "lst_c": state.get("lst", 32.5),
            "sst_c": state.get("sst", 29.2)
        },
        "assimilation_diagnostics": {
            "kalman_gain": state.get("kalman_gain", 0.42),
            "kalman_covariance": state.get("kalman_covariance", 0.15),
            "drift_status": "STABLE",
            "twin_confidence_pct": 91.0
        },
        "spatial_grid_extent": {
            "resolution": "0.25 deg x 0.25 deg",
            "lat_bounds": [17.5, 17.9],
            "lon_bounds": [83.0, 83.4]
        }
    }

def get_administrator_view(state: Dict[str, Any]) -> Dict[str, Any]:
    """Provides high-level planning, resource allocations, and risk indexes for government admins."""
    return {
        "role": "Administrator",
        "district": state.get("district", "Visakhapatnam"),
        "summary": {
            "vayusetu_cri_score": state.get("vayusetu_risk_score", 62.0),
            "risk_level": state.get("vayusetu_risk_level", "HIGH"),
            "population_density_index": "High Exposure"
        },
        "resources_at_risk": {
            "hospital_nodes_exposed": int(state.get("flood_risk", 58.0) * 0.4),
            "bridges_exceeding_threshold": int(state.get("flood_risk", 58.0) * 0.7),
            "power_grid_thermal_headroom_mw": max(5, int(150 - (state.get("temperature", 31.8) - 25) * 8))
        },
        "economic_indicators": {
            "projected_gdp_impact_cr": round(state.get("vayusetu_risk_score", 62.0) * 0.03 * 62500 / 100, 2),
            "infrastructure_rehabilitation_cost_cr": 12.5
        }
    }

def get_disaster_management_view(state: Dict[str, Any]) -> Dict[str, Any]:
    """Provides operational alert triggers and disaster mitigation plans."""
    flood_val = state.get("flood_risk", 58.0)
    heat_val = state.get("heatwave_risk", 42.0)
    drought_val = state.get("drought_risk", 20.0)
    
    severity = "NORMAL"
    if max(flood_val, heat_val, drought_val) > 75:
        severity = "CRITICAL"
    elif max(flood_val, heat_val, drought_val) > 50:
        severity = "WARNING"
        
    return {
        "role": "Disaster Management",
        "district": state.get("district", "Visakhapatnam"),
        "active_alerts": state.get("advisories", [
            {"action": "Standard monitoring active.", "priority": "NORMAL", "stakeholder": "Disaster Management"}
        ]),
        "hazard_levels": {
            "flood_index_pct": flood_val,
            "heatwave_index_pct": heat_val,
            "drought_index_pct": drought_val,
            "overall_severity": severity
        },
        "operational_response": {
            "sdrf_dispatch_hubs": ["Vizag Central Node", "Anakapalli Station"],
            "emergency_shelter_capacity": 15000,
            "common_alerting_protocol_gateway": "CAP-Synced"
        }
    }

def get_farmer_view(state: Dict[str, Any]) -> Dict[str, Any]:
    """Provides actionable soil moisture, crop thermal stress, and irrigation insights for farmers."""
    sm = state.get("soil_moisture", 68.0)
    water_stress = state.get("sector_impacts", {}).get("water", {}).get("reservoir_stress_pct", 35.0)
    
    crop_risk = "LOW"
    if sm < 40 or sm > 90:
        crop_risk = "HIGH"
    elif sm < 50 or sm > 80:
        crop_risk = "MODERATE"
        
    return {
        "role": "Farmer",
        "district": state.get("district", "Visakhapatnam"),
        "agri_conditions": {
            "temperature_c": state.get("temperature", 31.8),
            "precipitation_mm": state.get("rainfall", 75.0),
            "soil_moisture_saturation_pct": sm,
            "reservoir_stress_pct": water_stress
        },
        "crop_intelligence": {
            "irrigation_multiplier": round(1.0 + (30.0 / max(10.0, sm)), 2),
            "thermal_crop_stress_index": state.get("sector_impacts", {}).get("agriculture", {}).get("crop_stress_pct", 12.5),
            "soil_absorption_class": "Red Sandy Loam",
            "overall_crop_failure_risk": crop_risk
        }
    }
