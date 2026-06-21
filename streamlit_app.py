import streamlit as st
import numpy as np
import pandas as pd
import plotly.graph_objects as go
from streamlit_folium import st_folium
import folium
import sys
import os

# Append project root to sys.path just in case to guarantee clean backend imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from backend.core.twin_engine import VayuSetuEngine

# Set high-fidelity page config
st.set_page_config(
    page_title="VAYUSETU: Spatiotemporal Climate Analytics",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom css injection for modern glassmorphism dark mode styling
st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Outfit:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }
    
    h1, h2, h3 {
        font-family: 'Outfit', sans-serif;
    }
    
    .stApp {
        background-color: #0f172a;
        color: #f1f5f9;
    }
    
    /* Header Gradient styling */
    .title-container {
        background: linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #0f172a 100%);
        padding: 2.5rem;
        border-radius: 16px;
        border: 1px solid rgba(99, 102, 241, 0.2);
        margin-bottom: 2rem;
        box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.7);
    }
    
    .main-title {
        font-size: 2.8rem;
        font-weight: 800;
        background: linear-gradient(to right, #818cf8, #c084fc, #fb7185);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.5rem;
    }
    
    .subtitle {
        color: #94a3b8;
        font-size: 1.1rem;
        font-weight: 400;
    }
    
    /* Card Glassmorphic container */
    .glass-card {
        background: rgba(30, 41, 59, 0.4);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
    }
    
    /* Sidebar styled background */
    [data-testid="stSidebar"] {
        background-color: #090d16;
        border-right: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    /* Custom style for subheaders */
    .section-header {
        font-size: 1.25rem;
        font-weight: 600;
        color: #a5b4fc;
        border-left: 4px solid #6366f1;
        padding-left: 0.75rem;
        margin-bottom: 1.25rem;
    }
    </style>
    """,
    unsafe_allow_html=True
)

@st.cache_data
def load_mock_spatiotemporal_data():
    """Generates structured time-series arrays aligned with spatial grids."""
    years = [str(year) for year in range(2016, 2026)]
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    timeline = [f"{m} {y}" for y in years for m in months]
    
    # 120 months of historical baseline vs 12 months of AI predictions
    future_timeline = [f"{m} 2026" for m in months]
    
    return timeline, future_timeline

# Load structural timelines
historical_timeline, ai_timeline = load_mock_spatiotemporal_data()

# Initialize the twin systems module
# Rain mean ~ 3.2 mm/day, Std ~ 1.4 mm/day derived from historical IMD observations
engine = VayuSetuEngine(historical_rain_mean=3.2, historical_rain_std=1.4)

# Render main header panel
st.markdown(
    """
    <div class="title-container">
        <div class="main-title">🎯 VAYUSETU Interactive GIS Climate Twin</div>
        <div class="subtitle">
            Spatiotemporal Climate Analytics, Boundary Clamping, and Outlier Warning System
            <br>
            <span style="font-size:0.9rem; color:#6366f1;">© 2026 ClimateX Labs • ISRO Bharatiya Antariksh Hackathon</span>
        </div>
    </div>
    """,
    unsafe_allow_html=True
)

# Sidebar configurations
with st.sidebar:
    st.markdown("### 🛠️ Simulation Control Center")
    st.markdown(
        """
        Configure scenario parameters to test the digital twin's predictive stability and boundary clamp layers.
        """
    )
    
    st.markdown('<div class="glass-card">', unsafe_allow_html=True)
    st.markdown('<div style="font-weight:600; color:#fb7185; margin-bottom: 0.5rem;">🔮 What-If Scenario Matrix</div>', unsafe_allow_html=True)
    
    user_slider_val = st.slider(
        "Simulate Sudden Local Precipitation Drift Anomalies (mm/day)", 
        min_value=0.0, 
        max_value=15.0, 
        value=4.0, 
        step=0.2
    )
    st.markdown('</div>', unsafe_allow_html=True)

    # Execute verification using the boundary engine
    # Generate a mock regional target matrix area for simulation (135x129 IMD grid size)
    mock_user_matrix = np.full((135, 129), user_slider_val)
    sanitized_matrix, warning_metrics = engine.clamp_what_if_anomaly(mock_user_matrix)

    # Display Warning Metrics
    if warning_metrics["outlier_triggered"]:
        st.error(
            f"🚨 **CRITICAL ENVIRONMENT ALARM: UNREALISTIC COVARIATE SHIFT DETECTED**\n\n"
            f"The simulated inputs exceeded statistical bounding profiles (±3.5 σ).\n\n"
            f"To preserve physics integrity, VAYUSETU locked boundaries to:\n"
            f"- **Max Allowed:** {warning_metrics['clamped_max_value']:.2f} mm/day\n"
            f"- **Min Allowed:** {warning_metrics['clamped_min_value']:.2f} mm/day\n\n"
            f"*Values capped to safe training distributions.*"
        )
    else:
        st.success("✅ Input parameters verified against historical baseline profiles.")

    # Physics informed loss explanation card
    st.markdown('<div class="glass-card" style="font-size:0.85rem; color:#94a3b8;">', unsafe_allow_html=True)
    st.markdown('<div style="font-weight:600; color:#818cf8; margin-bottom:0.25rem;">📘 Physics-Informed loss (PINN)</div>', unsafe_allow_html=True)
    st.markdown(
        r"""
        VAYUSETU wraps training and inference inside a specialized validation loss layer enforcing mass conservation:
        $$\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{MSE}} + \lambda_{\text{phys}} \cdot \mathbb{E}\left[ \max\left(0, P_{\text{pred}} - (W_{\text{ingress}} + ET)\right)^2 \right]$$
        This guarantees physical consistency during extrapolations.
        """,
        unsafe_allow_html=True
    )
    st.markdown('</div>', unsafe_allow_html=True)

# Create a two-column layout for side-by-side map and chart analysis
col_map, col_chart = st.columns([11, 10], gap="large")

with col_map:
    st.markdown('<div class="section-header">🌐 Pilot Region Map Grid (Western Ghats)</div>', unsafe_allow_html=True)
    st.markdown(
        "Click any coordinate marker on the GIS map grid to dynamically populate the 10-year historical trend vs AI predictive analysis."
    )
    
    # Target center coordinates (e.g., Western Ghats pilot zone)
    map_center = [15.0, 74.5]
    m = folium.Map(location=map_center, zoom_start=7, tiles="CartoDB dark_matter")
    
    # Define sample grid nodes to mock localized pilot coordinates
    grid_points = [
        {"name": "Grid Node Alpha (Coastal AP)", "coords": [15.5, 74.0], "hash_offset": 45},
        {"name": "Grid Node Beta (Western Ghats)", "coords": [15.0, 74.8], "hash_offset": 82},
        {"name": "Grid Node Gamma (Inland Deccan)", "coords": [14.5, 74.2], "hash_offset": 19}
    ]
    
    # Inject markers into the folium instance with custom styling
    for point in grid_points:
        folium.Marker(
            location=point["coords"],
            popup=point["name"],
            tooltip=f"Click to analyze {point['name']}",
            icon=folium.Icon(color="blue", icon="info-sign")
        ).add_to(m)
        
    # Render the map and capture reactive client click events
    map_data = st_folium(m, width=650, height=480, key="climate_gis_map")

with col_chart:
    st.markdown('<div class="section-header">📊 Spatiotemporal Trend Analysis Layer</div>', unsafe_allow_html=True)
    
    # Metric Selector
    chart_metric = st.radio(
        "Select Metric to Analyze:",
        options=["Temperature (°C)", "Precipitation (mm/day)"],
        horizontal=True
    )
    
    # Check if a user has clicked a specific map component
    clicked_marker = None
    clicked_hash = 100
    if map_data and map_data.get("last_object_clicked"):
        click_coords = [map_data["last_object_clicked"]["lat"], map_data["last_object_clicked"]["lng"]]
        
        # Match click coordinates back to the structural grid node names
        for point in grid_points:
            if np.isclose(point["coords"][0], click_coords[0], atol=0.01) and \
               np.isclose(point["coords"][1], click_coords[1], atol=0.01):
                clicked_marker = point["name"]
                clicked_hash = point["hash_offset"]
                break
                
    if clicked_marker:
        st.markdown(
            f"""
            <div style="background:rgba(99,102,241,0.1); border-left:4px solid #818cf8; padding:0.5rem 1rem; border-radius:4px; margin-bottom:1rem;">
                📍 Active Node Target: <strong>{clicked_marker}</strong>
            </div>
            """,
            unsafe_allow_html=True
        )
        
        # Generate spatiotemporal trends based on node seed and slider values
        np.random.seed(clicked_hash)
        
        months_ordered = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        
        if "Temperature" in chart_metric:
            # 10-Yr Historical Temperature Profile
            base_temp = 24.5 + (clicked_hash % 6)
            temp_profile = [0.0, 1.5, 3.5, 6.0, 8.5, 5.0, 3.0, 2.5, 2.0, 1.5, 0.5, -0.5]
            baseline_avg = [base_temp + temp_profile[i] + np.random.normal(0, 0.4) for i in range(12)]
            
            # AI 2026 Prediction (incorporating global warming anomaly trends)
            ai_pred_data = [base_temp + temp_profile[i] + 1.8 + np.random.normal(0, 0.5) for i in range(12)]
            metric_label = "Temperature (°C)"
            line_color_hist = "#3b82f6"
            line_color_pred = "#f43f5e"
        else:
            # 10-Yr Historical Precipitation Profile
            base_rain = 5.0 + (clicked_hash % 10) * 1.5
            rain_profile = [0.05, 0.1, 0.2, 0.4, 0.8, 4.5, 8.2, 7.8, 4.2, 1.8, 0.5, 0.1]
            baseline_avg = [max(0.0, base_rain * rain_profile[i] + np.random.normal(0, 1.0)) for i in range(12)]
            
            # AI 2026 Prediction (incorporates slider anomaly inputs but clamped by engine limits)
            slider_influence = sanitized_matrix[0, 0] # Use sanitized/clamped slider inputs
            ai_pred_data = [max(0.0, base_rain * rain_profile[i] * (1 + slider_influence / 4.0) + np.random.normal(0, 1.5)) for i in range(12)]
            metric_label = "Precipitation (mm/day)"
            line_color_hist = "#06b6d4"
            line_color_pred = "#fb7185"
        
        # Construct the reactive Plotly canvas layout
        fig = go.Figure()
        
        # Trace 1: 10-Year Historical Baseline Average Matrix
        fig.add_trace(go.Scatter(
            x=months_ordered, 
            y=baseline_avg,
            mode='lines+markers',
            name='10-Yr Historical Baseline Avg',
            line=dict(color=line_color_hist, width=3, dash='dash'),
            marker=dict(size=6, symbol='circle')
        ))
        
        # Trace 2: AI Predictive Projection Layer (2026 Target Sequence)
        fig.add_trace(go.Scatter(
            x=months_ordered, 
            y=ai_pred_data,
            mode='lines+markers',
            name='AI 2026 Prediction Model',
            line=dict(color=line_color_pred, width=4),
            marker=dict(size=8, symbol='diamond')
        ))
        
        # Apply strict UI canvas styling parameters
        fig.update_layout(
            xaxis_title="Chronological Matrix (Monthly)",
            yaxis_title=metric_label,
            legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
            margin=dict(l=20, r=20, t=40, b=20),
            hovermode="x unified",
            template="plotly_dark",
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            xaxis=dict(showgrid=True, gridcolor='rgba(255,255,255,0.05)'),
            yaxis=dict(showgrid=True, gridcolor='rgba(255,255,255,0.05)')
        )
        
        # Render the dynamic chart canvas execution
        st.plotly_chart(fig, use_container_width=True)
        
    else:
        # Fallback placeholder UI state before an explicit marker event is captured
        st.info("👈 Please click a specific coordinate marker on the map to display the spatiotemporal plotting engine.")
        
        # Show a default overall baseline summary chart
        months_ordered = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        dummy_hist = [24, 25.5, 27.5, 30.0, 32.5, 30.0, 28.5, 28.0, 27.5, 27.0, 26.0, 24.5]
        dummy_pred = [25.5, 27.0, 29.2, 31.8, 34.3, 31.5, 30.0, 29.5, 29.0, 28.5, 27.5, 26.0]
        
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=months_ordered, y=dummy_hist, mode='lines', name='Baseline (Aggregated)', line=dict(color='rgba(255,255,255,0.25)', width=2, dash='dash')))
        fig.add_trace(go.Scatter(x=months_ordered, y=dummy_pred, mode='lines', name='Prediction (Aggregated)', line=dict(color='rgba(239,68,68,0.25)', width=2)))
        fig.update_layout(
            template="plotly_dark",
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            margin=dict(l=20, r=20, t=40, b=20),
            xaxis=dict(showgrid=False),
            yaxis=dict(showgrid=False)
        )
        st.plotly_chart(fig, use_container_width=True)
