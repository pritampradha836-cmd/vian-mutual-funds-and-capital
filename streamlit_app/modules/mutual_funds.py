import streamlit as st
import pandas as pd

FUNDS_DATA = [
    {
        "id": "ppfc-01",
        "name": "Parag Parikh Flexi Cap Fund - Direct Growth",
        "amc": "PPFAS Mutual Fund",
        "category": "Flexi Cap",
        "nav": 84.15,
        "returns_1y": 34.2,
        "returns_3y": 22.8,
        "returns_5y": 24.1,
        "aum_cr": 72450,
        "expense_ratio": 0.62,
        "risk_level": "Very High",
        "min_sip": 1000,
        "rating": 5,
        "sharpe": 1.62,
        "alpha": 5.4,
    },
    {
        "id": "hdfc-flexi-02",
        "name": "HDFC Flexi Cap Fund - Direct Growth",
        "amc": "HDFC Mutual Fund",
        "category": "Flexi Cap",
        "nav": 1985.40,
        "returns_1y": 36.8,
        "returns_3y": 24.5,
        "returns_5y": 22.7,
        "aum_cr": 58920,
        "expense_ratio": 0.81,
        "risk_level": "Very High",
        "min_sip": 500,
        "rating": 5,
        "sharpe": 1.55,
        "alpha": 4.8,
    },
    {
        "id": "icici-blue-03",
        "name": "ICICI Prudential Bluechip Fund - Direct Growth",
        "amc": "ICICI Prudential Mutual Fund",
        "category": "Large Cap",
        "nav": 112.45,
        "returns_1y": 29.4,
        "returns_3y": 18.2,
        "returns_5y": 17.6,
        "aum_cr": 56100,
        "expense_ratio": 0.89,
        "risk_level": "Very High",
        "min_sip": 500,
        "rating": 5,
        "sharpe": 1.34,
        "alpha": 2.9,
    },
    {
        "id": "nippon-small-04",
        "name": "Nippon India Small Cap Fund - Direct Growth",
        "amc": "Nippon India Mutual Fund",
        "category": "Small Cap",
        "nav": 178.60,
        "returns_1y": 48.6,
        "returns_3y": 29.8,
        "returns_5y": 31.4,
        "aum_cr": 57400,
        "expense_ratio": 0.68,
        "risk_level": "Very High",
        "min_sip": 1000,
        "rating": 5,
        "sharpe": 1.78,
        "alpha": 7.2,
    },
    {
        "id": "motilal-mid-05",
        "name": "Motilal Oswal Midcap Fund - Direct Growth",
        "amc": "Motilal Oswal Mutual Fund",
        "category": "Mid Cap",
        "nav": 96.30,
        "returns_1y": 56.4,
        "returns_3y": 34.2,
        "returns_5y": 28.9,
        "aum_cr": 18450,
        "expense_ratio": 0.65,
        "risk_level": "Very High",
        "min_sip": 500,
        "rating": 5,
        "sharpe": 1.84,
        "alpha": 8.6,
    },
    {
        "id": "mirae-elss-06",
        "name": "Mirae Asset ELSS Tax Saver Fund - Direct Growth",
        "amc": "Mirae Asset Mutual Fund",
        "category": "ELSS Tax Saver",
        "nav": 48.75,
        "returns_1y": 31.8,
        "returns_3y": 19.4,
        "returns_5y": 19.8,
        "aum_cr": 24300,
        "expense_ratio": 0.59,
        "risk_level": "Very High",
        "min_sip": 500,
        "rating": 4,
        "sharpe": 1.41,
        "alpha": 3.8,
    },
    {
        "id": "quant-small-07",
        "name": "Quant Small Cap Fund - Direct Growth",
        "amc": "Quant Mutual Fund",
        "category": "Small Cap",
        "nav": 265.80,
        "returns_1y": 44.5,
        "returns_3y": 31.2,
        "returns_5y": 36.8,
        "aum_cr": 22800,
        "expense_ratio": 0.77,
        "risk_level": "Very High",
        "min_sip": 1000,
        "rating": 5,
        "sharpe": 1.72,
        "alpha": 9.1,
    },
    {
        "id": "uti-nifty-08",
        "name": "UTI Nifty 50 Index Fund - Direct Growth",
        "amc": "UTI Mutual Fund",
        "category": "Index Funds",
        "nav": 172.90,
        "returns_1y": 26.8,
        "returns_3y": 16.2,
        "returns_5y": 16.5,
        "aum_cr": 19800,
        "expense_ratio": 0.18,
        "risk_level": "Very High",
        "min_sip": 500,
        "rating": 4,
        "sharpe": 1.28,
        "alpha": 0.05,
    },
    {
        "id": "icici-equity-debt-09",
        "name": "ICICI Prudential Equity & Debt Fund - Direct Growth",
        "amc": "ICICI Prudential Mutual Fund",
        "category": "Hybrid",
        "nav": 388.20,
        "returns_1y": 33.5,
        "returns_3y": 23.4,
        "returns_5y": 21.9,
        "aum_cr": 38900,
        "expense_ratio": 0.98,
        "risk_level": "High",
        "min_sip": 500,
        "rating": 5,
        "sharpe": 1.64,
        "alpha": 5.1,
    },
    {
        "id": "kotak-liquid-11",
        "name": "Kotak Liquid Fund - Direct Growth",
        "amc": "Kotak Mahindra Mutual Fund",
        "category": "Debt & Liquid",
        "nav": 4982.50,
        "returns_1y": 7.35,
        "returns_3y": 6.85,
        "returns_5y": 5.92,
        "aum_cr": 41200,
        "expense_ratio": 0.17,
        "risk_level": "Low",
        "min_sip": 500,
        "rating": 5,
        "sharpe": 2.15,
        "alpha": 0.4,
    },
]

def get_funds_dataframe():
    return pd.DataFrame(FUNDS_DATA)

def render_mutual_funds_page():
    st.subheader("📈 Direct Mutual Funds Explorer")
    st.caption("Invest in 24+ top AMCs with Zero Commission, Instant Daily/Monthly SIPs & Paperless e-Mandate")
    
    df = get_funds_dataframe()
    
    col1, col2 = st.columns([2, 1])
    with col1:
        search_query = st.text_input("🔍 Search by scheme name, fund house, or category", "")
    with col2:
        categories = ["All"] + sorted(list(df["category"].unique()))
        selected_cat = st.selectbox("Filter Category", categories)
        
    filtered_df = df
    if search_query:
        filtered_df = filtered_df[filtered_df["name"].str.contains(search_query, case=False)]
    if selected_cat != "All":
        filtered_df = filtered_df[filtered_df["category"] == selected_cat]
        
    st.markdown(f"**Showing {len(filtered_df)} schemes**")
    
    # Display schemes cards
    for _, fund in filtered_df.iterrows():
        with st.container():
            st.markdown(f"""
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="background: #eff6ff; color: #1d4ed8; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; font-weight:700;">{fund['category']}</span>
                    <span style="color: #f59e0b; font-weight: bold; font-size: 0.85rem;">★ {fund['rating']}.0 CRISIL</span>
                </div>
                <h4 style="color: #0f172a; margin: 0.5rem 0 0.2rem 0; font-size: 1.05rem;">{fund['name']}</h4>
                <p style="color: #64748b; font-size: 0.8rem; margin-bottom: 0.75rem;">{fund['amc']}</p>
                <div style="display: flex; gap: 2rem; font-size: 0.82rem; border-top: 1px solid #f1f5f9; padding-top: 0.6rem;">
                    <div><span style="color:#64748b;">Current NAV:</span> <b>₹{fund['nav']}</b></div>
                    <div><span style="color:#64748b;">3Y CAGR:</span> <b style="color:#16a34a;">+{fund['returns_3y']}%</b></div>
                    <div><span style="color:#64748b;">AUM:</span> <b>₹{fund['aum_cr']:,} Cr</b></div>
                    <div><span style="color:#64748b;">Min SIP:</span> <b>₹{fund['min_sip']}</b></div>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            c1, c2 = st.columns([1, 4])
            with c1:
                if st.button(f"Invest in {fund['category']}", key=f"inv_{fund['id']}"):
                    st.success(f"Order initiated for {fund['name']}! Routing to BSE Star MF.")
