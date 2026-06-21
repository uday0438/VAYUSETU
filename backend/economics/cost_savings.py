class CostSavingsCalculator:
    def calculate(self, resource_saved: float, rate: float) -> float:
        return round(resource_saved * rate, 2)
