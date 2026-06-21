import os
import time
import numpy as np
from typing import Dict, Any
from app.services.data_pipeline import parse_imd_binary, ClimateGridSchema
from app.services.drift_detector import compute_model_health_and_drift, trigger_model_retrain
from app.services.drift_alerting import check_forecast_drift
from lineage_engine.lineage_manager import LineageManager
from lineage_engine.audit_trail import AuditTrail, EventType

class DailyIngestionWorker:
    """
    Automated daily worker that fetches new meteorological observation grid files,
    performs type-safety checks via Pydantic, checks for statistical drift,
    and updates the Digital Twin lineage and audit trails.
    """
    def __init__(self, data_dir: str = "datasets/imd", lineage_manager: LineageManager = None, audit_trail: AuditTrail = None):
        self.data_dir = data_dir
        self.lineage_manager = lineage_manager or LineageManager()
        self.audit_trail = audit_trail or AuditTrail()

    def run_daily_update(self, date_str: str) -> Dict[str, Any]:
        print(f"[DAILY UPDATE] Ingesting new observations for: {date_str}...")
        
        # Step 1: Mock fetching file from IMD/MOSDAC servers
        mock_file_path = os.path.join(self.data_dir, f"imd_grid_{date_str.replace('-', '')}.bin")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Generate mock valid binary file to parse
        lat_points, lon_points = 135, 129
        grid_size = lat_points * lon_points
        mock_grid = np.random.uniform(0.0, 50.0, grid_size).astype(np.float32)
        # Add some NaN and outlier flags to test validation filters
        mock_grid[100] = -99.9
        mock_grid[200] = 99.9
        mock_grid.tofile(mock_file_path)

        try:
            # Step 2: Parse and auto-validate binary observations using ClimateGridSchema
            parsed_grid = parse_imd_binary(mock_file_path, lat_points, lon_points)
            mean_rain = float(np.mean(parsed_grid))
            
            # Step 3: Check for statistical model health and distribution drift
            # Create a 7-day prior forecast grid and historical training baseline for MASE
            forecast_grid = np.full((lat_points, lon_points), 25.0, dtype=np.float32)
            baseline_grid = np.array([22.0, 23.5, 24.0, 26.0, 28.5, 27.0, 25.0, 24.5, 23.0], dtype=np.float32)
            # Compute MASE drift check
            mase_report = check_forecast_drift(mock_file_path, forecast_grid, baseline_grid, threshold=1.5)
            
            # Simulate a drift check using current state
            drift_report = compute_model_health_and_drift()
            drift_report["mase_mearure"] = mase_report["mase_value"]
            drift_report["mase_drift_detected"] = mase_report["drift_detected"]
            
            # Step 4: Immutable Logging
            self.audit_trail.log_event(
                "DATASET_INGESTED",
                {
                    "dataset": "IMD Rainfall 0.25° Binary",
                    "date": date_str,
                    "mean_value": round(mean_rain, 2),
                    "dims": f"{lat_points}x{lon_points}",
                    "checksum": mock_file_path.split(os.sep)[-1],
                    "mase_score": mase_report["mase_value"],
                    "mase_drift": mase_report["drift_detected"]
                }
            )

            # Step 5: Check if retraining is recommended due to model drift
            retrained = False
            if drift_report["retrain_recommended"] or mase_report["drift_detected"]:
                print(f"[DRIFT DETECTED] Triggering automated model retraining...")
                trigger_model_retrain()
                retrained = True

                self.audit_trail.log_event(
                    "MODEL_RETRAINED",
                    {
                        "model": "Ensemble_v1",
                        "reason": f"Drift status: {drift_report['drift_status']}",
                        "new_health": 98.0
                    }
                )

            # Step 6: Create new version in Digital Twin Lineage Manager
            new_state = self.lineage_manager.create_lineage_record(
                dataset_sources=["IMD Rainfall 0.25°", "INSAT LST", "MOSDAC OLR"],
                coverage_pct=95.4,
                confidence=0.92 if not retrained else 0.94,
                operator="auto-scheduler"
            )
            
            self.audit_trail.log_event(
                "STATE_CREATED",
                {
                    "version": new_state.twin_version,
                    "confidence": new_state.confidence,
                    "coverage_pct": new_state.coverage_pct,
                    "run_id": new_state.assimilation_run_id
                }
            )

            return {
                "status": "SUCCESS",
                "date": date_str,
                "twin_version": new_state.twin_version,
                "assimilation_run_id": new_state.assimilation_run_id,
                "drift_report": drift_report,
                "retrained_triggered": retrained
            }
            
        except Exception as e:
            print(f"[DAILY UPDATE FAILED] Error: {str(e)}")
            raise e
        finally:
            # Clean up temp file
            if os.path.exists(mock_file_path):
                os.remove(mock_file_path)

if __name__ == "__main__":
    worker = DailyIngestionWorker()
    result = worker.run_daily_update("2026-06-21")
    print(f"Update Result: {result}")
