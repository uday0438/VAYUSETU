from typing import Dict, Any, List

class PolicyImpactAnalyzer:
    """
    Analyzes policy simulation runs and generates structural, executive-level 
    reports with strategic recommendations for policy makers.
    """

    def analyze_impact(self, simulation_results: Dict[str, Any]) -> Dict[str, Any]:
        deltas = simulation_results.get("deltas", {})
        cri_change = deltas.get("cri_change", 0.0)
        
        # Formulate executive summary
        if cri_change <= -10.0:
            summary = "The simulated policy updates yield high resilience improvements, significantly mitigating regional hazards."
            verdict = "STRONGLY RECOMMENDED"
        elif cri_change < 0.0:
            summary = "The simulated policy updates yield moderate risk reductions, improving localized climate adaptabilities."
            verdict = "RECOMMENDED"
        elif cri_change == 0.0:
            summary = "The simulated policy updates yield no net change in the district's Climate Resilience Index."
            verdict = "NEUTRAL"
        else:
            summary = "WARNING: The simulated policy shifts increase aggregate hazard exposures, accelerating vulnerability indices."
            verdict = "NOT RECOMMENDED"

        recommendations = []
        if deltas.get("flood_risk_change_pct", 0.0) > 5.0:
            recommendations.append("Prioritize sustainable drainage systems (SuDS) and wetland restorations to combat urbanization runoff.")
        if deltas.get("heat_risk_change_pct", 0.0) > 5.0:
            recommendations.append("Mandate green roofing and urban tree canopies to offset building heat absorption.")
        if deltas.get("water_stress_change_pct", 0.0) > 5.0:
            recommendations.append("Expedite reservoir dredging, check-dam additions, and micro-irrigation subsidies.")

        if not recommendations:
            recommendations.append("Maintain progress on baseline afforestation targets. Continue monitoring twin feedback loops.")

        return {
            "executive_summary": summary,
            "policy_verdict": verdict,
            "action_items": recommendations
        }
