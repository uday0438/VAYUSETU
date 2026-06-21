class RoiEngine:
    def calculate_roi(self, benefits: float, cost: float) -> float:
        if cost == 0:
            return 0.0
        return round(((benefits - cost) / cost) * 100.0, 1)
