import streamlit as st
import pandas as pd
import numpy as np

SAMPLE_HOLDINGS = [
    {
        "scheme": "Parag Parikh Flexi Cap Fund",
        "category": "Flexi Cap",
        "units": 11250.45,
        "invested": 616524,
        "current_val": 946725,
        "gain": 330201,
        "returns_pct": 53.56,
        "unrealized_ltcg": 312000,
    },
    {
        "scheme": "Motilal Oswal Midcap Fund",
        "category": "Mid Cap",
        "units": 6420.80,
        "invested": 400657,
        "current_val": 618323,
        "gain": 217666,
        "returns_pct": 54.33,
        "unrealized_ltcg": 198000,
    },
    {
        "scheme": "Nippon India Small Cap Fund",
        "category": "Small Cap",
        "units": 2450.60,
        "invested": 289660,
        "current_val": 437677,
        "gain": 148017,
        "returns_pct": 51.10,
        "unrealized_ltcg": 135000,
    },
    {
        "scheme": "Mirae Asset ELSS Tax Saver",
        "category": "ELSS Tax Saver",
        "units": 7850.00,
        "invested": 278675,
        "current_val": 382687,
        "gain": 104012,
        "returns_pct": 37.32,
        "unrealized_ltcg": 94000,
    },
    {
        "scheme": "ICICI Prudential Equity & Debt",
        "category": "Hybrid",
        "units": 680.50,
        "invested": 200747,
        "current_val": 264170,
        "gain": 63423,
        "returns_pct": 31.59,
        "unrealized_ltcg": 58000,
    },
    {
        "scheme": "Kotak Liquid Fund",
        "category": "Debt & Liquid",
        "units": 26.66,
        "invested": 125835,
        "current_val": 132833,
        "gain": 6998,
        "returns_pct": 5.56,
        "unrealized_ltcg": 0,
    },
]

def render_portfolio_dashboard():
    st.subheader("💼 Consolidated Investor Desk")
    st.caption("Client ID: VC-88419 • Rajesh Kumar Sharma • KYC Verified (CAMS)")
    
    df = pd.DataFrame(SAMPLE_HOLDINGS)
    total_invested = df["invested"].sum()
    total_current = df["current_val"].sum()
    total_gain = total_current - total_invested
    total_gain_pct = (total_gain / total_invested) * 100
    
    # Metrics Bar
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Portfolio Current Value", f"₹{total_current:,.0f}", f"+{total_gain_pct:.1f}%")
    with col2:
        st.metric("Total Invested", f"₹{total_invested:,.0f}", "Across 6 Funds")
    with col3:
        st.metric("Unrealized Net Profit", f"₹{total_gain:,.0f}", "XIRR: 18.6%")
    with col4:
        st.metric("Today's Movement", "+₹14,280", "+0.52%")
        
    st.markdown("---")
    
    # Sub tabs
    t1, t2, t3 = st.tabs(["📊 Scheme Holdings", "💡 Section 112A Tax Harvesting", "🔄 Active SIP Mandates"])
    
    with t1:
        st.dataframe(
            df[["scheme", "category", "invested", "current_val", "gain", "returns_pct"]].rename(columns={
                "scheme": "Scheme Name",
                "category": "Category",
                "invested": "Invested (₹)",
                "current_val": "Current Value (₹)",
                "gain": "Net Profit (₹)",
                "returns_pct": "Returns (%)",
            }),
            use_container_width=True
        )
        
    with t2:
        st.markdown("""
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem;">
            <h4 style="color: #166534; margin:0 0 0.5rem 0;">₹1,25,000 Tax-Free Long Term Capital Gains Exemption (Section 112A)</h4>
            <p style="color: #15803d; font-size: 0.85rem; margin:0;">
                Under Indian income tax laws, up to ₹1,25,000 in equity mutual fund long-term gains are 100% exempt from tax each financial year. 
                Selling and re-investing this year resets your purchase cost basis with ZERO tax liability!
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        harvestable = min(df["unrealized_ltcg"].sum(), 125000)
        tax_saved = harvestable * 0.125
        st.info(f"💰 **Total Tax You Can Save This Year:** ₹{tax_saved:,.0f} by harvesting ₹{harvestable:,.0f} of unrealized LTCG before March 31.")
        
    with t3:
        mandates_data = [
            {"Scheme": "Parag Parikh Flexi Cap", "Monthly SIP": "₹15,000", "Debit Date": "5th", "Bank": "HDFC Bank (A/C **4892)", "Status": "Active"},
            {"Scheme": "Motilal Oswal Midcap", "Monthly SIP": "₹10,000", "Debit Date": "10th", "Bank": "HDFC Bank (A/C **4892)", "Status": "Active"},
            {"Scheme": "Nippon India Small Cap", "Monthly SIP": "₹7,500", "Debit Date": "15th", "Bank": "HDFC Bank (A/C **4892)", "Status": "Active"},
            {"Scheme": "Mirae Asset ELSS", "Monthly SIP": "₹5,000", "Debit Date": "20th", "Bank": "HDFC Bank (A/C **4892)", "Status": "Active"},
            {"Scheme": "ICICI Pru Equity & Debt", "Monthly SIP": "₹5,000", "Debit Date": "25th", "Bank": "HDFC Bank (A/C **4892)", "Status": "Active"},
        ]
        st.table(pd.DataFrame(mandates_data))
