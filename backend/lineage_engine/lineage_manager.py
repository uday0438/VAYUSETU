"""
VAYUSETU Digital Twin Lineage Manager
=====================================
Manages twin state lineage — tracks every version of the digital twin,
which datasets contributed, who triggered the assimilation, and the
resulting confidence / coverage metrics.
"""

from __future__ import annotations

import hashlib
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional


@dataclass(frozen=True)
class TwinState:
    """Immutable snapshot of a single digital twin version."""
    twin_version: int
    timestamp: str
    assimilation_run_id: str
    dataset_sources: List[str]
    coverage_pct: float
    confidence: float
    operator: str
    checksum: str = ""


class LineageManager:
    """In-memory lineage store with auto-incrementing versions."""

    _OPERATORS = [
        "auto-scheduler", "Dr. Priya Sharma", "system-daemon",
        "Dr. Ravi Kumar", "assimilation-pipeline", "Dr. Anita Desai",
    ]

    _DATASET_POOL = [
        "IMD Rainfall 0.25°", "IMD MaxTemp 1°", "IMD MinTemp 1°",
        "INSAT LST", "INSAT SST", "INSAT Rainfall",
        "MOSDAC OLR", "Bhuvan LULC", "NICES Ocean",
    ]

    def __init__(self) -> None:
        self._store: Dict[int, TwinState] = {}
        self._next_version: int = 1
        self._counter: int = 0
        # Seed with initial lineage records for a realistic trail
        self._seed_initial_states()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def create_lineage_record(
        self,
        dataset_sources: Optional[List[str]] = None,
        coverage_pct: Optional[float] = None,
        confidence: Optional[float] = None,
        operator: Optional[str] = None,
    ) -> TwinState:
        """Create and store a new twin lineage record."""
        version = self._next_version
        now = datetime.now(timezone.utc)
        run_id = self._generate_assimilation_id(now)

        sources = dataset_sources or self._deterministic_sources(version)
        cov = coverage_pct if coverage_pct is not None else self._deterministic_coverage(version)
        conf = confidence if confidence is not None else self._deterministic_confidence(version)
        op = operator or self._OPERATORS[version % len(self._OPERATORS)]

        checksum = self._compute_checksum(version, run_id, sources)

        state = TwinState(
            twin_version=version,
            timestamp=now.isoformat(),
            assimilation_run_id=run_id,
            dataset_sources=sources,
            coverage_pct=round(cov, 2),
            confidence=round(conf, 4),
            operator=op,
            checksum=checksum,
        )
        self._store[version] = state
        self._next_version += 1
        return state

    def get_lineage(self, version: int) -> Optional[TwinState]:
        """Retrieve lineage record for a specific twin version."""
        return self._store.get(version)

    def get_latest_lineage(self) -> Optional[TwinState]:
        """Return the most recent lineage record."""
        if not self._store:
            return None
        return self._store[max(self._store)]

    def get_full_trail(self) -> List[Dict]:
        """Return the entire lineage trail as a list of dicts, newest first."""
        return [asdict(self._store[v]) for v in sorted(self._store, reverse=True)]

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _generate_assimilation_id(self, dt: datetime) -> str:
        self._counter += 1
        return f"ASML-{dt.strftime('%Y%m%d')}-{self._counter:03d}"

    def _deterministic_sources(self, version: int) -> List[str]:
        """Pick a deterministic subset of datasets based on version."""
        base_count = 5 + (version % 5)  # 5-9 sources
        indices = [(version * 3 + i * 7) % len(self._DATASET_POOL) for i in range(base_count)]
        return list(dict.fromkeys(self._DATASET_POOL[i] for i in indices))

    def _deterministic_coverage(self, version: int) -> float:
        base = 82.0
        increment = (version * 1.7) % 15
        return min(base + increment, 98.5)

    def _deterministic_confidence(self, version: int) -> float:
        base = 0.78
        increment = (version * 0.023) % 0.18
        return min(base + increment, 0.96)

    @staticmethod
    def _compute_checksum(version: int, run_id: str, sources: List[str]) -> str:
        payload = f"{version}:{run_id}:{','.join(sources)}"
        return hashlib.sha256(payload.encode()).hexdigest()[:16]

    def _seed_initial_states(self) -> None:
        """Pre-populate a short realistic lineage trail."""
        base_time = datetime(2026, 6, 21, 1, 0, 0, tzinfo=timezone.utc)
        seed_data = [
            ("auto-scheduler", 84.5, 0.81),
            ("Dr. Priya Sharma", 87.2, 0.84),
            ("assimilation-pipeline", 89.1, 0.87),
            ("system-daemon", 91.6, 0.89),
            ("Dr. Ravi Kumar", 93.4, 0.91),
        ]
        for i, (op, cov, conf) in enumerate(seed_data):
            version = self._next_version
            ts = base_time + timedelta(hours=i * 2)
            run_id = f"ASML-{ts.strftime('%Y%m%d')}-{version:03d}"
            sources = self._deterministic_sources(version)
            checksum = self._compute_checksum(version, run_id, sources)
            state = TwinState(
                twin_version=version,
                timestamp=ts.isoformat(),
                assimilation_run_id=run_id,
                dataset_sources=sources,
                coverage_pct=cov,
                confidence=conf,
                operator=op,
                checksum=checksum,
            )
            self._store[version] = state
            self._next_version += 1
            self._counter += 1
