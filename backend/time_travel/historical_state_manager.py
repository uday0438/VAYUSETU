"""
VAYUSETU Historical State Manager
==================================
Reconstructs past twin states using climatological baselines for
Visakhapatnam.  States are deterministic — the same timestamp always
produces the same state, derived from monsoon-season patterns.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, asdict
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional


@dataclass
class HistoricalTwinState:
    """Reconstructed past twin state."""
    timestamp: str
    temperature_c: float
    rainfall_mm: float
    humidity_pct: float
    wind_speed_kmh: float
    sea_surface_temp_c: float
    flood_risk: float
    heat_risk: float
    drought_risk: float
    water_stress: float
    confidence: float
    source: str = "climatological-reconstruction"


# Visakhapatnam climatological baselines (monthly means)
# Index 0 = January … 11 = December
_MONTHLY_TEMP = [24.5, 26.0, 28.5, 31.0, 33.5, 33.0, 30.5, 30.0, 30.0, 29.0, 27.0, 24.8]
_MONTHLY_RAIN = [8.0, 10.0, 12.0, 18.0, 55.0, 130.0, 175.0, 165.0, 190.0, 215.0, 95.0, 18.0]
_MONTHLY_HUM  = [68, 70, 72, 74, 72, 75, 82, 83, 84, 80, 74, 69]
_MONTHLY_WIND = [8.5, 9.0, 10.5, 13.0, 16.0, 22.0, 24.0, 21.0, 16.0, 12.0, 9.5, 8.0]
_MONTHLY_SST  = [26.5, 27.0, 28.0, 29.5, 30.0, 29.5, 28.5, 28.0, 28.5, 28.8, 28.0, 27.0]


class HistoricalStateManager:
    """Generates deterministic historical twin states from climatological data."""

    def get_state_at(self, timestamp: datetime) -> Dict:
        """Return reconstructed twin state for an exact timestamp."""
        return asdict(self._build_state(timestamp))

    def get_states_range(self, start: datetime, end: datetime, step_hours: int = 6) -> List[Dict]:
        """Return a series of states between *start* and *end*."""
        states: List[Dict] = []
        current = start
        while current <= end:
            states.append(asdict(self._build_state(current)))
            current += timedelta(hours=step_hours)
        return states

    # ------------------------------------------------------------------
    # Deterministic state builder
    # ------------------------------------------------------------------

    def _build_state(self, dt: datetime) -> HistoricalTwinState:
        month_idx = dt.month - 1
        day_frac = dt.day / 30.0  # crude intra-month interpolation
        hour_frac = dt.hour / 24.0

        # Interpolate between current and next month for smooth transitions
        next_idx = (month_idx + 1) % 12
        blend = day_frac

        temp = self._lerp(_MONTHLY_TEMP[month_idx], _MONTHLY_TEMP[next_idx], blend)
        # Add diurnal cycle: +3 °C at 14:00, −2 °C at 04:00
        temp += 3.0 * math.sin(math.pi * (hour_frac - 0.25))

        rain = self._lerp(_MONTHLY_RAIN[month_idx], _MONTHLY_RAIN[next_idx], blend)
        # Scale daily rain from monthly total — heavier in afternoon
        daily_rain = rain / 30.0
        daily_rain *= 1.0 + 0.4 * math.sin(math.pi * (hour_frac - 0.3))

        hum = self._lerp(_MONTHLY_HUM[month_idx], _MONTHLY_HUM[next_idx], blend)
        hum += 5.0 * math.sin(math.pi * hour_frac)

        wind = self._lerp(_MONTHLY_WIND[month_idx], _MONTHLY_WIND[next_idx], blend)
        sst = self._lerp(_MONTHLY_SST[month_idx], _MONTHLY_SST[next_idx], blend)

        # Derived risk scores (0-1)
        flood_risk = min(1.0, daily_rain / 12.0)
        heat_risk = min(1.0, max(0.0, (temp - 30.0) / 12.0))
        drought_risk = max(0.0, 1.0 - (rain / 120.0))
        water_stress = max(0.0, min(1.0, 0.5 - (rain / 400.0) + (temp - 28.0) / 20.0))

        # Confidence decays for very old reconstructions
        now = datetime.now(timezone.utc)
        age_days = abs((now - dt.replace(tzinfo=timezone.utc)).total_seconds()) / 86400
        confidence = max(0.55, 0.92 - age_days * 0.001)

        return HistoricalTwinState(
            timestamp=dt.isoformat(),
            temperature_c=round(temp, 2),
            rainfall_mm=round(max(0, daily_rain), 2),
            humidity_pct=round(min(100, max(0, hum)), 1),
            wind_speed_kmh=round(wind, 1),
            sea_surface_temp_c=round(sst, 2),
            flood_risk=round(flood_risk, 4),
            heat_risk=round(heat_risk, 4),
            drought_risk=round(drought_risk, 4),
            water_stress=round(water_stress, 4),
            confidence=round(confidence, 4),
        )

    @staticmethod
    def _lerp(a: float, b: float, t: float) -> float:
        return a + (b - a) * t
