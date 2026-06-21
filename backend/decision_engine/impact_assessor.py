"""
VAYUSETU Decision Impact Assessor
==================================
Translates raw climate risk scores into concrete impact estimates:
affected population, infrastructure exposure, and economic cost.
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import Dict


# District-level baseline data (Andhra Pradesh focus)
_DISTRICT_DATA: Dict[str, Dict] = {
    "Visakhapatnam": {
        "population": 4_288_113,
        "area_sq_km": 11_161,
        "urban_pct": 47.5,
        "hospitals": 42,
        "schools": 1_850,
        "bridges": 128,
        "power_stations": 6,
        "crop_area_hectares": 285_000,
        "gdp_cr": 62_500,
    },
    "Krishna": {
        "population": 4_529_009,
        "area_sq_km": 8_727,
        "urban_pct": 33.2,
        "hospitals": 38,
        "schools": 2_100,
        "bridges": 96,
        "power_stations": 4,
        "crop_area_hectares": 410_000,
        "gdp_cr": 48_200,
    },
    "East Godavari": {
        "population": 5_151_549,
        "area_sq_km": 10_807,
        "urban_pct": 29.1,
        "hospitals": 35,
        "schools": 2_450,
        "bridges": 112,
        "power_stations": 3,
        "crop_area_hectares": 520_000,
        "gdp_cr": 41_800,
    },
    "West Godavari": {
        "population": 3_934_782,
        "area_sq_km": 7_742,
        "urban_pct": 22.8,
        "hospitals": 28,
        "schools": 1_920,
        "bridges": 87,
        "power_stations": 2,
        "crop_area_hectares": 480_000,
        "gdp_cr": 36_500,
    },
    "Guntur": {
        "population": 4_889_230,
        "area_sq_km": 11_391,
        "urban_pct": 30.5,
        "hospitals": 40,
        "schools": 2_300,
        "bridges": 105,
        "power_stations": 5,
        "crop_area_hectares": 460_000,
        "gdp_cr": 44_100,
    },
}

_DEFAULT_DISTRICT = "Visakhapatnam"


@dataclass
class ImpactAssessment:
    district: str
    affected_population: int
    affected_districts: int
    infrastructure_at_risk: Dict
    economic_impact_cr: float
    crop_damage_hectares: int
    risk_summary: Dict
    severity: str


class ImpactAssessor:
    """Converts risk scores into actionable impact estimates."""

    def assess_impact(
        self,
        flood_risk: float,
        heat_risk: float,
        drought_risk: float,
        water_stress: float,
        district: str = _DEFAULT_DISTRICT,
    ) -> Dict:
        """
        Assess multi-hazard impact for a district.

        All risk inputs are 0-1 floats.
        """
        d = _DISTRICT_DATA.get(district, _DISTRICT_DATA[_DEFAULT_DISTRICT])
        max_risk = max(flood_risk, heat_risk, drought_risk, water_stress)

        # Affected population scales with max risk (not everyone affected equally)
        pop_factor = self._risk_to_factor(max_risk)
        affected_pop = int(d["population"] * pop_factor)

        # Count how many surrounding districts could cascade
        affected_districts = self._cascade_districts(max_risk)

        # Infrastructure exposure
        infra = {
            "hospitals_exposed": int(d["hospitals"] * flood_risk * 0.6),
            "schools_exposed": int(d["schools"] * flood_risk * 0.4),
            "bridges_at_risk": int(d["bridges"] * flood_risk * 0.7),
            "power_stations_at_risk": int(d["power_stations"] * max_risk * 0.5),
        }

        # Economic impact: base GDP loss proportional to risk
        econ = round(d["gdp_cr"] * max_risk * 0.03, 2)

        # Crop damage from flood + drought
        crop_risk = max(flood_risk * 0.6, drought_risk * 0.8)
        crop_dmg = int(d["crop_area_hectares"] * crop_risk * 0.25)

        # Severity label
        if max_risk >= 0.75:
            severity = "CRITICAL"
        elif max_risk >= 0.50:
            severity = "HIGH"
        elif max_risk >= 0.25:
            severity = "MODERATE"
        else:
            severity = "LOW"

        assessment = ImpactAssessment(
            district=district,
            affected_population=affected_pop,
            affected_districts=affected_districts,
            infrastructure_at_risk=infra,
            economic_impact_cr=econ,
            crop_damage_hectares=crop_dmg,
            risk_summary={
                "flood_risk": round(flood_risk, 4),
                "heat_risk": round(heat_risk, 4),
                "drought_risk": round(drought_risk, 4),
                "water_stress": round(water_stress, 4),
                "max_risk": round(max_risk, 4),
            },
            severity=severity,
        )
        return asdict(assessment)

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _risk_to_factor(risk: float) -> float:
        """Non-linear mapping from risk score to population fraction."""
        if risk < 0.2:
            return risk * 0.05
        elif risk < 0.5:
            return 0.01 + (risk - 0.2) * 0.15
        elif risk < 0.75:
            return 0.055 + (risk - 0.5) * 0.30
        else:
            return 0.13 + (risk - 0.75) * 0.50

    @staticmethod
    def _cascade_districts(risk: float) -> int:
        if risk >= 0.75:
            return 5
        elif risk >= 0.50:
            return 3
        elif risk >= 0.25:
            return 2
        return 1
