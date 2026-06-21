"""
VAYUSETU Timeline Controller
=============================
Unified temporal navigation — negative offsets travel to the past,
zero returns the current twin state, positive offsets project forward.
"""

from __future__ import annotations

from datetime import datetime, timezone, timedelta
from typing import Dict

from backend.time_travel.historical_state_manager import HistoricalStateManager
from backend.time_travel.future_state_manager import FutureStateManager


# Current twin state (Visakhapatnam, June 2026 — active monsoon)
_CURRENT_STATE = {
    "temperature_c": 31.8,
    "rainfall_mm": 6.2,
    "humidity_pct": 78.0,
    "wind_speed_kmh": 18.5,
    "sea_surface_temp_c": 29.4,
    "flood_risk": 0.41,
    "heat_risk": 0.15,
    "drought_risk": 0.08,
    "water_stress": 0.22,
    "confidence": 0.91,
}


class TimelineController:
    """Unified temporal interface for the digital twin."""

    def __init__(self) -> None:
        self._historical = HistoricalStateManager()
        self._future = FutureStateManager()

    def get_timeline_state(self, offset_hours: float) -> Dict:
        """
        Return twin state at *offset_hours* from now.

        - offset_hours < 0  → historical reconstruction
        - offset_hours == 0 → live / current state
        - offset_hours > 0  → future projection
        """
        now = datetime.now(timezone.utc)

        if offset_hours < 0:
            target_dt = now + timedelta(hours=offset_hours)
            state = self._historical.get_state_at(target_dt)
            mode = "historical"
        elif offset_hours == 0:
            state = dict(_CURRENT_STATE)
            state["timestamp"] = now.isoformat()
            mode = "current"
        else:
            days_ahead = offset_hours / 24.0
            state = self._future.get_future_state(days_ahead)
            mode = "projected"

        # Determine alert level from max risk
        risks = [
            state.get("flood_risk", 0),
            state.get("heat_risk", 0),
            state.get("drought_risk", 0),
            state.get("water_stress", 0),
        ]
        max_risk = max(risks)
        if max_risk >= 0.75:
            alert = "CRITICAL"
        elif max_risk >= 0.50:
            alert = "WARNING"
        elif max_risk >= 0.25:
            alert = "ADVISORY"
        else:
            alert = "NORMAL"

        return {
            "mode": mode,
            "offset_hours": offset_hours,
            "alert_level": alert,
            "state": state,
        }
