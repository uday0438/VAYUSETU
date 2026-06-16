# 🌍 VAYUSETU: AI-Powered Digital Twin of India's Climate
> **Transforming Climate Data into Actionable Intelligence**
> Developed for the Bharatiya Antariksh Hackathon 2026 (ISRO) — Challenge 5

---

## 🚀 Overview

**VAYUSETU** is an enterprise-grade AI-powered Digital Twin platform designed to create a dynamic, real-time virtual representation of India's climate system. By fusing multi-source national datasets from **ISRO (MOSDAC)** and the **India Meteorological Department (IMD)**, VAYUSETU enables continuous climate state monitoring, predictive forecasting, scenario simulation, and evidence-based decision support.

Built as a Proof-of-Concept for the **Bharatiya Antariksh Hackathon 2026**, VAYUSETU demonstrates how deep learning, digital twin frameworks, and explainable AI can accelerate climate adaptation, minimize disaster losses, and build a climate-resilient India.

---

## 🎯 Problem Statement & Impact

India's geography is highly vulnerable to climate hazards, including erratic monsoon seasons, catastrophic floods, intense heatwaves, and prolonged droughts. Although ISRO and IMD generate terabytes of earth observation and meteorological data, this data is often:
- **Fragmented**: Siloed across different systems, formats, and agencies.
- **Static**: Lacks integration into dynamic simulation engines.
- **Observation-focused**: Fails to provide scenario-based planning tools (e.g., *"What if rainfall increases by 25% due to a cyclone?"*).

### ⚠️ The Consequences
Delays in predicting extreme climate events and lack of localized risk planning directly lead to:
- Agricultural crop failures and threat to food security.
- Human casualties and displacement during floods and heatwaves.
- Massive infrastructure damage and economic losses.
- Inefficient water and resource management.

---

## 💡 Our Solution

VAYUSETU bridges the gap between **raw climate data** and **actionable decisions** through a 3-tier architecture:

```
                      +-----------------------------+
                      |   Satellite & Ground Data   |
                      +--------------+--------------+
                                     |
                                     v
                      +--------------+--------------+
                      |   Data Processing Pipeline  |
                      +--------------+--------------+
                                     |
                                     v
                      +--------------+--------------+
                      |    AI Prediction Engine     |
                      +--------------+--------------+
                                     |
                                     v
                      +--------------+--------------+
                      |     Climate Digital Twin    |
                      +--------------+--------------+
                                     |
                      +--------------+--------------+
                      |     Scenario Simulator      |
                      +--------------+--------------+
                                     |
                                     v
                      +--------------+--------------+
                      |      VAYUSETU Dashboard     |
                      +-----------------------------+
```

---

## 🌟 Key Features

### 🌦️ Real-Time Climate Monitoring
Continuous geospatial visualization of variables like Land Surface Temperature (LST), Sea Surface Temperature (SST), and rainfall intensities mapped on interactive GIS interfaces.

### 🤖 Spatio-Temporal AI Forecasting
- **Rainfall**: Spatio-temporal forecasting using ConvLSTM models to predict precipitation patterns.
- **Temperature & Heat Stress**: Gradient-boosted trees (XGBoost) and Temporal Fusion Transformers (TFT) for multi-horizon temperature forecasting.
- **Extreme Event Alerts**: Automated classification models for early warnings on heatwaves and flash floods.

### 🧪 Scenario Simulation Engine
"What-if" simulation workspace to let urban planners, disaster management agencies, and policymakers evaluate:
- The impact of a **20% increase in precipitation** on river basin catchments.
- **Urban heat island effects** arising from expansion and land-cover changes.
- Agricultural water requirements under varying monsoon projections.

### 🧠 Explainable Climate AI (XAI)
Uses SHAP and Integrated Gradients to explain *why* a model predicted an extreme event, building trust for policy deployment.

### 🚨 District Risk Scoring
Dynamic risk matrix displaying real-time risk scores for **Flood**, **Heatwave**, and **Drought** at the district level.

---

## 🏆 Unique Selling Proposition (USP)

1. **India's First AI Climate Twin**: Built explicitly for the Indian subcontinent using indigenous datasets (INSAT and IMD).
2. **"What-If" Simulation Workspace**: Unlike traditional weather apps, users can interactively manipulate climate variables to model scenarios.
3. **Decoupled Enterprise Architecture**: Built to handle high-throughput satellite rasters and stream vector tiles smoothly.
4. **Actionable Policy Advisories**: Direct recommendation engine translating climate risk index into concrete mitigation steps.

---

## 🏗️ System Architecture

VAYUSETU follows an enterprise-grade, microservice-based architecture:

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, ShadCN UI, and Leaflet.js for interactive mapping.
- **Backend API Gateway**: FastAPI (Python) serving REST APIs for climate datasets, predictions, and simulations.
- **Data Store**: PostgreSQL with PostGIS extension for storage of geospatial coordinates, raster metadata, and user configurations; Redis for caching high-frequency queries.
- **AI Engine**: PyTorch, TensorFlow, XGBoost, and Scikit-Learn.
- **Geospatial Pipeline**: Rasterio, GeoPandas, and GDAL for processing NetCDF and GeoTIFF satellite files.

---

## 📂 Dataset Integrations

| Dataset | Source | Parameters | Usage in VAYUSETU |
|---|---|---|---|
| **INSAT-3D LST** | MOSDAC | Land Surface Temperature | Surface energy balance & heatwave tracking |
| **INSAT-3D SST** | MOSDAC | Sea Surface Temperature | Monsoon dynamics & coastal cyclone indicators |
| **INSAT Rainfall** | MOSDAC | 3RIMG_L2B_IMC (Precipitation) | Spatio-temporal rainfall inputs |
| **IMD Gridded Rain** | IMD Pune | 0.25° × 0.25° Precipitation | Ground-truth training & bias correction |
| **IMD Gridded Temp** | IMD Pune | 1.00° × 1.00° Temperature | Temperature model validation |
| **ERA5 Reanalysis** | Copernicus | Wind vector, humidity, pressure | Feature engineering & atmospheric covariates |
| **SRTM DEM** | USGS | 30m Digital Elevation Model | Terrain-aware flood and water-runoff modeling |

---

## 🔐 Enterprise Security & Reliability

ISRO demands strict data governance and system resilience. VAYUSETU integrates:
- **Authentication**: JWT authentication with short-lived access tokens and secure HTTP-only refresh tokens.
- **Authorization**: Role-Based Access Control (RBAC) separating administrative planners, research scientists, and general users.
- **Data Security**: Encryption-at-rest (AES-256) for sensitive reports, audit logs, and environment secrets; TLS 1.3 for data-in-transit.
- **API Protection**: Rate limiting, strict Pydantic input validation, CORS protection, and request sanitization.
- **Monitoring**: Real-time logging, drift detection for AI models, and performance tracking.

---

## 📂 Repository Structure

The codebase is organized into isolated, maintainable, and scalable subdirectories:

```
VAYUSETU/
├── README.md                           # Project description and documentation
├── LICENSE                              # License information
├── CONTRIBUTING.md                      # Development guidelines
├── docker-compose.yml                  # Multi-container orchestration
├── requirements.txt                     # Python dependencies
├── package.json                        # Node dependencies
├── docs/                               # Comprehensive architecture & user documentation
│   ├── architecture.md
│   ├── api-documentation.md
│   └── datasets.md
├── frontend/                           # Next.js Frontend App
│   ├── src/
│   │   ├── app/                        # Next.js Pages & Routing
│   │   ├── components/                 # Reusable UI Elements (Map, Risk Cards)
│   │   └── services/                   # API Integration Clients
│   └── tests/                          # Frontend unit and E2E tests
├── backend/                            # FastAPI Microservices
│   ├── app/
│   │   ├── api/                        # API Endpoints (Climate, prediction, scenario)
│   │   ├── core/                       # Security, database connection, configs
│   │   └── services/                   # Business logic (Digital Twin updates)
│   └── tests/                          # Backend route and logic tests
├── ai_engine/                          # AI Models & Data Ingestion Pipelines
│   ├── data_pipeline/                  # Ingestion, validation, and feature store
│   ├── models/                         # Rainfall ConvLSTM, Temperature XGBoost models
│   └── training/                       # Model training and hyperparameter tuning scripts
├── digital_twin/                       # Digital Twin & Climate Simulation
│   ├── simulation_engine/              # Climate state physics & hydrology simulations
│   └── scenario_builder/               # "What-if" scenario orchestrator
└── deployment/                         # Deployment scripts & files
    ├── docker/                         # Dockerfiles for frontend/backend/AI
    └── kubernetes/                     # K8s manifest files for scaling
```

---

## 📊 Expected Impact & Scaling

### ⏱️ Immediate Benefits (Pilot Phase: Andhra Pradesh Coastal Region)
- Accurate district-level prediction of cyclone rainfall intensities.
- Proactive evacuation alerts during extreme precipitations.
- High-resolution heat stress maps allowing municipalities to establish cool roofs and cooling shelters.

### 🌐 Long-Term Vision
- **National Scale Integration**: Expand the Digital Twin to cover all states in India.
- **Smart City Integration**: Connect with municipal smart-grid sensors to optimize storm-water drains and water supply networks.
- **Agricultural Advisories**: Direct automated warnings sent to farmers via local SMS hubs based on predicted soil moisture anomalies.

---

## 🚢 Deployment Guide

VAYUSETU is structured for a scalable microservice deployment, allowing the Next.js user interface and the FastAPI backend service to be deployed independently on optimal platforms.

### 💻 Frontend Deployment (Vercel)

The Next.js user interface is fully prepared for zero-configuration, one-click deployments on **Vercel** directly from the repository root:

1. Import your VAYUSETU repository on Vercel.
2. Vercel will auto-detect the configuration using the root-level [vercel.json](file:///d:/BUNNY/PROJECTS/ISRO/vercel.json) file:
   * **Build Command**: `npm run build --prefix frontend`
   * **Output Directory**: `frontend/.next`
   * **Install Command**: `npm install --prefix frontend`
3. Add the following environment variable in the Vercel dashboard:
   * `NEXT_PUBLIC_API_URL`: The public URL of your deployed backend service (e.g. `https://vayusetu-backend.onrender.com`).

### ⚙️ Backend Deployment (Railway / Render / AWS)

Because the FastAPI backend and AI pipelines contain scientific computing libraries (like `torch` for ConvLSTM models, and potential C-compiled libraries such as `gdal`, `rasterio`, and `geopandas`), it should be deployed using a containerized environment:

1. **Deploy via Docker**: Use the pre-configured [Dockerfile.backend](file:///d:/BUNNY/PROJECTS/ISRO/deployment/docker/Dockerfile.backend).
2. **Environment Variables**:
   * Set `JWT_SECRET` to a cryptographically secure key.
   * (Optional) Set `DATABASE_URL` (PostgreSQL/PostGIS) and `REDIS_URL` if persistent data and caching layers are enabled.

---

## 👥 The Development Team: ClimateX Labs
- **Kalle Uday Bhaskar** (Team Leader)
- **Team Member 2** (Geospatial & DevOps Engineer)
- **Team Member 3** (AI/ML Research Scientist)
- **Team Member 4** (Frontend Developer)

---

## 📜 License
This project is licensed under the Apache 2.0 License - see the LICENSE file for details.

---

## 🌟 Acknowledgements
- **Indian Space Research Organisation (ISRO)** for the data access and challenge setup.
- **India Meteorological Department (IMD)** for providing ground-truth climate observations.
- **Hack2Skill** for organizing the hackathon.

> *"A resilient nation is built not by predicting the future, but by preparing for it. VAYUSETU transforms India's climate data into actionable intelligence for a safer, smarter, and more sustainable India."*
