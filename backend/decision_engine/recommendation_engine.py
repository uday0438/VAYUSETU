from typing import List, Dict, Any

class RecommendationEngine:
    """
    Generates actionable, stakeholder-specific recommendations based on 
    multihazard risk assessments and climate anomalies.
    """

    def get_recommendations(self, risk_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Takes risk scores (flood_risk, heat_risk, drought_risk, water_stress) 
        and returns stakeholder-targeted actions.
        """
        flood = risk_data.get("flood_risk", 0.0)
        heat = risk_data.get("heat_risk", 0.0)
        drought = risk_data.get("drought_risk", 0.0)
        water = risk_data.get("water_stress", 0.0)

        # Scale 0-100 risk to 0-1 if necessary
        if flood > 1.0: flood /= 100.0
        if heat > 1.0: heat /= 100.0
        if drought > 1.0: drought /= 100.0
        if water > 1.0: water /= 100.0

        recommendations = []

        # 1. Flood recommendations
        if flood >= 0.75:
            recommendations.append({
                "action": "Initiate immediate evacuation alerts for low-lying flood-prone zones.",
                "priority": "CRITICAL",
                "stakeholder": "Disaster Management",
                "timeline": "Immediate (0-2 hours)"
            })
            recommendations.append({
                "action": "Deploy emergency flood containment barriers and mobilize SDRF teams.",
                "priority": "CRITICAL",
                "stakeholder": "Disaster Management",
                "timeline": "Immediate (0-4 hours)"
            })
            recommendations.append({
                "action": "Open emergency shelters and pre-position drinking water and medicine packages.",
                "priority": "HIGH",
                "stakeholder": "Administrator",
                "timeline": "Under 12 hours"
            })
        elif flood >= 0.50:
            recommendations.append({
                "action": "Issue precautionary flood warnings and restrict access to river catchments.",
                "priority": "HIGH",
                "stakeholder": "Disaster Management",
                "timeline": "Under 6 hours"
            })
            recommendations.append({
                "action": "Begin controlled reservoir discharges at downstream gates.",
                "priority": "HIGH",
                "stakeholder": "Administrator",
                "timeline": "Under 12 hours"
            })
        elif flood >= 0.25:
            recommendations.append({
                "action": "Clear drainage blockages in urban areas and monitor catchment levels.",
                "priority": "MODERATE",
                "stakeholder": "Administrator",
                "timeline": "24-48 hours"
            })

        # 2. Heat wave recommendations
        if heat >= 0.75:
            recommendations.append({
                "action": "Declare extreme heatwave emergency and mandate cooling shelters across district centers.",
                "priority": "CRITICAL",
                "stakeholder": "Administrator",
                "timeline": "Under 2 hours"
            })
            recommendations.append({
                "action": "Suspend outdoor work between 11 AM and 4 PM to prevent thermal stroke.",
                "priority": "CRITICAL",
                "stakeholder": "Administrator",
                "timeline": "Immediate"
            })
            recommendations.append({
                "action": "Deploy shade nets and apply intensive hydration/mulching on vulnerable crops.",
                "priority": "HIGH",
                "stakeholder": "Farmer",
                "timeline": "Same day"
            })
        elif heat >= 0.50:
            recommendations.append({
                "action": "Establish localized drinking water stations and adjust school/work timings.",
                "priority": "HIGH",
                "stakeholder": "Administrator",
                "timeline": "Under 24 hours"
            })
            recommendations.append({
                "action": "Increase municipal power grid capacity allocations to avoid substation trips.",
                "priority": "HIGH",
                "stakeholder": "Administrator",
                "timeline": "Under 24 hours"
            })
        elif heat >= 0.25:
            recommendations.append({
                "action": "Issue heat advisory guidelines through mobile broadcasts.",
                "priority": "MODERATE",
                "stakeholder": "Administrator",
                "timeline": "Ongoing"
            })

        # 3. Drought and Water Stress recommendations
        if drought >= 0.75 or water >= 0.75:
            recommendations.append({
                "action": "Declare water emergency and enforce absolute conservation protocols on reservoirs.",
                "priority": "CRITICAL",
                "stakeholder": "Administrator",
                "timeline": "Immediate"
            })
            recommendations.append({
                "action": "Transition to micro-irrigation (drip/sprinkler) immediately; tap groundwater strictly for survival.",
                "priority": "CRITICAL",
                "stakeholder": "Farmer",
                "timeline": "Immediate"
            })
            recommendations.append({
                "action": "Provide emergency seed subsidies for short-duration drought-tolerant alternative crops.",
                "priority": "HIGH",
                "stakeholder": "Administrator",
                "timeline": "Under 48 hours"
            })
        elif drought >= 0.50 or water >= 0.50:
            recommendations.append({
                "action": "Implement rotational water supply schedules for agricultural channels.",
                "priority": "HIGH",
                "stakeholder": "Administrator",
                "timeline": "Under 3 days"
            })
            recommendations.append({
                "action": "Apply organic mulch (straw/leaves) to reduce soil moisture evaporation.",
                "priority": "HIGH",
                "stakeholder": "Farmer",
                "timeline": "Under 48 hours"
            })
        elif drought >= 0.25 or water >= 0.25:
            recommendations.append({
                "action": "Promote rainwater harvesting and moisture conservation methods.",
                "priority": "MODERATE",
                "stakeholder": "Farmer",
                "timeline": "Ongoing"
            })

        # Default recommendations if no high risk
        if not recommendations:
            recommendations.append({
                "action": "Routine digital twin observations active. Maintain standard agricultural schedules.",
                "priority": "NORMAL",
                "stakeholder": "Farmer",
                "timeline": "Routine"
            })
            recommendations.append({
                "action": "System reports safe resilient levels. Monitor weekly predictions.",
                "priority": "NORMAL",
                "stakeholder": "Administrator",
                "timeline": "Routine"
            })

        return recommendations
