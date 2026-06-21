from typing import Dict, Any

class TrustScoreCalculator:
    """
    Calculates the Twin Trust Score (0-100) using weighted dimensions:
    - 30% Dataset Freshness (based on latency hours)
    - 30% Model Confidence (from the prediction engine)
    - 20% Assimilation Success (Kalman Filter convergence rates)
    - 20% Data Coverage (overall spatial sensor count)
    """

    def calculate_trust_score(
        self,
        freshness_score: float,      # 0-100
        model_confidence: float,      # 0-100
        assimilation_success_rate: float, # 0-100
        data_coverage_pct: float      # 0-100
    ) -> Dict[str, Any]:
        
        # Weighted aggregate
        score = (
            0.30 * freshness_score + 
            0.30 * model_confidence + 
            0.20 * assimilation_success_rate + 
            0.20 * data_coverage_pct
        )
        score = round(score, 1)

        # Categorize
        if score >= 90.0:
            category = "EXCELLENT"
        elif score >= 75.0:
            category = "GOOD"
        elif score >= 50.0:
            category = "MODERATE"
        else:
            category = "LOW"

        return {
            "trust_score": score,
            "category": category,
            "metrics": {
                "dataset_freshness": freshness_score,
                "model_confidence": model_confidence,
                "assimilation_success": assimilation_success_rate,
                "data_coverage": data_coverage_pct
            }
        }
