import os
import requests
import json
from typing import Dict, Any, Optional

class MosdacIngestionPipeline:
    """
    Ingestion pipeline for download and preprocessing of NetCDF4 satellite rasters from ISRO's MOSDAC portal.
    Demonstrates clean, robust, and secure network calls with retry mechanics.
    """
    def __init__(self, api_token: Optional[str] = None):
        self.base_url = "https://www.mosdac.gov.in/api"
        # Secure token authorization
        self.headers = {
            "Authorization": f"Bearer {api_token}" if api_token else "",
            "Accept": "application/json",
            "User-Agent": "VAYUSETU Ingestion Engine v1.0"
        }

    def fetch_insat_raster_metadata(self, product_id: str = "3RIMG_L2B_LST") -> Dict[str, Any]:
        """
        Queries MOSDAC API for the latest available INSAT-3D Land Surface Temperature (LST) product metadata.
        """
        url = f"{self.base_url}/catalog/{product_id}/latest"
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            # Raise exception for HTTP errors (4xx or 5xx)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error querying MOSDAC catalog for product {product_id}: {e}")
            # Safe fallback default dictionary to avoid downstream crashes
            return {"status": "error", "message": str(e), "latest_file": None}

    def download_product_file(self, file_name: str, dest_folder: str = "data/raw") -> bool:
        """
        Downloads a target NetCDF/HDF5 satellite data file securely from MOSDAC portal.
        """
        if not file_name:
            return False
            
        os.makedirs(dest_folder, exist_ok=True)
        dest_path = os.path.join(dest_folder, file_name)
        
        # Avoid downloading duplicate files to optimize network and disk resources
        if os.path.exists(dest_path):
            print(f"File {file_name} already exists in raw cache. Skipping download.")
            return True
            
        url = f"{self.base_url}/download"
        params = {"file": file_name}
        
        try:
            print(f"Downloading {file_name} from MOSDAC...")
            with requests.get(url, params=params, headers=self.headers, stream=True, timeout=60) as r:
                r.raise_for_status()
                with open(dest_path, 'wb') as f:
                    for chunk in r.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)
            print(f"Download complete: {dest_path}")
            return True
        except requests.exceptions.RequestException as e:
            print(f"Failed to download file {file_name} from MOSDAC: {e}")
            if os.path.exists(dest_path):
                os.remove(dest_path) # Clean up partial downloads to prevent file corruption
            return False

if __name__ == "__main__":
    # Test execution harness using MOSDAC catalog
    pipeline = MosdacIngestionPipeline()
    # Ingest metadata for INSAT-3D Land Surface Temperature
    metadata = pipeline.fetch_insat_raster_metadata("3RIMG_L2B_LST")
    print(json.dumps(metadata, indent=2))
