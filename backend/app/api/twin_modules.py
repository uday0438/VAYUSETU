from fastapi import APIRouter, Query, HTTPException, Body
from typing import Dict, Any, Optional

# Import twin engines
from lineage_engine.lineage_manager import LineageManager
from lineage_engine.dataset_tracker import DatasetTracker
from lineage_engine.audit_trail import AuditTrail
from time_travel.timeline_controller import TimelineController
from decision_engine.impact_assessor import ImpactAssessor
from decision_engine.recommendation_engine import RecommendationEngine
from stakeholder_views.view_generator import (
    get_scientist_view,
    get_administrator_view,
    get_disaster_management_view,
    get_farmer_view,
)
from policy_engine.policy_simulator import PolicySimulator
from policy_engine.policy_impact import PolicyImpactAnalyzer
from copilot.copilot_service import ClimateCopilotService
from trust_engine.trust_score import TrustScoreCalculator
from coverage_engine.coverage_tracker import CoverageTracker
from freshness.freshness_monitor import FreshnessMonitor

router = APIRouter()

# Singletons / Managers
lineage_mgr = LineageManager()
dataset_tracker = DatasetTracker()
audit_trail = AuditTrail()
timeline_ctrl = TimelineController()
impact_assessor = ImpactAssessor()
recommendation_eng = RecommendationEngine()
policy_sim = PolicySimulator()
policy_analyzer = PolicyImpactAnalyzer()
copilot_svc = ClimateCopilotService()
trust_calc = TrustScoreCalculator()
coverage_trk = CoverageTracker()
freshness_mon = FreshnessMonitor()

@router.get("/twin-lineage")
def get_latest_lineage() -> Dict[str, Any]:
    """Retrieve the latest Digital Twin state lineage metadata."""
    record = lineage_mgr.get_latest_lineage()
    if not record:
        raise HTTPException(status_code=444, detail="No lineage records found.")
    from dataclasses import asdict
    return asdict(record)

@router.get("/twin-lineage/{version}")
def get_versioned_lineage(version: int) -> Dict[str, Any]:
    """Retrieve lineage metadata for a specific Twin version."""
    record = lineage_mgr.get_lineage(version)
    if not record:
        raise HTTPException(status_code=404, detail=f"Lineage version {version} not found.")
    from dataclasses import asdict
    return asdict(record)

@router.get("/audit-trail")
def get_twin_audit_trail(limit: int = 50) -> Dict[str, Any]:
    """Retrieve immutable logs documenting digital twin events with SHA-256 validation."""
    trail = audit_trail.get_audit_trail(limit)
    return {"status": "success", "count": len(trail), "trail": trail}

@router.get("/dataset-status")
def get_datasets_status() -> Dict[str, Any]:
    """Track data freshness, coverage metrics, and live stream status of ISRO/IMD feeds."""
    return dataset_tracker.get_dataset_status()

@router.get("/time-travel")
def time_travel_state(offset_hours: float = Query(0.0, description="Negative = past, 0 = current, Positive = future forecast")) -> Dict[str, Any]:
    """Temporal time-travel navigation across past, present, and projected twin states."""
    result = timeline_ctrl.get_timeline_state(offset_hours)
    # Log this search event
    audit_trail.log_event("SCENARIO_RUN", {"time_travel_offset_hours": offset_hours, "action": "Time Travel Inquired"})
    return result

@router.get("/decision-impact")
def get_decision_impact(
    district: str = Query("Visakhapatnam", description="District for impact assessment"),
    flood_risk: float = 0.58,
    heat_risk: float = 0.42,
    drought_risk: float = 0.20,
    water_stress: float = 0.35,
) -> Dict[str, Any]:
    """Assess hazard cascading impacts and return stakeholder action advisories."""
    assessment = impact_assessor.assess_impact(
        flood_risk=flood_risk,
        heat_risk=heat_risk,
        drought_risk=drought_risk,
        water_stress=water_stress,
        district=district
    )
    
    # Generate recommendations based on the risk profile
    recs = recommendation_eng.get_recommendations({
        "flood_risk": flood_risk,
        "heat_risk": heat_risk,
        "drought_risk": drought_risk,
        "water_stress": water_stress
    })
    
    assessment["recommendations"] = recs
    return assessment

@router.get("/stakeholder-view")
def get_stakeholder_sliced_view(
    role: str = Query("scientist", description="scientist | administrator | disaster | farmer"),
    district: str = Query("Visakhapatnam", description="District to display")
) -> Dict[str, Any]:
    """Filter the twin state fields to return customized interfaces for targeted stakeholders."""
    # Build standard fallback state
    fallback_state = {
        "district": district,
        "temperature": 31.8,
        "rainfall": 75.0,
        "soil_moisture": 68.0,
        "humidity": 82.0,
        "lst": 32.5,
        "sst": 29.2,
        "kalman_gain": 0.42,
        "kalman_covariance": 0.15,
        "vayusetu_risk_score": 62.0,
        "vayusetu_risk_level": "HIGH",
        "flood_risk": 58.0,
        "heatwave_risk": 42.0,
        "drought_risk": 20.0,
        "sector_impacts": {
            "agriculture": {"crop_stress_pct": 12.5},
            "water": {"reservoir_stress_pct": 35.0}
        }
    }
    
    role_lower = role.lower()
    if "scientist" in role_lower:
        return get_scientist_view(fallback_state)
    elif "admin" in role_lower:
        return get_administrator_view(fallback_state)
    elif "disaster" in role_lower:
        return get_disaster_management_view(fallback_state)
    elif "farmer" in role_lower:
        return get_farmer_view(fallback_state)
    else:
        raise HTTPException(status_code=400, detail="Invalid role. Must be scientist, administrator, disaster, or farmer.")

@router.post("/policy-simulate")
def simulate_policy_lever_impact(
    body: Dict[str, Any] = Body(
        default={
            "base_flood": 58.0,
            "base_heat": 42.0,
            "base_drought": 20.0,
            "base_water": 35.0,
            "forest_cover_change_pct": 10.0,
            "urbanization_change_pct": 15.0,
            "water_storage_change_pct": 20.0
        }
    )
) -> Dict[str, Any]:
    """Simulate urbanization and environmental adjustments to produce executive-level policy reports."""
    results = policy_sim.simulate(
        base_flood=body.get("base_flood", 58.0),
        base_heat=body.get("base_heat", 42.0),
        base_drought=body.get("base_drought", 20.0),
        base_water=body.get("base_water", 35.0),
        forest_cover_change_pct=body.get("forest_cover_change_pct", 10.0),
        urbanization_change_pct=body.get("urbanization_change_pct", 15.0),
        water_storage_change_pct=body.get("water_storage_change_pct", 20.0),
    )
    report = policy_analyzer.analyze_impact(results)
    return {
        "status": "success",
        "simulation": results,
        "analysis_report": report
    }

@router.post("/copilot/ask")
def ask_climate_copilot(
    body: Dict[str, Any] = Body(default={"question": "What happens if rainfall increases 20%?"})
) -> Dict[str, Any]:
    """Interact with the dynamic rule-based AI Copilot Service."""
    question = body.get("question", "What happens if rainfall increases 20%?")
    # Default state mock matching Visakhapatnam current conditions
    mock_state = {
        "district": "Visakhapatnam",
        "temperature": 31.8,
        "rainfall": 75.0,
        "soil_moisture": 68.0,
        "humidity": 82.0,
        "lst": 32.5,
        "sst": 29.2,
        "vayusetu_risk_score": 62.0
    }
    state = body.get("twin_state", mock_state)
    answer = copilot_svc.ask(question, state)
    return {"question": question, "answer": answer}

@router.get("/trust-score")
def get_digital_twin_trust_score(
    freshness: float = Query(85.0),
    confidence: float = Query(91.0),
    success_rate: float = Query(95.0),
    coverage: float = Query(92.4)
) -> Dict[str, Any]:
    """Retrieve the unified trust score showing telemetry and model health indices."""
    return trust_calc.calculate_trust_score(freshness, confidence, success_rate, coverage)

@router.get("/system-coverage")
def get_system_dataset_coverage() -> Dict[str, Any]:
    """Retrieve spatial grids coverages across national satellites."""
    return coverage_trk.get_system_coverage()

@router.get("/data-freshness")
def get_system_freshness_monitor() -> Dict[str, Any]:
    """Retrieve operational pipeline updates freshness status."""
    return freshness_mon.get_freshness_status()

@router.get("/twin-status")
def get_comprehensive_twin_status() -> Dict[str, Any]:
    """Serve a complete overview status pane for the digital twin's control bar."""
    from app.services.drift_alerting import get_drift_alerts
    cov = coverage_trk.get_system_coverage()
    fresh = freshness_mon.get_freshness_status()
    trust = trust_calc.calculate_trust_score(
        freshness_score=fresh["freshness_score"],
        model_confidence=91.0,
        assimilation_success_rate=95.0,
        data_coverage_pct=cov["overall_score"]
    )
    return {
        "status": "ACTIVE",
        "twin_version": "v1.24",
        "last_assimilation": "12s ago",
        "twin_health_score": 96.0,
        "active_datasets_count": len(cov["datasets"]),
        "overall_coverage_pct": cov["overall_score"],
        "overall_freshness_score": fresh["freshness_score"],
        "twin_trust_score": trust["trust_score"],
        "trust_category": trust["category"],
        "drift_alerts": get_drift_alerts()
    }
