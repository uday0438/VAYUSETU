class RiskReductionModel:
    def estimate_reduction(self, base_exposure: float, mitigation_efficiency: float) -> float:
        # Computes mitigation of disasters
        return round(base_exposure * (1.0 - mitigation_efficiency), 1)
