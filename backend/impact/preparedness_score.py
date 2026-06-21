class PreparednessScoreModel:
    def compute(self, sensors_count: int, drill_completed: bool) -> float:
        base = 50.0
        if sensors_count > 10:
            base += 30.0
        if drill_completed:
            base += 20.0
        return base
