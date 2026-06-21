import os
import json
import datetime

class ModelRegistryManager:
    def __init__(self, catalog_path="ai_engine/registry/model_catalog.json"):
        self.catalog_path = catalog_path
        os.makedirs(os.path.dirname(self.catalog_path), exist_ok=True)
        if not os.path.exists(self.catalog_path):
            self._write_catalog([])

    def _read_catalog(self) -> list:
        try:
            with open(self.catalog_path, "r") as f:
                return json.load(f)
        except Exception:
            return []

    def _write_catalog(self, data: list):
        with open(self.catalog_path, "w") as f:
            json.dump(data, f, indent=2)

    def register_model(self, model_name: str, algorithm: str, dataset: str, rmse: float, mae: float, r2: float) -> dict:
        catalog = self._read_catalog()
        version = f"v{len(catalog) + 1}.0"
        entry = {
            "model": model_name,
            "version": version,
            "algorithm": algorithm,
            "dataset": dataset,
            "rmse": rmse,
            "mae": mae,
            "r2": r2,
            "created": datetime.datetime.utcnow().isoformat() + "Z"
        }
        catalog.append(entry)
        self._write_catalog(catalog)
        return entry
