"""
VAYUSETU Dataset Tracker
========================
Tracks availability, freshness, coverage, and quality of all upstream
climate datasets feeding the digital twin.
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from datetime import datetime, timezone, timedelta
from typing import Dict, List


@dataclass
class DatasetInfo:
    """Metadata for a single upstream dataset."""
    name: str
    source_agency: str
    spatial_resolution: str
    temporal_resolution: str
    last_update: str
    coverage_pct: float
    quality_rating: str          # Excellent / Good / Moderate / Poor
    record_count: int
    status: str                  # LIVE / STALE / OFFLINE


# -----------------------------------------------------------------------
# Deterministic baseline dataset catalogue
# -----------------------------------------------------------------------
_NOW = datetime(2026, 6, 21, 7, 30, 0, tzinfo=timezone.utc)

_CATALOGUE: List[Dict] = [
    {
        "name": "IMD Rainfall 0.25°",
        "source_agency": "India Meteorological Department",
        "spatial_resolution": "0.25° × 0.25°",
        "temporal_resolution": "Daily",
        "hours_ago": 1.2,
        "coverage_pct": 96.8,
        "quality_rating": "Excellent",
        "record_count": 184320,
        "status": "LIVE",
    },
    {
        "name": "IMD MaxTemp 1°",
        "source_agency": "India Meteorological Department",
        "spatial_resolution": "1° × 1°",
        "temporal_resolution": "Daily",
        "hours_ago": 2.5,
        "coverage_pct": 94.1,
        "quality_rating": "Good",
        "record_count": 11520,
        "status": "LIVE",
    },
    {
        "name": "IMD MinTemp 1°",
        "source_agency": "India Meteorological Department",
        "spatial_resolution": "1° × 1°",
        "temporal_resolution": "Daily",
        "hours_ago": 2.5,
        "coverage_pct": 93.7,
        "quality_rating": "Good",
        "record_count": 11520,
        "status": "LIVE",
    },
    {
        "name": "INSAT LST",
        "source_agency": "ISRO / MOSDAC",
        "spatial_resolution": "4 km",
        "temporal_resolution": "Hourly",
        "hours_ago": 0.5,
        "coverage_pct": 91.2,
        "quality_rating": "Good",
        "record_count": 720400,
        "status": "LIVE",
    },
    {
        "name": "INSAT SST",
        "source_agency": "ISRO / MOSDAC",
        "spatial_resolution": "4 km",
        "temporal_resolution": "6-hourly",
        "hours_ago": 3.0,
        "coverage_pct": 88.5,
        "quality_rating": "Good",
        "record_count": 180200,
        "status": "LIVE",
    },
    {
        "name": "INSAT Rainfall",
        "source_agency": "ISRO / MOSDAC",
        "spatial_resolution": "4 km",
        "temporal_resolution": "Half-hourly",
        "hours_ago": 0.3,
        "coverage_pct": 92.4,
        "quality_rating": "Excellent",
        "record_count": 1440800,
        "status": "LIVE",
    },
    {
        "name": "MOSDAC OLR",
        "source_agency": "ISRO / MOSDAC",
        "spatial_resolution": "1° × 1°",
        "temporal_resolution": "Daily",
        "hours_ago": 6.0,
        "coverage_pct": 89.0,
        "quality_rating": "Good",
        "record_count": 11520,
        "status": "LIVE",
    },
    {
        "name": "Bhuvan LULC",
        "source_agency": "ISRO / NRSC",
        "spatial_resolution": "56 m",
        "temporal_resolution": "Annual",
        "hours_ago": 720.0,   # ~30 days old — annual product
        "coverage_pct": 99.1,
        "quality_rating": "Excellent",
        "record_count": 2_500_000,
        "status": "LIVE",
    },
    {
        "name": "NICES Ocean",
        "source_agency": "ISRO / SAC",
        "spatial_resolution": "25 km",
        "temporal_resolution": "Daily",
        "hours_ago": 4.5,
        "coverage_pct": 85.3,
        "quality_rating": "Moderate",
        "record_count": 48000,
        "status": "LIVE",
    },
]


class DatasetTracker:
    """Registry of all upstream datasets and their current status."""

    def __init__(self) -> None:
        self._datasets: Dict[str, DatasetInfo] = {}
        self._build_catalogue()

    def get_dataset_status(self) -> Dict:
        """Return every tracked dataset with full metadata."""
        datasets = [asdict(d) for d in self._datasets.values()]
        live = sum(1 for d in self._datasets.values() if d.status == "LIVE")
        avg_coverage = (
            sum(d.coverage_pct for d in self._datasets.values()) / len(self._datasets)
            if self._datasets else 0.0
        )
        return {
            "total_datasets": len(datasets),
            "live_count": live,
            "stale_count": len(datasets) - live,
            "average_coverage_pct": round(avg_coverage, 2),
            "datasets": datasets,
        }

    def get_dataset(self, name: str) -> DatasetInfo | None:
        return self._datasets.get(name)

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    def _build_catalogue(self) -> None:
        for entry in _CATALOGUE:
            last_update = (_NOW - timedelta(hours=entry["hours_ago"])).isoformat()
            info = DatasetInfo(
                name=entry["name"],
                source_agency=entry["source_agency"],
                spatial_resolution=entry["spatial_resolution"],
                temporal_resolution=entry["temporal_resolution"],
                last_update=last_update,
                coverage_pct=entry["coverage_pct"],
                quality_rating=entry["quality_rating"],
                record_count=entry["record_count"],
                status=entry["status"],
            )
            self._datasets[info.name] = info
