import numpy as np
from typing import Dict, Any, List

def calculate_rational_runoff(
    rainfall_intensity_mm_hr: float,
    catchment_area_km2: float,
    runoff_coefficient: float = 0.65
) -> float:
    """
    Calculates peak water discharge using the Rational Method: Q = C * I * A.
    Q = Peak discharge in cubic meters per second (m^3/s).
    C = Runoff coefficient (dimensionless, representing land cover/soil absorption).
    I = Rainfall intensity (mm/hr).
    A = Catchment area (km^2).
    """
    # Unit conversion factor: 1 mm/hr * 1 km^2 = 0.2778 m^3/s
    conversion_factor = 0.2778
    peak_discharge = runoff_coefficient * rainfall_intensity_mm_hr * catchment_area_km2 * conversion_factor
    return round(peak_discharge, 2)

def assess_flood_hazard(
    peak_discharge_m3s: float,
    channel_capacity_m3s: float
) -> Dict[str, Any]:
    """
    Assesses flood hazard level based on peak discharge vs river channel capacity.
    """
    ratio = peak_discharge_m3s / channel_capacity_m3s if channel_capacity_m3s > 0 else 1.0
    
    if ratio < 0.6:
        hazard_level = "LOW"
        risk_score = int(ratio * 100 * 0.8)
    elif ratio < 0.9:
        hazard_level = "ELEVATED"
        risk_score = int(ratio * 100 * 0.9)
    else:
        hazard_level = "CRITICAL"
        risk_score = min(100, int(ratio * 100))
        
    return {
        "peak_discharge_m3s": peak_discharge_m3s,
        "channel_capacity_m3s": channel_capacity_m3s,
        "discharge_ratio": round(ratio, 2),
        "hazard_level": hazard_level,
        "risk_score": risk_score
    }

def run_district_flood_simulation(
    precipitation_anomaly_pct: float,
    urbanization_increase_pct: float,
    base_rainfall_mm: float = 120.0,
    districts: List[str] = None,
    soil_moisture_pct: float = 50.0
) -> Dict[str, Any]:
    """
    Simulates district-level flood indices under dynamic 'What-If' scenarios.
    Precipitation anomaly and urbanization directly alter the runoff coefficient and rainfall intensity.
    """
    if districts is None:
        districts = [
            "New Delhi", "Mumbai", "Kolkata", "Chennai",
            "Bengaluru", "Hyderabad", "Guwahati", "Srinagar",
            "Ahmedabad", "Bhopal", "Visakhapatnam", "Patna"
        ]
        
    results = {}
    
    # Base parameters for districts: [area (km2), channel_capacity (m3s), base_runoff_coeff]
    district_specs = {
        "New Delhi": {"area": 1480, "capacity": 600, "base_c": 0.50},
        "Mumbai": {"area": 600, "capacity": 400, "base_c": 0.70},
        "Kolkata": {"area": 200, "capacity": 150, "base_c": 0.65},
        "Chennai": {"area": 420, "capacity": 300, "base_c": 0.60},
        "Bengaluru": {"area": 700, "capacity": 250, "base_c": 0.45},
        "Hyderabad": {"area": 650, "capacity": 220, "base_c": 0.42},
        "Guwahati": {"area": 330, "capacity": 500, "base_c": 0.58},
        "Srinagar": {"area": 290, "capacity": 400, "base_c": 0.48},
        "Ahmedabad": {"area": 460, "capacity": 300, "base_c": 0.40},
        "Bhopal": {"area": 280, "capacity": 200, "base_c": 0.44},
        "Visakhapatnam": {"area": 540, "capacity": 250, "base_c": 0.65},
        "Patna": {"area": 250, "capacity": 350, "base_c": 0.55}
    }
    
    for district in districts:
        specs = district_specs.get(district, {"area": 500, "capacity": 300, "base_c": 0.60})
        
        # Calculate simulated rainfall intensity
        # Assume rainfall occurs over a 6-hour duration
        simulated_rainfall = base_rainfall_mm * (1 + precipitation_anomaly_pct / 100)
        intensity = simulated_rainfall / 6.0
        
        # Urbanization increases impervious surfaces, thereby increasing the runoff coefficient.
        # Soil moisture adds an Antecedent Moisture Condition (AMC) factor (range: -0.15 to +0.15).
        moisture_factor = (soil_moisture_pct - 50.0) * 0.003
        simulated_c = min(0.98, max(0.15, specs["base_c"] + (urbanization_increase_pct * 0.005) + moisture_factor))
        
        # Calculate discharge
        q = calculate_rational_runoff(intensity, specs["area"], simulated_c)
        
        # Assess hazard
        hazard = assess_flood_hazard(q, specs["capacity"])
        
        results[district] = {
            "rainfall_mm": round(simulated_rainfall, 1),
            "runoff_coefficient": round(simulated_c, 2),
            "soil_moisture_pct": soil_moisture_pct,
            **hazard
        }
        
    return results
