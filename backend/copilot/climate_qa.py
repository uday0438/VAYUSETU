from typing import Dict

CLIMATE_KNOWLEDGE_BASE: Dict[str, str] = {
    "cri": (
        "Climate Resilience Index (CRI): A aggregated risk score from 0 to 100 "
        "combining weighted hazards: 35% Flood Risk + 35% Heat Risk + 15% Drought Risk "
        "+ 15% Water Stress. Scores categorize into SAFE (0-25), MODERATE (25-50), "
        "HIGH (50-75), and CRITICAL (75-100)."
    ),
    "lst": (
        "Land Surface Temperature (LST): The temperature of the skin of the Earth "
        "as seen from satellite sensors (e.g. INSAT-3D thermal bands). LST is critical "
        "for identifying soil moisture evaporation rates and urban heat islands."
    ),
    "sst": (
        "Sea Surface Temperature (SST): The temperature of the top layer of the ocean. "
        "SST controls marine boundary layers and fuels moisture transport paths during monsoons."
    ),
    "tvdi": (
        "Temperature Vegetation Dryness Index (TVDI): An index derived from the relationship "
        "between Land Surface Temperature and Normalized Difference Vegetation Index (NDVI), "
        "used for gridded soil dryness estimation."
    ),
    "kalman": (
        "Kalman Filter Ingestion: A closed-loop data assimilation technique. It takes predicted "
        "model states and combines them with satellite/ground observations, weighting them by "
        "sensor error covariances to yield corrected, optimal state parameters."
    ),
}
