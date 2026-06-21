import random
from typing import Dict, Any

class CoverageEngine:
    """
    Computes data coverage scores for various satellite and gridded datasets.
    Formula: Coverage Score = (Available Data / Expected Data) * 100
    """
    def __init__(self):
        self.expected_updates = {
            "IMD": 1,
            "INSAT": 48,  # half-hourly observations
            "MOSDAC": 24, # hourly files
            "Bhuvan": 4,  # daily layers
            "NICES": 1
        }
        
    def calculate_coverage(self, dataset: str, actual_updates: int) -> float:
        expected = self.expected_updates.get(dataset, 1)
        score = (actual_updates / expected) * 100.0
        return round(min(100.0, max(0.0, score)), 1)
        
    def get_overall_score(self, scores: Dict[str, float]) -> float:
        if not scores:
            return 0.0
        return round(sum(scores.values()) / len(scores), 1)
