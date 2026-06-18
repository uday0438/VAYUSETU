import logging
import numpy as np
from fastapi import APIRouter, Query, HTTPException
from typing import Dict, Any
from digital_twin.simulation_engine.runoff_model import run_district_flood_simulation

logger = logging.getLogger(__name__)

router = APIRouter()

TIMELINE_PROJECTIONS = {
    2026: {
        "year": 2026,
        "scenario": "Historical Baseline",
        "temperature_anomaly_c": 1.5,
        "sea_level_rise_cm": 0.0,
        "precipitation_shift_pct": 20.0,
        "crop_yield_stress_multiplier": 1.0,
        "co2_concentration_ppm": 418.0,
        "crop_kc_projections": {
            "rice": {
                "stages": ["Initial", "Development", "Mid-Season", "Late"],
                "kc_values": [0.3, 1.15, 1.20, 0.8],
                "irrigation_multiplier": 1.0,
                "yield_loss_pct": 0.0
            },
            "wheat": {
                "stages": ["Initial", "Development", "Mid-Season", "Late"],
                "kc_values": [0.3, 1.15, 1.15, 0.4],
                "irrigation_multiplier": 1.0,
                "yield_loss_pct": 0.0
            }
        }
    },
    2030: {
        "year": 2030,
        "scenario": "SSP2-4.5 Intermediate Pathway",
        "temperature_anomaly_c": 1.7,
        "sea_level_rise_cm": 2.1,
        "precipitation_shift_pct": 24.0,
        "crop_yield_stress_multiplier": 1.1,
        "co2_concentration_ppm": 435.0,
        "crop_kc_projections": {
            "rice": {
                "stages": ["Initial", "Development", "Mid-Season", "Late"],
                "kc_values": [0.32, 1.18, 1.24, 0.82],
                "irrigation_multiplier": 1.12,
                "yield_loss_pct": 4.5
            },
            "wheat": {
                "stages": ["Initial", "Development", "Mid-Season", "Late"],
                "kc_values": [0.31, 1.16, 1.18, 0.42],
                "irrigation_multiplier": 1.08,
                "yield_loss_pct": 3.2
            }
        }
    },
    2040: {
        "year": 2040,
        "scenario": "SSP2-4.5 Intermediate Pathway",
        "temperature_anomaly_c": 2.1,
        "sea_level_rise_cm": 6.4,
        "precipitation_shift_pct": 28.0,
        "crop_yield_stress_multiplier": 1.3,
        "co2_concentration_ppm": 460.0,
        "crop_kc_projections": {
            "rice": {
                "stages": ["Initial", "Development", "Mid-Season", "Late"],
                "kc_values": [0.35, 1.22, 1.30, 0.85],
                "irrigation_multiplier": 1.28,
                "yield_loss_pct": 12.0
            },
            "wheat": {
                "stages": ["Initial", "Development", "Mid-Season", "Late"],
                "kc_values": [0.34, 1.20, 1.22, 0.45],
                "irrigation_multiplier": 1.18,
                "yield_loss_pct": 8.5
            }
        }
    },
    2050: {
        "year": 2050,
        "scenario": "SSP2-4.5 Intermediate Pathway",
        "temperature_anomaly_c": 2.6,
        "sea_level_rise_cm": 12.8,
        "precipitation_shift_pct": 35.0,
        "crop_yield_stress_multiplier": 1.6,
        "co2_concentration_ppm": 490.0,
        "crop_kc_projections": {
            "rice": {
                "stages": ["Initial", "Development", "Mid-Season", "Late"],
                "kc_values": [0.38, 1.28, 1.35, 0.90],
                "irrigation_multiplier": 1.45,
                "yield_loss_pct": 22.5
            },
            "wheat": {
                "stages": ["Initial", "Development", "Mid-Season", "Late"],
                "kc_values": [0.37, 1.25, 1.28, 0.48],
                "irrigation_multiplier": 1.32,
                "yield_loss_pct": 16.0
            }
        }
    }
}

@router.get("/runoff")
def simulate_runoff(
    precipitation_anomaly_pct: float = Query(20.0, description="Precipitation anomaly percentage", ge=-50.0, le=100.0),
    urbanization_increase_pct: float = Query(15.0, description="Urban cover shift percentage", ge=-50.0, le=50.0),
    temp_rise_c: float = Query(1.5, description="Global temperature anomaly", ge=-2.0, le=5.0),
    soil_moisture_pct: float = Query(50.0, description="Soil moisture index percentage", ge=0.0, le=100.0),
    vegetation_increase_pct: float = Query(0.0, description="Vegetation/Forest cover shift percentage", ge=-50.0, le=50.0)
) -> Dict[str, Any]:
    """Runs a hydrological simulation based on input What-If scenarios and returns district risk scoring and scenario metrics."""
    try:
        simulation_results = run_district_flood_simulation(
            precipitation_anomaly_pct=precipitation_anomaly_pct,
            urbanization_increase_pct=urbanization_increase_pct,
            soil_moisture_pct=soil_moisture_pct,
            temp_rise_c=temp_rise_c
        )
    except Exception as e:
        logger.exception("Simulation engine failed")
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")

    if simulation_results:
        overall_score = max(res["risk_score"] for res in simulation_results.values())
    else:
        overall_score = 45

    overall_level = "CRITICAL" if overall_score > 75 else "ELEVATED" if overall_score > 50 else "NORMAL"

    # Compute What-If Scenario secondary impact metrics
    heatwave_shift = (temp_rise_c * 15.0) + (urbanization_increase_pct * 0.6) - (vegetation_increase_pct * 0.8)
    heatwave_shift = round(max(-50.0, min(100.0, heatwave_shift)), 1)

    flood_shift = (precipitation_anomaly_pct * 0.7) + (urbanization_increase_pct * 0.8) - (vegetation_increase_pct * 0.5)
    flood_shift = round(max(-50.0, min(100.0, flood_shift)), 1)

    crop_yield_shift = (
        (precipitation_anomaly_pct * 0.15 if precipitation_anomaly_pct < 30 else -0.2 * (precipitation_anomaly_pct - 30))
        - (temp_rise_c * 6.5)
        - (urbanization_increase_pct * 0.4)
        + (vegetation_increase_pct * 0.5)
        + (soil_moisture_pct - 50.0) * 0.2
    )
    crop_yield_shift = round(max(-75.0, min(30.0, crop_yield_shift)), 1)

    water_availability_shift = (
        (precipitation_anomaly_pct * 0.5)
        + (soil_moisture_pct - 50.0) * 0.25
        - (temp_rise_c * 5.0)
        - (urbanization_increase_pct * 0.3)
    )
    water_availability_shift = round(max(-60.0, min(50.0, water_availability_shift)), 1)

    return {
        "status": "success",
        "inputs": {
            "precipitation_anomaly_pct": precipitation_anomaly_pct,
            "urbanization_increase_pct": urbanization_increase_pct,
            "temp_rise_c": temp_rise_c,
            "soil_moisture_pct": soil_moisture_pct,
            "vegetation_increase_pct": vegetation_increase_pct
        },
        "overall_risk_score": overall_score,
        "overall_level": overall_level,
        "scenario_studio_metrics": {
            "heatwave_risk_shift_pct": heatwave_shift,
            "flood_risk_shift_pct": flood_shift,
            "crop_yield_shift_pct": crop_yield_shift,
            "water_availability_shift_pct": water_availability_shift
        },
        "district_breakdown": simulation_results
    }

@router.get("/climate-timeline")
def get_climate_timeline(year: int = Query(2026, description="Scenario year: 2026, 2030, 2040, 2050")) -> Dict[str, Any]:
    """Returns future climate change timeline projection parameters under SSP pathways."""
    if year not in TIMELINE_PROJECTIONS:
        raise HTTPException(status_code=400, detail="Projection year must be 2026, 2030, 2040, or 2050")
    return TIMELINE_PROJECTIONS[year]

@router.get("/hydraulic-routing")
def get_hydraulic_routing(
    district: str = Query("Visakhapatnam", description="District for hydraulic routing simulation"),
    precipitation_anomaly_pct: float = Query(20.0, description="Precipitation anomaly"),
    friction_coeff: float = Query(0.03, description="Manning's friction coefficient")
) -> Dict[str, Any]:
    """Runs the 2D Saint-Venant solver for the district under the precipitation scenario."""
    from app.services.hydraulic_routing import SaintVenantSolver2D
    
    # Generate elevation and runoff grids based on the district name (deterministic mock)
    seed = sum(ord(c) for c in district)
    np.random.seed(seed)
    
    nx, ny = 16, 16
    x = np.linspace(0, 1, nx)
    y = np.linspace(0, 1, ny)
    X, Y = np.meshgrid(x, y)
    
    if district in ["Visakhapatnam", "Mumbai"]:
        elevation = 20.0 * (1.0 - X) + 5.0 * np.random.rand(nx, ny)
    else:
        elevation = 50.0 * ((X - 0.5)**2 + (Y - 0.5)**2) + 2.0 * np.random.rand(nx, ny)
        
    base_rain = 0.01 * (1.0 + precipitation_anomaly_pct / 100.0)
    runoff = np.ones((nx, ny)) * base_rain + 0.005 * np.random.rand(nx, ny)
    
    solver = SaintVenantSolver2D(nx=nx, ny=ny, dx=50.0, dy=50.0, dt=0.02)
    h, u, v = solver.solve(elevation, runoff, friction_coeff=friction_coeff, steps=15)
    
    return {
        "status": "success",
        "district": district,
        "grid_dims": [nx, ny],
        "depth_grid": h.tolist(),
        "velocity_x_grid": u.tolist(),
        "velocity_y_grid": v.tolist()
    }
