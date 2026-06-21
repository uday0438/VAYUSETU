"""
VAYUSETU Future State Manager
==============================
Projects future twin states using current conditions plus trend
extrapolation based on climatological patterns and basic numerical
weather prediction heuristics.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, asdict
from datetime import datetime, timezone, timedelta
from typing import Dict


@dataclass
class FutureTwinState:
    """Projected future twin state."""
    timestamp: str
    days_ahead: float
    temperature_c: float
    rainfall_mm: float
    humidity_pct: float
    wind_speed_kmh: float
    flood_risk: float
    heat_risk: float
    drought_risk: float
    water_stress: float
    confidence: float
    source: str = "trend-extrapolation"


# Current baseline (Visakhapatnam, June 2026 monsoon onset)
_CURRENT = {
    "temperature_c": 31.8,
    "rainfall_mm": 6.2,
    "humidity_pct": 78.0,
    "wind_speed_kmh": 18.5,
}

# Daily trend vectors (per-day deltas during active monsoon)
_TRENDS = {
    "temperature_c": -0.08,   # cooling as monsoon deepens
    "rainfall_mm": 0.35,      # increasing rainfall
    "humidity_pct": 0.25,     # rising humidity
    "wind_speed_kmh": 0.10,   # slight wind increase
}


class FutureStateManager:
    """Generates projected future twin states via trend extrapolation."""

    def get_future_state(self, days_ahead: float) -> Dict:
        """Project a twin state *days_ahead* into the future."""
        return asdict(self._project(days_ahead))

    # ------------------------------------------------------------------
    # Projection engine
    # ------------------------------------------------------------------

    def _project(self, days_ahead: float) -> FutureTwinState:
        now = datetime.now(timezone.utc)
        future_dt = now + timedelta(days=days_ahead)

        # Apply linear trends with sinusoidal seasonal modulation
        seasonal_mod = math.sin(math.pi * (days_ahead % 180) / 180)

        temp = (
            _CURRENT["temperature_c"]
            + _TRENDS["temperature_c"] * days_ahead
            + 1.5 * seasonal_mod
        )
        rain = max(0.0, (
            _CURRENT["rainfall_mm"]
            + _TRENDS["rainfall_mm"] * days_ahead
            + 3.0 * seasonal_mod
        ))
        hum = min(100.0, max(0.0, (
            _CURRENT["humidity_pct"]
            + _TRENDS["humidity_pct"] * days_ahead
            + 4.0 * seasonal_mod
        )))
        wind = max(0.0, (
            _CURRENT["wind_speed_kmh"]
            + _TRENDS["wind_speed_kmh"] * days_ahead
            + 2.0 * seasonal_mod
        ))

        # Risk scores derived from projected meteorology
        flood_risk = min(1.0, rain / 15.0)
        heat_risk = min(1.0, max(0.0, (temp - 30.0) / 12.0))
        drought_risk = max(0.0, 1.0 - rain / 8.0)
        water_stress = max(0.0, min(1.0, 0.45 - rain / 30.0 + (temp - 28.0) / 20.0))

        # Confidence drops with forecast horizon
        confidence = max(0.35, 0.92 - days_ahead * 0.02)

        return FutureTwinState(
            timestamp=future_dt.isoformat(),
            days_ahead=round(days_ahead, 2),
            temperature_c=round(temp, 2),
            rainfall_mm=round(rain, 2),
            humidity_pct=round(hum, 1),
            wind_speed_kmh=round(wind, 1),
            flood_risk=round(flood_risk, 4),
            heat_risk=round(heat_risk, 4),
            drought_risk=round(drought_risk, 4),
            water_stress=round(water_stress, 4),
            confidence=round(confidence, 4),
        )
