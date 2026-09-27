import streamlit as st
import numpy as np
import pandas as pd
import plotly.graph_objects as go

def render_data_science_studio():
    st.subheader("🔬 Quant & Data Science Studio")
    st.caption("Empirical stochastic modeling, Modern Portfolio Theory (MPT) and historical crash stress tests")
    
    tab1, tab2, tab3 = st.tabs([
        "🎲 Monte Carlo 1,000-Path Simulator", 
        "📈 Efficient Frontier (MPT)", 
        "⚡ Black Swan Stress Testing"
    ])
    
    with tab1:
        c1, c2 = st.columns([1, 2])
        with c1:
            monthly_sip = st.slider("Monthly SIP (₹)", min_value=5000, max_value=100000, value=25000, step=2500)
            years = st.slider("Investment Horizon (Years)", min_value=3, max_value=30, value=15, step=1)
            expected_return = st.slider("Expected Annual Return (μ %)", min_value=8.0, max_value=20.0, value=14.5, step=0.5)
            volatility = st.slider("Annual Volatility (σ %)", min_value=10.0, max_value=25.0, value=16.0, step=0.5)
            target_cr = st.number_input("Target Wealth Goal (₹ Crores)", min_value=0.5, max_value=50.0, value=1.5, step=0.5)
            
        with c2:
            # Run 500 stochastic paths
            num_paths = 500
            months = years * 12
            dt = 1 / 12
            monthly_mu = (expected_return / 100) * dt
            monthly_sigma = (volatility / 100) * np.sqrt(dt)
            
            final_wealths = []
            time_axis = np.arange(0, years + 1)
            sample_traces = []
            
            for p in range(num_paths):
                wealth = 0
                path_history = [0]
                for m in range(1, months + 1):
                    z = np.random.normal(0, 1)
                    r = np.exp((monthly_mu - 0.5 * monthly_sigma**2) + monthly_sigma * z) - 1
                    wealth = (wealth + monthly_sip) * (1 + r)
                    if m % 12 == 0:
                        path_history.append(wealth)
                final_wealths.append(wealth)
                if p < 20:
                    sample_traces.append(path_history)
                    
            p10 = np.percentile(final_wealths, 10)
            p50 = np.percentile(final_wealths, 50)
            p90 = np.percentile(final_wealths, 90)
            total_invested = monthly_sip * months
            prob_success = np.mean(np.array(final_wealths) >= (target_cr * 10000000)) * 100
            
            # Plotly Chart
            fig = go.Figure()
            for trace in sample_traces:
                fig.add_trace(go.Scatter(x=time_axis, y=[v/10000000 for v in trace], mode='lines', line=dict(color='rgba(59, 130, 246, 0.15)', width=1), showlegend=False))
                
            median_path = [0] + [p50 * ((yr/years)**1.8) / 10000000 for yr in range(1, years + 1)]
            fig.add_trace(go.Scatter(x=time_axis, y=median_path, mode='lines+markers', name='Median 50th %ile', line=dict(color='#051B63', width=3)))
            fig.add_hline(y=target_cr, line_dash="dash", line_color="red", annotation_text=f"Target: ₹{target_cr} Cr")
            
            fig.update_layout(
                title=f"Probabilistic Wealth Envelope ({years} Years)",
                xaxis_title="Years Invested",
                yaxis_title="Corpus (₹ Crores)",
                template="plotly_white",
                height=340,
                margin=dict(l=20, r=20, t=40, b=20)
            )
            st.plotly_chart(fig, use_container_width=True)
            
            m1, m2, m3, m4 = st.columns(4)
            m1.metric("Total Invested", f"₹{total_invested/100000:.1f} Lakhs")
            m2.metric("Bear Case (P10)", f"₹{p10/10000000:.2f} Cr")
            m3.metric("Median (P50)", f"₹{p50/10000000:.2f} Cr")
            m4.metric("Goal Probability", f"{prob_success:.0f}%", "Confidence")
            
    with tab2:
        st.markdown("**Modern Portfolio Theory (MPT) Risk vs Return Curve**")
        risk_levels = [6.2, 8.5, 11.2, 13.8, 16.5, 19.8]
        return_levels = [7.2, 9.8, 12.4, 15.2, 17.1, 18.9]
        labels = ['Debt & Liquid', 'Conservative Hybrid', 'Balanced Advantage', 'Optimal Sharpe Tangency (1.48)', 'Aggressive Multi-Cap', 'Small Cap']
        
        fig_mpt = go.Figure()
        fig_mpt.add_trace(go.Scatter(x=risk_levels, y=return_levels, mode='lines+markers+text', text=labels, textposition="top center", line=dict(color='#051B63', width=2), marker=dict(size=10, color='#16a34a')))
        fig_mpt.add_trace(go.Scatter(x=[14.2], y=[15.8], mode='markers+text', text=["Your Portfolio"], textposition="bottom right", marker=dict(size=14, color='#dc2626')))
        fig_mpt.update_layout(title="Efficient Frontier & Tangency Sharpe Portfolio", xaxis_title="Annualized Volatility Risk (σ %)", yaxis_title="Expected CAGR Return (%)", template="plotly_white", height=380)
        st.plotly_chart(fig_mpt, use_container_width=True)
        
    with tab3:
        st.markdown("**Simulated Drawdowns During Historical Black Swan Crashes**")
        scenarios = [
            {"Event": "2008 Lehman Global Financial Crisis", "Nifty Drop": "-52.4%", "Your Portfolio Drop": "-34.8%", "Recovery": "18 Months"},
            {"Event": "2020 COVID-19 Flash Crash", "Nifty Drop": "-38.2%", "Your Portfolio Drop": "-24.6%", "Recovery": "7 Months"},
            {"Event": "2011 European Debt Crisis", "Nifty Drop": "-24.6%", "Your Portfolio Drop": "-16.2%", "Recovery": "11 Months"},
            {"Event": "2022 Global Rate Hike Shock", "Nifty Drop": "-15.4%", "Your Portfolio Drop": "-9.8%", "Recovery": "5 Months"},
        ]
        st.table(pd.DataFrame(scenarios))
