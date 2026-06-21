from typing import Dict, Any
from app.twin_core.state_manager import TwinStateManager
from app.twin_core.assimilation_engine import KalmanAssimilationEngine
from app.twin_core.prediction_engine import TwinPredictionEngine
from app.twin_core.scenario_engine import ScenarioSimulationEngine
from app.twin_core.feedback_engine import TwinFeedbackEngine

class TwinLoopController:
    """
    Orchestrates the entire closed-loop execution cycle of VAYUSETU Digital Twin.
    """
    def __init__(self):
        self.state_mgr = TwinStateManager()
        self.assim_engine = KalmanAssimilationEngine()
        self.pred_engine = TwinPredictionEngine()
        self.scenario_engine = ScenarioSimulationEngine()
        self.feedback_engine = TwinFeedbackEngine()

    def run_assimilation_cycle(self, district: str, predicted: float, observed: float, covariance: float) -> Dict[str, Any]:
        res = self.assim_engine.assimilate(predicted, observed, covariance)
        curr_state = self.state_mgr.load_state(district)
        curr_state["temperature"] = res["corrected_state"]
        self.state_mgr.save_state(district, curr_state)
        return {"district": district, "corrected_state": res, "saved": True}