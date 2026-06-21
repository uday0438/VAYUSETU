# VAYUSETU — System Architecture

## End-to-End Architecture

```
                     IMD (Rainfall, Temperature)
                              │
                     INSAT-3D/3DR (LST, SST, Rainfall)
                              │
                     MOSDAC / Bhuvan / NICES
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Data Ingestion     │
                    │  (imd_loader.py,    │
                    │   insat_loader.py)  │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Data Quality       │
                    │  (Z-score, impute,  │
                    │   range validation) │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Feature Engine     │
                    │  TVDI, ESI, RAI     │
                    │  Lag features       │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Climate Memory     │
                    │  (Historical state  │
                    │   + anomaly buffer) │
                    └─────────────────────┘
                              │
                              ▼
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ ConvLSTM │   │Transformer│  │ XGBoost  │
        │  (0.4)   │   │  (0.4)   │   │  (0.2)   │
        └──────────┘   └──────────┘   └──────────┘
              │               │               │
              └───────────────┼───────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Weighted Ensemble  │
                    │  final = 0.4*C +    │
                    │  0.4*T + 0.2*X      │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Uncertainty Engine │
                    │  (Ensemble variance,│
                    │   confidence, PI)   │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Validation Engine  │
                    │  RMSE, MAE, R²,     │
                    │  MAPE, Correlation  │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Climate Twin Core  │
                    │  (Twin State DB)    │
                    └─────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │  Flood   │   │   Heat   │   │ Drought  │
        │  Risk    │   │   Risk   │   │  Risk    │
        └──────────┘   └──────────┘   └──────────┘
              │               │               │
              └───────┬───────┴───────┬───────┘
                      ▼               ▼
              ┌──────────┐   ┌──────────────┐
              │ Scenario │   │     AI       │
              │Simulator │   │Recommendation│
              └──────────┘   └──────────────┘
                      │               │
                      └───────┬───────┘
                              ▼
                    ┌─────────────────────┐
                    │  Climate Command    │
                    │  Dashboard          │
                    │  (Next.js + FastAPI)│
                    └─────────────────────┘
```

## Technology Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, Recharts, Mapbox GL |
| Backend | FastAPI, Python 3.11 |
| AI Models | PyTorch (ConvLSTM, Transformer), XGBoost |
| Database | SQLite (Twin State), JSON (Registry) |
| Data | IMD CSV, INSAT NetCDF/HDF5 |
| Deployment | Docker, Vercel, ISRO Cloud |

## Key Innovation
- **Cyber-Physical Digital Twin**: Not just a dashboard — a live, feedback-driven simulation
- **Ensemble AI**: Three complementary architectures with uncertainty quantification
- **Multi-Hazard Intelligence**: Unified flood, heat, and drought risk assessment
- **ISRO Data Native**: Built specifically for IMD + INSAT data pipelines
