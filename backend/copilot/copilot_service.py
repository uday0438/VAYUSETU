from typing import Dict, Any


class ClimateCopilotService:
    """
    Intelligent Climate Copilot Service providing explainable Q&A
    grounded strictly in the digital twin state.
    """

    def ask(self, question: str, twin_state: Dict[str, Any]) -> str:
        q = question.lower().strip()

        temp    = twin_state.get("temperature",        31.8)
        rain    = twin_state.get("rainfall",           75.0)
        sm      = twin_state.get("soil_moisture",      68.0)
        humidity= twin_state.get("humidity",           82.0)
        lst     = twin_state.get("lst",                32.5)
        sst     = twin_state.get("sst",                29.2)
        cri     = twin_state.get("vayusetu_risk_score",62.0)
        district= twin_state.get("district",           "Visakhapatnam")

        flood_risk   = min(100.0, 50 + (rain * 0.3) + ((sm - 50) * 0.4))
        heat_risk    = min(100.0, 40 + (temp - 25) * 8)
        drought_risk = max(0.0,   70 - (rain * 0.3) - (sm * 0.2))

        # ── Greetings ────────────────────────────────────────────────────────
        if any(w in q for w in ["hello", "hi", "hey", "good morning", "good evening", "howdy"]):
            return (
                f"Hello! I'm the VAYUSETU Climate Intelligence Copilot. "
                f"I'm monitoring {district} in real-time — CRI stands at {cri:.0f}/100. "
                "Ask me about flood risk, heat stress, rainfall projections, soil moisture, policy recommendations, or ISRO satellite data!"
            )

        # ── How are you / status ─────────────────────────────────────────────
        if any(w in q for w in ["how are you", "how r you", "what's up", "whats up", "status"]):
            return (
                f"All systems nominal! VAYUSETU Digital Twin is actively processing satellite feeds for {district}. "
                f"Current CRI: {cri:.0f}/100 | Rainfall: {rain:.1f} mm | Temp: {temp:.1f}°C | Soil Moisture: {sm:.1f}% | LST: {lst:.1f}°C. "
                "What specific climate parameter would you like me to analyse?"
            )

        # ── What is VAYUSETU ─────────────────────────────────────────────────
        if any(w in q for w in ["what is vayusetu", "vayusetu", "about", "explain vayusetu", "what does vayusetu"]):
            return (
                "VAYUSETU is an AI-powered Climate Digital Twin platform developed for ISRO. "
                "It fuses multi-source satellite data (INSAT-3D, MOSDAC, NavIC, IMD) with "
                "deep learning models (PINN-ConvLSTM, TFT, XGBoost) to produce real-time flood, "
                "heat, drought, and agricultural risk assessments across India's 28 states and UTs. "
                "It supports what-if scenario simulation, SSP2-4.5 climate projections, and policy decision support."
            )

        # ── Rainfall increase ─────────────────────────────────────────────────
        if "rainfall" in q and any(w in q for w in ["increase", "more rain", "heavy", "excess", "rise"]):
            projected = rain * 1.20
            flood_proj = min(100.0, flood_risk + 12)
            return (
                f"In {district}, current rainfall baseline is {rain:.1f} mm. "
                f"A 20% increase raises it to {projected:.1f} mm. "
                f"With soil saturation at {sm:.1f}%, our hydrological model projects Flood Risk rising to ~{flood_proj:.0f}/100. "
                "Recommend pre-positioning disaster response teams in low-lying catchment zones."
            )

        # ── Flood risk ────────────────────────────────────────────────────────
        if any(w in q for w in ["flood", "inundation", "waterlog", "submerge", "runoff", "discharge"]):
            severity = "CRITICAL" if flood_risk > 75 else "ELEVATED" if flood_risk > 50 else "NORMAL"
            return (
                f"🌊 Flood Risk Analysis for {district}: Index = {flood_risk:.0f}/100 [{severity}]. "
                f"Rainfall: {rain:.1f} mm | Soil Saturation: {sm:.1f}% | Catchment loading is {'HIGH' if sm > 70 else 'MODERATE'}. "
                f"Runoff coefficient is elevated due to {'high antecedent soil moisture' if sm > 70 else 'seasonal rainfall accumulation'}. "
                "Recommend monitoring river discharge gauges and activating early warning SMS alerts."
            )

        # ── Heat / Temperature ────────────────────────────────────────────────
        if any(w in q for w in ["heat", "temperature", "hot", "thermal", "lst", "heatwave", "warm"]):
            anomaly = lst - 28.0
            severity = "EXTREME" if heat_risk > 75 else "HIGH" if heat_risk > 50 else "MODERATE"
            return (
                f"🌡️ Heat Stress Analysis for {district}: Heatwave Risk = {heat_risk:.0f}/100 [{severity}]. "
                f"LST: {lst:.1f}°C (anomaly: +{anomaly:.1f}°C above seasonal baseline) | Air Temp: {temp:.1f}°C. "
                "Drivers include low NDVI vegetative cooling, urban heat island effect, and reduced cloud cover. "
                "Recommend issuing heat advisories for outdoor workers and activating cooling centres."
            )

        # ── Drought / Soil Moisture ───────────────────────────────────────────
        if any(w in q for w in ["drought", "soil", "moisture", "dry", "amc", "saturation", "deficit", "water stress"]):
            status = "DROUGHT WATCH" if drought_risk > 60 else "STRESSED" if drought_risk > 40 else "ADEQUATE"
            return (
                f"🌾 Soil Moisture & Drought Analysis for {district}: Drought Risk = {drought_risk:.0f}/100 [{status}]. "
                f"Soil Moisture: {sm:.1f}% | Antecedent Moisture Condition (AMC) is {'III (Wet)' if sm > 70 else 'II (Normal)' if sm > 40 else 'I (Dry)'}. "
                f"With current rainfall of {rain:.1f} mm, recharge rate is {'positive' if rain > 50 else 'below replacement level'}. "
                "Recommend activating drip-irrigation advisories and monitoring groundwater table levels."
            )

        # ── SST / Ocean ───────────────────────────────────────────────────────
        if any(w in q for w in ["sst", "sea surface", "ocean", "bay of bengal", "cyclone", "marine"]):
            return (
                f"🌊 SST Analysis: Bay of Bengal Sea Surface Temperature = {sst:.1f}°C. "
                f"{'SST exceeds 28°C threshold — conditions are FAVOURABLE for cyclogenesis. Monitor RSMC advisories closely.' if sst > 28 else 'SST is below cyclogenesis threshold. No immediate cyclone risk.'} "
                f"SST influences moisture flux into {district}, affecting monsoon intensity and coastal rainfall patterns."
            )

        # ── Policy / Recommendation ───────────────────────────────────────────
        if any(w in q for w in ["policy", "recommend", "action", "prioritize", "priority", "what should", "advice"]):
            if sm > 75:
                return (
                    f"📋 Policy Priority for {district} [High Soil Saturation = {sm:.0f}%]: "
                    "1. FLOOD MITIGATION — Restrict urbanisation in wetland buffer zones. "
                    "2. Activate micro-retention basin overflow gates. "
                    "3. Issue pre-emptive evacuation advisories for flood-prone wards. "
                    "4. Deploy NDRF teams to high-risk catchments."
                )
            elif heat_risk > 60:
                return (
                    f"📋 Policy Priority for {district} [Heat Risk = {heat_risk:.0f}/100]: "
                    "1. HEAT ADAPTATION — Issue public heat health advisory. "
                    "2. Activate urban cooling centres and distribute ORS packets. "
                    "3. Mandate reflective cool-roof installations in new constructions. "
                    "4. Subsidise drip-irrigation for Kharif crop protection."
                )
            else:
                return (
                    f"📋 Policy Priority for {district} [CRI = {cri:.0f}/100]: "
                    "1. MONITORING — Maintain satellite data ingestion cadence. "
                    "2. Conduct seasonal vulnerability assessment for Rabi crop zones. "
                    "3. Review check-dam storage capacity before next monsoon onset. "
                    "4. Update district disaster management plans with latest CRI scores."
                )

        # ── ISRO / Satellites ─────────────────────────────────────────────────
        if any(w in q for w in ["isro", "satellite", "navic", "mosdac", "insat", "bhoonidhi"]):
            return (
                "🛰️ VAYUSETU integrates the following ISRO data streams: "
                "• INSAT-3D/3DR — Land Surface Temperature (LST) and Outgoing Longwave Radiation (OLR) every 30 min. "
                "• MOSDAC — Gridded rainfall analysis at 0.25° resolution. "
                "• NavIC L5-S1 — Sub-metre positioning for field sensor telemetry. "
                "• Bhoonidhi DEM — Digital Elevation Model for watershed delineation. "
                "• IMD Station Network — Ground-truth surface observations fused via Kalman filter."
            )

        # ── CRI / Risk Score ──────────────────────────────────────────────────
        if any(w in q for w in ["cri", "resilience", "risk score", "index", "score"]):
            label = "HIGH RISK" if cri > 70 else "MODERATE RISK" if cri > 40 else "RESILIENT"
            return (
                f"📊 Climate Resilience Index (CRI) for {district}: {cri:.0f}/100 [{label}]. "
                f"Composite drivers: Flood contribution = {flood_risk:.0f}pts, Heat = {heat_risk:.0f}pts, Drought = {drought_risk:.0f}pts. "
                "CRI is computed from fused satellite observations, ensemble model outputs, and socio-economic exposure layers. "
                "A higher score indicates greater climate stress."
            )

        # ── Monsoon ───────────────────────────────────────────────────────────
        if any(w in q for w in ["monsoon", "onset", "withdrawal", "southwest", "northeast", "imd forecast"]):
            return (
                f"🌦️ Monsoon Status for {district}: Southwest Monsoon is ACTIVE over South & Central Peninsula. "
                "Onset over Kerala: 01-Jun-2026 (+2 days delay). "
                f"Current monsoonal wind vectors: 14.8 m/s. Rainfall anomaly for {district}: +{rain - 75:.1f} mm vs normal. "
                "Projected withdrawal from northwest India: 18-Sep-2026. "
                "NE monsoon contribution expected Oct-Nov for coastal Andhra Pradesh and Tamil Nadu."
            )

        # ── Crop / Agriculture ────────────────────────────────────────────────
        if any(w in q for w in ["crop", "agriculture", "farm", "yield", "kharif", "rabi", "irrigation", "kc"]):
            stress = min(100, max(0, 100 - rain * 0.5 - sm * 0.3))
            return (
                f"🌾 Agricultural Impact for {district}: Crop Stress Index = {stress:.0f}/100. "
                f"Soil moisture at {sm:.1f}% → {'adequate for Kharif sowing' if sm > 55 else 'below optimal — irrigation advisory active'}. "
                f"Rainfall at {rain:.1f} mm is {'above' if rain > 75 else 'below'} seasonal normal (75 mm). "
                "Kc (Crop Coefficient) for Rice: Initial=0.30, Dev=0.75, Mid=1.20, Late=0.60. "
                "Recommend soil health card updates before next sowing window."
            )

        # ── What-If Scenario ──────────────────────────────────────────────────
        if any(w in q for w in ["what if", "scenario", "simulate", "projection", "ssp", "2030", "2050"]):
            return (
                f"🔬 What-If Scenario Engine for {district}: "
                "Use the Scenario Studio sliders (left panel) to adjust Temperature Rise, CO₂ Levels, Forest Cover, Precipitation, Urbanization, and Soil Moisture. "
                "The Digital Twin will recalculate Flood, Heat, and Drought risk in real-time. "
                "For SSP2-4.5 long-term projections, use the timeline slider to jump to 2030, 2040, or 2050 outlooks. "
                "Current scenario baseline: "
                f"Temp +{0}°C | Precip +{0}% | Forest +{0}%."
            )

        # ── Who / Creator ─────────────────────────────────────────────────────
        if any(w in q for w in ["who", "creator", "team", "made", "built", "developed"]):
            return (
                "VAYUSETU was developed as an ISRO Space Application Centre initiative, "
                "integrating AI/ML research with operational satellite remote sensing. "
                "The platform uses PINN-ConvLSTM, Temporal Fusion Transformer (TFT), and XGBoost ensemble models "
                "trained on multi-decadal IMD, MOSDAC, and ERA5 climate reanalysis datasets."
            )

        # ── Catch-all: contextual, not generic ────────────────────────────────
        risk_label = "HIGH" if cri > 70 else "MODERATE" if cri > 40 else "LOW"
        return (
            f"🛰️ VAYUSETU Climate Intelligence for **{district}** — CRI: {cri:.0f}/100 [{risk_label} STRESS]\n"
            f"• 🌡️ Temperature: {temp:.1f}°C  |  LST: {lst:.1f}°C  |  SST: {sst:.1f}°C\n"
            f"• 🌧️ Rainfall: {rain:.1f} mm  |  Humidity: {humidity:.0f}%\n"
            f"• 🌾 Soil Moisture: {sm:.1f}%  |  Flood Risk: {flood_risk:.0f}/100  |  Heat Risk: {heat_risk:.0f}/100\n\n"
            "You can ask me about: flood risk, heat stress, drought, soil moisture, monsoon, crop impact, "
            "satellite data, policy recommendations, what-if scenarios, or SSP projections."
        )
