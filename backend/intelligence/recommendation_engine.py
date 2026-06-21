from typing import List

class RecommendationEngine:
    def get_district_recommendation(self, flood_risk: float, heat_risk: float, drought_risk: float) -> List[str]:
        recs = []
        if flood_risk > 70:
            recs.append("Flood mitigation: Deploy sandbags and clear drainage segment gates.")
        if heat_risk > 70:
            recs.append("Heatwave mitigation: Restrict open outdoor work between 12-4 PM.")
        if drought_risk > 70:
            recs.append("Drought mitigation: Restrict industrial water intake; prioritize reservoir supply.")
        if not recs:
            recs.append("General recommendation: Continue standard grid calibrating.")
        return recs