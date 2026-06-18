from typing import List, Dict, Any

def get_climate_advisories(flood_risk: float, heatwave_risk: float, drought_risk: float) -> List[Dict[str, Any]]:
    """
    Translates climate risk levels into recommended mitigation and adaptation advisories.
    """
    advisories = []
    
    # Flood Advisories
    if flood_risk > 75:
        advisories.append({
            "type": "FLOOD",
            "level": "CRITICAL",
            "title": "Immediate Flood Warning & Response",
            "actions": [
                "Activate local early warning siren systems",
                "Begin evacuation procedures in low-lying catchments",
                "Execute reservoir pre-depletion and discharge planning",
                "Deploy NDRF / local disaster response units",
                "Bar access to bridges and riverbanks"
            ]
        })
    elif flood_risk > 50:
        advisories.append({
            "type": "FLOOD",
            "level": "ELEVATED",
            "title": "Flood Preparedness Alert",
            "actions": [
                "Establish continuous monitoring of river gauge levels",
                "Clear municipal stormwater drains of debris",
                "Alert emergency shelter networks",
                "Issue advisory to fishermen and coastal communities"
            ]
        })
        
    # Heatwave Advisories
    if heatwave_risk > 75:
        advisories.append({
            "type": "HEATWAVE",
            "level": "CRITICAL",
            "title": "Severe Heatwave Action Plan",
            "actions": [
                "Establish public cooling shelters with clean water supply",
                "Adjust outdoor working hour regulations (noon restrictions)",
                "Alert emergency hospital wings for heatstroke management",
                "Deploy misting stations in high-density urban areas",
                "Distribute cool roof advisories and materials"
            ]
        })
    elif heatwave_risk > 50:
        advisories.append({
            "type": "HEATWAVE",
            "level": "ELEVATED",
            "title": "Heat Warning Alert",
            "actions": [
                "Issue warnings on active hydration guidelines",
                "Optimize water supply schedules for public parks",
                "Promote community cooling checks for elderly citizens"
            ]
        })
        
    # Drought Advisories
    if drought_risk > 75:
        advisories.append({
            "type": "DROUGHT",
            "level": "CRITICAL",
            "title": "Severe Water Crisis Advisory",
            "actions": [
                "Enforce mandatory water conservation rules",
                "Prioritize reservoir supply for drinking and live-stock",
                "Distribute drought-tolerant seeds to farmers",
                "Implement water rationing in industrial sectors"
            ]
        })
    elif drought_risk > 50:
        advisories.append({
            "type": "DROUGHT",
            "level": "ELEVATED",
            "title": "Drought Vigilance Alert",
            "actions": [
                "Promote rainwater harvesting checks",
                "Encourage drip-irrigation techniques",
                "Audit local irrigation canal distribution efficiency"
            ]
        })
        
    # Default advisories if all normal
    if not advisories:
        advisories.append({
            "type": "NORMAL",
            "level": "NORMAL",
            "title": "Standard Climate Resiliency Guidelines",
            "actions": [
                "Promote afforestation to strengthen soil structure",
                "Maintain local weather telemetry network calibration",
                "Conduct community climate awareness workshops"
            ]
        })
        
    return advisories
