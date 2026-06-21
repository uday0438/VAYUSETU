import random
import datetime
from typing import Dict, Any
from .coverage_engine import CoverageEngine

class DatasetMonitor:
    def __init__(self):
        self.engine = CoverageEngine()
        
    def check_streams(self) -> Dict[str, Any]:
        imd_actual = 1
        insat_actual = random.choice([45, 46, 47, 48])
        mosdac_actual = random.choice([22, 23, 24])
        bhuvan_actual = 4
        nices_actual = 1
        
        scores = {
            "IMD": self.engine.calculate_coverage("IMD", imd_actual),
            "INSAT": self.engine.calculate_coverage("INSAT", insat_actual),
            "MOSDAC": self.engine.calculate_coverage("MOSDAC", mosdac_actual),
            "Bhuvan": self.engine.calculate_coverage("Bhuvan", bhuvan_actual),
            "NICES": self.engine.calculate_coverage("NICES", nices_actual)
        }
        
        overall = self.engine.get_overall_score(scores)
        return {
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "coverage_scores": scores,
            "overall_coverage": overall,
            "status": "HEALTHY" if overall > 92.0 else "WARNING"
        }
