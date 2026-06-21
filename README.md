# 🌍 VAYUSETU: Cyber-Physical Climate Digital Twin of India

> **Translating Multi-Source Earth Observation Data into Actionable Hazard Intelligence**
> Designed and Developed for the **ISRO Bharatiya Antariksh Hackathon 2026** — Challenge 5

---

<div align="center">

[![VAYUSETU CI/CD Pipeline](https://github.com/uday0438/VAYUSETU/actions/workflows/ci.yml/badge.svg)](https://github.com/uday0438/VAYUSETU/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-emerald?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.32-red?style=flat-square&logo=streamlit)](https://streamlit.io/)
[![Plotly](https://img.shields.io/badge/Plotly-5.19-blue?style=flat-square&logo=plotly)](https://plotly.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.2-orange?style=flat-square&logo=pytorch)](https://pytorch.org/)
[![Leaflet.js](https://img.shields.io/badge/Leaflet-1.9-green?style=flat-square&logo=leaflet)](https://leafletjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 🚀 Overview

**VAYUSETU** is a production-grade, cyber-physical Climate Digital Twin (CDT) platform of India. Unlike traditional meteorological dashboards that show static, disjointed observation grids, VAYUSETU establishes a continuous feedback loop between physical earth systems and digital models. By assimilating multi-source indigenous datasets (ISRO MOSDAC, Bhuvan, and IMD Pune), it feeds a state-of-the-art hybrid AI ensemble to run spatiotemporal forecasting, real-time risk index fusion, and policy scenario simulations.

---

## 🤖 Deep Technical Underpinnings

```
                                  [ PHYSICAL EARTH SYSTEMS ]
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
             [ ISRO MOSDAC Feeds ]                          [ IMD Ground Telemetry ]
          (INSAT-3D LST, SST, Rain)                      (0.25° Rain, 1° Temp Grids)
                      │                                               │
                      └───────────────────────┬───────────────────────┘
                                              ▼
                                 [ Data Assimilation Layer ]
                                   (1D/2D Kalman Filters)
                                              │
                                              ▼
                                 [ Versioned Twin State DB ]
                                  (Lineage & Audit Engines)
                                              │
                                              ▼
                                 [ Spatiotemporal AI Models ]
                        (U-Net ConvLSTM + TFT + XGBoost + PINN)
                                              │
                                              ▼
                               [ Decision & Policy Simulator ]
                          (2D Saint-Venant hydraulic solvers)
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
         [ VAYUSETU Command Portal ]                     [ GIS Analytics Dashboard ]
           (Next.js 15 + React 19)                         (Streamlit + Plotly Map)
```

---

## 🌟 Key Features & Hackathon Upgrades

### 1. Robust MLOps Ingestion Pipeline
* **Vectorized Binary Ingestion Fallback**: Added a vectorized binary reader (`parse_imd_binary`) that decodes raw IMD `.bin` files directly using high-speed NumPy stream execution, sanitizing flag values (`-99.9`/`99.9`) and invalid bounds dynamically.
* **Strict Type Safety & Pydantic Validation**: Uses Pydantic schemas (`ClimateGridSchema`) to enforce structural dimensions on met-data grids before feeding them to inference tensors.
* **Automated Daily Ingestion Worker**: Includes a scheduled daemon worker ([daily_ingestion_worker.py](file:///D:/BUNNY/PROJECTS/ISRO/backend/app/services/daily_ingestion_worker.py)) that fetches new daily met-grids, runs drift analysis, and creates immutable records in the Lineage engine.

### 2. Spatiotemporal Trend Visualization & GIS App
* **Linked Map Click Charting**: Clicking any district node or map grid cell dynamically populates the **Spatiotemporal Analysis Side Panel**.
* **Next.js Native SVG Chart**: Renders a custom, high-fidelity SVG chart showing a **10-Year Historical Average** temperature/rainfall baseline vs. the **AI's Predicted Timeline (2026)**.
* **Streamlit + Plotly GIS Dashboard**: Integrates a dedicated analytics dashboard ([streamlit_app.py](file:///D:/BUNNY/PROJECTS/ISRO/streamlit_app.py)) that embeds reactive Folium maps. Clicking specific markers dynamically plots spatiotemporal curves in Plotly, transforming the twin from a simple display tool into a functional, exploratory GIS utility.

### 3. Edge-Aware Model Quantization
* **Weight Quantization Script**: Includes [export_quantized.py](file:///D:/BUNNY/PROJECTS/ISRO/models/export_quantized.py) in the models registry, quantizing float32 PyTorch/TensorFlow checkpoints down to **INT8 precision** for zero-latency execution on limited edge nodes.

### 4. Outlier Clamping & Physics-Informed Guardrails (VayuSetuEngine)
* **Chronological Split**: Implements a strict rolling-window time-series split to eliminate temporal data leakage (Train: 2015–2023, Validate: 2024, Test: 2025).
* **Covariate Shift Clamping**: Calculates historical deviations and clamps extreme input anomalies ($\pm 3.5 \text{ Standard Deviations}$) in the simulation engine. Displays a critical UI warning if the user attempts environmentally unrealistic configurations.
* **Mass-Conservative Regridding**: Employs `xarray` combined with a vectorized conservative regridding fallback to ensure properties like aggregate rainfall are physically preserved when downscaling grids.
* **Physics-Informed Neural Network (PINN) Loss**: Penalizes the model during training if it violates thermodynamic laws (e.g. Precipitation exceeds atmospheric moisture ingress):
  $$\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{MSE}} + \lambda_{\text{phys}} \cdot \mathbb{E}\left[ \max\left(0, P_{\text{pred}} - (W_{\text{ingress}} + ET)\right)^2 \right]$$
* **NetCDF Export**: Preserves spatial projections (CRS, EPSG:4326 WGS 84) by exporting predictions to industry-standard `.nc` (NetCDF4) formats.

### 5. Automated Ground-Truth Drift Alerting
* **MASE Monitor**: Calculates the Mean Absolute Scaled Error (MASE) between the model's 7-day prior forecasts and newly ingested ground-truth IMD grid binaries. If MASE exceeds a threshold (e.g., 1.5), a warning alert is immediately flagged on the twin status control bar.

---

## 🏗️ Production Tech Stack

* **Frontend Command Center**: Next.js 15, React 19, TypeScript, Tailwind CSS, Leaflet JS mapping.
* **GIS Dashboard Service**: Streamlit, Plotly, Folium & Streamlit-Folium.
* **Backend API Gateway**: FastAPI (Python 3.11) with Uvicorn async routing.
* **AI & Physics Models**: PyTorch 2.2, xarray, netCDF4, NumPy, Pandas.
* **Geospatial Processing**: Rasterio, NetCDF4, H5py.
* **Database Relational Store**: SQLite for pilot/edge caches, migrating to PostGIS (PostgreSQL) for production grids.

---

## 📂 Dataset Lineage

| Dataset | Source Agency | Resolution | Role in Twin State |
|---|---|---|---|
| **INSAT-3D LST** | MOSDAC / ISRO | 4 km | Land surface thermal assimilation |
| **INSAT-3D SST** | MOSDAC / ISRO | 4 km | Ocean-land boundary coupling |
| **INSAT Rainfall** | MOSDAC / ISRO | 4 km | Real-time precipitation estimates |
| **IMD Rainfall** | IMD Pune | 0.25° (~25 km) | Primary precipitation training & ground-truth |
| **IMD Temperature** | IMD Pune | 1.00° (~100 km) | Temperature training & baseline checks |
| **Bhuvan LULC** | NRSC / ISRO | 56 m | Land cover classification & runoff coefficients |

---

## 🔐 Security Audit & Resilience
* **Model Drift Audits**: Runs Kolmogorov-Smirnov (KS-Test) on telemetry streams. If p-value falls below $0.05$ or MASE exceeds $1.50$, a retraining trigger is generated.
* **Graceful Fallbacks**: If satellite feeds are obscured by cloud cover or go offline, the system safely falls back to local climatological averages and flags a `STALE` warning.
* **Audit Trail**: Writes immutable, append-only logs for all core events (state creation, dataset ingestion, model retrains) using SHA-256 integrity checksums.

---

## 🚀 Running the Project

### 💻 Running the Streamlit GIS Analytics Dashboard
```bash
# Start the Streamlit server from the root directory
streamlit run streamlit_app.py
```

### 💻 Local Frontend Command Center Execution
```bash
cd frontend
npm install
npm run dev -- -p 3001
```

### ⚙️ Local Backend API Execution
```bash
# Set PYTHONPATH
$env:PYTHONPATH="D:\BUNNY\PROJECTS\ISRO;D:\BUNNY\PROJECTS\ISRO\backend"
python backend/app/main.py
```

### 🧪 Run the Verification Test Suite
```bash
python run_tests.py
```

---

## 👥 The Development Team: ClimateX Labs
* **Kalle Uday Bhaskar** — Lead Architect & Systems Engineer
* **Team Member 2** — Geospatial Pipeline & DevOps Engineer
* **Team Member 3** — Deep Learning & AI Research Scientist
* **Team Member 4** — Frontend Command Center UI Developer

---

## 📜 License
This project is licensed under the Apache 2.0 License.

> **Transforming data into resilience.** VAYUSETU bridges the gap between outer space observation and local emergency action.
