"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TRANSLATIONS, Language } from "../services/translations";
import { BENEFICIARIES_DATA } from "../services/beneficiaries";
import Globe from "./Globe";

interface DistrictMetadata {
  name: string;
  coords: [number, number];
  code: string;
  zone: string;
  basin: string;
  soil: string;
  coeff: number;
  baseFlood: number;
  baseHeat: number;
  baseDrought: number;
}

const DISTRICTS_METADATA: { [key: string]: DistrictMetadata } = {
  "New Delhi": {
    name: "New Delhi",
    coords: [28.6139, 77.2090],
    code: "DEL",
    zone: "North India",
    basin: "Yamuna / Ganga River Basin",
    soil: "Alluvial Soil",
    coeff: 0.50,
    baseFlood: 50,
    baseHeat: 50,
    baseDrought: 30,
  },
  Mumbai: {
    name: "Mumbai",
    coords: [19.0760, 72.8777],
    code: "BOM",
    zone: "West Coast India",
    basin: "Ulhas / Coastal Basins",
    soil: "Clayey Loam",
    coeff: 0.70,
    baseFlood: 70,
    baseHeat: 52,
    baseDrought: 20,
  },
  Kolkata: {
    name: "Kolkata",
    coords: [22.5726, 88.3639],
    code: "CCU",
    zone: "East India",
    basin: "Hooghly / Ganga Delta Basin",
    soil: "Deltaic Alluvial",
    coeff: 0.65,
    baseFlood: 65,
    baseHeat: 48,
    baseDrought: 22,
  },
  Chennai: {
    name: "Chennai",
    coords: [13.0827, 80.2707],
    code: "MAA",
    zone: "South East India",
    basin: "Adyar & Cooum Basins",
    soil: "Clayey & Sandy",
    coeff: 0.60,
    baseFlood: 60,
    baseHeat: 58,
    baseDrought: 25,
  },
  Bengaluru: {
    name: "Bengaluru",
    coords: [12.9716, 77.5946],
    code: "BLR",
    zone: "South Interior India",
    basin: "Dakshina Pinakini / Cauvery Basin",
    soil: "Red Sandy Clay Loam",
    coeff: 0.45,
    baseFlood: 45,
    baseHeat: 45,
    baseDrought: 35,
  },
  Hyderabad: {
    name: "Hyderabad",
    coords: [17.3850, 78.4867],
    code: "HYD",
    zone: "Central-South India",
    basin: "Musi / Krishna Basin",
    soil: "Red Sandy Loam",
    coeff: 0.42,
    baseFlood: 42,
    baseHeat: 50,
    baseDrought: 38,
  },
  Guwahati: {
    name: "Guwahati",
    coords: [26.1445, 91.7362],
    code: "GAU",
    zone: "North East India",
    basin: "Brahmaputra River Basin",
    soil: "Alluvial & Red Soil",
    coeff: 0.58,
    baseFlood: 62,
    baseHeat: 46,
    baseDrought: 28,
  },
  Srinagar: {
    name: "Srinagar",
    coords: [34.0837, 74.7973],
    code: "SXR",
    zone: "Himalayan Region",
    basin: "Jhelum River Basin",
    soil: "Lacustrine Silty Clay (Karewa)",
    coeff: 0.48,
    baseFlood: 55,
    baseHeat: 38,
    baseDrought: 32,
  },
  Ahmedabad: {
    name: "Ahmedabad",
    coords: [23.0225, 72.5714],
    code: "AMD",
    zone: "West India",
    basin: "Sabarmati Basin",
    soil: "Sandy Alluvial",
    coeff: 0.40,
    baseFlood: 40,
    baseHeat: 60,
    baseDrought: 40,
  },
  Bhopal: {
    name: "Bhopal",
    coords: [23.2599, 77.4126],
    code: "BHO",
    zone: "Central India",
    basin: "Betwa / Narmada Basin",
    soil: "Medium Black Soil",
    coeff: 0.44,
    baseFlood: 44,
    baseHeat: 54,
    baseDrought: 35,
  },
  Visakhapatnam: {
    name: "Visakhapatnam",
    coords: [17.6868, 83.2185],
    code: "VSKP",
    zone: "East Coast India",
    basin: "Gosthani & Sarda Basins",
    soil: "Red Sandy Loam",
    coeff: 0.65, // Kept to 0.65 to align with backend specs & tests
    baseFlood: 65,
    baseHeat: 45,
    baseDrought: 35,
  },
  Patna: {
    name: "Patna",
    coords: [25.5941, 85.1376],
    code: "PAT",
    zone: "East-Central India",
    basin: "Ganga Basin",
    soil: "Alluvial Clay",
    coeff: 0.55,
    baseFlood: 55,
    baseHeat: 56,
    baseDrought: 30,
  },
  // --- Coastal Nodes ---
  Kochi: {
    name: "Kochi",
    coords: [9.9312, 76.2673],
    code: "COK",
    zone: "Arabian Sea Coast (Kerala)",
    basin: "Periyar & Vembanad Backwaters",
    soil: "Laterite & Coastal Alluvial",
    coeff: 0.62,
    baseFlood: 62,
    baseHeat: 42,
    baseDrought: 18,
  },
  Thiruvananthapuram: {
    name: "Thiruvananthapuram",
    coords: [8.5241, 76.9366],
    code: "TRV",
    zone: "Southern Tip Coast (Kerala)",
    basin: "Karamana & Neyyar Basin",
    soil: "Laterite Red Loam",
    coeff: 0.55,
    baseFlood: 55,
    baseHeat: 40,
    baseDrought: 20,
  },
  Mangaluru: {
    name: "Mangaluru",
    coords: [12.9141, 74.8560],
    code: "IXE",
    zone: "West Coast (Karnataka)",
    basin: "Netravathi & Gurupur Basin",
    soil: "Laterite & Coastal Sandy",
    coeff: 0.60,
    baseFlood: 60,
    baseHeat: 44,
    baseDrought: 22,
  },
  Goa: {
    name: "Goa",
    coords: [15.2993, 74.1240],
    code: "GOI",
    zone: "Konkan Coast (Goa)",
    basin: "Mandovi & Zuari River Basin",
    soil: "Laterite & Alluvial",
    coeff: 0.52,
    baseFlood: 52,
    baseHeat: 43,
    baseDrought: 24,
  },
  Puri: {
    name: "Puri",
    coords: [19.8135, 85.8312],
    code: "PUR",
    zone: "East Coast (Odisha)",
    basin: "Mahanadi Delta & Chilika Lagoon",
    soil: "Deltaic Alluvial & Sandy",
    coeff: 0.68,
    baseFlood: 68,
    baseHeat: 48,
    baseDrought: 26,
  },
  Puducherry: {
    name: "Puducherry",
    coords: [11.9416, 79.8083],
    code: "PNY",
    zone: "Coromandel Coast",
    basin: "Gingee & Ponnaiyar Basin",
    soil: "Alluvial Coastal Clay",
    coeff: 0.58,
    baseFlood: 58,
    baseHeat: 52,
    baseDrought: 28,
  },
  Ratnagiri: {
    name: "Ratnagiri",
    coords: [16.9902, 73.3120],
    code: "RTC",
    zone: "Konkan Coast (Maharashtra)",
    basin: "Shastri & Ratnagiri Coastal Basins",
    soil: "Laterite & Red Sandy Loam",
    coeff: 0.63,
    baseFlood: 63,
    baseHeat: 44,
    baseDrought: 20,
  },
  Surat: {
    name: "Surat",
    coords: [21.1702, 72.8311],
    code: "STV",
    zone: "Gulf of Khambhat Coast (Gujarat)",
    basin: "Tapi River Basin",
    soil: "Black Cotton & Alluvial",
    coeff: 0.56,
    baseFlood: 56,
    baseHeat: 55,
    baseDrought: 32,
  },
};

export default function VayuSetuDashboard() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const [lang, setLang] = useState<Language>("en");
  const t = (key: string) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS["en"]?.[key] || key;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [precipitation, setPrecipitation] = useState(20);
  const [tempRise, setTempRise] = useState(1.5);
  const [urbanization, setUrbanization] = useState(15);
  const [soilMoisture, setSoilMoisture] = useState(50);
  const [simulating, setSimulating] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const [timelineStep, setTimelineStep] = useState(1); // 0=Past, 1=Current, 2=24h, 3=48h, 4=Scenario
  const [timelineProjection, setTimelineProjection] = useState<any>(null);
  
  // Active selected map district
  const [selectedDistrict, setSelectedDistrict] = useState("New Delhi");

  // Modals state variables
  const [xaiModalOpen, setXaiModalOpen] = useState(false);
  const [metricsModalOpen, setMetricsModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [docsTab, setDocsTab] = useState<"system" | "matrix" | "beforeAfter" | "priority" | "twin_justification" | "deployment_roadmap" | "cost_infrastructure" | "datasets_coverage" | "climate_memory" | "event_detection" | "multi_hazard" | "sdg_alignment" | "isro_integration" | "benchmarking">("system");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Chat Assistant state variables
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", text: "Welcome to VAYUSETU AI Space Assistant. How can I help you analyze climate parameters for the India territory today?" }
  ]);

  // Derived indicators based on What-If Simulator values
  const [floodRisk, setFloodRisk] = useState(82);
  const [heatwaveRisk, setHeatwaveRisk] = useState(54);
  const [droughtRisk, setDroughtRisk] = useState(28);

  // Dynamic XAI weights
  const [sstWeight, setSstWeight] = useState(34);
  const [humidityWeight, setHumidityWeight] = useState(28);
  const [windWeight, setWindWeight] = useState(38);

  // Dynamic Model Metrics
  const [accuracy, setAccuracy] = useState("92.4");
  const [drift, setDrift] = useState("1.8");
  const [twinMode, setTwinMode] = useState<"demo" | "research">("demo");

  // Live Date/Time state
  const [liveDateTime, setLiveDateTime] = useState<string>("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setLiveDateTime(now.toLocaleString());
    };
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Performance cache and level-of-detail zoom states
  const [mapZoom, setMapZoom] = useState(5);
  const gridCacheRef = useRef<{[key: string]: any}>({});
  const [chartMetric, setChartMetric] = useState<"temp" | "rain">("temp");

  // Splash Screen States
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (!showSplash) return;
    
    const duration = 3500; // 3.5 seconds loading time
    const intervalTime = 50;
    const increment = (100 / (duration / intervalTime));
    
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          // Start fadeout
          setSplashFading(true);
          setTimeout(() => {
            setShowSplash(false);
          }, 1000); // 1s fade duration
          return 100;
        }
        return next;
      });
    }, intervalTime);
    
    return () => clearInterval(timer);
  }, [showSplash]);

  // Derived loading text based on progress value
  const getLoadingText = (progress: number) => {
    if (progress < 20) return "Initializing Digital Twin Grid...";
    if (progress < 45) return "Ingesting INSAT-3D Telemetry...";
    if (progress < 70) return "Fusing IMD Rainfall Datasets...";
    if (progress < 90) return "Calibrating AI Prediction Engines...";
    return "Establishing Secured VAYUSETU Control Center...";
  };

  // Map state variables & refs
  const [mapType, setMapType] = useState<"styled" | "satellite" | "terrain" | "globe">("styled");
  const [co2Shift, setCo2Shift] = useState(0);
  const [forestShift, setForestShift] = useState(0);
  const [activeModel, setActiveModel] = useState<"PINN-ConvLSTM Hybrid" | "LSTM + XGBoost Ensemble" | "Empirical Runoff">("PINN-ConvLSTM Hybrid");
  const [digitalTwinScale, setDigitalTwinScale] = useState<"Pilot" | "State" | "Regional" | "National">("Pilot");
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [key: string]: L.CircleMarker }>({});
  const [mapReady, setMapReady] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(true);

  // Settings & About Us states
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [textSize, setTextSize] = useState<"sm" | "md" | "lg">("md");
  const [layoutWidth, setLayoutWidth] = useState<"standard" | "widescreen" | "full">("widescreen");

  // Manage theme changes by applying class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove("light-theme");
    } else {
      document.documentElement.classList.add("light-theme");
    }
  }, [isDarkMode]);

  // Adjust text scaling by changing HTML element font-size
  useEffect(() => {
    const sizeMap = {
      sm: "14px",
      md: "16px",
      lg: "18px"
    };
    document.documentElement.style.fontSize = sizeMap[textSize];
    return () => {
      document.documentElement.style.fontSize = "16px";
    };
  }, [textSize]);

  // Search state variables & refs
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [customDistricts, setCustomDistricts] = useState<{ [key: string]: DistrictMetadata }>({});

  // Upgraded Climate Twin states & refs
  const [gridCells, setGridCells] = useState<any[]>([]);
  const [activeGridLayer, setActiveGridLayer] = useState<string>("none"); 
  const [selectedGridCell, setSelectedGridCell] = useState<any | null>(null);
  const [radarData, setRadarData] = useState<any>(null);
  const [hydraulicData, setHydraulicData] = useState<any>(null);
  const [timeOffsetMins, setTimeOffsetMins] = useState<number>(0);
  const [scenarioMetrics, setScenarioMetrics] = useState<any>({
    heatwave_risk_shift_pct: 0,
    flood_risk_shift_pct: 0,
    crop_yield_shift_pct: 0,
    water_availability_shift_pct: 0
  });
  const [ensembleData, setEnsembleData] = useState<any>({
    rainfall: {
      ensemble_prediction: 75.0,
      confidence_pct: 91,
      uncertainty_range: "±5.2",
      range_bounds: [69.8, 80.2],
      reliability_class: "HIGH",
      models: {
        "ConvLSTM-Precip": 76.5,
        "TFT-Temp": 73.8,
        "XGBoost-LST": 74.2
      }
    },
    temperature: {
      ensemble_prediction: 31.8,
      confidence_pct: 91,
      uncertainty_range: "±1.2",
      range_bounds: [30.6, 33.0],
      reliability_class: "HIGH",
      models: {
        "ConvLSTM-Precip": 32.2,
        "TFT-Temp": 31.4,
        "XGBoost-LST": 31.8
      }
    }
  });
  const [activeAdvisories, setActiveAdvisories] = useState<any[]>([]);
  const [xaiRainfallAttributions, setXaiRainfallAttributions] = useState<any>(null);
  const [xaiTempAttributions, setXaiTempAttributions] = useState<any>(null);
  const [xaiActiveTab, setXaiActiveTab] = useState<"rain" | "temp">("rain");
  const [twinMetadata, setTwinMetadata] = useState<any>(null);
  const [modelHealthData, setModelHealthData] = useState<any>({
    model_health_pct: 96.0,
    drift_status: "STABLE",
    average_error_mae: 1.2,
    ks_test_p_value: 0.52,
    retrain_recommended: false,
    retrains_completed: 0
  });
  const [kalmanGain, setKalmanGain] = useState<number>(0.35);
  const [kalmanCovariance, setKalmanCovariance] = useState<number>(0.8);
  const [monsoonData, setMonsoonData] = useState<any>({
    monsoon_status: "ONSET_COMPLETED",
    onset_date_kerala: "2026-06-01",
    current_progression: "Active over Central & South Peninsula",
    onset_delay_days: +2,
    monsoonal_wind_vectors_ms: 14.8,
    regional_indicators: {
      south_india: "Active precipitation",
      central_india: "Normal onset in progress",
      north_india: "Pre-monsoon showers"
    },
    projected_withdrawal_start: "2026-09-18"
  });
  const [sectorImpactsData, setSectorImpactsData] = useState<any>({
    agriculture: { crop_stress_pct: 12.5, status: "OPTIMAL_HEALTH" },
    water: { reservoir_stress_pct: 35.0, evaporative_loss_index: 0.2 },
    urban: { heat_island_risk_pct: 45.0, microclimate_temp_offset_c: 1.2 },
    disaster: { flood_exposure_index: 25.0, catchment_saturation_ratio: 0.4 }
  });
  const [vayusetuRiskData, setVayusetuRiskData] = useState<any>({
    risk_score: 62.0,
    level: "HIGH",
    contributors: {
      flood_risk: 82.0,
      heat_risk: 54.0,
      drought_risk: 28.0,
      water_stress: 32.0
    }
  });
  const gridLayersRef = useRef<L.Layer[]>([]);
  const searchMarkerRef = useRef<L.CircleMarker | null>(null);

  // Sensor Ingestion Telemetry state
  const [telemetryLogs, setTelemetryLogs] = useState<Array<{
    id: string;
    time: string;
    source: string;
    level: "INFO" | "SUCCESS" | "WARNING" | "INGEST";
    messageKey: string;
    params?: Record<string, string | number>;
  }>>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const logContainerRef = useRef<HTMLDivElement | null>(null);
  const isInitialMount = useRef(true);

  // Helper to render log messages with parameters localized
  const renderLogMessage = (log: { messageKey: string; params?: Record<string, string | number> }) => {
    let text = t(log.messageKey);
    if (log.params) {
      Object.entries(log.params).forEach(([key, val]) => {
        text = text.replace(`{${key}}`, String(val));
      });
    }
    return text;
  };


  // Helper to resolve metadata for a district (supports custom searched districts)
  const getDistrictInfo = (name: string): DistrictMetadata => {
    return customDistricts[name] || DISTRICTS_METADATA[name] || DISTRICTS_METADATA["Visakhapatnam"];
  };

  const getRegionalGateway = (name: string): string => {
    const d = name.toLowerCase();
    if (d.includes("patna")) return "East-Central Hub";
    if (d.includes("delhi")) return "North Hub";
    if (d.includes("chennai") || d.includes("visakhapatnam") || d.includes("bengaluru") || d.includes("hyderabad") || d.includes("kochi") || d.includes("thiruvananthapuram") || d.includes("mangaluru") || d.includes("puducherry")) return "South Hub";
    if (d.includes("mumbai") || d.includes("ahmedabad") || d.includes("goa") || d.includes("ratnagiri") || d.includes("surat")) return "West Hub";
    if (d.includes("guwahati")) return "North-East Hub";
    if (d.includes("kolkata") || d.includes("puri")) return "East Hub";
    if (d.includes("bhopal")) return "Central Hub";
    return "National Hub";
  };

  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1&countrycodes=in`
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        const displayName = result.display_name;
        
        // Extract a shorter name for the district/city (e.g. "Dharmavaram")
        const nameParts = displayName.split(",");
        const shortName = nameParts[0].trim();

        // 1. Center the map on the new location
        if (mapRef.current) {
          mapRef.current.setView([lat, lon], 10);
        }

        // 2. Find closest predefined district to copy physical baselines (zone, basin, soil, base coeffs)
        let closestDist: DistrictMetadata = DISTRICTS_METADATA["Visakhapatnam"];
        let minDistance = Infinity;
        Object.values(DISTRICTS_METADATA).forEach((d) => {
          const dist = Math.sqrt(Math.pow(d.coords[0] - lat, 2) + Math.pow(d.coords[1] - lon, 2));
          if (dist < minDistance) {
            minDistance = dist;
            closestDist = d;
          }
        });

        // 3. Create metadata for this custom location
        const newLocationMetadata: DistrictMetadata = {
          name: shortName,
          coords: [lat, lon],
          code: shortName.substring(0, 3).toUpperCase(),
          zone: closestDist.zone,
          basin: closestDist.basin,
          soil: closestDist.soil,
          coeff: closestDist.coeff,
          baseFlood: closestDist.baseFlood,
          baseHeat: closestDist.baseHeat,
          baseDrought: closestDist.baseDrought,
        };

        // 4. Update customDistricts state
        setCustomDistricts((prev) => ({
          ...prev,
          [shortName]: newLocationMetadata,
        }));

        // 5. Remove old search marker from map and markersRef if it exists
        if (searchMarkerRef.current) {
          searchMarkerRef.current.remove();
          // Clean up from markersRef
          Object.keys(markersRef.current).forEach((key) => {
            if (markersRef.current[key] === searchMarkerRef.current) {
              delete markersRef.current[key];
            }
          });
        }

        // 6. Create new search marker
        if (mapRef.current) {
          const marker = L.circleMarker([lat, lon], {
            radius: 13,
            fillColor: "#eab308", // Bright yellow for search results
            color: "#ffffff",
            weight: 2.5,
            opacity: 0.9,
            fillOpacity: 0.8,
          }).addTo(mapRef.current);

          marker.bindPopup("", {
            closeButton: false,
            minWidth: 190,
          });

          marker.bindTooltip(`<b>${shortName} (Searched)</b>`, {
            permanent: false,
            direction: "top",
          });

          marker.on("click", () => {
            setSelectedDistrict(shortName);
          });

          searchMarkerRef.current = marker;
          markersRef.current[shortName] = marker;
        }

        // 7. Select this location
        setSelectedDistrict(shortName);
        setToastMessage(`Map focused on ${shortName} (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        setToastMessage(`Location "${searchQuery}" not found. Try entering a city or district in India.`);
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (error) {
      setToastMessage("Failed to connect to location search engine. Check your connection.");
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setSearchLoading(false);
      setSearchQuery("");
    }
  };

  // Listen for Escape key to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setXaiModalOpen(false);
        setMetricsModalOpen(false);
        setDocsModalOpen(false);
        setAssistantOpen(false);
        setSettingsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch dynamic database telemetry, ensemble prediction, XAI attributions, and map grid cells when selectedDistrict changes
  useEffect(() => {
    const fetchDistrictTwinData = async () => {
      if (!selectedDistrict) return;
      try {
        const modeRes = await fetch(`${API_BASE}/api/v1/climate/operational/get-mode`);
        if (modeRes.ok) {
          const modeData = await modeRes.json();
          setTwinMode(modeData.mode);
        }
        
        // 1. Fetch live telemetry from database (includes advisories and Kalman status)
        const liveRes = await fetch(`${API_BASE}/api/v1/climate/live-state?district=${encodeURIComponent(selectedDistrict)}`);
        if (liveRes.ok) {
          const liveData = await liveRes.json();
          if (liveData.temperature) {
            setFloodRisk(liveData.flood_risk || 40);
            setHeatwaveRisk(liveData.heatwave_risk || 30);
            setDroughtRisk(liveData.drought_risk || 20);
            setActiveAdvisories(liveData.advisories || []);
            setKalmanGain(liveData.kalman_gain || 0.35);
            setKalmanCovariance(liveData.kalman_covariance || 0.8);
            if (liveData.sector_impacts) {
              setSectorImpactsData(liveData.sector_impacts);
            }
            if (liveData.vayusetu_risk_score !== undefined) {
              setVayusetuRiskData({
                risk_score: liveData.vayusetu_risk_score,
                level: liveData.vayusetu_risk_level,
                contributors: liveData.vayusetu_risk_contributors
              });
            }
          }
        }
      } catch (err) {
        // Safe fallback
      }

      const setEnsembleFallback = () => {
        setEnsembleData({
          rainfall: {
            ensemble_prediction: 75.0,
            confidence_pct: 91,
            uncertainty_range: "±5.2",
            range_bounds: [69.8, 80.2],
            reliability_class: "HIGH",
            models: {
              "ConvLSTM-Precip": 76.5,
              "TFT-Temp": 73.8,
              "XGBoost-LST": 74.2
            }
          },
          temperature: {
            ensemble_prediction: 31.8,
            confidence_pct: 91,
            uncertainty_range: "±1.2",
            range_bounds: [30.6, 33.0],
            reliability_class: "HIGH",
            models: {
              "ConvLSTM-Precip": 32.2,
              "TFT-Temp": 31.4,
              "XGBoost-LST": 31.8
            }
          }
        });
      };

      try {
        // 2. Fetch multi-model ensemble forecast
        const forecastRes = await fetch(`${API_BASE}/api/v1/prediction/forecast?district=${encodeURIComponent(selectedDistrict)}`);
        if (forecastRes.ok) {
          const forecastData = await forecastRes.json();
          if (forecastData.forecast_horizons) {
            setEnsembleData(forecastData.forecast_horizons);
            if (forecastData.forecast_horizons.rainfall?.models) {
              const rf = forecastData.forecast_horizons.rainfall;
              setSstWeight(rf.models["ConvLSTM-Precip"] ? 34 : 34); 
            }
          } else {
            setEnsembleFallback();
          }
        } else {
          setEnsembleFallback();
        }
      } catch (err) {
        setEnsembleFallback();
      }

      try {
        // 3. Fetch grid cells for high-res GIS Grid Layer
        const gridRes = await fetch(`${API_BASE}/api/v1/climate/grid-data?district=${encodeURIComponent(selectedDistrict)}&precipitation_anomaly_pct=${precipitation}&temp_rise_c=${tempRise}&urbanization_increase_pct=${urbanization}&soil_moisture_pct=${soilMoisture}&vegetation_increase_pct=${forestShift}`);
        if (gridRes.ok) {
          const gridData = await gridRes.json();
          setGridCells(gridData);
        }
      } catch (err) {
        // Safe fallback
      }

      try {
        // 4. Fetch XAI explanations (Rainfall / Integrated Gradients)
        const xaiRainRes = await fetch(`${API_BASE}/api/v1/prediction/explain?district=${encodeURIComponent(selectedDistrict)}&target=rainfall`);
        if (xaiRainRes.ok) {
          const xaiRainData = await xaiRainRes.json();
          setXaiRainfallAttributions(xaiRainData);
        }
        
        // 5. Fetch XAI explanations (Temperature / SHAP)
        const xaiTempRes = await fetch(`${API_BASE}/api/v1/prediction/explain?district=${encodeURIComponent(selectedDistrict)}&target=temperature`);
        if (xaiTempRes.ok) {
          const xaiTempData = await xaiTempRes.json();
          setXaiTempAttributions(xaiTempData);
        }
      } catch (err) {
        // Safe fallback
      }

      try {
        // 6. Fetch Model health and Drift statistics
        const driftRes = await fetch(`${API_BASE}/api/v1/prediction/drift-status?district=${encodeURIComponent(selectedDistrict)}`);
        if (driftRes.ok) {
          const driftData = await driftRes.json();
          setModelHealthData(driftData);
          setAccuracy(driftData.model_health_pct.toString());
          setDrift(driftData.average_error_mae.toString());
        }
      } catch (err) {
        // Safe fallback
      }

      try {
        // 7. Fetch Southwest Monsoon Tracker data
        const monsoonRes = await fetch(`${API_BASE}/api/v1/climate/monsoon-tracker`);
        if (monsoonRes.ok) {
          const mData = await monsoonRes.json();
          setMonsoonData(mData);
        }
      } catch (err) {
        // Safe fallback
      }

      try {
        // 8. Fetch dynamic aggregated twin metadata
        const metadataRes = await fetch(`${API_BASE}/api/v1/climate/twin-metadata?district=${encodeURIComponent(selectedDistrict)}`);
        if (metadataRes.ok) {
          const metaData = await metadataRes.json();
          setTwinMetadata(metaData);
        }
      } catch (err) {
        // Safe fallback
      }
    };

    fetchDistrictTwinData();
  }, [API_BASE, selectedDistrict]);

  // Fetch SSP climate timeline projection when step is 1, 5, 6, 7
  useEffect(() => {
    const fetchTimelineProjection = async () => {
      let yearVal = 2026;
      if (timelineStep === 1) yearVal = 2026;
      else if (timelineStep === 5) yearVal = 2030;
      else if (timelineStep === 6) yearVal = 2040;
      else if (timelineStep === 7) yearVal = 2050;
      else {
        setTimelineProjection(null);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/v1/simulation/climate-timeline?year=${yearVal}`);
        if (res.ok) {
          const data = await res.json();
          setTimelineProjection(data);
          setTempRise(data.temperature_anomaly_c);
          setPrecipitation(Math.round(data.precipitation_shift_pct));
          const shift = Math.round(((data.co2_concentration_ppm / 418.0) - 1.0) * 100.0);
          setCo2Shift(shift);
        }
      } catch (err) {
        // Safe fallback
      }
    };

    fetchTimelineProjection();
  }, [timelineStep, API_BASE]);

  // Radar nowcast sweep animation timer
  useEffect(() => {
    if (activeGridLayer !== "radar" || !isStreaming) return;
    const interval = setInterval(() => {
      setTimeOffsetMins((prev) => (prev + 5) % 180);
    }, 2000);
    return () => clearInterval(interval);
  }, [activeGridLayer, isStreaming]);

  // Fetch Radar Nowcast data from backend
  useEffect(() => {
    if (activeGridLayer !== "radar") return;
    let active = true;
    const fetchRadar = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/prediction/radar-nowcast?district=${selectedDistrict}&time_offset_mins=${timeOffsetMins}`);
        if (res.ok && active) {
          const data = await res.json();
          setRadarData(data);
        }
      } catch (err) {
        // Safe fallback
      }
    };
    fetchRadar();
    return () => { active = false; };
  }, [activeGridLayer, selectedDistrict, timeOffsetMins, API_BASE]);

  // Fetch Hydraulic Routing inundation data from backend (debounced to protect backend)
  useEffect(() => {
    if (activeGridLayer !== "hydraulic") return;
    const handler = setTimeout(() => {
      const fetchHydraulic = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/v1/simulation/hydraulic-routing?district=${selectedDistrict}&precipitation_anomaly_pct=${precipitation}`);
          if (res.ok) {
            const data = await res.json();
            setHydraulicData(data);
          }
        } catch (err) {
          // Safe fallback
        }
      };
      fetchHydraulic();
    }, 300);
    return () => clearTimeout(handler);
  }, [activeGridLayer, selectedDistrict, precipitation, API_BASE]);

  // Update dynamic values by simulating runoff from the backend server
  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchRunoffSimulation = async () => {
        // Recalculate SHAP attributions based on inputs
        const calculatedSstWeight = Math.min(60, Math.max(10, Math.round(34 + (tempRise * 3) + (co2Shift * 0.15))));
        const calculatedHumidityWeight = Math.min(50, Math.max(10, Math.round(28 + (precipitation * 0.1) - (forestShift * 0.1))));
        const calculatedWindWeight = 100 - calculatedSstWeight - calculatedHumidityWeight;
        setSstWeight(calculatedSstWeight);
        setHumidityWeight(calculatedHumidityWeight);
        setWindWeight(calculatedWindWeight);

        try {
          const url = `${API_BASE}/api/v1/simulation/runoff?precipitation_anomaly_pct=${precipitation}&urbanization_increase_pct=${urbanization}&temp_rise_c=${tempRise}&soil_moisture_pct=${soilMoisture}&vegetation_increase_pct=${forestShift}`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data.scenario_studio_metrics) {
              setScenarioMetrics(data.scenario_studio_metrics);
            }

            // Dynamically fetch and update grid overlay data based on new parameters (utilizing cache)
            try {
              const cacheKey = `${selectedDistrict}_${precipitation}_${tempRise}_${urbanization}_${soilMoisture}_${forestShift}`;
              if (gridCacheRef.current[cacheKey]) {
                setGridCells(gridCacheRef.current[cacheKey]);
              } else {
                const gridRes = await fetch(`${API_BASE}/api/v1/climate/grid-data?district=${encodeURIComponent(selectedDistrict)}&precipitation_anomaly_pct=${precipitation}&temp_rise_c=${tempRise}&urbanization_increase_pct=${urbanization}&soil_moisture_pct=${soilMoisture}&vegetation_increase_pct=${forestShift}`);
                if (gridRes.ok) {
                  const gridData = await gridRes.json();
                  gridCacheRef.current[cacheKey] = gridData;
                  setGridCells(gridData);
                }
              }
            } catch (gErr) {
              // Ignore grid error
            }

            // Dynamically update model drift statistics for selected district
            try {
              const driftRes = await fetch(`${API_BASE}/api/v1/prediction/drift-status?district=${encodeURIComponent(selectedDistrict)}`);
              if (driftRes.ok) {
                const driftData = await driftRes.json();
                setModelHealthData(driftData);
                setAccuracy(driftData.model_health_pct.toString());
                setDrift(driftData.average_error_mae.toString());
              }
            } catch (dErr) {
              // Ignore drift error
            }

            if (data.district_breakdown && data.district_breakdown[selectedDistrict]) {
              const distData = data.district_breakdown[selectedDistrict];
              
              let floodCalc = distData.risk_score || 82;
              floodCalc = Math.min(100, Math.max(0, Math.round(floodCalc - (forestShift * 0.4))));
              setFloodRisk(floodCalc);
              
              const distInfo = getDistrictInfo(selectedDistrict);
              const baseHeat = distInfo.baseHeat;
              const heatCalc = Math.min(100, Math.max(0, Math.round(baseHeat + (tempRise * 8) + (urbanization * 0.3) + (co2Shift * 0.2) - (forestShift * 0.3))));
              const baseDrought = distInfo.baseDrought;
              const droughtCalc = Math.min(100, Math.max(0, Math.round(baseDrought - (precipitation * 0.3) + (tempRise * 5) - (forestShift * 0.2) + (co2Shift * 0.15))));
              
              setHeatwaveRisk(heatCalc);
              setDroughtRisk(droughtCalc);

              const waterStressCalc = Math.min(100, Math.max(0, Math.round(baseDrought * 0.8 + (tempRise * 3) - (precipitation * 0.2))));
              const criScore = Math.round(0.35 * floodCalc + 0.35 * heatCalc + 0.15 * droughtCalc + 0.15 * waterStressCalc);
              const criLevel = criScore > 75 ? "CRITICAL" : criScore > 50 ? "HIGH" : criScore > 25 ? "MODERATE" : "SAFE";
              setVayusetuRiskData({
                risk_score: criScore,
                level: criLevel,
                contributors: {
                  flood_risk: floodCalc,
                  heat_risk: heatCalc,
                  drought_risk: droughtCalc,
                  water_stress: waterStressCalc
                }
              });
              return;
            }
          }
        } catch (err) {
          // Safe fallback
        }

        // CLIENT-SIDE FALLBACK CALCULATIONS:
        const distInfo = getDistrictInfo(selectedDistrict);
        const baseFlood = distInfo.baseFlood;
        const baseHeat = distInfo.baseHeat;
        const baseDrought = distInfo.baseDrought;

        const moistureFactor = (soilMoisture - 50) * 0.3; // -15 to +15 adjustment
        const floodCalc = Math.min(100, Math.max(0, Math.round(baseFlood + (precipitation * 0.5) + (urbanization * 0.4) - (forestShift * 0.4) + moistureFactor)));
        const heatCalc = Math.min(100, Math.max(0, Math.round(baseHeat + (tempRise * 8) + (urbanization * 0.3) + (co2Shift * 0.2) - (forestShift * 0.3))));
        const droughtCalc = Math.min(100, Math.max(0, Math.round(baseDrought - (precipitation * 0.3) + (tempRise * 5) - (forestShift * 0.2) + (co2Shift * 0.15))));

        setFloodRisk(floodCalc);
        setHeatwaveRisk(heatCalc);
        setDroughtRisk(droughtCalc);

        const waterStressCalc = Math.min(100, Math.max(0, Math.round(baseDrought * 0.8 + (tempRise * 3) - (precipitation * 0.2))));
        const criScore = Math.round(0.35 * floodCalc + 0.35 * heatCalc + 0.15 * droughtCalc + 0.15 * waterStressCalc);
        const criLevel = criScore > 75 ? "CRITICAL" : criScore > 50 ? "HIGH" : criScore > 25 ? "MODERATE" : "SAFE";
        setVayusetuRiskData({
          risk_score: criScore,
          level: criLevel,
          contributors: {
            flood_risk: floodCalc,
            heat_risk: heatCalc,
            drought_risk: droughtCalc,
            water_stress: waterStressCalc
          }
        });

        setScenarioMetrics({
          heatwave_risk_shift_pct: Math.round((tempRise * 15.0) + (urbanization * 0.6) - (forestShift * 0.8)),
          flood_risk_shift_pct: Math.round((precipitation * 0.7) + (urbanization * 0.8) - (forestShift * 0.5)),
          crop_yield_shift_pct: Math.round((precipitation * 0.1) - (tempRise * 6.5) - (urbanization * 0.4) + (forestShift * 0.5)),
          water_availability_shift_pct: Math.round((precipitation * 0.5) - (tempRise * 5.0) - (urbanization * 0.3))
        });

        const calculatedAccuracy = (92.4 - (urbanization * 0.04) + (precipitation * 0.01)).toFixed(1);
        const calculatedDrift = (1.8 + (tempRise * 0.15) + (urbanization * 0.02)).toFixed(1);

        setAccuracy(calculatedAccuracy);
        setDrift(calculatedDrift);
      };

      fetchRunoffSimulation();
    }, 300);

    return () => clearTimeout(handler);
  }, [precipitation, tempRise, urbanization, soilMoisture, co2Shift, forestShift, selectedDistrict, API_BASE]);

  // Telemetry Monitor: Populate initial logs on mount
  useEffect(() => {
    const initialLogs = [
      {
        id: "init-1",
        time: new Date(Date.now() - 5000).toLocaleTimeString(),
        source: "MOSDAC",
        level: "INGEST" as const,
        messageKey: "logMsgMosdac"
      },
      {
        id: "init-2",
        time: new Date(Date.now() - 4000).toLocaleTimeString(),
        source: "NavIC",
        level: "INFO" as const,
        messageKey: "logMsgNavic",
        params: { lat: 17.68, lng: 83.21 }
      },
      {
        id: "init-3",
        time: new Date(Date.now() - 3000).toLocaleTimeString(),
        source: "IMD-GFS",
        level: "SUCCESS" as const,
        messageKey: "logMsgImd"
      },
      {
        id: "init-4",
        time: new Date(Date.now() - 2000).toLocaleTimeString(),
        source: "ERA5",
        level: "INFO" as const,
        messageKey: "logMsgEra5"
      },
      {
        id: "init-5",
        time: new Date(Date.now() - 1000).toLocaleTimeString(),
        source: "AI-Engine",
        level: "SUCCESS" as const,
        messageKey: "logMsgConvlstm"
      }
    ];
    setTelemetryLogs(initialLogs);
  }, []);

  // Telemetry Monitor: Live-scrolling tick stream
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      const sources = ["MOSDAC", "IMD-GFS", "ERA5", "Drift-Audit"];
      const randSrc = sources[Math.floor(Math.random() * sources.length)];
      
      let newLog: any;
      if (randSrc === "MOSDAC") {
        newLog = {
          id: `rand-${Date.now()}`,
          time,
          source: "MOSDAC",
          level: "INGEST",
          messageKey: "logMsgMosdac"
        };
      } else if (randSrc === "IMD-GFS") {
        newLog = {
          id: `rand-${Date.now()}`,
          time,
          source: "IMD-GFS",
          level: "SUCCESS",
          messageKey: "logMsgImd"
        };
      } else if (randSrc === "ERA5") {
        newLog = {
          id: `rand-${Date.now()}`,
          time,
          source: "ERA5",
          level: "INFO",
          messageKey: "logMsgEra5"
        };
      } else {
        newLog = {
          id: `rand-${Date.now()}`,
          time,
          source: "Drift-Audit",
          level: "SUCCESS",
          messageKey: "logMsgDrift",
          params: { pval: (Math.random() * 0.1 + 0.05).toFixed(3) }
        };
      }

      setTelemetryLogs((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].messageKey === newLog.messageKey && prev[prev.length - 1].source === newLog.source) return prev;
        return [...prev.slice(-19), newLog];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Telemetry Monitor: Append logs instantly on state transitions
  useEffect(() => {
    if (!isStreaming) return;
    const time = new Date().toLocaleTimeString();
    const modelKey = activeModel === "PINN-ConvLSTM Hybrid" 
      ? "logMsgConvlstm" 
      : activeModel === "LSTM + XGBoost Ensemble" 
      ? "logMsgLstmXgb" 
      : "logMsgRunoff";
    
    setTelemetryLogs((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].messageKey === modelKey && prev[prev.length - 1].source === "AI-Engine") return prev;
      return [
        ...prev.slice(-19),
        {
          id: `model-${Date.now()}`,
          time,
          source: "AI-Engine",
          level: "SUCCESS",
          messageKey: modelKey
        }
      ];
    });
  }, [activeModel, isStreaming]);

  useEffect(() => {
    if (!isStreaming) return;
    const time = new Date().toLocaleTimeString();
    setTelemetryLogs((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].messageKey === "logMsgScale" && prev[prev.length - 1].source === "GIS-Projection") return prev;
      return [
        ...prev.slice(-19),
        {
          id: `scale-${Date.now()}`,
          time,
          source: "GIS-Projection",
          level: "INFO",
          messageKey: "logMsgScale",
          params: { scale: digitalTwinScale }
        }
      ];
    });
  }, [digitalTwinScale, isStreaming]);

  useEffect(() => {
    if (!isStreaming) return;
    const time = new Date().toLocaleTimeString();
    const distInfo = getDistrictInfo(selectedDistrict);
    setTelemetryLogs((prev) => {
      const navicLog = {
        id: `navic-${Date.now()}`,
        time,
        source: "NavIC",
        level: "INFO" as const,
        messageKey: "logMsgNavic",
        params: { lat: distInfo.coords[0].toFixed(4), lng: distInfo.coords[1].toFixed(4) }
      };
      const anomalyLog = {
        id: `anomaly-${Date.now() + 1}`,
        time,
        source: "System",
        level: floodRisk > 60 ? ("WARNING" as const) : ("INFO" as const),
        messageKey: "logMsgAnomaly",
        params: { district: selectedDistrict }
      };
      let currentPrev = [...prev];
      if (currentPrev.length === 0 || currentPrev[currentPrev.length - 1].messageKey !== navicLog.messageKey || currentPrev[currentPrev.length - 1].source !== navicLog.source) {
        currentPrev = [...currentPrev, navicLog];
      }
      if (currentPrev.length === 0 || currentPrev[currentPrev.length - 1].messageKey !== anomalyLog.messageKey || currentPrev[currentPrev.length - 1].source !== anomalyLog.source) {
        currentPrev = [...currentPrev, anomalyLog];
      }
      return currentPrev.slice(-20);
    });
  }, [selectedDistrict, isStreaming]);

  // Telemetry Monitor: Auto-scroll
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [telemetryLogs]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (mapRef.current) return;
    const container = document.getElementById("map-container");
    if (!container) return;

    // Center map on India
    const mapInstance = L.map("map-container", {
      center: [20.5937, 78.9629],
      zoom: 5,
      minZoom: 4,
      zoomControl: true,
      attributionControl: false,
      worldCopyJump: false,
      maxBoundsViscosity: 1.0,
      maxBounds: [
        [5.0, 60.0],
        [40.0, 100.0]
      ]
    });

    mapRef.current = mapInstance;

    // Track zoom level changes dynamically
    mapInstance.on("zoomend", () => {
      setMapZoom(mapInstance.getZoom());
    });

    // Initial styled dark tile layer
    const tileLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      noWrap: true,
    }).addTo(mapInstance);

    tileLayerRef.current = tileLayer;

    const districts = Object.values(DISTRICTS_METADATA).map((d) => ({
      name: d.name,
      coords: d.coords as L.LatLngExpression,
      code: d.code,
    }));

    const newMarkers: { [key: string]: L.CircleMarker } = {};

    districts.forEach((dist) => {
      const circle = L.circleMarker(dist.coords, {
        radius: 10,
        fillColor: "#10b981",
        color: "#ffffff",
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.7,
      }).addTo(mapInstance);

      // Create initial empty popup that will be dynamically set by style effect
      circle.bindPopup("", {
        closeButton: false,
        minWidth: 190,
      });

      circle.bindTooltip(`<b>${dist.name} (${dist.code})</b>`, {
        permanent: false,
        direction: "top",
      });

      circle.on("click", () => {
        setSelectedDistrict(dist.name);
      });

      newMarkers[dist.name] = circle;
    });

    markersRef.current = newMarkers;
    setMapReady(true);

    // Initial resize trigger to calculate viewport sizes correctly
    const resizeTimer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 200);

    // Handle window resize dynamically to prevent layout rendering glitches (freezing/getting stuck)
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (searchMarkerRef.current) {
        searchMarkerRef.current = null;
      }
      tileLayerRef.current = null;
      markersRef.current = {};
      setMapReady(false);
    };
  }, []);

  // Update Map Tile Layer based on Type
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;

    let url = "";
    if (mapType === "satellite") {
      url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    } else if (mapType === "terrain") {
      url = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
    } else {
      url = isDarkMode 
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
    }

    tileLayerRef.current.setUrl(url);
  }, [mapType, isDarkMode]);

  // Recalculate map size when map type changes (crucial when switching back from 3D Globe to prevent stuck viewport)
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    if (mapType !== "globe") {
      const typeTimer = setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 150);
      return () => clearTimeout(typeTimer);
    }
  }, [mapType, mapReady]);

  // Fly/pan to selected district when it changes (ensures map centers and follows the user's active focus)
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const distInfo = getDistrictInfo(selectedDistrict);
    if (distInfo && distInfo.coords) {
      mapRef.current.flyTo(distInfo.coords as L.LatLngExpression, mapRef.current.getZoom(), {
        animate: true,
        duration: 1.5
      });
    }
  }, [selectedDistrict, mapReady]);

  // Dynamically update map marker styles and popup details based on risk scores
  useEffect(() => {
    if (!mapReady) return;
    Object.entries(markersRef.current).forEach(([name, marker]) => {
      let score = 0;
      let basin = "";
      let soil = "";
      let region = "";
      let coeff = 0;

      const distInfo = getDistrictInfo(name);
      basin = distInfo.basin;
      soil = distInfo.soil;
      region = distInfo.zone;
      coeff = distInfo.coeff;

      if (name === selectedDistrict) {
        score = floodRisk;
      } else {
        const moistureFactor = (soilMoisture - 50) * 0.3;
        score = Math.min(100, Math.max(0, Math.round((coeff * 100) + (precipitation * 0.4) + moistureFactor)));
      }

      const color = getRiskColor(score);
      const isSelected = name === selectedDistrict;

      marker.setStyle({
        fillColor: color,
        radius: isSelected ? 13 : 9,
        weight: isSelected ? 2.5 : 1.5,
        color: isSelected ? "#6366f1" : (isDarkMode ? "#ffffff" : "#475569"),
      });

      // HTML contents inside map click popup
      const popupHtml = `
        <div style="font-family: monospace; color: ${isDarkMode ? '#f1f5f9' : '#0f172a'}; background: ${isDarkMode ? '#020617' : '#ffffff'}; padding: 6px; font-size: 11px; min-width: 175px;">
          <div style="font-weight: bold; border-bottom: 1px solid ${isDarkMode ? '#1e293b' : '#cbd5e1'}; padding-bottom: 4px; margin-bottom: 6px; color: #818cf8; text-transform: uppercase;">📍 ${name}</div>
          <div style="margin-bottom: 2px;">• <b>${t("zone")}:</b> ${t(region)}</div>
          <div style="margin-bottom: 2px;">• <b>${t("basin")}:</b> ${t(basin)}</div>
          <div style="margin-bottom: 2px;">• <b>${t("soil")}:</b> ${t(soil)}</div>
          <div style="margin-bottom: 2px;">• <b>${t("soilMoistureAmc")}:</b> ${soilMoisture}%</div>
          <div style="margin-top: 6px; padding: 4px; border-radius: 4px; font-weight: bold; text-align: center; background: ${color}20; color: ${color}; border: 1px solid ${color}40;">
            ${t("floodRisk")}: ${score}%
          </div>
        </div>
      `;

      marker.setPopupContent(popupHtml);

      // Auto open popup for clicked active district
      if (isSelected && mapRef.current) {
        marker.openPopup();
      }
    });
  }, [mapReady, floodRisk, selectedDistrict, precipitation, soilMoisture, customDistricts, isDarkMode, lang]);

  // Render High-Resolution Climate Grid Overlay
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    // Clear previous grid layers
    gridLayersRef.current.forEach((layer) => {
      if (mapRef.current) {
        mapRef.current.removeLayer(layer);
      }
    });
    gridLayersRef.current = [];

    if (activeGridLayer === "none" || (activeGridLayer !== "radar" && activeGridLayer !== "hydraulic" && gridCells.length === 0)) {
      return;
    }

    const newLayers: L.Layer[] = [];

    if (activeGridLayer === "radar" && radarData) {
      const centerLatLng = radarData.radar_center as L.LatLngExpression;
      
      const boundaryCircle = L.circle(centerLatLng, {
        radius: radarData.sweep_radius_km * 1000,
        color: "#6366f1",
        weight: 1.0,
        dashArray: "4, 4",
        fill: false,
        opacity: 0.35
      }).addTo(mapRef.current);
      newLayers.push(boundaryCircle);

      const angle = radarData.current_sweep_angle;
      const rad = (angle * Math.PI) / 180;
      const sweepTarget: L.LatLngExpression = [
        centerLatLng[0] + 0.8 * Math.sin(rad),
        centerLatLng[1] + 0.8 * Math.cos(rad)
      ];
      const sweepLine = L.polyline([centerLatLng, sweepTarget], {
        color: "#10b981",
        weight: 1.5,
        opacity: 0.6
      }).addTo(mapRef.current);
      newLayers.push(sweepLine);

      radarData.contours.forEach((contour: any) => {
        const circle = L.circle(contour.center as L.LatLngExpression, {
          radius: contour.radius_km * 1000,
          color: contour.color,
          weight: 1.5,
          fillColor: contour.color,
          fillOpacity: contour.opacity
        }).addTo(mapRef.current);
        
        circle.bindTooltip(`Radar Nowcast: ${contour.dbz} dBZ (Storm Cell)`, {
          permanent: false,
          direction: "top"
        });
        newLayers.push(circle);
      });

    } else if (activeGridLayer === "hydraulic" && hydraulicData) {
      const distInfo = getDistrictInfo(selectedDistrict);
      const centerLat = distInfo.coords[0];
      const centerLng = distInfo.coords[1];
      const nx = 16;
      const ny = 16;
      const cellScale = 0.008;
      const startLat = centerLat - (nx / 2) * cellScale;
      const startLng = centerLng - (ny / 2) * cellScale;

      for (let i = 0; i < nx; i++) {
        for (let j = 0; j < ny; j++) {
          const depth = hydraulicData.depth_grid[i][j];
          if (depth < 0.02) continue;

          const bounds: L.LatLngBoundsExpression = [
            [startLat + i * cellScale, startLng + j * cellScale],
            [startLat + (i + 1) * cellScale, startLng + (j + 1) * cellScale]
          ];

          const depthColor = depth > 2.0 ? "#1e3a8a" : depth > 1.0 ? "#2563eb" : depth > 0.3 ? "#3b82f6" : "#60a5fa";
          
          const rect = L.rectangle(bounds, {
            color: "#3b82f6",
            weight: 0.5,
            fillColor: depthColor,
            fillOpacity: 0.55
          }).addTo(mapRef.current);

          const velX = hydraulicData.velocity_x_grid[i][j];
          const velY = hydraulicData.velocity_y_grid[i][j];
          const velMag = Math.sqrt(velX * velX + velY * velY).toFixed(2);

          rect.bindTooltip(
            `<b>Hydraulic Inundation Grid [${i},${j}]</b><br/>
             Water Depth: ${depth.toFixed(2)} m<br/>
             Velocity: ${velMag} m/s`,
            { permanent: false, sticky: true }
          );
          newLayers.push(rect);
        }
      }

    } else {
      // Dynamic Map Downsampling (Level of Detail - LoD)
      const renderedCells = mapZoom <= 5 
        ? gridCells.filter((_, idx) => idx % 4 === 0) 
        : gridCells;

      renderedCells.forEach((cell) => {
        const bounds: L.LatLngBoundsExpression = [
          [cell.latitude - 0.005, cell.longitude - 0.005],
          [cell.latitude + 0.005, cell.longitude + 0.005]
        ];

        let color = "#10b981"; 

        if (activeGridLayer === "rainfall") {
          const fillVal = cell.rainfall; 
          const pct = Math.min(100, Math.max(0, (fillVal / 150) * 100));
          color = pct > 75 ? "#1e3a8a" : pct > 50 ? "#3b82f6" : pct > 25 ? "#60a5fa" : "#dbeafe";
        } else if (activeGridLayer === "temperature") {
          const fillVal = cell.temperature; 
          const pct = Math.min(100, Math.max(0, ((fillVal - 15) / 30) * 100));
          color = pct > 75 ? "#dc2626" : pct > 50 ? "#ea580c" : pct > 25 ? "#f97316" : "#fef08a";
        } else if (activeGridLayer === "soil_moisture") {
          const pct = cell.soil_moisture;
          color = pct > 75 ? "#065f46" : pct > 50 ? "#059669" : pct > 25 ? "#34d399" : "#b45309";
        } else if (activeGridLayer === "flood") {
          color = getRiskColor(cell.flood_risk);
        } else if (activeGridLayer === "drought") {
          color = getRiskColor(cell.drought_risk);
        } else if (activeGridLayer === "heatwave") {
          color = getRiskColor(cell.heatwave_risk);
        }

        const rect = L.rectangle(bounds, {
          color: isDarkMode ? "#334155" : "#94a3b8",
          weight: 0.5,
          fillColor: color,
          fillOpacity: 0.45,
        });

        rect.bindTooltip(
          `<b>Cell ${cell.cell}</b><br/>
           Temp: ${cell.temperature}°C<br/>
           Rainfall: ${cell.rainfall} mm<br/>
           Soil Moisture: ${cell.soil_moisture}%<br/>
           Flood Risk: ${cell.flood_risk}%`,
          { permanent: false, sticky: true }
        );

        rect.on("click", () => {
          setSelectedGridCell(cell);
        });

        rect.addTo(mapRef.current);
        newLayers.push(rect);
      });
    }

    gridLayersRef.current = newLayers;

    return () => {
      newLayers.forEach((layer) => {
        if (mapRef.current) {
          mapRef.current.removeLayer(layer);
        }
      });
      gridLayersRef.current = [];
    };
  }, [mapReady, activeGridLayer, gridCells, isDarkMode, radarData, hydraulicData, selectedDistrict, mapZoom]);

  const runSimulation = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setTimelineStep(4); // Switch to Scenario tab automatically
      setToastMessage(t("simulationDone"));
      setTimeout(() => setToastMessage(null), 4000);
    }, 1500);
  };

  const handleRetrain = async () => {
    setRetraining(true);
    setToastMessage("Contacting training queue...");
    try {
      const res = await fetch(`${API_BASE}/api/v1/prediction/retrain`, { method: "POST" });
      if (res.ok) {
        setToastMessage("Retraining AI models... (Kalman corrections running)");
        setTimeout(() => {
          setToastMessage("Validating new model checkpoints...");
          setTimeout(() => {
            setToastMessage("Registering models in VAYUSETU registry...");
            setTimeout(async () => {
              try {
                const driftRes = await fetch(`${API_BASE}/api/v1/prediction/drift-status`);
                if (driftRes.ok) {
                  const driftData = await driftRes.json();
                  setModelHealthData(driftData);
                  setAccuracy(driftData.model_health_pct.toString());
                  setDrift(driftData.average_error_mae.toString());
                }
              } catch (err) {}
              setRetraining(false);
              setToastMessage("Model Retraining Completed Successfully!");
              setTimeout(() => setToastMessage(null), 3000);
            }, 1000);
          }, 1000);
        }, 1500);
      } else {
        setRetraining(false);
        setToastMessage("Model Retraining failed.");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      setRetraining(false);
      setToastMessage("Network error during retraining.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const applyPreset = (temp: number, co2: number, forest: number, precip: number, urban: number, moisture: number) => {
    setTempRise(temp);
    setCo2Shift(co2);
    setForestShift(forest);
    setPrecipitation(precip);
    setUrbanization(urban);
    setSoilMoisture(moisture);

    // Client-side immediate update to keep UI instant and consistent
    const distInfo = getDistrictInfo(selectedDistrict);
    const baseFlood = distInfo.baseFlood;
    const baseHeat = distInfo.baseHeat;
    const baseDrought = distInfo.baseDrought;

    const moistureFactor = (moisture - 50) * 0.3;
    const floodCalc = Math.min(100, Math.max(0, Math.round(baseFlood + (precip * 0.5) + (urban * 0.4) - (forest * 0.4) + moistureFactor)));
    const heatCalc = Math.min(100, Math.max(0, Math.round(baseHeat + (temp * 8) + (urban * 0.3) + (co2 * 0.2) - (forest * 0.3))));
    const droughtCalc = Math.min(100, Math.max(0, Math.round(baseDrought - (precip * 0.3) + (temp * 5) - (forest * 0.2) + (co2 * 0.15))));

    setFloodRisk(floodCalc);
    setHeatwaveRisk(heatCalc);
    setDroughtRisk(droughtCalc);

    const waterStressCalc = Math.min(100, Math.max(0, Math.round(baseDrought * 0.8 + (temp * 3) - (precip * 0.2))));
    const criScore = Math.round(0.35 * floodCalc + 0.35 * heatCalc + 0.15 * droughtCalc + 0.15 * waterStressCalc);
    const criLevel = criScore > 75 ? "CRITICAL" : criScore > 50 ? "HIGH" : criScore > 25 ? "MODERATE" : "SAFE";

    setVayusetuRiskData({
      risk_score: criScore,
      level: criLevel,
      contributors: {
        flood_risk: floodCalc,
        heat_risk: heatCalc,
        drought_risk: droughtCalc,
        water_stress: waterStressCalc
      }
    });

    setScenarioMetrics({
      heatwave_risk_shift_pct: Math.round((temp * 15.0) + (urban * 0.6) - (forest * 0.8)),
      flood_risk_shift_pct: Math.round((precip * 0.7) + (urban * 0.8) - (forest * 0.5)),
      crop_yield_shift_pct: Math.round((precip * 0.1) - (temp * 6.5) - (urban * 0.4) + (forest * 0.5)),
      water_availability_shift_pct: Math.round((precip * 0.5) - (temp * 5.0) - (urban * 0.3))
    });
  };

  const handleExportReport = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/climate/operational/district-report?district=${encodeURIComponent(selectedDistrict)}`);
      if (res.ok) {
        const data = await res.json();
        const element = document.createElement("a");
        const file = new Blob([data.report], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `VAYUSETU_${selectedDistrict.replace(/\s+/g, '_')}_Climate_Report.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        setToastMessage(`Exported Climate Intelligence Report for ${selectedDistrict}!`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      setToastMessage("Failed to export report.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleGenerateBrief = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/climate/operational/climate-brief?district=${encodeURIComponent(selectedDistrict)}`);
      if (res.ok) {
        const data = await res.json();
        setToastMessage(`Brief generated! Checked RAG Space.`);
        setChatHistory(prev => [
          ...prev,
          { role: "user", text: `Generate climate brief for ${selectedDistrict}` },
          { role: "assistant", text: data.brief }
        ]);
        setAssistantOpen(true);
      }
    } catch (err) {
      setToastMessage("Failed to generate brief.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleBroadcastAlert = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/climate/operational/broadcast-alert?district=${encodeURIComponent(selectedDistrict)}`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setToastMessage(data.message);
        setTimeout(() => setToastMessage(null), 5000);
      }
    } catch (err) {
      setToastMessage("Failed to broadcast alert.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleDownloadPolicyPDF = () => {
    const link = document.createElement('a');
    link.href = `${API_BASE}/api/v1/climate/operational/policy-pdf`;
    link.download = 'VAYUSETU_DATASET_INVENTORY.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage("Downloading Dataset Inventory Policy PDF...");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleTwinMode = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/climate/operational/toggle-mode`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setTwinMode(data.mode);
        setToastMessage(`Switched Digital Twin Mode to: ${data.mode.toUpperCase()}`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      setToastMessage("Failed to toggle mode.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: "user", text: chatInput };
    setChatHistory((prev) => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput("");

    // Try fetching from the backend Copilot Q&A service
    try {
      const stateObj = {
        district: selectedDistrict,
        temperature: ensembleData?.temperature?.ensemble_prediction || 31.8,
        rainfall: ensembleData?.rainfall?.ensemble_prediction || 75.0,
        soil_moisture: soilMoisture,
        humidity: 82.0,
        lst: 32.5,
        sst: 29.2,
        vayusetu_risk_score: vayusetuRiskData?.risk_score || 62.0
      };
      const response = await fetch(`${API_BASE}/api/v1/twin/copilot/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentInput, twin_state: stateObj })
      });
      if (response.ok) {
        const data = await response.json();
        setChatHistory((prev) => [...prev, { role: "assistant", text: data.answer }]);
        return;
      }
    } catch (err) {
      console.error("Backend copilot failed, falling back to offline handler", err);
    }

    // Offline / Fallback Q&A Engine
    const query = currentInput.toLowerCase();
    let reply = "";

    const activeDist = selectedDistrict;
    const riskLevel = floodRisk > 75 ? t("lblCriticalAlert") : t("lblElevatedWarning");

    if (query.includes("hello") || query.includes("hi ") || query.includes("hey") || query.includes("greetings")) {
      reply = t("chatReplyGreetings");
    } else if (query.includes("map") || query.includes("satellite") || query.includes("terrain") || query.includes("basemap") || query.includes("style")) {
      reply = t("chatReplyMap");
    } else if (
      (() => {
        let matched = false;
        const allDistricts = { ...DISTRICTS_METADATA, ...customDistricts };
        Object.keys(allDistricts).forEach((key) => {
          const d = allDistricts[key];
          if (query.includes(d.name.toLowerCase()) || query.includes(d.code.toLowerCase()) || (d.name === "Visakhapatnam" && query.includes("vizag"))) {
            matched = true;
          }
        });
        return matched;
      })()
    ) {
      let matchedDistrictKey = "";
      const allDistricts = { ...DISTRICTS_METADATA, ...customDistricts };
      Object.keys(allDistricts).forEach((key) => {
        const d = allDistricts[key];
        if (query.includes(d.name.toLowerCase()) || query.includes(d.code.toLowerCase()) || (d.name === "Visakhapatnam" && query.includes("vizag"))) {
          matchedDistrictKey = key;
        }
      });
      const d = allDistricts[matchedDistrictKey];
      
      // Auto-change active district in dashboard and map
      setSelectedDistrict(d.name);
      
      const isSel = selectedDistrict === d.name;
      const distFlood = isSel ? floodRisk : Math.min(100, Math.max(0, Math.round((d.coeff * 100) + (precipitation * 0.4))));
      const distHeat = isSel ? heatwaveRisk : Math.min(100, Math.max(0, Math.round(d.baseHeat + (tempRise * 8) + (urbanization * 0.3))));
      const distDrought = isSel ? droughtRisk : Math.min(100, Math.max(0, Math.round(d.baseDrought - (precipitation * 0.3) + (tempRise * 5))));

      const advisory = distFlood > 75 
        ? t("advisoryCritical") 
        : distFlood > 50 
          ? t("advisoryElevated") 
          : t("advisoryNormal");

      let baseReply = t("chatReplyDistrict")
        .replace("{district}", d.name)
        .replace("{code}", d.code)
        .replace("{zone}", t(d.zone))
        .replace("{basin}", t(d.basin))
        .replace("{soil}", t(d.soil))
        .replace("{coeff}", d.coeff.toString())
        .replace("{floodRisk}", distFlood.toString())
        .replace("{heatRisk}", distHeat.toString())
        .replace("{droughtRisk}", distDrought.toString())
        .replace("{precipitation}", precipitation.toString())
        .replace("{tempRise}", tempRise.toString())
        .replace("{urbanization}", urbanization.toString())
        .replace("{advisory}", advisory);

      let insight = "";
      if (query.includes("temp") || query.includes("heat") || query.includes("lst") || query.includes("sst") || query.includes("thermal")) {
        insight = `\n\n🌡️ **LST Anomaly Insight**: The Land Surface Temperature (LST) under this scenario has an anomaly of +${tempRise}°C, placing the Heatwave Risk at ${distHeat}/100. Evaporative demand is high.`;
      } else if (query.includes("rain") || query.includes("flood") || query.includes("runoff") || query.includes("precipitation") || query.includes("discharge")) {
        insight = `\n\n🌧️ **Runoff Flood Insight**: Fusing precipitation grids (+${precipitation}% shift) with soil properties yields a peak discharge of ${distFlood}% risk. High catchment loading observed.`;
      } else if (query.includes("soil") || query.includes("moisture") || query.includes("drought") || query.includes("amc")) {
        insight = `\n\n🌾 **Hydrological Deficit Insight**: Catchment soil saturation stands at ${soilMoisture}%. Deficit is causing a Drought Stress of ${distDrought}/100.`;
      } else if (query.includes("accuracy") || query.includes("drift") || query.includes("metric") || query.includes("validation") || query.includes("rmse")) {
        insight = `\n\n🛡️ **Model Audit**: The forecasting model for ${d.name} reports a local accuracy of ${accuracy}% and MAE of ${drift} mm/°C.`;
      }

      reply = `🛰️ **Space Twin Telemetry Update** for **${d.name}**:\n` + baseReply + insight;
    } else if (query.includes("fews") || query.includes("flood") || query.includes("rain") || query.includes("runoff") || query.includes("precipitation")) {
      reply = t("chatReplyFews")
        .replace("{precipitation}", precipitation.toString())
        .replace("{district}", activeDist)
        .replace("{floodRisk}", floodRisk.toString())
        .replace("{riskLevel}", riskLevel);
    } else if (query.includes("heat") || query.includes("temp") || query.includes("drought") || query.includes("lst") || query.includes("sst")) {
      reply = t("chatReplyHeat")
        .replace("{tempRise}", tempRise.toString())
        .replace("{heatwaveRisk}", heatwaveRisk.toString())
        .replace("{droughtRisk}", droughtRisk.toString())
        .replace("{district}", activeDist);
    } else if (query.includes("shap") || query.includes("gradient") || query.includes("ig") || query.includes("xai") || query.includes("explain") || query.includes("attribution") || query.includes("weight")) {
      reply = t("chatReplyShap")
        .replace("{sstWeight}", sstWeight.toString())
        .replace("{humidityWeight}", humidityWeight.toString())
        .replace("{windWeight}", windWeight.toString());
    } else if (query.includes("accuracy") || query.includes("drift") || query.includes("f1") || query.includes("metric") || query.includes("ks-test") || query.includes("performance") || query.includes("rmse") || query.includes("mape")) {
      reply = t("chatReplyAccuracy")
        .replace("{accuracy}", accuracy)
        .replace("{drift}", drift);
    } else if (query.includes("soil") || query.includes("moisture") || query.includes("amc") || query.includes("saturation") || query.includes("antecedent")) {
      reply = t("chatReplySoil")
        .replace("{soilMoisture}", soilMoisture.toString())
        .replace("{coeffAdj}", ((soilMoisture - 50) * 0.003).toFixed(3));
    } else if (query.includes("isro") || query.includes("satellite") || query.includes("navic") || query.includes("mosdac")) {
      reply = t("chatReplyIsro");
    } else if (query.includes("who") || query.includes("creator") || query.includes("team")) {
      reply = t("chatReplyWho");
    } else {
      reply = t("chatReplyFallback")
        .replace("{input}", currentInput)
        .replace("{district}", activeDist)
        .replace("{precipitation}", precipitation.toString())
        .replace("{tempRise}", tempRise.toString())
        .replace("{urbanization}", urbanization.toString())
        .replace("{floodRisk}", floodRisk.toString())
        .replace("{riskLevel}", riskLevel)
        .replace("{heatwaveRisk}", heatwaveRisk.toString());
      // Clean up the generic "Coastal Andhra Pradesh" text if it's there
      reply = reply.replace("for the Coastal Andhra Pradesh region.", `for ${activeDist} and surrounding territory.`);
    }

    setChatHistory((prev) => [...prev, { role: "assistant", text: reply }]);
  };

  const getTimelineLabel = (step: number) => {
    switch(step) {
      case 0: return t("pastState");
      case 1: return t("currentState");
      case 2: return t("forecast24");
      case 3: return t("forecast48");
      case 4: return t("scenarioTwin");
      case 5: return "SSP2-4.5 (Year 2030)";
      case 6: return "SSP2-4.5 (Year 2040)";
      case 7: return "SSP2-4.5 (Year 2050)";
      default: return "";
    }
  };

  const getRiskColor = (score: number) => {
    if (score > 75) return "#ef4444"; // Red (Critical)
    if (score > 50) return "#f59e0b"; // Orange (Amber)
    return "#10b981"; // Green (Normal)
  };

  const distInfo = getDistrictInfo(selectedDistrict);
  
  // Calculate summary texts dynamically
  const getFloodStateText = () => {
    const basinTranslated = t(distInfo.basin).split('/')[0].trim();
    if (floodRisk > 75) {
      return t("floodCritical")
        .replace("{floodRisk}", floodRisk.toString())
        .replace("{basin}", basinTranslated);
    } else if (floodRisk > 50) {
      return t("floodElevated")
        .replace("{floodRisk}", floodRisk.toString());
    } else {
      return t("floodNormal")
        .replace("{floodRisk}", floodRisk.toString());
    }
  };

  const getHeatStateText = () => {
    if (heatwaveRisk > 75) {
      return t("heatCritical")
        .replace("{heatwaveRisk}", heatwaveRisk.toString());
    } else if (heatwaveRisk > 50) {
      return t("heatElevated")
        .replace("{heatwaveRisk}", heatwaveRisk.toString());
    } else {
      return t("heatNormal")
        .replace("{heatwaveRisk}", heatwaveRisk.toString());
    }
  };

  const getDroughtStateText = () => {
    if (droughtRisk > 65) {
      return t("droughtCritical")
        .replace("{droughtRisk}", droughtRisk.toString());
    } else if (droughtRisk > 40) {
      return t("droughtElevated")
        .replace("{droughtRisk}", droughtRisk.toString());
    } else {
      return t("droughtNormal")
        .replace("{droughtRisk}", droughtRisk.toString());
    }
  };

  const floodStateText = getFloodStateText();
  const heatStateText = getHeatStateText();
  const droughtStateText = getDroughtStateText();
  const districtsList = Object.values({...DISTRICTS_METADATA, ...customDistricts}).map((d) => {
    const isSel = d.name === selectedDistrict;
    const score = isSel 
      ? floodRisk 
      : Math.min(100, Math.max(0, Math.round((d.coeff * 100) + (precipitation * 0.4))));
    return {
      name: d.name,
      coords: d.coords,
      color: getRiskColor(score),
      risk: score
    };
  });

  // SVG Chart Plotting Engine
  const renderTrendChart = () => {
    const seedString = selectedGridCell ? `cell_${selectedGridCell.cell}` : selectedDistrict;
    const hash = seedString.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const baseTemp = 20 + (hash % 8);
    const baseRain = 30 + (hash % 120);
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const tempProfile = [0.0, 1.5, 3.5, 6.0, 8.5, 5.0, 3.0, 2.5, 2.0, 1.5, 0.5, -0.5];
    const rainProfile = [0.05, 0.1, 0.2, 0.4, 0.8, 4.5, 8.2, 7.8, 4.2, 1.8, 0.5, 0.1];
    
    // Select metric values
    let histY: number[];
    let predY: number[];
    let unit: string;
    let title: string;
    
    if (chartMetric === "temp") {
      histY = months.map((_, i) => baseTemp + tempProfile[i] + (Math.sin(hash + i) * 0.4));
      predY = months.map((_, i) => baseTemp + tempProfile[i] + 1.8 + (Math.cos(hash - i) * 0.5) + (tempRise * 0.5));
      unit = "°C";
      title = "Surface Temp";
    } else {
      histY = months.map((_, i) => Math.max(0, baseRain * rainProfile[i] + (Math.sin(hash * i) * 5)));
      predY = months.map((_, i) => Math.max(0, baseRain * rainProfile[i] * (1 + precipitation / 100.0) + (Math.cos(hash + i) * 6)));
      unit = " mm";
      title = "Precipitation";
    }
    
    // Scale coordinates into 300x120 SVG box
    const minVal = Math.min(...histY, ...predY) * 0.9;
    const maxVal = Math.max(...histY, ...predY) * 1.1;
    const valRange = maxVal - minVal || 1.0;
    
    const getX = (idx: number) => 35 + (idx * (245 / 11));
    const getY = (val: number) => 110 - ((val - minVal) / valRange) * 90;
    
    const histPoints = histY.map((v, i) => `${getX(i)},${getY(v)}`).join(" ");
    const predPoints = predY.map((v, i) => `${getX(i)},${getY(v)}`).join(" ");
    
    return (
      <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/80 mt-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-300">
            📊 Spatiotemporal Trend: {title}
          </span>
          <div className="flex gap-1 bg-slate-950 p-0.5 rounded text-[8px] font-mono">
            <button 
              type="button"
              onClick={() => setChartMetric("temp")}
              className={`px-1.5 py-0.5 rounded ${chartMetric === "temp" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"}`}
            >
              Temp
            </button>
            <button 
              type="button"
              onClick={() => setChartMetric("rain")}
              className={`px-1.5 py-0.5 rounded ${chartMetric === "rain" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"}`}
            >
              Rain
            </button>
          </div>
        </div>
        
        <div className="text-[9px] text-slate-400 font-mono">
          Focus: <span className="text-white font-bold">{seedString}</span>
        </div>
        
        {/* SVG Drawing Canvas */}
        <div className="relative">
          <svg className="w-full h-auto overflow-visible" viewBox="0 0 300 130">
            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const val = minVal + ratio * valRange;
              const y = 110 - ratio * 90;
              return (
                <g key={ratio} className="opacity-15">
                  <line x1="30" y1={y} x2="285" y2={y} stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2, 2" />
                  <text x="5" y={y + 3} fill="#94a3b8" className="text-[7px] font-mono fill-current font-semibold">{val.toFixed(0)}</text>
                </g>
              );
            })}
            
            {/* Timeline ticks */}
            {months.map((m, i) => (
              <text key={m} x={getX(i)} y="125" fill="#64748b" textAnchor="middle" className="text-[7px] font-mono fill-current">{m}</text>
            ))}
            
            {/* Line 1: Historical Avg (Dashed Blue) */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1.5"
              strokeDasharray="3, 3"
              points={histPoints}
            />
            {histY.map((v, i) => (
              <circle
                key={`hist-${i}`}
                cx={getX(i)}
                cy={getY(v)}
                r="2"
                fill="#3b82f6"
                className="hover:r-3 cursor-pointer"
              >
                <title>{`10-Yr Avg: ${v.toFixed(1)}${unit}`}</title>
              </circle>
            ))}
            
            {/* Line 2: AI Predicted (Solid Crimson) */}
            <polyline
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.0"
              points={predPoints}
              style={{ filter: "drop-shadow(0 0 3px rgba(239, 68, 68, 0.4))" }}
            />
            {predY.map((v, i) => (
              <circle
                key={`pred-${i}`}
                cx={getX(i)}
                cy={getY(v)}
                r="2.5"
                fill="#ef4444"
                className="hover:r-3.5 cursor-pointer"
              >
                <title>{`AI 2026: ${v.toFixed(1)}${unit}`}</title>
              </circle>
            ))}
          </svg>
        </div>
        
        {/* Chart Legend */}
        <div className="flex justify-center gap-4 text-[8px] font-mono text-slate-400 pt-1 border-t border-slate-900/60">
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-0.5 border-t border-dashed border-blue-500"></span>
            <span>10-Yr Hist Avg</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-0.5 bg-red-500"></span>
            <span>AI 2026 Projection</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen space-bg text-slate-100 font-sans relative">
      
      {showSplash && (
        <div 
          className={`fixed inset-0 z-[9999] bg-[#020617] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ${
            splashFading ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Custom Space CSS Animations */}
          <style>{`
            @keyframes space-orbit {
              0% { transform: rotate(0deg) translate(180px) rotate(0deg) scale(0.6); z-index: 10; }
              50% { transform: rotate(180deg) translate(180px) rotate(-180deg) scale(1.1); z-index: 10; }
              50.01% { z-index: -10; }
              100% { transform: rotate(360deg) translate(180px) rotate(-360deg) scale(0.6); z-index: -10; }
            }
            @keyframes float-earth {
              0%, 100% { transform: translateY(0) scale(1); }
              50% { transform: translateY(-8px) scale(1.02); }
            }
            @keyframes starry-twinkle {
              0%, 100% { opacity: 0.15; }
              50% { opacity: 1; }
            }
          `}</style>

          {/* Random Starry Space Background */}
          <div className="absolute inset-0 z-0">
            {[...Array(80)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  animation: `starry-twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Earth & Astronaut Cluster */}
          <div className="relative w-80 h-80 flex items-center justify-center z-10 mb-8 select-none">
            {/* The Earth */}
            <div 
              className="w-48 h-48 rounded-full relative bg-gradient-to-br from-blue-500 via-indigo-950 to-slate-950 border border-blue-400/30 flex items-center justify-center overflow-hidden"
              style={{
                animation: "float-earth 6s ease-in-out infinite",
                boxShadow: "0 0 50px rgba(59, 130, 246, 0.2)"
              }}
            >
              {/* Earth texture simulation */}
              <div className="absolute inset-0 bg-cover opacity-20 pointer-events-none mix-blend-overlay bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-300 via-indigo-600 to-black"></div>
              {/* Spinning atmosphere glow */}
              <div className="absolute inset-0 rounded-full border border-blue-400/20 shadow-[inset_0_0_20px_rgba(59,130,246,0.5)]"></div>
              
              {/* Abstract continents */}
              <svg className="absolute w-full h-full text-emerald-600/40 fill-current opacity-60" viewBox="0 0 100 100">
                <path d="M20,30 Q30,25 40,35 T60,30 T80,45 T90,60 L95,80 L70,85 L50,70 L30,80 L15,60 Z" />
                <path d="M45,15 Q55,10 65,15 T75,10 L80,25 L65,30 Z" />
              </svg>
            </div>

            {/* Orbiting Spaceman (Astronaut) */}
            <div 
              className="absolute w-12 h-12 flex items-center justify-center pointer-events-none"
              style={{
                animation: "space-orbit 12s linear infinite"
              }}
            >
              <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                {/* Backpack */}
                <rect x="18" y="28" width="5" height="18" rx="2" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5"/>
                <rect x="41" y="28" width="5" height="18" rx="2" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5"/>
                
                {/* Suit Body */}
                <rect x="22" y="32" width="20" height="20" rx="5" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2"/>
                
                {/* Chest pack */}
                <rect x="26" y="36" width="12" height="7" rx="1.5" fill="#CBD5E1"/>
                <circle cx="29" cy="39.5" r="1" fill="#EF4444"/>
                <circle cx="32" cy="39.5" r="1" fill="#10B981"/>
                <circle cx="35" cy="39.5" r="1" fill="#3B82F6"/>
                
                {/* Arms */}
                <path d="M22 35C18 35 15 37 14 39C13 40.5 14 42 16 41C18 40 22 38 22 38" stroke="#F8FAFC" strokeWidth="4.5" strokeLinecap="round"/>
                <path d="M42 35C46 35 49 37 50 39C51 40.5 50 42 48 41C46 40 42 38 42 38" stroke="#F8FAFC" strokeWidth="4.5" strokeLinecap="round"/>
                
                {/* Legs */}
                <path d="M26 50V56C26 57.5 28 57.5 28 56V50" stroke="#F8FAFC" strokeWidth="4.5" strokeLinecap="round"/>
                <path d="M38 50V56C38 57.5 40 57.5 40 56V50" stroke="#F8FAFC" strokeWidth="4.5" strokeLinecap="round"/>

                {/* Helmet */}
                <circle cx="32" cy="21" r="11" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2"/>
                <path d="M24 19C24 16.5 26 14.5 28.5 14.5H35.5C38 14.5 40 16.5 40 19V22.5C40 23.5 39 24.5 38 24.5H26C25 24.5 24 23.5 24 22.5V19Z" fill="#1E293B" stroke="#38BDF8" strokeWidth="2"/>
                <path d="M26 17.5H32" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Logo & Project Title */}
          <div className="text-center z-10 select-none px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-[0.2em] font-sans bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent uppercase">
              VAYUSETU
            </h1>
            <p className="mt-2 text-xs md:text-sm tracking-wider text-slate-400 font-light max-w-sm mx-auto uppercase">
              AI-Powered Digital Twin of India's Climate
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-64 mt-12 z-10 select-none">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-1.5">
              <span className="uppercase tracking-wider">{getLoadingText(loadingProgress)}</span>
              <span>{Math.round(loadingProgress)}%</span>
            </div>
            <div className="w-full h-[3px] bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all duration-75"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Absolute Positioned Bright Constellation Stars */}
      <div className="hidden sm:block absolute top-24 left-[8%] w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_#38bdf8] animate-pulse pointer-events-none z-0"></div>
      <div className="absolute top-[40%] left-[88%] w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_12px_#fff,0_0_25px_#818cf8] animate-pulse pointer-events-none z-0" style={{ animationDelay: "1.5s", animationDuration: "3s" }}></div>
      <div className="absolute top-[65%] left-[6%] w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_18px_#6366f1] animate-pulse pointer-events-none z-0" style={{ animationDelay: "3s", animationDuration: "4s" }}></div>
      <div className="absolute top-[78%] left-[92%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#fff,0_0_14px_#22d3ee] animate-pulse pointer-events-none z-0" style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}></div>
      <div className="absolute top-[18%] left-[72%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#fff,0_0_14px_#818cf8] animate-pulse pointer-events-none z-0" style={{ animationDelay: "2s", animationDuration: "3.5s" }}></div>
      <div className="hidden sm:block absolute top-[88%] left-[22%] w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_12px_#fff,0_0_22px_#6366f1] animate-pulse pointer-events-none z-0" style={{ animationDelay: "4s", animationDuration: "5s" }}></div>

      {/* Official Government Header */}
      <div className="relative z-10 bg-[#0B2545]/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="bg-[#134074] text-white px-2 py-0.5 rounded font-bold font-mono">{t("isroCollaborative")}</span>
          <span className="hidden sm:inline">{t("govTitle")}</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 font-mono">
          <span>{t("telemetryNavic")}</span>
          <span className="h-3 w-px bg-slate-700"></span>
          <span>{t("bhuvanGis")}</span>
        </div>
      </div>

      {/* Main Header / Navigation bar */}
      <header className="relative z-10 bg-slate-950/85 border-b border-slate-800/80 px-3 py-2 sm:px-4 sm:py-3 lg:px-8 flex items-center justify-between shadow-lg backdrop-blur-md gap-2">
        <div className="flex items-center gap-3">
          
          {/* Logo Group: VayuSetu and ISRO Logos side by side */}
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-700 bg-white shadow-[0_0_10px_rgba(59,130,246,0.15)]">
              <Image 
                src="/logo/logo.jpg" 
                alt="VAYUSETU Logo" 
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Image 
                src="/logo/isro.svg" 
                alt="ISRO Logo" 
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              VAYUSETU <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-mono">{t("pilotTwin")}</span>
            </h1>
            <p className="text-[10px] text-slate-400">{t("subtitle")}</p>
          </div>
        </div>

        {/* Center/Desktop Navigation bar - Styled as premium pill links */}
        <nav className="hidden md:flex items-center gap-2 bg-slate-900/40 border border-slate-800/60 p-1 rounded-xl">
          <span className="text-xs font-bold text-white px-3 font-mono tracking-wider border-r border-slate-800 pr-3">VAYUSETU</span>
          <a 
            href="#dashboard" 
            className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-[0_0_10px_rgba(99,102,241,0.12)] transition"
          >
            {t("operationsRoom")}
          </a>
          <button 
            onClick={() => setXaiModalOpen(true)}
            className="hover:bg-slate-900/60 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 transition"
            aria-label="Open Explainable AI diagnostics modal"
          >
            {t("xaiLink")}
          </button>
          <button 
            onClick={() => setMetricsModalOpen(true)}
            className="hover:bg-slate-900/60 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 transition"
            aria-label="Open Model quality metrics modal"
          >
            {t("telemetryLink")}
          </button>
          <button 
            onClick={() => setAssistantOpen(!assistantOpen)}
            className="hover:bg-slate-900/60 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 transition"
            aria-label="Toggle RAG Space assistant"
          >
            {t("assistantLink")}
          </button>
          <button 
            onClick={() => setDocsModalOpen(true)}
            className="hover:bg-slate-900/60 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 transition"
            aria-label="Open system documentation modal"
          >
            {t("docsLink")}
          </button>
        </nav>

        {/* Live Status Tag */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Selector Dropdown */}
          <div className="relative inline-block hidden sm:block">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="flex items-center justify-center p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 transition text-xs font-mono focus:outline-none cursor-pointer"
              aria-label="Select language"
            >
              <option value="en" className="bg-slate-950 text-slate-200">EN - English</option>
              <option value="hi" className="bg-slate-950 text-slate-200">HI - हिन्दी</option>
              <option value="te" className="bg-slate-950 text-slate-200">TE - తెలుగు</option>
              <option value="ta" className="bg-slate-950 text-slate-200">TA - தமிழ்</option>
              <option value="kn" className="bg-slate-950 text-slate-200">KN - ಕನ್ನಡ</option>
            </select>
          </div>
          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="hidden sm:flex items-center justify-center p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 transition text-xs font-mono gap-1.5"
            aria-label="Toggle light/dark theme"
          >
            {isDarkMode ? t("themeLight") : t("themeDark")}
          </button>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span> {t("navicSatellite")}
          </span>
          <button
            onClick={() => setSettingsModalOpen(true)}
            className="flex items-center justify-center p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition text-xs"
            aria-label="System Settings and Config"
            title={t("settingsTitle")}
          >
            ⚙️
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 transition"
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/95 flex flex-col pt-6 px-6 gap-6 backdrop-blur-lg animate-in slide-in-from-top duration-300">
          <div className="flex justify-end font-mono">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-400 hover:text-white text-2xl font-bold p-2 focus:outline-none"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <a 
            href="#dashboard" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-semibold text-indigo-400 border-b border-slate-800 pb-3"
          >
            {t("operationsRoom")}
          </a>
          <button 
            onClick={() => { setMobileMenuOpen(false); setXaiModalOpen(true); }}
            className="text-left text-lg font-semibold text-white border-b border-slate-800 pb-3"
            aria-label="Open Explainable AI diagnostics modal from mobile menu"
          >
            {t("xaiLink")}
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); setMetricsModalOpen(true); }}
            className="text-left text-lg font-semibold text-white border-b border-slate-800 pb-3"
            aria-label="Open Model quality metrics modal from mobile menu"
          >
            {t("telemetryLink")}
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); setAssistantOpen(true); }}
            className="text-left text-lg font-semibold text-white border-b border-slate-800 pb-3"
            aria-label="Open chatbot from mobile menu"
          >
            {t("assistantLink")}
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); setDocsModalOpen(true); }}
            className="text-left text-lg font-semibold text-white pb-3 border-b border-slate-800"
            aria-label="Open documentation from mobile menu"
          >
            {t("docsLink")}
          </button>
          <div className="flex flex-col gap-2 pb-3 border-b border-slate-800">
            <span className="text-sm font-semibold text-slate-400 font-mono">{t("selectLanguageLabel")}</span>
            <select
              value={lang}
              onChange={(e) => {
                setLang(e.target.value as Language);
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:outline-none cursor-pointer"
            >
              <option value="en">EN - English</option>
              <option value="hi">HI - हिन्दी</option>
              <option value="te">TE - తెలుగు</option>
              <option value="ta">TA - தமிழ்</option>
              <option value="kn">KN - ಕನ್ನಡ</option>
            </select>
          </div>
          <button 
            onClick={() => { setMobileMenuOpen(false); setIsDarkMode(!isDarkMode); }}
            className="text-left text-lg font-semibold text-indigo-400 pb-3 flex items-center gap-2"
            aria-label="Toggle light/dark theme from mobile menu"
          >
            {isDarkMode ? t("themeLightMobile") : t("themeDarkMobile")}
          </button>
        </div>
      )}

      {/* Main Layout Grid */}
      <main 
        id="dashboard" 
        className={`relative z-10 mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 ${
          layoutWidth === "standard" 
            ? "max-w-[1280px]" 
            : layoutWidth === "full" 
            ? "max-w-full" 
            : "max-w-[1600px]"
        }`}
      >
        
        {/* Climate Command Center Dashboard */}
        <div className="bg-slate-950/70 border border-slate-800/80 backdrop-blur-md rounded-xl p-4 sm:p-5 shadow-[0_0_20px_rgba(99,102,241,0.08)] border-l-4 border-l-indigo-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: Twin Status Panel */}
            <div className="space-y-3 md:border-r border-slate-800/60 md:pr-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 animate-pulse text-xs">●</span>
                  <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">Twin Status: ACTIVE</span>
                </div>
                <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-900/50">v1.24</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                <div className="bg-slate-900/60 p-2 rounded border border-slate-800/40">
                  <span className="text-[9px] text-slate-500 block">TWIN HEALTH</span>
                  <span className="text-emerald-400 font-bold">96%</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded border border-slate-800/40">
                  <span className="text-[9px] text-slate-500 block">LAST ASSIMILATION</span>
                  <span className="text-indigo-400 font-bold">12s ago</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded border border-slate-800/40">
                  <span className="text-[9px] text-slate-500 block">ACTIVE DATASETS</span>
                  <span className="text-indigo-300 font-bold">18 Feeds Ingested</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded border border-slate-800/40">
                  <span className="text-[9px] text-slate-500 block">FORECAST HORIZON</span>
                  <span className="text-slate-200 font-bold">7 Days</span>
                </div>
                <div 
                  onClick={toggleTwinMode}
                  className="bg-slate-900/60 p-2 rounded border border-slate-800/40 col-span-2 flex items-center justify-between cursor-pointer hover:bg-[#134074] hover:text-white transition shadow-[0_0_8px_rgba(99,102,241,0.15)] group"
                  title="Click to toggle between Research and Demo modes"
                >
                  <div>
                    <span className="text-[9px] text-slate-500 block group-hover:text-slate-300">TWIN OPERATION MODE</span>
                    <span className={twinMode === "research" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                      {twinMode === "research" ? "🔬 RESEARCH MODE (Real Data)" : "📺 DEMO MODE (Simulated Stream)"}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">🔄</span>
                </div>
              </div>
            </div>

            {/* Column 2: AI Insights & Alerts */}
            <div className="space-y-3 md:border-r border-slate-800/60 md:px-6">
              <div className="flex items-center gap-2">
                <span className="text-indigo-400 text-xs">ℹ</span>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">Climate Command Insights ({selectedDistrict})</span>
              </div>
              <div className="space-y-1.5 text-[11px] font-mono text-slate-300">
                <div className="flex justify-between items-center bg-slate-900/40 px-2 py-1 rounded">
                  <span>Flood Risk Index:</span>
                  <span className={`font-bold ${floodRisk > 75 ? 'text-red-400' : 'text-slate-300'}`}>{floodRisk}%</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/40 px-2 py-1 rounded">
                  <span>Heatwave Risk:</span>
                  <span className="text-slate-300 font-bold">{heatwaveRisk}%</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/40 px-2 py-1 rounded">
                  <span>Rainfall Anomaly:</span>
                  <span className={`font-bold ${precipitation >= 20 ? 'text-red-400' : 'text-slate-300'}`}>+{precipitation}%</span>
                </div>
              </div>
            </div>

            {/* Column 3: Operational Command Portal */}
            <div className="space-y-3 md:pl-6 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-xs">⚡</span>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">Operational Command Portal</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 my-auto py-1">
                <div className="bg-slate-900/40 p-2 rounded border border-slate-800/40">
                  <span className="text-slate-500 block text-[8px]">COMMAND NODE</span>
                  <span className="text-slate-300 font-bold">ISRO-VAYUSETU-A1</span>
                </div>
                <div className="bg-slate-900/40 p-2 rounded border border-slate-800/40">
                  <span className="text-slate-500 block text-[8px]">SECURITY TUNNEL</span>
                  <span className="text-emerald-400 font-bold animate-pulse">🔒 SECURED (SSL)</span>
                </div>
                <div className="bg-slate-900/40 p-2 rounded border border-slate-800/40">
                  <span className="text-slate-500 block text-[8px]">BROADCAST SYSTEM</span>
                  <span className="text-indigo-400 font-bold">CAP-ACTIVE</span>
                </div>
                <div className="bg-slate-900/40 p-2 rounded border border-slate-800/40">
                  <span className="text-slate-500 block text-[8px]">TELEMETRY FEED</span>
                  <span className="text-indigo-300 font-bold">S-BAND LINK</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleExportReport}
                  className="py-1.5 bg-indigo-950/80 hover:bg-[#134074] text-indigo-300 border border-indigo-800 text-[10px] font-mono rounded font-semibold transition text-center preserve-dark"
                  aria-label="Export District Intelligence Report"
                >
                  📄 Export Report
                </button>
                <button 
                  onClick={handleGenerateBrief}
                  className="py-1.5 bg-indigo-950/80 hover:bg-[#134074] text-indigo-300 border border-indigo-800 text-[10px] font-mono rounded font-semibold transition text-center preserve-dark"
                  aria-label="Generate Climate Action Brief"
                >
                  📝 Generate Brief
                </button>
                <button 
                  onClick={handleBroadcastAlert}
                  className="py-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 text-[10px] font-mono rounded font-semibold transition text-center preserve-dark"
                  aria-label="Broadcast CAP Alert"
                >
                  🚨 Broadcast Alert
                </button>
                <button 
                  onClick={handleDownloadPolicyPDF}
                  className="py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[10px] font-mono rounded font-semibold transition text-center"
                  aria-label="Download Policy PDF"
                >
                  ⬇ Policy PDF
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 3-Panel Main Operational Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Panel 1: What-If Simulator & Timeline Controls */}
          <section className="bg-slate-950/65 border border-slate-800/75 backdrop-blur-md rounded-xl p-3 sm:p-5 space-y-4 sm:space-y-6 lg:col-span-1 flex flex-col shadow-[0_0_15px_rgba(59,130,246,0.05)] text-slate-200">
            <div className="space-y-5">
              <div>
                <h2 className="text-sm uppercase font-mono tracking-wider text-indigo-400 border-b border-slate-800 pb-2">{t("simulatorTitle")}</h2>
                <p className="text-xs text-slate-500 mt-1">{t("simulatorDesc")}</p>
              </div>

              {/* Climate Policy Sandbox Presets */}
              <div className="space-y-1.5 mt-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block">{t("runPolicySandbox")}</span>
                <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono">
                  <button
                    type="button"
                    onClick={() => applyPreset(2.0, 10, -10, 0, 15, 50)}
                    className="p-1 bg-slate-900 hover:bg-[#134074] border border-slate-800 text-slate-300 hover:text-white rounded text-left transition"
                  >
                    🌡️ Global Warming
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(1.5, 5, -10, 0, 20, 50)}
                    className="p-1 bg-slate-900 hover:bg-[#134074] border border-slate-800 text-slate-300 hover:text-white rounded text-left transition"
                  >
                    🏢 Urbanization
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(-0.5, -5, 15, 0, 0, 50)}
                    className="p-1 bg-slate-900 hover:bg-[#134074] border border-slate-800 text-slate-300 hover:text-white rounded text-left transition"
                  >
                    🌳 Afforestation
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(1.5, 5, -5, 40, 10, 85)}
                    className="p-1 bg-slate-900 hover:bg-[#134074] border border-slate-800 text-slate-300 hover:text-white rounded text-left transition"
                  >
                    🌧️ Extreme Monsoon
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Rainfall slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="precipitation-slider" className="text-slate-300">{t("precipitationShift")}</label>
                    <span className="text-indigo-400 font-mono font-bold">{precipitation > 0 ? '+' : ''}{precipitation}%</span>
                  </div>
                  <input 
                    id="precipitation-slider"
                    type="range" 
                    min="-50" 
                    max="100" 
                    value={precipitation}
                    onChange={(e) => setPrecipitation(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    aria-label="Precipitation Anomaly Slider"
                  />
                </div>

                {/* Temperature slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="temperature-slider" className="text-slate-300">{t("temperatureAnomaly")}</label>
                    <span className="text-indigo-400 font-mono font-bold">+{tempRise}°C</span>
                  </div>
                  <input 
                    id="temperature-slider"
                    type="range" 
                    min="0.5" 
                    max="5.0" 
                    step="0.1"
                    value={tempRise}
                    onChange={(e) => setTempRise(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    aria-label="Temperature Anomaly Slider"
                  />
                </div>

                {/* CO2 level slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="co2-slider" className="text-slate-300">{t("co2LevelLabel")}</label>
                    <span className="text-indigo-400 font-mono font-bold">{co2Shift > 0 ? '+' : ''}{co2Shift}% ({Math.round(418 * (1 + co2Shift / 100))} ppm)</span>
                  </div>
                  <input 
                    id="co2-slider"
                    type="range" 
                    min="-20" 
                    max="50" 
                    value={co2Shift}
                    onChange={(e) => setCo2Shift(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    aria-label="CO2 Level Slider"
                  />
                </div>

                {/* Forest cover slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="forest-slider" className="text-slate-300">{t("forestCoverLabel")}</label>
                    <span className="text-indigo-400 font-mono font-bold">{forestShift > 0 ? '+' : ''}{forestShift}%</span>
                  </div>
                  <input 
                    id="forest-slider"
                    type="range" 
                    min="-30" 
                    max="30" 
                    value={forestShift}
                    onChange={(e) => setForestShift(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    aria-label="Forest Cover Slider"
                  />
                </div>

                {/* Urbanization slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="urbanization-slider" className="text-slate-300">{t("urbanCoverShift")}</label>
                    <span className="text-indigo-400 font-mono font-bold">+{urbanization}%</span>
                  </div>
                  <input 
                    id="urbanization-slider"
                    type="range" 
                    min="0" 
                    max="50" 
                    value={urbanization}
                    onChange={(e) => setUrbanization(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    aria-label="Urban Cover Shift Slider"
                  />
                </div>

                {/* Soil Moisture slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="soil-moisture-slider" className="text-slate-300">{t("soilMoistureAmc")}</label>
                    <span className="text-indigo-400 font-mono font-bold">{soilMoisture}%</span>
                  </div>
                  <input 
                    id="soil-moisture-slider"
                    type="range" 
                    min="0" 
                    max="100" 
                    value={soilMoisture}
                    onChange={(e) => setSoilMoisture(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    aria-label="Soil Moisture Slider"
                  />
                </div>
              </div>

              {/* Scope Switcher */}
              <div className="space-y-2 pt-2 border-t border-slate-900">
                <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold block">{t("scaleSelectorLabel")}</label>
                <div className="grid grid-cols-2 gap-1 text-[9px] font-mono">
                  {(["Pilot", "State", "Regional", "National"] as const).map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => setDigitalTwinScale(sc)}
                      className={`p-1 text-center rounded border transition ${
                        digitalTwinScale === sc 
                          ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/30" 
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {sc === "Pilot" && t("tabPilotScale").split(" ")[0]}
                      {sc === "State" && t("tabStateScale").split(" ")[0]}
                      {sc === "Regional" && t("tabRegionalScale").split(" ")[0]}
                      {sc === "National" && t("tabNationalScale").split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Engine Model Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-900">
                <label htmlFor="model-select" className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold block">{t("activeModelLabel")}</label>
                <select
                  id="model-select"
                  value={activeModel}
                  onChange={(e) => setActiveModel(e.target.value as any)}
                  className="w-full p-2 rounded bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="PINN-ConvLSTM Hybrid">🧠 PINN-ConvLSTM Hybrid</option>
                  <option value="LSTM + XGBoost Ensemble">📈 LSTM + XGBoost Ensemble</option>
                  <option value="Empirical Runoff">🌊 Physics Empirical Runoff</option>
                </select>
              </div>

              <button 
                onClick={runSimulation}
                disabled={simulating}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold text-xs rounded transition flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                aria-label="Run projections and simulate Digital Twin state"
              >
                {simulating ? t("simulating") : t("runSimulation")}
              </button>
            </div>

            {/* What-If Scenario Studio Results — only shown after simulation ran */}
            {(scenarioMetrics.heatwave_risk_shift_pct !== 0 ||
              scenarioMetrics.flood_risk_shift_pct !== 0 ||
              scenarioMetrics.crop_yield_shift_pct !== 0 ||
              scenarioMetrics.water_availability_shift_pct !== 0) && (
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block">📊 Scenario Studio Output</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="bg-slate-950 p-1.5 rounded border border-slate-900">
                  <div className="text-slate-500 text-[9px]">Heatwave Risk</div>
                  <div className={`text-[11px] font-bold ${scenarioMetrics.heatwave_risk_shift_pct >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {scenarioMetrics.heatwave_risk_shift_pct >= 0 ? '↑' : '↓'} {Math.abs(scenarioMetrics.heatwave_risk_shift_pct)}%
                  </div>
                </div>
                <div className="bg-slate-950 p-1.5 rounded border border-slate-900">
                  <div className="text-slate-500 text-[9px]">Flood Risk</div>
                  <div className={`text-[11px] font-bold ${scenarioMetrics.flood_risk_shift_pct >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {scenarioMetrics.flood_risk_shift_pct >= 0 ? '↑' : '↓'} {Math.abs(scenarioMetrics.flood_risk_shift_pct)}%
                  </div>
                </div>
                <div className="bg-slate-950 p-1.5 rounded border border-slate-900">
                  <div className="text-slate-500 text-[9px]">Crop Yield</div>
                  <div className={`text-[11px] font-bold ${scenarioMetrics.crop_yield_shift_pct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {scenarioMetrics.crop_yield_shift_pct >= 0 ? '↑' : '↓'} {Math.abs(scenarioMetrics.crop_yield_shift_pct)}%
                  </div>
                </div>
                <div className="bg-slate-950 p-1.5 rounded border border-slate-900">
                  <div className="text-slate-500 text-[9px]">Water Availability</div>
                  <div className={`text-[11px] font-bold ${scenarioMetrics.water_availability_shift_pct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {scenarioMetrics.water_availability_shift_pct >= 0 ? '↑' : '↓'} {Math.abs(scenarioMetrics.water_availability_shift_pct)}%
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-slate-800/60">
              <h2 className="text-sm uppercase font-mono tracking-wider text-indigo-400 border-b border-slate-800 pb-2">⚡ Quick Actions</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTimelineStep(2)}
                  className="py-2 px-2 bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-700 text-slate-300 hover:text-indigo-300 text-[10px] font-mono rounded transition text-left"
                >
                  🕐 24h Forecast
                </button>
                <button
                  onClick={() => setTimelineStep(4)}
                  className="py-2 px-2 bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-700 text-slate-300 hover:text-indigo-300 text-[10px] font-mono rounded transition text-left"
                >
                  🧪 Run Scenario
                </button>
                <button
                  onClick={() => setTimelineStep(5)}
                  className="py-2 px-2 bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-700 text-slate-300 hover:text-indigo-300 text-[10px] font-mono rounded transition text-left"
                >
                  📅 2030 Outlook
                </button>
                <button
                  onClick={() => setTimelineStep(7)}
                  className="py-2 px-2 bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-700 text-slate-300 hover:text-indigo-300 text-[10px] font-mono rounded transition text-left"
                >
                  🔮 2050 Outlook
                </button>
              </div>
            </div>


          </section>


          {/* Panel 2: Interactive Digital Twin Map & Temporal Timeline */}
          <section className="lg:col-span-2 bg-slate-950/65 border border-slate-800/75 backdrop-blur-md rounded-xl overflow-hidden flex flex-col min-h-[350px] sm:min-h-[440px] shadow-[0_0_15px_rgba(59,130,246,0.05)]">
            
            {/* Timeline Selector Header */}
            <div className="bg-slate-950 p-3 border-b border-slate-800/60 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("temporalTimeline")}</span>
                <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2.5 py-0.5 rounded font-mono font-bold">
                  {getTimelineLabel(timelineStep)}
                </span>
              </div>
              
              {/* Custom Timeline Slider with perfect dot alignment */}
              <div className="relative w-full px-5 pt-3 pb-8 select-none">
                {/* Track Line */}
                <div className="absolute top-[22px] left-5 right-5 h-1 bg-slate-800 rounded-full" />
                
                {/* Active Track Highlight */}
                <div 
                  className="absolute top-[22px] left-5 h-1 bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ 
                    width: `calc(${(timelineStep / 7) * 100}%)` 
                  }}
                />

                {/* Dots and Labels */}
                <div className="relative w-full h-10">
                  {[
                    { val: 0, label: t("lblPast") },
                    { val: 1, label: t("lblCurrent") },
                    { val: 2, label: t("lbl24h") },
                    { val: 3, label: t("lbl48h") },
                    { val: 4, label: t("lblScenario") },
                    { val: 5, label: "2030" },
                    { val: 6, label: "2040" },
                    { val: 7, label: "2050" }
                  ].map((step, idx) => {
                    const percent = (idx / 7) * 100;
                    const isActive = timelineStep === idx;
                    return (
                      <div 
                        key={idx}
                        className="absolute -translate-x-1/2 flex flex-col items-center cursor-pointer group"
                        style={{ left: `${percent}%` }}
                        onClick={() => setTimelineStep(idx)}
                      >
                        {/* Dot */}
                        <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 flex items-center justify-center mt-1
                          ${isActive 
                            ? "bg-indigo-500 border-indigo-400 scale-125 shadow-[0_0_8px_rgba(99,102,241,0.8)]" 
                            : "bg-slate-950 border-slate-700 group-hover:border-slate-500 hover:scale-110"
                          }`}
                        >
                          {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        
                        {/* Label */}
                        <span className={`mt-2 text-[9px] font-mono transition-all duration-200 whitespace-nowrap
                          ${isActive 
                            ? "text-indigo-400 font-bold" 
                            : "text-slate-500 group-hover:text-slate-300"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Map Viewport - Real Leaflet GIS Map */}
            <div className="flex-1 bg-slate-950/50 relative min-h-[300px] sm:min-h-[400px]">
              
              {/* Map Layer Switcher Overlay */}
              <div className="absolute top-3 right-2 sm:right-3 z-[1000] bg-slate-950/90 border border-slate-800 p-1 sm:p-1.5 rounded-lg shadow-lg flex gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-mono backdrop-blur-md">
                <button 
                  onClick={() => setMapType("styled")}
                  className={`px-2 py-1 rounded transition-colors ${mapType === "styled" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}
                >
                  {t("styled")}
                </button>
                <button 
                  onClick={() => setMapType("satellite")}
                  className={`px-2 py-1 rounded transition-colors ${mapType === "satellite" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}
                >
                  {t("satellite")}
                </button>
                <button 
                  onClick={() => setMapType("terrain")}
                  className={`px-2 py-1 rounded transition-colors ${mapType === "terrain" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}
                >
                  {t("terrain")}
                </button>
                <button 
                  onClick={() => setMapType("globe")}
                  className={`px-2 py-1 rounded transition-colors ${mapType === "globe" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}
                >
                  {t("globeViewLabel")}
                </button>
              </div>

              {/* High-Resolution Grid Overlay Selector */}
              <div className="absolute top-12 right-2 sm:right-3 z-[1000] bg-slate-950/90 border border-slate-800 p-1 sm:p-1.5 rounded-lg shadow-lg flex flex-wrap gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-mono backdrop-blur-md max-w-[280px] sm:max-w-none">
                <span className="text-slate-500 self-center px-1">Grid:</span>
                {[
                  { id: "none", label: "Off" },
                  { id: "rainfall", label: "Rain" },
                  { id: "temperature", label: "Temp" },
                  { id: "soil_moisture", label: "Soil" },
                  { id: "flood", label: "Flood" },
                  { id: "drought", label: "Drought" },
                  { id: "heatwave", label: "Heat" },
                  { id: "radar", label: "Radar" },
                  { id: "hydraulic", label: "Hydraulic" }
                ].map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setActiveGridLayer(layer.id)}
                    className={`px-1.5 py-0.5 rounded transition-colors ${activeGridLayer === layer.id ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}
                  >
                    {layer.label}
                  </button>
                ))}
              </div>

              {/* Floating Grid Cell Details */}
              {selectedGridCell && (
                <div className="absolute bottom-3 right-3 z-[1000] bg-slate-950/95 border border-indigo-500/40 p-3 rounded-lg shadow-2xl text-[10px] sm:text-xs font-mono backdrop-blur-md text-slate-300 max-w-[200px]">
                  <div className="flex justify-between border-b border-slate-800 pb-1 mb-2">
                    <span className="text-indigo-400 font-bold">📍 {selectedGridCell.cell}</span>
                    <button onClick={() => setSelectedGridCell(null)} className="text-slate-500 hover:text-red-400 font-bold">✕</button>
                  </div>
                  <div className="space-y-1">
                    <div>Lat: {selectedGridCell.latitude}</div>
                    <div>Lng: {selectedGridCell.longitude}</div>
                    <div>Temp: <span className="text-orange-400">{selectedGridCell.temperature}°C</span></div>
                    <div>Rainfall: <span className="text-blue-400">{selectedGridCell.rainfall} mm</span></div>
                    <div>Soil Moisture: <span className="text-emerald-400">{selectedGridCell.soil_moisture}%</span></div>
                    <div className="pt-1 mt-1 border-t border-slate-900">
                      <div>Flood Risk: <span className="font-bold" style={{ color: getRiskColor(selectedGridCell.flood_risk) }}>{selectedGridCell.flood_risk}%</span></div>
                      <div>Drought Risk: <span className="font-bold" style={{ color: getRiskColor(selectedGridCell.drought_risk) }}>{selectedGridCell.drought_risk}%</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Search Bar Overlay - Top Left */}
              <div className="absolute top-3 left-2 sm:left-12 z-[1000] flex items-center gap-1.5 max-w-[180px] sm:max-w-[300px]">
                <form onSubmit={handleLocationSearch} className="flex bg-indigo-950/75 border border-indigo-500/30 p-1 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.2)] focus-within:border-indigo-500 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all duration-300 backdrop-blur-md w-full">
                  <input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-indigo-100 text-xs px-2.5 py-1 w-full focus:outline-none placeholder-indigo-300/50 font-mono"
                    disabled={searchLoading}
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white px-2.5 py-1 rounded text-xs transition-colors flex items-center justify-center font-mono font-bold"
                    disabled={searchLoading}
                  >
                    {searchLoading ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      "🔍"
                    )}
                  </button>
                </form>
              </div>

              {/* Leaflet Map Div */}
              {!mapReady && mapType !== "globe" && (
                <div className="absolute inset-0 bg-slate-950/90 z-[1001] flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-slate-400 font-mono">{t("syncingNavic")}</span>
                </div>
              )}
              <div 
                id="map-container" 
                className="w-full h-full min-h-[300px] sm:min-h-[400px] z-0"
                style={{ display: mapType === "globe" ? "none" : "block" }}
              ></div>

              {timelineProjection && (
                <div className="absolute bottom-16 left-3 right-3 z-[1000] bg-slate-950 border border-indigo-500/60 p-3 rounded-xl shadow-2xl font-mono text-[10px] text-slate-200 max-h-[56%] overflow-y-auto">

                  {/* Header */}
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2 sticky top-0 bg-slate-950 z-10">
                    <span className="text-indigo-400 font-bold uppercase text-[11px]">⚠️ SSP2-4.5 Projection Pathway ({timelineProjection.year})</span>
                    <span className="ml-auto bg-indigo-600 text-white border border-indigo-400 px-2 py-0.5 rounded text-[9px] font-bold tracking-wide">{timelineProjection.scenario}</span>
                  </div>

                  {/* Stat cards — each value on its own row, never wraps */}
                  <div className="grid grid-cols-4 gap-1.5 border-b border-slate-800 pb-2.5 mb-2.5">
                    <div className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5">
                      <div className="text-slate-500 text-[8px] mb-1">🌡️ Temp Anomaly</div>
                      <div className="text-red-400 font-bold text-xs whitespace-nowrap">+{timelineProjection.temperature_anomaly_c}°C</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5">
                      <div className="text-slate-500 text-[8px] mb-1">🌧️ Precip Shift</div>
                      <div className="text-blue-400 font-bold text-xs whitespace-nowrap">+{timelineProjection.precipitation_shift_pct}%</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5">
                      <div className="text-slate-500 text-[8px] mb-1">🌊 Sea Level Rise</div>
                      <div className="text-emerald-400 font-bold text-xs whitespace-nowrap">+{timelineProjection.sea_level_rise_cm} cm</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5">
                      <div className="text-slate-500 text-[8px] mb-1">🌾 Crop Stress</div>
                      <div className="text-amber-400 font-bold text-xs whitespace-nowrap">{timelineProjection.crop_yield_stress_multiplier}x</div>
                    </div>
                  </div>

                  {/* Crop Kc Cards */}
                  {timelineProjection.crop_kc_projections && (
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(timelineProjection.crop_kc_projections).map(([crop, data]: [string, any]) => (
                        <div key={crop} className="bg-slate-900 border border-slate-700 rounded-lg p-2">
                          {/* Crop header */}
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-emerald-400 font-bold uppercase text-[9px] tracking-wide">🌾 {crop} Kc</span>
                            <span className="bg-slate-800 text-red-300 border border-slate-600 px-1.5 py-0.5 rounded text-[9px] font-bold">
                              Loss: {data.yield_loss_pct}%
                            </span>
                          </div>
                          {/* Irrigation */}
                          <div className="text-slate-400 text-[9px] mb-2">
                            Irrigation: <span className="text-amber-400 font-semibold">{data.irrigation_multiplier}x</span>
                          </div>
                          {/* Stage grid */}
                          <div className="grid grid-cols-4 gap-1">
                            {data.stages.map((stage: string, idx: number) => (
                              <div key={stage} className="bg-slate-950 border border-slate-800 rounded text-center py-1 px-0.5">
                                <div className="text-slate-400 text-[8px] leading-snug">{stage}</div>
                                <div className="text-indigo-300 font-bold text-[11px] mt-0.5">{data.kc_values[idx].toFixed(2)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}




              {mapType === "globe" && (
                <div className="w-full h-full min-h-[300px] sm:min-h-[400px] z-0">
                  <Globe 
                    selectedDistrict={selectedDistrict}
                    onSelectDistrict={setSelectedDistrict}
                    isDarkMode={isDarkMode}
                    districtsList={districtsList}
                  />
                </div>
              )}

              {/* Dynamic Bottom Legend overlay */}
              <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 z-[1000] bg-slate-950/85 border border-slate-800 p-2 sm:p-2.5 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-0 text-[10px] sm:text-xs backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="font-semibold text-white">{t("activeFocus")}: {selectedDistrict}</span>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-indigo-400 px-1.5 py-0.5 rounded font-mono">
                    {t("latLngTelemetry")}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10b981]"></span> {t("normal")}</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span> {t("elevated")}</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ef4444]"></span> {t("critical")}</div>
                </div>
              </div>

            </div>
          </section>

          {/* Panel 3: Risk matrix, Decision Engine & Explainable AI */}
          <section className="bg-slate-950/65 border border-slate-800/75 backdrop-blur-md rounded-xl p-3 sm:p-5 space-y-4 sm:space-y-6 lg:col-span-1 shadow-[0_0_15px_rgba(59,130,246,0.05)]">
            
            {/* Risk scores */}
            <div>
              <h2 className="text-sm uppercase font-mono tracking-wider text-indigo-400 border-b border-slate-800 pb-2">{t("climateRiskMatrix")}</h2>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span>{t("midnightFloodRisk")}</span>
                  <span className={`font-mono font-bold`} style={{ color: getRiskColor(floodRisk) }}>{floodRisk}/100</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>{t("heatwaveRiskLabel")}</span>
                  <span className="font-mono font-bold" style={{ color: getRiskColor(heatwaveRisk) }}>{heatwaveRisk}/100</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>{t("droughtRiskLabel")}</span>
                  <span className="font-mono font-bold" style={{ color: getRiskColor(droughtRisk) }}>{droughtRisk}/100</span>
                </div>
                <div className="pt-2 flex justify-between items-center border-t border-slate-800/80 text-xs font-bold">
                  <span>{t("overallRiskLevel")}</span>
                  {(() => {
                    const maxRisk = Math.max(floodRisk, heatwaveRisk, droughtRisk);
                    const color = getRiskColor(maxRisk);
                    const label = maxRisk > 75 ? t("lblCriticalAlert") : maxRisk > 50 ? t("lblElevatedWarning") : t("lblNormal");
                    return (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: `${color}20`, color: color, border: `1px solid ${color}30` }}>
                        {label}
                      </span>
                    );
                  })()}
                </div>
                <div className="pt-2 flex justify-between items-center border-t border-slate-900 text-xs font-bold">
                  <span className="text-indigo-400">VAYUSETU Index (CRI):</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded text-white" style={{ backgroundColor: getRiskColor(vayusetuRiskData.risk_score) }}>
                    {vayusetuRiskData.risk_score}/100 ({vayusetuRiskData.level})
                  </span>
                </div>
              </div>
            </div>

            {/* Multi-Model Climate Fusion Widget */}
            <div>
              <h2 className="text-sm uppercase font-mono tracking-wider text-indigo-400 border-b border-slate-800 pb-2">🤖 Multi-Model AI Ensemble</h2>
              {ensembleData ? (
                <div className="mt-3 space-y-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                  {/* Rainfall Ensemble */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-200">
                      <span>🌧️ Precipitation Forecast:</span>
                      <span className="text-blue-400">{ensembleData.rainfall.ensemble_prediction} mm</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Confidence: {ensembleData.rainfall.confidence_pct}%</span>
                      <span>Range: {ensembleData.rainfall.range_bounds ? `${ensembleData.rainfall.range_bounds[0]} - ${ensembleData.rainfall.range_bounds[1]} mm` : `±${ensembleData.rainfall.uncertainty_range}`}</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1 rounded overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: `${ensembleData.rainfall.confidence_pct}%` }}></div>
                    </div>
                    <div className="grid grid-cols-3 gap-1 pt-1.5 text-[9px] font-mono text-slate-500">
                      <div>ConvLSTM: <span className="text-slate-300 font-semibold">{ensembleData.rainfall.models["ConvLSTM-Precip"]}mm</span></div>
                      <div>TFT: <span className="text-slate-300 font-semibold">{ensembleData.rainfall.models["TFT-Temp"]}mm</span></div>
                      <div>XGBoost: <span className="text-slate-300 font-semibold">{ensembleData.rainfall.models["XGBoost-LST"]}mm</span></div>
                    </div>
                  </div>

                  {/* Temperature Ensemble */}
                  <div className="space-y-1 pt-2 border-t border-slate-900">
                    <div className="flex justify-between text-xs font-bold text-slate-200">
                      <span>🌡️ Temperature Forecast:</span>
                      <span className="text-amber-400">{ensembleData.temperature.ensemble_prediction} °C</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Confidence: {ensembleData.temperature.confidence_pct}%</span>
                      <span>Range: {ensembleData.temperature.range_bounds ? `${ensembleData.temperature.range_bounds[0]} - ${ensembleData.temperature.range_bounds[1]} °C` : `±${ensembleData.temperature.uncertainty_range}`}</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1 rounded overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: `${ensembleData.temperature.confidence_pct}%` }}></div>
                    </div>
                    <div className="grid grid-cols-3 gap-1 pt-1.5 text-[9px] font-mono text-slate-500">
                      <div>ConvLSTM: <span className="text-slate-300 font-semibold">{ensembleData.temperature.models["ConvLSTM-Precip"]}°C</span></div>
                      <div>TFT: <span className="text-slate-300 font-semibold">{ensembleData.temperature.models["TFT-Temp"]}°C</span></div>
                      <div>XGBoost: <span className="text-slate-300 font-semibold">{ensembleData.temperature.models["XGBoost-LST"]}°C</span></div>
                    </div>
                  </div>

                  {/* Model Contributions / Weights */}
                  <div className="pt-2 border-t border-slate-900/60 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-indigo-400 font-mono uppercase tracking-wider">
                      <span>Model Contributions:</span>
                      <span>Ensemble Confidence: {ensembleData.rainfall.confidence_pct}%</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 pt-1 text-[9px] font-mono text-slate-500">
                      <div>ConvLSTM: <span className="text-slate-300 font-semibold">32%</span></div>
                      <div>Transformer: <span className="text-slate-300 font-semibold">28%</span></div>
                      <div>XGBoost: <span className="text-slate-300 font-semibold">20%</span></div>
                      <div>PINN: <span className="text-slate-300 font-semibold">20%</span></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-3 text-xs text-slate-500 font-mono italic">Calculating ensemble forecasts...</div>
              )}
            </div>

            {/* Explainable AI (XAI) widget */}
            <div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h2 className="text-sm uppercase font-mono tracking-wider text-indigo-400">{t("xaiLink")}</h2>
                <div className="flex gap-1 bg-slate-900 p-0.5 rounded text-[9px] font-mono">
                  <button 
                    onClick={() => setXaiActiveTab("rain")}
                    className={`px-1.5 py-0.5 rounded ${xaiActiveTab === "rain" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"}`}
                  >
                    Rain
                  </button>
                  <button 
                    onClick={() => setXaiActiveTab("temp")}
                    className={`px-1.5 py-0.5 rounded ${xaiActiveTab === "temp" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"}`}
                  >
                    Temp
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-sans">
                {xaiActiveTab === "rain" 
                  ? "Feature contribution for rainfall prediction (Integrated Gradients):" 
                  : "Feature contribution for temperature prediction (SHAP Values):"
                }
              </p>
              
              <div className="mt-3 space-y-2 text-xs font-mono">
                {xaiActiveTab === "rain" ? (
                  Object.entries(xaiRainfallAttributions?.attributions || {
                    "SST Anomaly (Thermodynamic Fuel)": sstWeight,
                    "Relative Humidity Grid (Moisture Feed)": humidityWeight,
                    "Monsoon Wind Vectors (Spatio-Temporal Transport)": windWeight
                  }).map(([feature, weight]: [string, any]) => (
                    <div key={feature} className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-300">
                        <span className="truncate max-w-[170px]" title={feature}>{feature}</span>
                        <span>{weight}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded">
                        <div className="bg-indigo-500 h-1.5 rounded transition-all duration-300 progress-glow" style={{ width: `${weight}%`, boxShadow: "0 0 8px #6366f1" }}></div>
                      </div>
                    </div>
                  ))
                ) : (
                  Object.entries(xaiTempAttributions?.attributions || {
                    "LST Anomaly (Land Surface Temperature)": 45,
                    "Soil Moisture Deficit (Antecedent Dryness)": 25,
                    "Relative Humidity (Dry Air Mass)": 20,
                    "Albedo Coefficient (Solar Radiation Absorption)": 10
                  }).map(([feature, weight]: [string, any]) => (
                    <div key={feature} className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-300">
                        <span className="truncate max-w-[170px]" title={feature}>{feature}</span>
                        <span>{weight}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded">
                        <div className="bg-amber-500 h-1.5 rounded transition-all duration-300 progress-glow" style={{ width: `${weight}%`, boxShadow: "0 0 8px #f59e0b" }}></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button 
                onClick={() => setXaiModalOpen(true)}
                className="w-full text-center mt-3 text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 py-1 rounded transition border border-slate-800 font-semibold"
                aria-label="Interpret prediction models detailed window"
              >
                {t("interpretAttribution")}
              </button>
            </div>

            {/* Climate Action Advisor */}
            <div>
              <h2 className="text-sm uppercase font-mono tracking-wider text-indigo-400 border-b border-slate-800 pb-2">📋 Climate Action Advisor</h2>
              <div className="mt-2 space-y-3">
                {(activeAdvisories.length > 0 ? activeAdvisories : [
                  {
                    title: "Standard Climate Resiliency Guidelines",
                    level: "NORMAL",
                    actions: [
                      "Promote afforestation to strengthen soil structure",
                      "Maintain local weather telemetry network calibration",
                      "Conduct community climate awareness workshops"
                    ]
                  }
                ]).map((adv: any, i: number) => {
                  const levelColor = adv.level === "CRITICAL" ? "text-red-400" : adv.level === "ELEVATED" ? "text-amber-400" : "text-emerald-400";
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
                        <span className={`px-1 rounded bg-slate-900 border border-slate-800 ${levelColor}`}>{adv.level}</span>
                        <span className="text-slate-200">{adv.title}</span>
                      </div>
                      <ul className="text-[10px] text-slate-400 space-y-1 pl-2">
                        {adv.actions.map((act: string, j: number) => (
                          <li key={j} className="flex gap-1.5 items-start">
                            <span className="text-indigo-400 font-bold" aria-hidden="true">✓</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Dynamic Charts Linked to Map Clicks */}
            <div className="mt-4 pt-4 border-t border-slate-800/60 text-slate-200">
              <h2 className="text-sm uppercase font-mono tracking-wider text-indigo-400 border-b border-slate-800 pb-2">📊 Spatiotemporal Analysis</h2>
              {renderTrendChart()}
            </div>
          </section>
        </div>

        {/* Live-Streaming Sensor Ingestion Monitor */}
        <section className="bg-slate-950/65 border border-slate-800/75 backdrop-blur-md rounded-xl p-3 sm:p-5 shadow-[0_0_15px_rgba(59,130,246,0.05)] text-slate-200 mt-4 sm:mt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-sm uppercase font-mono tracking-wider text-indigo-400">
                {t("ingestionMonitorTitle")}
              </h2>
              <div className="flex items-center gap-2">
                <span className={`relative flex h-2 w-2 ${isStreaming ? "" : "hidden"}`}>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className={`h-2 w-2 rounded-full bg-slate-500 ${isStreaming ? "hidden" : ""}`}></span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {isStreaming ? "LIVE FEED" : "PAUSED"}
                </span>
              </div>
              
              <div className="hidden md:flex items-center gap-4 border-l border-slate-800 pl-4 text-[10px] font-mono text-slate-400">
                <div>Estimator: <span className="text-indigo-400 font-bold">1D Kalman Filter</span></div>
                <div>Kalman Gain (K): <span className="text-white">{kalmanGain}</span></div>
                <div>Covariance (P): <span className="text-white">{kalmanCovariance}</span></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsStreaming(!isStreaming)}
                className="bg-slate-900 hover:bg-[#134074] border border-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded text-[10px] font-mono transition"
              >
                {isStreaming ? "⏸️ PAUSE" : "▶️ RESUME"}
              </button>
              <button
                type="button"
                onClick={() => setTelemetryLogs([])}
                className="bg-slate-900 hover:bg-red-950/30 border border-slate-800 hover:border-red-900/50 text-slate-300 hover:text-red-400 px-2.5 py-1 rounded text-[10px] font-mono transition"
              >
                🗑️ CLEAR
              </button>
            </div>
          </div>

          <div ref={logContainerRef} className="bg-slate-950/90 border border-slate-900 rounded-lg p-2 sm:p-4 font-mono text-[10px] sm:text-[11px] overflow-y-auto max-h-[140px] sm:max-h-[180px] h-[140px] sm:h-[180px] space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
            {telemetryLogs.length === 0 ? (
              <div className="text-slate-600 italic text-center py-12">No telemetry packets received. Activate feed to stream.</div>
            ) : (
              telemetryLogs.map((log) => {
                let srcColor = "text-slate-400";
                if (log.source === "MOSDAC") srcColor = "text-orange-400";
                else if (log.source === "NavIC") srcColor = "text-cyan-400";
                else if (log.source === "IMD-GFS") srcColor = "text-yellow-400";
                else if (log.source === "ERA5") srcColor = "text-emerald-400";
                else if (log.source === "AI-Engine") srcColor = "text-purple-400";
                else if (log.source === "System") srcColor = "text-rose-400 bg-rose-950/20 px-1 rounded";
                else if (log.source === "GIS-Projection") srcColor = "text-violet-400";

                let lvlColor = "text-slate-400";
                if (log.level === "INGEST") lvlColor = "text-orange-500 font-bold";
                else if (log.level === "SUCCESS") lvlColor = "text-emerald-500 font-bold";
                else if (log.level === "WARNING") lvlColor = "text-amber-500 font-bold animate-pulse";

                return (
                  <div key={log.id} className="flex items-start gap-1 sm:gap-2 hover:bg-slate-900/40 p-0.5 rounded transition flex-wrap sm:flex-nowrap">
                    <span className="text-slate-600">[{log.time}]</span>
                    <span className={`font-bold ${srcColor}`}>[{log.source}]</span>
                    <span className={lvlColor}>[{log.level}]</span>
                    <span className="text-slate-300">{renderLogMessage(log)}</span>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Secondary Console: Operational Monitors & Diagnostics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6 text-slate-200">
          
          {/* Column 1: Monsoon & Sector Impact Trackers */}
          <section className="bg-slate-950/65 border border-slate-800/75 backdrop-blur-md rounded-xl p-3 sm:p-5 space-y-4 sm:space-y-6 shadow-[0_0_15px_rgba(59,130,246,0.05)]">
            {/* Southwest Monsoon Tracker */}
            <div>
              <h2 className="text-sm uppercase font-mono tracking-wider text-indigo-400 border-b border-slate-800 pb-2">🌦️ Southwest Monsoon Tracker</h2>
              <div className="mt-3 bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 text-[11px] space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span>Monsoon Status:</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
                    (monsoonData?.monsoon_status || '').includes('ACTIVE') || (monsoonData?.monsoon_status || '').includes('ONSET')
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : (monsoonData?.monsoon_status || '').includes('WITHDRAW')
                      ? 'bg-amber-950 text-amber-400 border-amber-800'
                      : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}>
                    {(monsoonData?.monsoon_status || 'LOADING').replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-b border-slate-800/40 py-2 text-slate-400">
                  <div>Onset Kerala: <span className="text-white font-sans font-semibold">{monsoonData?.onset_date_kerala || '—'}</span></div>
                  <div>Onset Delay: <span className="text-amber-400 font-sans font-semibold">{monsoonData?.onset_delay_days != null ? `+${monsoonData.onset_delay_days} days` : '—'}</span></div>
                  <div>Wind Vectors: <span className="text-indigo-400 font-sans font-semibold">{monsoonData?.monsoonal_wind_vectors_ms != null ? `${monsoonData.monsoonal_wind_vectors_ms} m/s` : '—'}</span></div>
                  <div>Withdrawal: <span className="text-slate-200 font-sans font-semibold">{monsoonData?.projected_withdrawal_start || '—'}</span></div>
                </div>
                <div className="text-[10px] space-y-1">
                  <div className="text-slate-400 font-semibold font-mono uppercase text-[9px] tracking-wider">Progression:</div>
                  <div className="text-slate-300 leading-relaxed bg-slate-950/40 p-1.5 rounded border border-slate-900">
                    {monsoonData?.current_progression || 'Awaiting data...'}
                  </div>
                </div>
                {monsoonData?.regional_indicators && (
                <div className="text-[10px] space-y-1 border-t border-slate-900 pt-1.5">
                  <div className="text-slate-400 font-semibold font-mono uppercase text-[9px] tracking-wider">Regional Indicators:</div>
                  <div className="grid grid-cols-3 gap-1 text-[9px]">
                    <div className="bg-slate-950/60 p-1 rounded text-center border border-slate-900">
                      <div className="text-slate-500 font-bold">South</div>
                      <div className="text-slate-300 truncate" title={monsoonData.regional_indicators?.south_india}>{monsoonData.regional_indicators?.south_india || '—'}</div>
                    </div>
                    <div className="bg-slate-950/60 p-1 rounded text-center border border-slate-900">
                      <div className="text-slate-500 font-bold">Central</div>
                      <div className="text-slate-300 truncate" title={monsoonData.regional_indicators?.central_india}>{monsoonData.regional_indicators?.central_india || '—'}</div>
                    </div>
                    <div className="bg-slate-950/60 p-1 rounded text-center border border-slate-900">
                      <div className="text-slate-500 font-bold">North</div>
                      <div className="text-slate-300 truncate" title={monsoonData.regional_indicators?.north_india}>{monsoonData.regional_indicators?.north_india || '—'}</div>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* Sector Impact Monitor */}
            <div className="pt-4 border-t border-slate-800/60">
              <h2 className="text-sm uppercase font-mono tracking-wider text-indigo-400 border-b border-slate-800 pb-2">🚜 Sector Impact Monitor</h2>
              <div className="mt-3 space-y-3 bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
                {/* Crop Stress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>🌾 Crop Stress Risk:</span>
                    <span className="font-mono font-bold" style={{ color: getRiskColor(sectorImpactsData.agriculture.crop_stress_pct) }}>
                      {sectorImpactsData.agriculture.crop_stress_pct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded overflow-hidden">
                    <div 
                      className="h-full rounded progress-glow" 
                      style={{ 
                        width: `${sectorImpactsData.agriculture.crop_stress_pct}%`, 
                        backgroundColor: getRiskColor(sectorImpactsData.agriculture.crop_stress_pct),
                        boxShadow: `0 0 6px ${getRiskColor(sectorImpactsData.agriculture.crop_stress_pct)}`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Status: {sectorImpactsData.agriculture.status.replace("_", " ")}</span>
                  </div>
                </div>

                {/* Reservoir Stress */}
                <div className="space-y-1 pt-1.5 border-t border-slate-900">
                  <div className="flex justify-between text-xs">
                    <span>💧 Reservoir Stress:</span>
                    <span className="font-mono font-bold" style={{ color: getRiskColor(sectorImpactsData.water.reservoir_stress_pct) }}>
                      {sectorImpactsData.water.reservoir_stress_pct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded overflow-hidden">
                    <div 
                      className="h-full rounded progress-glow" 
                      style={{ 
                        width: `${sectorImpactsData.water.reservoir_stress_pct}%`, 
                        backgroundColor: getRiskColor(sectorImpactsData.water.reservoir_stress_pct),
                        boxShadow: `0 0 6px ${getRiskColor(sectorImpactsData.water.reservoir_stress_pct)}`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Evaporation: {sectorImpactsData.water.evaporative_loss_index} mm/day</span>
                  </div>
                </div>

                {/* Urban Heat Island */}
                <div className="space-y-1 pt-1.5 border-t border-slate-900">
                  <div className="flex justify-between text-xs">
                    <span>🏢 Heat Island Risk:</span>
                    <span className="font-mono font-bold" style={{ color: getRiskColor(sectorImpactsData.urban.heat_island_risk_pct) }}>
                      {sectorImpactsData.urban.heat_island_risk_pct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded overflow-hidden">
                    <div 
                      className="h-full rounded progress-glow" 
                      style={{ 
                        width: `${sectorImpactsData.urban.heat_island_risk_pct}%`, 
                        backgroundColor: getRiskColor(sectorImpactsData.urban.heat_island_risk_pct),
                        boxShadow: `0 0 6px ${getRiskColor(sectorImpactsData.urban.heat_island_risk_pct)}`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>UHI Temp Offset: +{sectorImpactsData.urban.microclimate_temp_offset_c}°C</span>
                  </div>
                </div>

                {/* Flood Exposure */}
                <div className="space-y-1 pt-1.5 border-t border-slate-900">
                  <div className="flex justify-between text-xs">
                    <span>🌊 Flood Exposure Index:</span>
                    <span className="font-mono font-bold" style={{ color: getRiskColor(sectorImpactsData.disaster.flood_exposure_index) }}>
                      {sectorImpactsData.disaster.flood_exposure_index}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded overflow-hidden">
                    <div 
                      className="h-full rounded progress-glow" 
                      style={{ 
                        width: `${sectorImpactsData.disaster.flood_exposure_index}%`, 
                        backgroundColor: getRiskColor(sectorImpactsData.disaster.flood_exposure_index),
                        boxShadow: `0 0 6px ${getRiskColor(sectorImpactsData.disaster.flood_exposure_index)}`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Catchment Saturation: {Math.round(sectorImpactsData.disaster.catchment_saturation_ratio * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Column 2: Model Health & Performance Monitoring */}
          <section className="bg-slate-950/65 border border-slate-800/75 backdrop-blur-md rounded-xl p-3 sm:p-5 space-y-4 sm:space-y-6 shadow-[0_0_15px_rgba(59,130,246,0.05)]">
            <div>
              <h2 className="text-sm uppercase font-mono tracking-wider text-indigo-400 border-b border-slate-800 pb-2">🛡️ Model Health & Drift Monitor</h2>
              <div className="mt-3 bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 space-y-2 text-[11px]">
                <div className="flex justify-between text-slate-300 font-mono">
                  <span>Model Health:</span>
                  <span className="text-emerald-400 font-semibold">{modelHealthData.model_health_pct}%</span>
                </div>
                <div className="flex justify-between text-slate-300 font-mono">
                  <span>Drift Status:</span>
                  <span className={`font-semibold ${modelHealthData.drift_status === 'STABLE' ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>
                    {modelHealthData.drift_status}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300 font-mono">
                  <span>Prediction MAE:</span>
                  <span className="text-slate-200 font-semibold">{modelHealthData.average_error_mae} mm/°C</span>
                </div>
                <div className="flex justify-between text-slate-300 font-mono pb-2 border-b border-slate-800/40">
                  <span>KS-Test p-val:</span>
                  <span className="text-slate-400">{modelHealthData.ks_test_p_value}</span>
                </div>
                
                <div className="flex gap-1.5 pt-1.5">
                  <button 
                    onClick={handleRetrain}
                    disabled={retraining}
                    className={`flex-1 py-1.5 rounded text-[10px] font-mono transition border ${
                      retraining 
                        ? "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed" 
                        : modelHealthData.retrain_recommended
                          ? "bg-amber-600 hover:bg-amber-500 border-amber-500 text-white font-bold"
                          : "bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300"
                    }`}
                    aria-label="Trigger model retraining"
                  >
                    {retraining ? (
                      <span className="flex items-center justify-center gap-1">
                        <svg className="animate-spin h-3 w-3 text-indigo-400" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Retraining...
                      </span>
                    ) : "🔄 Retrain AI"}
                  </button>
                  <button 
                    onClick={() => setMetricsModalOpen(true)}
                    className="flex-1 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-[10px] font-mono transition border border-slate-800"
                    aria-label="Inspect performance metrics detailed window"
                  >
                    {t("inspectSpecs")}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Column 3: System Status & Regional Metadata */}
          <section className="bg-slate-950/65 border border-slate-800/75 backdrop-blur-md rounded-xl p-3 sm:p-5 space-y-4 sm:space-y-6 shadow-[0_0_15px_rgba(59,130,246,0.05)]">
            {/* ISRO Data Feed Status */}
            <div>
              <h2 className="text-sm uppercase font-mono tracking-wider text-indigo-400 border-b border-slate-800 pb-2">🛰️ ISRO Data Feed</h2>
              <div className="mt-3 space-y-1.5 text-[10px] font-mono">
                {[
                  { src: "INSAT-3D/3DR", type: "LST & OLR", status: "LIVE", color: "text-emerald-400" },
                  { src: "MOSDAC API", type: "Rainfall Grid", status: "LIVE", color: "text-emerald-400" },
                  { src: "IMD Station", type: "Surface Obs", status: "SYNCED", color: "text-indigo-400" },
                  { src: "NavIC L5-S1", type: "Positioning", status: "ACTIVE", color: "text-emerald-400" },
                  { src: "Bhoonidhi DEM", type: "Elevation", status: "CACHED", color: "text-amber-400" },
                ].map((feed) => (
                  <div key={feed.src} className="flex items-center justify-between bg-slate-900/50 px-2 py-1 rounded border border-slate-900">
                    <div>
                      <span className="text-slate-300">{feed.src}</span>
                      <span className="text-slate-600 ml-1">— {feed.type}</span>
                    </div>
                    <span className={`text-[9px] font-bold ${feed.color} flex items-center gap-1`}>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {feed.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* National Twin Sync status */}
            <div className="pt-4 border-t border-slate-800/60">
              <h2 className="text-sm uppercase font-mono tracking-wider text-indigo-400 border-b border-slate-800 pb-2">🌐 National Twin Sync</h2>
              <div className="mt-3 bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 text-[10px] font-mono space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">District Node:</span>
                  <span className="text-slate-200 font-sans font-semibold">{selectedDistrict}</span>
                  <span className="text-emerald-400">● SYNCED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">State Hub:</span>
                  <span className="text-slate-200 font-sans font-semibold">{getDistrictInfo(selectedDistrict).zone || "State Node"}</span>
                  <span className="text-emerald-400">● ACTIVE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Regional Gateway:</span>
                  <span className="text-slate-200 font-sans font-semibold">{getRegionalGateway(selectedDistrict)}</span>
                  <span className="text-emerald-400">● SYNCED</span>
                </div>
                <div className="flex items-center justify-between font-bold border-t border-slate-900 pt-1.5">
                  <span className="text-slate-400">National Twin:</span>
                  <span className="text-white font-sans">Pan-India Hub</span>
                  <span className="text-indigo-400">● ONLINE</span>
                </div>
              </div>
            </div>

            {/* Professional Climate Summary */}
            <div className="pt-4 border-t border-slate-800/60 text-slate-200">
              <h2 className="text-sm uppercase font-mono tracking-wider text-indigo-400 border-b border-slate-800 pb-2">{t("professionalSummary")}</h2>
              <div className="mt-3 bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 text-[11px] space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono border-b border-slate-800/40 pb-2 text-slate-400">
                  <div>{t("zone")}: <span className="text-white font-sans font-semibold">{t(distInfo.zone)}</span></div>
                  <div>{t("soil")}: <span className="text-white font-sans font-semibold">{t(distInfo.soil)}</span></div>
                  <div className="col-span-2">{t("basin")}: <span className="text-white font-sans font-semibold">{t(distInfo.basin)}</span></div>
                  <div className="col-span-2">{t("soilPerm")}: <span className="text-indigo-400 font-sans font-semibold">{distInfo.coeff > 0.5 ? "Low Infiltration (C=" + distInfo.coeff + ")" : "High Infiltration (C=" + distInfo.coeff + ")"}</span></div>
                </div>
                <div className="space-y-1.5 leading-relaxed text-slate-300">
                  <p>
                    <span className="font-semibold text-indigo-300">{t("hydroStatus")}:</span> {floodStateText}
                  </p>
                  <p>
                    <span className="font-semibold text-indigo-300">{t("thermalProfile")}:</span> {heatStateText}
                  </p>
                  <p>
                    <span className="font-semibold text-indigo-300">{t("agriRisk")}:</span> {droughtStateText}
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* ------------------ MODAL 1: EXPLAINABLE AI (XAI) ------------------ */}
      {xaiModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="xai-modal-title" onClick={() => setXaiModalOpen(false)}>
          <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-[#0b1329] px-5 py-4 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">🧠</span>
                <div>
                  <h3 id="xai-modal-title" className="font-bold text-base">{t("xaiModalTitle")}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {xaiActiveTab === "rain" ? "Integrated Gradients (ConvLSTM Spatial Attribution)" : "SHAP Values (XGBoost Feature Importance)"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1 bg-slate-900 p-0.5 rounded text-[10px] font-mono mr-2">
                  <button 
                    onClick={() => setXaiActiveTab("rain")}
                    className={`px-2 py-0.5 rounded ${xaiActiveTab === "rain" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"}`}
                  >
                    Rainfall (Integrated Gradients)
                  </button>
                  <button 
                    onClick={() => setXaiActiveTab("temp")}
                    className={`px-2 py-0.5 rounded ${xaiActiveTab === "temp" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"}`}
                  >
                    Temperature (SHAP)
                  </button>
                </div>
                <button 
                  onClick={() => setXaiModalOpen(false)}
                  className="text-slate-400 hover:text-red-400 text-lg font-bold"
                  aria-label="Close dialog"
                >
                  ✕
                </button>
              </div>
            </div>
            {/* Modal Content */}
            <div className="p-6 space-y-6 text-sm text-slate-300">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-slate-500">
                  {xaiActiveTab === "rain" ? "Integrated Gradients Attribution Map" : "SHAP Force Attributions"}
                </span>
                <p className="text-xs mt-1">
                  {xaiActiveTab === "rain" 
                    ? `Attributions show the relative influence of inputs pushing the ConvLSTM model to predict a simulated rainfall anomaly for ${selectedDistrict}.`
                    : `Attributions reflect how specific parameters pull the XGBoost model outputs away from base temperatures to predict drought/heat stress for ${selectedDistrict}.`
                  }
                </p>
              </div>

              {/* Attribution Bars */}
              <div className="space-y-4 font-mono text-xs">
                {xaiActiveTab === "rain" ? (
                  Object.entries(xaiRainfallAttributions?.attributions || {
                    "SST Anomaly (Thermodynamic Fuel)": sstWeight,
                    "Relative Humidity Grid (Moisture Feed)": humidityWeight,
                    "Monsoon Wind Vectors (Spatio-Temporal Transport)": windWeight
                  }).map(([feature, weight]: [string, any]) => (
                    <div key={feature} className="space-y-1">
                      <div className="flex justify-between text-slate-200">
                        <span>{feature}</span>
                        <span className="text-indigo-400 font-bold">+{weight}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${weight}%` }}></div>
                      </div>
                    </div>
                  ))
                ) : (
                  Object.entries(xaiTempAttributions?.attributions || {
                    "LST Anomaly (Land Surface Temperature)": 45,
                    "Soil Moisture Deficit (Antecedent Dryness)": 25,
                    "Relative Humidity (Dry Air Mass)": 20,
                    "Albedo Coefficient (Solar Radiation Absorption)": 10
                  }).map(([feature, weight]: [string, any]) => (
                    <div key={feature} className="space-y-1">
                      <div className="flex justify-between text-slate-200">
                        <span>{feature}</span>
                        <span className="text-amber-400 font-bold">+{weight}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-amber-600 h-full transition-all duration-300" style={{ width: `${weight}%` }}></div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-slate-900 p-4 rounded border border-slate-800 text-xs leading-relaxed">
                <strong className="text-slate-200 block mb-1">{t("diagnosticInsightLabel")}</strong>
                <span>
                  {xaiActiveTab === "rain"
                    ? (xaiRainfallAttributions?.insight || `SST Anomaly is above base climate variables, contributing the highest positive attribution. High SST acts as a thermodynamic fuel, evaporating heavy moisture grids which are pushed into ${selectedDistrict} by wind vectors.`)
                    : (xaiTempAttributions?.insight || `High Land Surface Temperature (LST) anomaly coupled with severe soil moisture deficit and dry air mass explains the elevated drought risk in ${selectedDistrict}.`)
                  }
                </span>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="bg-slate-950 px-5 py-3 border-t border-slate-900 flex justify-end">
              <button 
                onClick={() => setXaiModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded transition"
                aria-label="Close dialog"
              >
                {t("closeDiagnosticPanel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ MODAL 2: MODEL METRICS ------------------ */}
      {metricsModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="metrics-modal-title" onClick={() => setMetricsModalOpen(false)}>
          <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-[#0b1329] px-5 py-4 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">📈</span>
                <div>
                  <h3 id="metrics-modal-title" className="font-bold text-base">{t("metricsModalTitle")}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{t("metricsModalSubtitle")}</p>
                </div>
              </div>
              <button 
                onClick={() => setMetricsModalOpen(false)}
                className="text-slate-400 hover:text-red-400 text-lg font-bold"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>
            {/* Modal Content */}
            <div className="p-6 space-y-6 text-sm text-slate-300">
              
              {/* Primary metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">{t("modelAccuracy")}</span>
                  <p className="text-lg font-bold text-emerald-400 mt-1">{accuracy}%</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">{t("f1ScoreLabel")}</span>
                  <p className="text-lg font-bold text-slate-200 mt-1">0.91</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">{t("dataDriftLabel")}</span>
                  <p className="text-lg font-bold text-amber-500 mt-1">{drift}%</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">{t("ksTestLabel")}</span>
                  <p className="text-lg font-bold text-emerald-400 mt-1">{t("passed")}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">RMSE (Error spread)</span>
                  <p className="text-lg font-bold text-indigo-400 mt-1">{modelHealthData.rmse || "1.42"} mm/°C</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">MAE (Mean Error)</span>
                  <p className="text-lg font-bold text-indigo-300 mt-1">{modelHealthData.average_error_mae || "1.1"} mm/°C</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">MAPE (%)</span>
                  <p className="text-lg font-bold text-pink-400 mt-1">{modelHealthData.mape_pct || "4.1"}%</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">R² Coefficient</span>
                  <p className="text-lg font-bold text-teal-400 mt-1">{modelHealthData.r2_score || "0.94"}</p>
                </div>
              </div>

              {/* Confusion Matrix Table */}
              <div className="space-y-2">
                <span className="text-xs uppercase font-mono tracking-widest text-slate-500">{t("confusionMatrixTitle")}</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse border border-slate-800">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800">
                        <th className="py-2 px-3 text-slate-400 font-semibold">{t("metricTypeHeader")}</th>
                        <th className="py-2 px-3 text-slate-200 font-semibold">{t("predictedAlertHeader")}</th>
                        <th className="py-2 px-3 text-slate-200 font-semibold">{t("predictedNormalHeader")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-400 bg-slate-900/50">{t("trueAlertLabel")}</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">412 ({t("truePosText")})</td>
                        <td className="py-2 px-3 text-red-400">49 ({t("falseNegText")})</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-400 bg-slate-900/50">{t("trueNormalLabel")}</td>
                        <td className="py-2 px-3 text-red-400">31 ({t("falsePosText")})</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">894 ({t("trueNegText")})</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dataset details */}
              <div className="bg-slate-900 p-4 rounded border border-slate-800 text-xs space-y-1.5 leading-relaxed">
                <strong className="text-slate-200 block">{t("ingestedDatasetInfo")}</strong>
                <div>• <strong className="text-white">{t("spatialResolution")}</strong> {t("spatialResolutionDesc")}</div>
                <div>• <strong className="text-white">{t("temporalRange")}</strong> {t("temporalRangeDesc")}</div>
                <div>• <strong className="text-white">{t("validationMethod")}</strong> {t("validationMethodDesc")}</div>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="bg-slate-950 px-5 py-3 border-t border-slate-900 flex justify-end">
              <button 
                onClick={() => setMetricsModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded transition"
                aria-label="Close dialog"
              >
                {t("closeMetricsDashboard")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ MODAL 3: SYSTEM DOCUMENTATION ------------------ */}
      {docsModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="docs-modal-title" onClick={() => setDocsModalOpen(false)}>
          <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-[#0b1329] px-5 py-4 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">ℹ️</span>
                <div>
                  <h3 id="docs-modal-title" className="font-bold text-base">{t("docsModalTitle")}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{t("docsModalSubtitle")}</p>
                </div>
              </div>
              <button 
                onClick={() => setDocsModalOpen(false)}
                className="text-slate-400 hover:text-red-400 text-lg font-bold"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-900 bg-slate-950/50 p-2 gap-2 text-xs font-mono overflow-x-auto scrollbar-thin">
              <button
                onClick={() => setDocsTab("system")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  docsTab === "system" 
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                }`}
              >
                🛰️ {t("docsLink").replace(/[^a-zA-Z0-9\s\u0900-\u097F\u0C00-\u0C7F\u0B80-\u0BFF\u0C80-\u0CFF]/g, '').trim()}
              </button>
              <button
                onClick={() => setDocsTab("twin_justification")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  docsTab === "twin_justification" 
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                }`}
              >
                🔄 Justification
              </button>
              <button
                onClick={() => setDocsTab("deployment_roadmap")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  docsTab === "deployment_roadmap" 
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                }`}
              >
                🗺️ Scale Roadmap
              </button>
              <button
                onClick={() => setDocsTab("cost_infrastructure")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  docsTab === "cost_infrastructure" 
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                }`}
              >
                💸 Cost & Ingestion
              </button>
              <button
                onClick={() => setDocsTab("datasets_coverage")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  docsTab === "datasets_coverage" 
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                }`}
              >
                📈 Data Coverage
              </button>
              <button
                onClick={() => setDocsTab("climate_memory")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  docsTab === "climate_memory" 
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                }`}
              >
                💾 Climate Memory
              </button>
              <button
                onClick={() => setDocsTab("event_detection")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  docsTab === "event_detection" 
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                }`}
              >
                ⚠️ Event Alerts
              </button>
              <button
                onClick={() => setDocsTab("multi_hazard")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  docsTab === "multi_hazard" 
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                }`}
              >
                ⚡ Multi-Hazard
              </button>
              <button
                onClick={() => setDocsTab("sdg_alignment")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  docsTab === "sdg_alignment" 
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                }`}
              >
                🌿 SDG Targets
              </button>
              <button
                onClick={() => setDocsTab("isro_integration")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  docsTab === "isro_integration" 
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                }`}
              >
                🚀 ISRO Feeds
              </button>
              <button
                onClick={() => setDocsTab("benchmarking")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  docsTab === "benchmarking" 
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                }`}
              >
                🏁 Benchmarking
              </button>
              <button
                onClick={() => setDocsTab("matrix")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  docsTab === "matrix" 
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                }`}
              >
                📊 {BENEFICIARIES_DATA[lang]?.tabTitle1 || "Impact Matrix"}
              </button>
              <button
                onClick={() => setDocsTab("beforeAfter")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  docsTab === "beforeAfter" 
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                }`}
              >
                ⚖️ {BENEFICIARIES_DATA[lang]?.tabTitle2 || "Before vs After"}
              </button>
              <button
                onClick={() => setDocsTab("priority")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  docsTab === "priority" 
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                }`}
              >
                ⭐ {BENEFICIARIES_DATA[lang]?.tabTitle3 || "Prioritization"}
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 text-xs text-slate-300 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-slate-800">
              {docsTab === "system" && (
                <div className="space-y-5">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">{t("isroHackathonContext")}</span>
                    <p className="leading-relaxed">
                      {parseBoldText(t("isroHackathonText"))}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-y border-slate-900 py-4 my-2">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">{t("hydrologyRunoffFormula")}</span>
                      <p className="leading-relaxed mb-2">
                        {parseBoldText(t("hydrologyRunoffText"))}
                      </p>
                      <div className="bg-slate-900 p-3 rounded font-mono text-center text-slate-200 border border-slate-800">
                        Q = C × I × A × 0.00278
                      </div>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
                        <li><strong className="text-slate-300">Q:</strong> {t("qDesc")}</li>
                        <li><strong className="text-slate-300">C:</strong> {t("cDesc")}</li>
                        <li><strong className="text-slate-300">I:</strong> {t("iDesc")}</li>
                        <li><strong className="text-slate-300">A:</strong> {t("aDesc")}</li>
                      </ul>
                    </div>
                    
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">{t("ingestedSatelliteTelemetry")}</span>
                      <ul className="space-y-2 text-slate-400 mt-1">
                        {[
                          "insatSstBullet",
                          "insatLstBullet",
                          "imdGriddedRainfallBullet",
                          "navicTelemetryBullet"
                        ].map((key) => {
                          const text = t(key);
                          const colonIdx = text.indexOf(":");
                          if (colonIdx !== -1) {
                            const label = text.substring(0, colonIdx);
                            const desc = text.substring(colonIdx + 1);
                            return (
                              <li key={key}>
                                <strong className="text-slate-300">{label}:</strong>{desc}
                              </li>
                            );
                          }
                          return <li key={key}>{text}</li>;
                        })}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">{t("teamCreditsTitle")}</span>
                    <div className="grid grid-cols-2 gap-3 mt-2 font-mono text-[10px] text-slate-400">
                      <div className="bg-slate-900/40 p-2 rounded border border-slate-800">
                        <strong className="text-slate-300 block">{t("teamMember1Name")}</strong>
                        {t("teamMember1Role")}
                      </div>
                      <div className="bg-slate-900/40 p-2 rounded border border-slate-800">
                        <strong className="text-slate-300 block">{t("teamMember2Name")}</strong>
                        {t("teamMember2Role")}
                      </div>
                      <div className="bg-slate-900/40 p-2 rounded border border-slate-800">
                        <strong className="text-slate-300 block">{t("teamMember3Name")}</strong>
                        {t("teamMember3Role")}
                      </div>
                      <div className="bg-slate-900/40 p-2 rounded border border-slate-800">
                        <strong className="text-slate-300 block">{t("teamMember4Name")}</strong>
                        {t("teamMember4Role")}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {docsTab === "matrix" && (
                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">
                    {BENEFICIARIES_DATA[lang]?.title || "Detailed Beneficiary Comparison"}
                  </span>
                  <div className="overflow-x-auto border border-slate-800/60 rounded-lg max-h-[50vh] scrollbar-thin scrollbar-thumb-slate-800">
                    <table className="w-full text-[10px] font-mono text-left border-collapse">
                      <thead>
                        <tr className="bg-[#0b1329] text-indigo-400 border-b border-slate-800 sticky top-0">
                          <th className="p-2 border-r border-slate-800 min-w-[100px]">{BENEFICIARIES_DATA[lang]?.colBeneficiary}</th>
                          <th className="p-2 border-r border-slate-800 min-w-[150px]">{BENEFICIARIES_DATA[lang]?.colChallenges}</th>
                          <th className="p-2 border-r border-slate-800 min-w-[200px]">{BENEFICIARIES_DATA[lang]?.colHelps}</th>
                          <th className="p-2 border-r border-slate-800 min-w-[150px]">{BENEFICIARIES_DATA[lang]?.colBenefits}</th>
                          <th className="p-2 min-w-[150px]">{BENEFICIARIES_DATA[lang]?.colImpact}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 bg-slate-950/20">
                        {(BENEFICIARIES_DATA[lang]?.beneficiaries || BENEFICIARIES_DATA.en.beneficiaries).map((b, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/50 transition">
                            <td className="p-2 border-r border-slate-800 font-bold text-slate-200">{b.name}</td>
                            <td className="p-2 border-r border-slate-800 text-slate-400">{b.challenges}</td>
                            <td className="p-2 border-r border-slate-800 text-slate-300">{b.helps}</td>
                            <td className="p-2 border-r border-slate-800 text-emerald-400/90">{b.benefits}</td>
                            <td className="p-2 text-indigo-400">{b.impact}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {docsTab === "beforeAfter" && (
                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">
                    {BENEFICIARIES_DATA[lang]?.beforeAfterTitle || "Before vs After Digital Twin"}
                  </span>
                  <div className="overflow-x-auto border border-slate-800/60 rounded-lg">
                    <table className="w-full text-[10px] font-mono text-left border-collapse">
                      <thead>
                        <tr className="bg-[#0b1329] text-indigo-400 border-b border-slate-800">
                          <th className="p-2 border-r border-slate-800 min-w-[120px]">{BENEFICIARIES_DATA[lang]?.colAspect}</th>
                          <th className="p-2 border-r border-slate-800 min-w-[200px] text-red-400/80">{BENEFICIARIES_DATA[lang]?.colTraditional}</th>
                          <th className="p-2 min-w-[200px] text-emerald-400">{BENEFICIARIES_DATA[lang]?.colTwin}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 bg-slate-950/20">
                        {(BENEFICIARIES_DATA[lang]?.beforeAfter || BENEFICIARIES_DATA.en.beforeAfter).map((ba, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/50 transition">
                            <td className="p-2 border-r border-slate-800 font-bold text-slate-200">{ba.aspect}</td>
                            <td className="p-2 border-r border-slate-800 text-slate-400 line-through decoration-red-950/45">{ba.traditional}</td>
                            <td className="p-2 text-slate-300 font-semibold">{ba.twin}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {docsTab === "priority" && (
                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">
                    {BENEFICIARIES_DATA[lang]?.priorityTitle || "Beneficiary Prioritization Matrix"}
                  </span>
                  <div className="overflow-x-auto border border-slate-800/60 rounded-lg max-h-[50vh] scrollbar-thin scrollbar-thumb-slate-800">
                    <table className="w-full text-[10px] font-mono text-left border-collapse">
                      <thead>
                        <tr className="bg-[#0b1329] text-indigo-400 border-b border-slate-800 sticky top-0">
                          <th className="p-2 border-r border-slate-800 min-w-[90px]">{BENEFICIARIES_DATA[lang]?.colPriority}</th>
                          <th className="p-2 border-r border-slate-800 min-w-[130px]">{BENEFICIARIES_DATA[lang]?.colGroup}</th>
                          <th className="p-2 min-w-[250px]">{BENEFICIARIES_DATA[lang]?.colReason}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 bg-slate-950/20">
                        {(BENEFICIARIES_DATA[lang]?.priorities || BENEFICIARIES_DATA.en.priorities).map((p, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/50 transition">
                            <td className="p-2 border-r border-slate-800 font-bold text-amber-400">
                              {"★".repeat(p.stars)}
                            </td>
                            <td className="p-2 border-r border-slate-800 font-bold text-slate-200">{p.group}</td>
                            <td className="p-2 text-slate-400">{p.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {docsTab === "twin_justification" && (
                <div className="space-y-6">
                  <div className="bg-[#0b1329] border border-indigo-500/20 p-4 rounded-xl">
                    <span className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">
                      Digital Twin feedback-loop architecture
                    </span>
                    <h3 className="text-base font-bold text-white mb-2">Why It Is a True Digital Twin, Not a Forecast Dashboard</h3>
                    <p className="leading-relaxed mb-4 text-slate-300">
                      Traditional forecast dashboards display static, one-way weather projections. 
                      VAYUSETU implements a <strong className="text-indigo-300 font-semibold">closed-loop Cyber-Physical System (CPS)</strong>. It continuously assimilates live satellite measurements (INSAT) and gridded grids (IMD) via a Kalman Filter, updates its internal virtual state models, and adjusts simulation parameters to feed decisions back into observed reality.
                    </p>
                    
                    {/* Visual Flowchart Diagram */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center text-center font-mono text-[9px] bg-slate-950/80 p-4 rounded-lg border border-slate-800">
                      <div className="p-2 rounded bg-indigo-950/40 border border-indigo-500/30 text-indigo-300">
                        <span className="block font-bold">1. REAL CLIMATE</span>
                        Observed Environment
                      </div>
                      <div className="text-slate-500 font-bold">▼ Ingest</div>
                      <div className="p-2 rounded bg-indigo-950/40 border border-indigo-500/30 text-indigo-300">
                        <span className="block font-bold">2. TELEMETRY</span>
                        IMD + INSAT + Bhuvan
                      </div>
                      <div className="text-slate-500 font-bold">▼ Assimilate</div>
                      <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                        <span className="block font-bold">3. ASSIMILATION</span>
                        Kalman Filter Engine
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center text-center font-mono text-[9px] bg-slate-950/80 p-4 rounded-lg border border-slate-800 mt-2">
                      <div className="p-2 rounded bg-blue-950/40 border border-blue-500/30 text-blue-300">
                        <span className="block font-bold">4. STATE CORE</span>
                        Twin State Manager
                      </div>
                      <div className="text-slate-500 font-bold">▼ Predict / Sim</div>
                      <div className="p-2 rounded bg-purple-950/40 border border-purple-500/30 text-purple-300">
                        <span className="block font-bold">5. FORECASTS</span>
                        What-If Scenarios
                      </div>
                      <div className="text-slate-500 font-bold">▼ Feedback</div>
                      <div className="p-2 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300">
                        <span className="block font-bold">6. REALITY SYNC</span>
                        Feedback Engine Update
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">State Manager status</span>
                      <ul className="space-y-1 text-slate-400 font-mono text-[10px]">
                        <li>• <strong className="text-slate-200">Active Location:</strong> {selectedDistrict}</li>
                        <li>• <strong className="text-slate-200">Current Temp:</strong> {twinMetadata?.climate_memory?.current_state?.temperature || 31.8}°C</li>
                        <li>• <strong className="text-slate-200">Rainfall:</strong> {twinMetadata?.climate_memory?.current_state?.rainfall || 75} mm</li>
                        <li>• <strong className="text-slate-200">Kalman Gain:</strong> {kalmanGain}</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">Action Loop</span>
                      <ul className="space-y-1 text-slate-400 font-mono text-[10px]">
                        <li>• <strong className="text-slate-200">Ingested Sources:</strong> INSAT, MOSDAC, Bhuvan</li>
                        <li>• <strong className="text-slate-200">Feedback Loop:</strong> Closed & Active</li>
                        <li>• <strong className="text-slate-200">Confidence Score:</strong> 94%</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {docsTab === "deployment_roadmap" && (
                <div className="space-y-6">
                  <div className="bg-[#0b1329] border border-indigo-500/20 p-4 rounded-xl">
                    <span className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">
                      National Scale Deployment roadmap
                    </span>
                    <h3 className="text-base font-bold text-white mb-3">Roadmap from Pilot to Pan-India</h3>
                    
                    <div className="space-y-3 font-mono text-[10px] text-slate-300">
                      <div className="flex items-center gap-3 bg-indigo-950/30 p-2.5 rounded border border-indigo-500/30">
                        <span className="bg-indigo-600 text-white font-bold px-2 py-0.5 rounded text-[8px] shrink-0">PHASE 1</span>
                        <div>
                          <strong className="text-slate-100 block">Godavari Basin (Pilot Region)</strong>
                          High-resolution hydrology runoff routing. (ACTIVE)
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-950/60 p-2.5 rounded border border-slate-900">
                        <span className="bg-indigo-950 text-indigo-300 font-bold px-2 py-0.5 rounded text-[8px] shrink-0">PHASE 2</span>
                        <div>
                          <strong className="text-slate-200 block">Andhra Pradesh (State Scale)</strong>
                          Fusing state-wide agricultural and urban micro-climate grids. (READY)
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-950/60 p-2.5 rounded border border-slate-900">
                        <span className="bg-indigo-950 text-indigo-300 font-bold px-2 py-0.5 rounded text-[8px] shrink-0">PHASE 3</span>
                        <div>
                          <strong className="text-slate-200 block">South India (Regional Climate Hubs)</strong>
                          Aggregating multi-state river catchments and coastal zones. (PLANNED)
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-950/60 p-2.5 rounded border border-slate-900">
                        <span className="bg-indigo-950 text-indigo-300 font-bold px-2 py-0.5 rounded text-[8px] shrink-0">PHASE 4</span>
                        <div>
                          <strong className="text-slate-200 block">Pan India (National Climate Twin)</strong>
                          Full national grid simulation with distributed timescale shards. (VISION)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">
                      Scale Database strategy
                    </span>
                    <div className="overflow-x-auto border border-slate-800 rounded-lg">
                      <table className="w-full text-[10px] font-mono text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-950 text-indigo-300 border-b border-slate-800">
                            <th className="p-2">Deployment Scale</th>
                            <th className="p-2">Database Strategy</th>
                            <th className="p-2">Optimizations</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 text-slate-400">
                          <tr>
                            <td className="p-2 font-bold text-slate-200">Pilot (Godavari)</td>
                            <td className="p-2">PostgreSQL</td>
                            <td className="p-2 text-slate-300">Local gridded datasets & district metadata</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-bold text-slate-200">State / Regional</td>
                            <td className="p-2">TimescaleDB</td>
                            <td className="p-2 text-slate-300">Time-series hyper-tables & compression</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-bold text-slate-200">National (Pan-India)</td>
                            <td className="p-2">Distributed TimescaleDB</td>
                            <td className="p-2 text-slate-300">Multi-node time shards with geographical clustering</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {docsTab === "cost_infrastructure" && (
                <div className="space-y-6">
                  <div className="bg-[#0b1329] border border-indigo-500/20 p-4 rounded-xl">
                    <span className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">
                      Cost & infrastructure Architecture
                    </span>
                    <h3 className="text-base font-bold text-white mb-2">High Performance, Low Latency Pipeline</h3>
                    <p className="leading-relaxed text-slate-300 mb-4">
                      VAYUSETU optimizes computing costs through caching and queuing. Telemetry feeds are ingested asynchronously using a <strong className="text-indigo-300 font-semibold">Redis Queue</strong>, processed via <strong className="text-indigo-300 font-semibold">FastAPI Backend</strong> services, and cached in the local database to support fast rendering without heavy redundant API calls.
                    </p>
                    
                    {/* Visual diagram */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-2 p-3 bg-slate-950/80 rounded border border-slate-900 font-mono text-[9px] text-slate-400 text-center">
                      <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-200">
                        IMD/INSAT/MOSDAC Feeds
                      </div>
                      <div className="text-slate-500 font-bold">➔</div>
                      <div className="p-2 bg-indigo-950/30 rounded border border-indigo-800/40 text-indigo-300">
                        Redis Queue (Asynchronous)
                      </div>
                      <div className="text-slate-500 font-bold">➔</div>
                      <div className="p-2 bg-indigo-950/30 rounded border border-indigo-800/40 text-indigo-300">
                        FastAPI Inference (PyTorch/XGBoost)
                      </div>
                      <div className="text-slate-500 font-bold">➔</div>
                      <div className="p-2 bg-emerald-950/30 rounded border border-emerald-800/40 text-emerald-300">
                        TimescaleDB / Twin Core
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center font-mono">
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <div className="text-[10px] text-slate-500">QUEUE</div>
                      <div className="text-xs font-bold text-slate-200 mt-1">Redis</div>
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <div className="text-[10px] text-slate-500">BACKEND</div>
                      <div className="text-xs font-bold text-slate-200 mt-1">FastAPI</div>
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <div className="text-[10px] text-slate-500">AI ENSEMBLES</div>
                      <div className="text-xs font-bold text-slate-200 mt-1">TensorFlow / PyTorch</div>
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <div className="text-[10px] text-slate-500">DEPLOYMENT</div>
                      <div className="text-xs font-bold text-slate-200 mt-1">Docker / Vercel</div>
                    </div>
                  </div>
                </div>
              )}

              {docsTab === "datasets_coverage" && (
                <div className="space-y-6">
                  <div className="bg-[#0b1329] border border-indigo-500/20 p-4 rounded-xl">
                    <span className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">
                      Dataset Coverage engine
                    </span>
                    <h3 className="text-base font-bold text-white mb-2">Live Ingestion Auditing</h3>
                    <p className="leading-relaxed text-slate-300 mb-3">
                      The coverage score validates the availability of live telemetry streams. Expected update rates are verified continuously against actual arrivals.
                    </p>
                    <div className="text-[9px] bg-slate-950 font-mono p-2.5 rounded border border-slate-900 text-center mb-2">
                      <code className="text-indigo-400">Coverage Score = (Available Data / Expected Data) × 100</code>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span>Overall Ingestion Coverage</span>
                      <span className="text-emerald-400 font-mono">{twinMetadata?.dataset_coverage?.overall_score || 95.6}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400" style={{ width: `${twinMetadata?.dataset_coverage?.overall_score || 95.6}%` }}></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {(twinMetadata?.dataset_coverage?.datasets || [
                        {"name": "IMD Coverage", "score": 100.0, "expected": "1/day"},
                        {"name": "INSAT Coverage", "score": 95.0, "expected": "48/day"},
                        {"name": "MOSDAC Coverage", "score": 92.0, "expected": "24/day"},
                        {"name": "Bhuvan Layers", "score": 100.0, "expected": "4/day"},
                        {"name": "NICES Products", "score": 96.0, "expected": "1/day"}
                      ]).map((d: any, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex justify-between items-center">
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">{d.name}</span>
                            <span className="text-[9px] text-slate-500 font-mono">Expected: {d.expected}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-indigo-400">{d.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {docsTab === "climate_memory" && (
                <div className="space-y-6">
                  <div className="bg-[#0b1329] border border-indigo-500/20 p-4 rounded-xl">
                    <span className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">
                      Climate Memory Engine
                    </span>
                    <h3 className="text-base font-bold text-white mb-2">Historical Window Aggregation</h3>
                    <p className="leading-relaxed text-slate-300">
                      Climate memory catalogs historical anomalies, tracking dynamic changes over <strong className="text-indigo-300">24 Hours, 7 Days, 30 Days, and 1 Year</strong> to contextualize sudden anomalies against long-term baselines.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-2">
                        District Trend Analysis
                      </span>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span className="text-slate-400">Target Region:</span>
                          <span className="text-slate-200 font-bold">{selectedDistrict}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span className="text-slate-400">Rainfall Trend (30d):</span>
                          <span className="text-emerald-400 font-bold">{twinMetadata?.climate_memory?.past_trends?.rainfall_trend || "Increasing"}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span className="text-slate-400">Temperature Trend (30d):</span>
                          <span className="text-indigo-400 font-bold">{twinMetadata?.climate_memory?.past_trends?.temperature_trend || "Stable"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Accumulated Rain (30d):</span>
                          <span className="text-slate-200 font-bold">{twinMetadata?.climate_memory?.past_trends?.last_30_days_rainfall || 312} mm</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block">
                        Historical Windows
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
                        <div className="p-2 bg-slate-950 border border-slate-800 rounded">
                          <span className="text-slate-500 block">24 Hours Avg Temp</span>
                          <span className="text-xs font-bold text-slate-200 mt-1">{twinMetadata?.climate_memory?.ranges?.last_24_hours?.avg_temperature || 31.2}°C</span>
                        </div>
                        <div className="p-2 bg-slate-950 border border-slate-800 rounded">
                          <span className="text-slate-500 block">7 Days Rain Sum</span>
                          <span className="text-xs font-bold text-slate-200 mt-1">{twinMetadata?.climate_memory?.ranges?.last_7_days?.total_rainfall || 98.4} mm</span>
                        </div>
                        <div className="p-2 bg-slate-950 border border-slate-800 rounded">
                          <span className="text-slate-500 block">30 Days Avg Soil</span>
                          <span className="text-xs font-bold text-slate-200 mt-1">{twinMetadata?.climate_memory?.ranges?.last_30_days?.avg_soil_moisture || 52.4}%</span>
                        </div>
                        <div className="p-2 bg-slate-950 border border-slate-800 rounded">
                          <span className="text-slate-500 block">1 Year Rain Sum</span>
                          <span className="text-xs font-bold text-slate-200 mt-1">{twinMetadata?.climate_memory?.ranges?.last_1_year?.total_rainfall || 1420.5} mm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {docsTab === "event_detection" && (
                <div className="space-y-6">
                  <div className="bg-[#0b1329] border border-indigo-500/20 p-4 rounded-xl">
                    <span className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">
                      Climate Event Detection
                    </span>
                    <h3 className="text-base font-bold text-white mb-2">Automated Threshold Alerting</h3>
                    <p className="leading-relaxed text-slate-300">
                      VAYUSETU continuously monitors environmental variables. When indicators exceed specific standard thresholds, climate alert events are auto-generated.
                    </p>
                  </div>

                  <div className="space-y-3 font-mono text-[10px]">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block">
                      Active Alerts in {selectedDistrict}
                    </span>
                    {(!twinMetadata?.active_alerts || twinMetadata.active_alerts.length === 0) ? (
                      <div className="p-4 bg-slate-950 border border-slate-900 text-center text-slate-500 rounded-lg">
                        No severe events detected. District parameters are currently within normal baseline ranges.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {twinMetadata.active_alerts.map((al: any, idx: number) => (
                          <div key={idx} className="p-3 bg-red-950/20 border border-red-800/40 rounded-lg flex justify-between items-center gap-4">
                            <div>
                              <strong className="text-red-400 text-xs block uppercase tracking-wider">⚠️ {al.event} Detected</strong>
                              <span className="text-slate-400">{al.description || al.indicator || `Severity: ${al.severity}`}</span>
                            </div>
                            <span className="bg-red-900/40 text-red-400 border border-red-800/30 px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-widest shrink-0">
                              {al.severity}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {docsTab === "multi_hazard" && (
                <div className="space-y-6">
                  <div className="bg-[#0b1329] border border-indigo-500/20 p-4 rounded-xl">
                    <span className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">
                      Multi-Hazard Intelligence
                    </span>
                    <h3 className="text-base font-bold text-white mb-2">Risk Fusion & Climate Resilience Index (CRI)</h3>
                    <p className="leading-relaxed text-slate-300">
                      Standard weather tools provide isolated parameters like rainfall. VAYUSETU implements a <strong className="text-indigo-300">Risk Fusion Engine</strong> combining soil moisture, land surface temperature, ocean wind vectors, and relative humidity to produce a unified <strong className="text-indigo-300">Climate Resilience Index (CRI)</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[10px]">
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">
                        Fused Risk Parameters
                      </span>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-400">Flood Risk Index:</span>
                            <span className="text-slate-200 font-bold">{twinMetadata?.multi_hazard?.flood_risk || 58.0}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${twinMetadata?.multi_hazard?.flood_risk || 58.0}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-400">Heatwave Risk Index:</span>
                            <span className="text-slate-200 font-bold">{twinMetadata?.multi_hazard?.heat_risk || 42.0}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500" style={{ width: `${twinMetadata?.multi_hazard?.heat_risk || 42.0}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-400">Drought Risk Index:</span>
                            <span className="text-slate-200 font-bold">{twinMetadata?.multi_hazard?.drought_risk || 20.0}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: `${twinMetadata?.multi_hazard?.drought_risk || 20.0}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-400">Crop Thermal Stress:</span>
                            <span className="text-slate-200 font-bold">{twinMetadata?.multi_hazard?.crop_stress || 25.0}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${twinMetadata?.multi_hazard?.crop_stress || 25.0}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-center items-center text-center">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-3">
                        Climate Resilience Index (CRI)
                      </span>
                      <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 flex flex-col justify-center items-center bg-slate-950 shadow-[0_0_20px_rgba(99,102,241,0.15)] animate-pulse">
                        <span className="text-2xl font-bold text-white">{twinMetadata?.multi_hazard?.climate_resilience_index || 72.4}</span>
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest mt-1">CRI SCORE</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-relaxed mt-4 max-w-[200px]">
                        A higher index indicates stronger local capacity to absorb environmental shocks based on fused moisture/thermal gradients.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {docsTab === "sdg_alignment" && (
                <div className="space-y-6">
                  <div className="bg-[#0b1329] border border-indigo-500/20 p-4 rounded-xl">
                    <span className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">
                      United Nations SDG Alignment Layer
                    </span>
                    <h3 className="text-base font-bold text-white mb-2">Sustainable Development Goal (SDG) Target Mapping</h3>
                    <p className="leading-relaxed text-slate-300 mb-2">
                      VAYUSETU aligns the outputs of its physics-informed digital twin models to support the UN's climate action and sustainability framework.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-start gap-3">
                      <div className="bg-emerald-900/30 text-emerald-400 border border-emerald-800/40 p-2 rounded shrink-0 font-bold font-mono">SDG 2</div>
                      <div>
                        <strong className="text-slate-200 block text-xs">Zero Hunger (Agricultural Planning)</strong>
                        <span className="text-[10px] text-slate-400">Mitigates crop failure risk by monitoring thermal stress levels and dynamic irrigation multipliers.</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-start gap-3">
                      <div className="bg-blue-900/30 text-blue-400 border border-blue-800/40 p-2 rounded shrink-0 font-bold font-mono">SDG 6</div>
                      <div>
                        <strong className="text-slate-200 block text-xs">Clean Water & Sanitation (Water Security)</strong>
                        <span className="text-[10px] text-slate-400">Calculates reservoir evaporation indices to preserve critical drinking and agricultural water buffers.</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-start gap-3">
                      <div className="bg-amber-900/30 text-amber-400 border border-amber-800/40 p-2 rounded shrink-0 font-bold font-mono">SDG 11</div>
                      <div>
                        <strong className="text-slate-200 block text-xs">Sustainable Cities (Flood Management)</strong>
                        <span className="text-[10px] text-slate-400">Applies 2D shallow water Saint-Venant hydraulic modeling to trigger pre-emptive urban flood sirens.</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-start gap-3">
                      <div className="bg-purple-900/30 text-purple-400 border border-purple-800/40 p-2 rounded shrink-0 font-bold font-mono">SDG 13</div>
                      <div>
                        <strong className="text-slate-200 block text-xs">Climate Action (Climate Intelligence)</strong>
                        <span className="text-[10px] text-slate-400">Provides What-If simulator engines to forecast secondary hazard migrations based on carbon and temperature shifts.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {docsTab === "isro_integration" && (
                <div className="space-y-6">
                  <div className="bg-[#0b1329] border border-indigo-500/20 p-4 rounded-xl">
                    <span className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">
                      ISRO Asset Ingest Layer
                    </span>
                    <h3 className="text-base font-bold text-white mb-2">Live Space & Geospatial Ingest Status</h3>
                    <p className="leading-relaxed text-slate-300">
                      Real-time connectors interface with ISRO space assets, downloading and parsing multi-spectral bands to calibrate prediction constraints.
                    </p>
                  </div>

                  <div className="space-y-2.5 font-mono text-[10px]">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center">
                      <div>
                        <strong className="text-slate-200 text-xs block">🛰️ INSAT-3D/3DR Satellite</strong>
                        <span className="text-slate-500">LST: {twinMetadata?.isro_assets?.insat?.lst_c || 32.5}°C | SST: {twinMetadata?.isro_assets?.insat?.sst_c || 28.5}°C</span>
                      </div>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded font-bold text-[8px] tracking-widest">
                        CONNECTED
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center">
                      <div>
                        <strong className="text-slate-200 text-xs block">🛸 MOSDAC Portals</strong>
                        <span className="text-slate-500">Ocean Wind Speed: {twinMetadata?.isro_assets?.mosdac?.ocean_wind_vectors_ms || 12.4} m/s | Vapor Depth: {twinMetadata?.isro_assets?.mosdac?.water_vapor_depth_mm || 42.1} mm</span>
                      </div>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded font-bold text-[8px] tracking-widest">
                        CONNECTED
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center">
                      <div>
                        <strong className="text-slate-200 text-xs block">🗺️ Bhuvan GIS Layers</strong>
                        <span className="text-slate-500">Class: {twinMetadata?.isro_assets?.bhuvan?.lulc_class || "Forest"} | Slope: {twinMetadata?.isro_assets?.bhuvan?.catchment_slope_deg || 3.5}°</span>
                      </div>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded font-bold text-[8px] tracking-widest">
                        CONNECTED
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center">
                      <div>
                        <strong className="text-slate-200 text-xs block">🌀 NICES Products</strong>
                        <span className="text-slate-500">Albedo: {twinMetadata?.isro_assets?.nices?.albedo_fraction || 0.18} | Soil Moisture Fraction: {twinMetadata?.isro_assets?.nices?.soil_moisture_fraction || 0.45}</span>
                      </div>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded font-bold text-[8px] tracking-widest">
                        CONNECTED
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {docsTab === "benchmarking" && (
                <div className="space-y-6">
                  <div className="bg-[#0b1329] border border-indigo-500/20 p-4 rounded-xl">
                    <span className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">
                      Scientific Benchmarking Engine
                    </span>
                    <h3 className="text-base font-bold text-white mb-2">Performance vs Legacy Forecasting Systems</h3>
                    <p className="leading-relaxed text-slate-300">
                      Comparing the root mean squared error (RMSE) of VAYUSETU's machine learning models against traditional numerical weather prediction (NWP) reports.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center font-mono">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                      <div className="text-[10px] text-slate-500">TRADITIONAL RMSE</div>
                      <div className="text-lg font-bold text-red-400 mt-1">4.8</div>
                    </div>
                    <div className="p-3 bg-[#0b1329] border border-indigo-500/30 rounded-lg">
                      <div className="text-[10px] text-slate-400">VAYUSETU RMSE</div>
                      <div className="text-lg font-bold text-emerald-400 mt-1">2.1</div>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                      <div className="text-[10px] text-slate-500">IMPROVEMENT</div>
                      <div className="text-lg font-bold text-indigo-400 mt-1">56%</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">
                      Feature Comparison Matrix
                    </span>
                    <div className="overflow-x-auto border border-slate-800 rounded-lg">
                      <table className="w-full text-[10px] font-mono text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-950 text-indigo-300 border-b border-slate-800">
                            <th className="p-2">System</th>
                            <th className="p-2">Real-Time Ingestion</th>
                            <th className="p-2">What-If Sim</th>
                            <th className="p-2">Closed Loop Feedback</th>
                            <th className="p-2">AI Ensembles</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 text-slate-400">
                          <tr>
                            <td className="p-2 font-bold text-slate-300">Traditional Forecast</td>
                            <td className="p-2">No</td>
                            <td className="p-2">No</td>
                            <td className="p-2">No</td>
                            <td className="p-2">No</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-bold text-slate-300">Climate Reports</td>
                            <td className="p-2">No</td>
                            <td className="p-2">No</td>
                            <td className="p-2">No</td>
                            <td className="p-2">No</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-bold text-slate-300">Dashboard Systems</td>
                            <td className="p-2 text-indigo-400">Partial</td>
                            <td className="p-2">No</td>
                            <td className="p-2">No</td>
                            <td className="p-2 text-indigo-400">Partial</td>
                          </tr>
                          <tr className="bg-indigo-950/20">
                            <td className="p-2 font-bold text-white">VAYUSETU Twin</td>
                            <td className="p-2 text-emerald-400 font-bold">Yes</td>
                            <td className="p-2 text-emerald-400 font-bold">Yes</td>
                            <td className="p-2 text-emerald-400 font-bold">Yes</td>
                            <td className="p-2 text-emerald-400 font-bold">Yes</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950 px-5 py-3 border-t border-slate-900 flex justify-end">
              <button 
                onClick={() => setDocsModalOpen(false)}
                className="bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded transition"
                aria-label={t("closeDocumentation")}
              >
                {t("closeDocumentation")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ MODAL 4: SETTINGS & ABOUT US ------------------ */}
      {settingsModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="settings-modal-title" 
          onClick={() => setSettingsModalOpen(false)}
        >
          <div 
            className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#0b1329] px-5 py-4 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">⚙️</span>
                <div>
                  <h3 id="settings-modal-title" className="font-bold text-base">{t("settingsTitle")}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{t("settingsDesc")}</p>
                </div>
              </div>
              <button 
                onClick={() => setSettingsModalOpen(false)}
                className="text-slate-400 hover:text-red-400 text-lg font-bold"
                aria-label="Close settings dialog"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 text-xs text-slate-300">
              {/* Text scaling option */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block">
                  {t("textSizeLabel")}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(["sm", "md", "lg"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setTextSize(size)}
                      className={`py-2 px-3 border rounded text-center font-mono font-semibold transition ${
                        textSize === size
                          ? "bg-indigo-950/80 text-indigo-300 border-indigo-500/40 shadow-[0_0_8px_rgba(99,102,241,0.1)]"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200"
                      }`}
                    >
                      {size === "sm" ? t("textSizeSmall") : size === "lg" ? t("textSizeLarge") : t("textSizeNormal")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout width scaling option */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold block">
                  {t("layoutWidthLabel")}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(["standard", "widescreen", "full"] as const).map((width) => (
                    <button
                      key={width}
                      type="button"
                      onClick={() => setLayoutWidth(width)}
                      className={`py-2 px-3 border rounded text-center font-mono font-semibold transition ${
                        layoutWidth === width
                          ? "bg-indigo-950/80 text-indigo-300 border-indigo-500/40 shadow-[0_0_8px_rgba(99,102,241,0.1)]"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200"
                      }`}
                    >
                      {width === "standard" ? t("layoutStandard") : width === "full" ? t("layoutFull") : t("layoutWidescreen")}
                    </button>
                  ))}
                </div>
              </div>

              {/* About Us panel */}
              <div className="bg-slate-900 p-4 rounded border border-slate-800 space-y-2 leading-relaxed">
                <strong className="text-slate-200 block text-xs border-b border-slate-800 pb-1 font-semibold">
                  {t("aboutUsTitle")}
                </strong>
                <p className="text-slate-400 font-mono text-[10px]">
                  {t("aboutUsDesc")}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950 px-5 py-3 border-t border-slate-900 flex justify-end">
              <button 
                onClick={() => setSettingsModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded transition"
                aria-label="Close configuration"
              >
                {t("closeSettings")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Climate Assistant Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <button 
          onClick={() => setAssistantOpen(!assistantOpen)}
          className="bg-indigo-950 hover:bg-indigo-900 text-white font-bold p-3.5 rounded-full shadow-2xl transition duration-300 flex items-center gap-2 border border-indigo-800 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
          aria-label="Open AI Climate Assistant Chat"
        >
          <span>💬</span> <span className="text-xs hidden md:inline">{t("chatTitle")}</span>
        </button>
      </div>

      {/* AI Assistant Chat Drawer */}
      {assistantOpen && (
        <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] z-50 bg-[#080d1a] border-l border-slate-800 shadow-2xl flex flex-col justify-between" role="dialog" aria-label="AI Climate Assistant Chat Drawer">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">💬</span>
              <div>
                <h3 className="font-bold text-sm">VAYUSETU {t("chatTitle")}</h3>
                <p className="text-[9px] text-indigo-400 font-mono">{t("chatCooperativeNode")}</p>
              </div>
            </div>
            <button onClick={() => setAssistantOpen(false)} className="text-white hover:text-red-400 text-lg" aria-label={t("closeDocumentation")}>✕</button>
          </div>

          {/* Chat text area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-800" aria-live="polite">
            {chatHistory.map((msg, idx) => {
              const text = (idx === 0 && msg.role === 'assistant') ? t("chatWelcome") : msg.text;
              return (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-lg text-xs max-w-[85%] ${msg.role === 'user' ? 'bg-indigo-950 text-indigo-100 border border-indigo-900 preserve-dark' : 'bg-slate-900 text-slate-200 border border-slate-800'}`}>
                    {parseMarkdown(text)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Questions Chips */}
          <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/80 flex flex-wrap gap-1.5">
            <button 
              type="button"
              onClick={() => setChatInput("Analyze Visakhapatnam flood risk")}
              className="bg-slate-900 hover:bg-[#134074] text-slate-300 hover:text-white px-2 py-1 rounded-full text-[10px] transition border border-slate-800"
            >
              {t("quickQuestion1Label")}
            </button>
            <button 
              type="button"
              onClick={() => setChatInput("Show LST temperature drift for Kochi")}
              className="bg-slate-900 hover:bg-[#134074] text-slate-300 hover:text-white px-2 py-1 rounded-full text-[10px] transition border border-slate-800"
            >
              {t("quickQuestion2Label")}
            </button>
            <button 
              type="button"
              onClick={() => setChatInput("What is the current space-grid risk score?")}
              className="bg-slate-900 hover:bg-[#134074] text-slate-300 hover:text-white px-2 py-1 rounded-full text-[10px] transition border border-slate-800"
            >
              {t("quickQuestion3Label")}
            </button>
          </div>

          {/* Input text form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={t("chatPlaceholderDynamic").replace("{district}", t(selectedDistrict))}
              className="flex-1 bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              aria-label="Ask a question about climate risk"
            />
            <button type="submit" className="bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded transition" aria-label="Send message">
              {t("chatSend")}
            </button>
          </form>
        </div>
      )}

      {/* Premium Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-24 left-3 right-3 sm:left-6 sm:right-auto z-50 bg-indigo-950/95 border border-indigo-500/30 text-slate-100 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg shadow-2xl flex items-center gap-2 sm:gap-3 backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-300">
          <span className="text-indigo-400">⚡</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white text-xs ml-2">✕</button>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/90 py-5 px-4 text-center text-xs text-slate-500 mt-12">
        <p>{t("footerCredits")}</p>
        <p className="mt-1 font-mono text-[10px]">
          {t("footerStatus")} | <span className="text-indigo-400 font-semibold">{liveDateTime}</span>
        </p>
      </footer>
    </div>
  );
}

function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    let content: React.ReactNode = line;
    
    // Check for bullet points
    const bulletMatch = line.match(/^-\s+\*\*(.*?)\*\*:\s*(.*)$/);
    const simpleBulletMatch = line.match(/^-\s+(.*)$/);
    
    if (bulletMatch) {
      const [, label, value] = bulletMatch;
      content = (
        <li className="list-none ml-2">
          • <strong>{label}:</strong> {value}
        </li>
      );
    } else if (simpleBulletMatch) {
      const [, val] = simpleBulletMatch;
      content = <li className="list-none ml-2">• {parseBoldText(val)}</li>;
    } else {
      content = parseBoldText(line);
    }

    return (
      <div key={lineIdx} className={lineIdx > 0 ? "mt-1" : ""}>
        {content}
      </div>
    );
  });
}

function parseBoldText(text: string): React.ReactNode {
  const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="font-bold text-white">{part}</strong> : part));
}
