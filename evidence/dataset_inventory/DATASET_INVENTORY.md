# VAYUSETU — Dataset Inventory & Scientific Evidence

## Project
**VAYUSETU: AI-Powered Climate Digital Twin for Disaster-Resilient India**
ISRO Bharatiya Antariksh Hackathon 2026

---

## Dataset Inventory

| # | Dataset | Source | Resolution | Coverage | Format | Period | Usage |
|---|---------|--------|------------|----------|--------|--------|-------|
| 1 | IMD Gridded Rainfall | IMD Pune | 0.25° × 0.25° | All India | CSV/Binary | 1901–2024 | Rainfall prediction training & validation |
| 2 | IMD Max Temperature | IMD Pune | 1° × 1° | All India | CSV/Binary | 1951–2024 | Heatwave detection, temperature modeling |
| 3 | IMD Min Temperature | IMD Pune | 1° × 1° | All India | CSV/Binary | 1951–2024 | Cold wave detection, diurnal range |
| 4 | INSAT-3D/3DR LST | MOSDAC (ISRO) | 4–10 km | Indian Subcontinent | NetCDF/HDF5 | 2014–present | Urban heat island, drought index (TVDI) |
| 5 | INSAT-3D/3DR SST | MOSDAC (ISRO) | 4 km | Indian Ocean Region | NetCDF/HDF5 | 2014–present | Monsoon onset, cyclone intensity |
| 6 | INSAT-3D/3DR Rainfall | MOSDAC (ISRO) | 0.25° (IMSRA) | Indian Subcontinent | NetCDF/HDF5 | 2014–present | Near-real-time flood early warning |

---

## Data Pipeline Architecture

```
IMD Rainfall CSV → imd_loader.py → Quality Control → Feature Engineering → Training Dataset
IMD Max Temp CSV  →       ↑                ↑                    ↑
IMD Min Temp CSV  →       ↑                ↑                    ↑
INSAT LST NetCDF  → insat_loader.py →     ↑                    ↑
INSAT SST NetCDF  →       ↑               ↑                    ↑
INSAT Rain NetCDF →       ↑        data_pipeline.py    dataset_builder.py
```

## Quality Control Steps
1. **Outlier Detection**: Z-score clipping (|z| > 3σ removed)
2. **Missing Value Imputation**: Temporal interpolation + spatial kriging
3. **Range Validation**: Physical bounds checking (rainfall ≥ 0, -10 ≤ temp ≤ 55°C)
4. **Temporal Consistency**: Forward-fill + backward-fill for gaps ≤ 3 days

## Derived Climate Indices
| Index | Formula | Inputs | Application |
|-------|---------|--------|-------------|
| TVDI | (LST - LST_min) / (LST_max - LST_min) | INSAT LST, NDVI | Agricultural drought |
| ESI | (ET - ET_ref) / ET_ref | INSAT LST, IMD Temp | Water stress |
| RAI | (P - P_mean) / P_std | IMD Rainfall | Monsoon anomaly |

---

## Scientific References
1. Pai et al. (2014), "High spatial resolution daily gridded rainfall data set over India", Mausam, 65(1), 1-18
2. Srivastava et al. (2009), "High resolution daily gridded temperature data set", MAUSAM
3. ISRO MOSDAC Portal — INSAT-3D/3DR Level-2B Product Guide
4. Mishra et al. (2019), "Satellite-derived precipitation estimates over India", J. Earth Syst. Sci.

---

## Sample Files Present in Repository
- [Rainfall_India_0.25.csv](file:///D:/BUNNY/PROJECTS/ISRO/evidence/dataset_inventory/sample_imd_files/Rainfall_India_0.25.csv) — 30-day gridded rainfall at 0.25° resolution
- [MaxTemp_India_1.0.csv](file:///D:/BUNNY/PROJECTS/ISRO/evidence/dataset_inventory/sample_imd_files/MaxTemp_India_1.0.csv) — 30-day gridded max temp at 1.0° resolution
- [MinTemp_India_1.0.csv](file:///D:/BUNNY/PROJECTS/ISRO/evidence/dataset_inventory/sample_imd_files/MinTemp_India_1.0.csv) — 30-day gridded min temp at 1.0° resolution
- [INSAT_LST.nc](file:///D:/BUNNY/PROJECTS/ISRO/evidence/dataset_inventory/sample_insat_files/INSAT_LST.nc) — 30-day gridded satellite LST (16x16 grid)
- [INSAT_SST.nc](file:///D:/BUNNY/PROJECTS/ISRO/evidence/dataset_inventory/sample_insat_files/INSAT_SST.nc) — 30-day gridded satellite SST (16x16 grid)
- [INSAT_Rainfall.nc](file:///D:/BUNNY/PROJECTS/ISRO/evidence/dataset_inventory/sample_insat_files/INSAT_Rainfall.nc) — 30-day gridded satellite Rainfall (16x16 grid)

