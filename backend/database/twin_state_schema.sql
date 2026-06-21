-- VAYUSETU TimescaleDB / PostGIS Database schemas
CREATE TABLE IF NOT EXISTS climate_twin_state (
    id SERIAL,
    timestamp TIMESTAMPTZ NOT NULL,
    district VARCHAR(100) NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    temperature REAL NOT NULL,
    rainfall REAL NOT NULL,
    humidity REAL NOT NULL,
    soil_moisture REAL NOT NULL,
    flood_risk REAL NOT NULL,
    heat_risk REAL NOT NULL,
    drought_risk REAL NOT NULL,
    confidence REAL NOT NULL,
    forecast_horizon VARCHAR(20) NOT NULL,
    PRIMARY KEY (timestamp, district)
);

CREATE INDEX IF NOT EXISTS idx_timescaledb_district ON climate_twin_state(district, timestamp DESC);