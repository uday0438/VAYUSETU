"""
VAYUSETU Immutable Audit Trail
==============================
Append-only audit log for all twin lifecycle events.  Once written,
records cannot be modified or deleted.
"""

from __future__ import annotations

import hashlib
from dataclasses import dataclass, asdict
from datetime import datetime, timezone, timedelta
from enum import Enum
from typing import Dict, List, Optional


class EventType(str, Enum):
    ASSIMILATION_RUN = "ASSIMILATION_RUN"
    STATE_CREATED = "STATE_CREATED"
    DATASET_INGESTED = "DATASET_INGESTED"
    MODEL_RETRAINED = "MODEL_RETRAINED"
    SCENARIO_RUN = "SCENARIO_RUN"


@dataclass(frozen=True)
class AuditRecord:
    """Immutable audit log entry."""
    event_id: int
    event_type: str
    timestamp: str
    details: Dict
    checksum: str


class AuditTrail:
    """Append-only audit log with integrity checksums."""

    def __init__(self) -> None:
        self._log: List[AuditRecord] = []
        self._next_id: int = 1
        self._seed_events()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def log_event(self, event_type: str, details: Dict) -> AuditRecord:
        """Append a new immutable audit record."""
        if event_type not in EventType.__members__:
            raise ValueError(
                f"Invalid event_type '{event_type}'. "
                f"Must be one of {list(EventType.__members__)}"
            )
        eid = self._next_id
        ts = datetime.now(timezone.utc).isoformat()
        checksum = self._compute_checksum(eid, event_type, ts, details)
        record = AuditRecord(
            event_id=eid,
            event_type=event_type,
            timestamp=ts,
            details=details,
            checksum=checksum,
        )
        self._log.append(record)
        self._next_id += 1
        return record

    def get_audit_trail(self, limit: int = 50) -> List[Dict]:
        """Return the most recent *limit* audit entries, newest first."""
        records = self._log[-limit:]
        return [asdict(r) for r in reversed(records)]

    def get_events_by_type(self, event_type: str) -> List[Dict]:
        """Filter audit trail by event type."""
        return [asdict(r) for r in self._log if r.event_type == event_type]

    # ------------------------------------------------------------------
    # Internals
    # ------------------------------------------------------------------

    @staticmethod
    def _compute_checksum(eid: int, etype: str, ts: str, details: Dict) -> str:
        payload = f"{eid}|{etype}|{ts}|{sorted(details.items())}"
        return hashlib.sha256(payload.encode()).hexdigest()[:16]

    def _seed_events(self) -> None:
        """Pre-populate realistic audit history."""
        base = datetime(2026, 6, 21, 1, 0, 0, tzinfo=timezone.utc)
        seeds = [
            (EventType.DATASET_INGESTED, {"dataset": "IMD Rainfall 0.25°", "records": 184320, "quality": "Excellent"}),
            (EventType.DATASET_INGESTED, {"dataset": "INSAT LST", "records": 720400, "quality": "Good"}),
            (EventType.ASSIMILATION_RUN, {"run_id": "ASML-20260621-001", "datasets_used": 7, "duration_sec": 42.3}),
            (EventType.STATE_CREATED, {"version": 1, "confidence": 0.81, "coverage_pct": 84.5}),
            (EventType.DATASET_INGESTED, {"dataset": "INSAT Rainfall", "records": 1440800, "quality": "Excellent"}),
            (EventType.ASSIMILATION_RUN, {"run_id": "ASML-20260621-002", "datasets_used": 8, "duration_sec": 38.7}),
            (EventType.STATE_CREATED, {"version": 2, "confidence": 0.84, "coverage_pct": 87.2}),
            (EventType.MODEL_RETRAINED, {"model": "FloodCastNet-v3", "epochs": 120, "val_loss": 0.0231}),
            (EventType.ASSIMILATION_RUN, {"run_id": "ASML-20260621-003", "datasets_used": 9, "duration_sec": 35.1}),
            (EventType.STATE_CREATED, {"version": 3, "confidence": 0.87, "coverage_pct": 89.1}),
            (EventType.SCENARIO_RUN, {"scenario": "Monsoon Surge +20%", "districts_affected": 4}),
            (EventType.ASSIMILATION_RUN, {"run_id": "ASML-20260621-004", "datasets_used": 9, "duration_sec": 33.9}),
            (EventType.STATE_CREATED, {"version": 4, "confidence": 0.89, "coverage_pct": 91.6}),
            (EventType.ASSIMILATION_RUN, {"run_id": "ASML-20260621-005", "datasets_used": 9, "duration_sec": 31.5}),
            (EventType.STATE_CREATED, {"version": 5, "confidence": 0.91, "coverage_pct": 93.4}),
        ]
        for i, (etype, details) in enumerate(seeds):
            ts = (base + timedelta(minutes=i * 25)).isoformat()
            checksum = self._compute_checksum(self._next_id, etype.value, ts, details)
            record = AuditRecord(
                event_id=self._next_id,
                event_type=etype.value,
                timestamp=ts,
                details=details,
                checksum=checksum,
            )
            self._log.append(record)
            self._next_id += 1
