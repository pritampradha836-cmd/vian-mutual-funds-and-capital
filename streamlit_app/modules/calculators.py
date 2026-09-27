import streamlit as st
import numpy as np

def render_calculators_page():
    st.subheader("🧮 Financial Calculators & Goal Architecture")
    st.caption("Accurate compounding projections for SIP, Lumpsum, SWP, Tax Optimization & Life Coverage")
    
    calc_choice = st.radio("Choose Calculator", ["SIP Compounding", "Lumpsum Wealth", "SWP Regular Pension", "ELSS Tax Saver", "Insurance Cover (HLV)"], horizontal=True)
    
    if calc_choice == "SIP Compounding":
        c1, c2 = st.columns(2)
        with c1:
            sip = st.number_input("Monthly SIP (₹)", value=10000, step=1000)
            years = st.slider("Investment Period (Years)", 1, 35, 15)
            cagr = st.slider("Expected CAGR (%)", 8.0, 22.0, 14.0, 0.5)
            step_up = st.checkbox("Annual Step-Up (+10% every year)", value=True)
            
        with c2:
            total_invested = 0
            wealth = 0
            curr_sip = sip
            monthly_r = (cagr / 100) / 12
            
            for y in range(1, years + 1):
                for m in range(1, 13):
                    total_invested += curr_sip
                    months_left = (years * 12) - ((y - 1) * 12 + m)
                    wealth += curr_sip * ((1 + monthly_r) ** months_left)
                if step_up:
                    curr_sip *= 1.10
                    
            st.markdown(f"""
            <div style="background: #051B63; color: white; padding: 1.5rem; border-radius: 1rem;">
                <span style="font-size: 0.8rem; color: #93c5fd; text-transform: uppercase;">Projected Maturity Corpus</span>
                <h2 style="color: white; margin: 0.2rem 0; font-size: 2.2rem;">₹{wealth/10000000:.2f} Crore</h2>
                <div style="display:flex; justify-content:space-between; margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 0.5rem; font-size: 0.85rem;">
                    <div>Invested: <b>₹{total_invested:,.0f}</b></div>
                    <div>Estimated Gains: <b style="color:#4ade80;">₹{(wealth - total_invested):,.0f}</b></div>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
    elif calc_choice == "Lumpsum Wealth":
        c1, c2 = st.columns(2)
        with c1:
            lump = st.number_input("One-Time Investment (₹)", value=500000, step=50000)
            years = st.slider("Duration (Years)", 1, 30, 10)
            cagr = st.slider("Expected CAGR (%)", 8.0, 22.0, 15.0, 0.5)
        with c2:
            final_val = lump * ((1 + cagr/100) ** years)
            st.markdown(f"""
            <div style="background: #051B63; color: white; padding: 1.5rem; border-radius: 1rem;">
                <span style="font-size: 0.8rem; color: #93c5fd; text-transform: uppercase;">Future Maturity Value</span>
                <h2 style="color: white; margin: 0.2rem 0; font-size: 2.2rem;">₹{final_val/10000000:.2f} Crore</h2>
                <div style="display:flex; justify-content:space-between; margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 0.5rem; font-size: 0.85rem;">
                    <div>Invested: <b>₹{lump:,.0f}</b></div>
                    <div>Compounded Gains: <b style="color:#4ade80;">₹{(final_val - lump):,.0f}</b></div>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
    elif calc_choice == "SWP Regular Pension":
        c1, c2 = st.columns(2)
        with c1:
            corpus = st.number_input("Initial Retirement Corpus (₹)", value=5000000, step=500000)
            withdrawal = st.number_input("Desired Monthly Payout (₹)", value=35000, step=2500)
            years = st.slider("Duration (Years)", 5, 30, 15)
        with c2:
            st.info(f"Total Pension Payouts: ₹{(withdrawal * years * 12):,.0f} over {years} years while principal remains invested.")
            
    elif calc_choice == "ELSS Tax Saver":
        c1, c2 = st.columns(2)
        with c1:
            inv = st.slider("ELSS Investment Amount (₹)", 10000, 150000, 150000, 10000)
        with c2:
            tax_saved = inv * 0.312
            proj_3y = inv * (1.18 ** 3)
            st.success(f"Direct Tax Saved: ₹{tax_saved:,.0f} under Section 80C. Projected 3Y Maturity: ₹{proj_3y:,.0f}")
            
    elif calc_choice == "Insurance Cover (HLV)":
        c1, c2 = st.columns(2)
        with c1:
            income = st.number_input("Annual Take-Home Income (₹)", value=1800000, step=100000)
            age = st.slider("Current Age", 21, 55, 32)
        with c2:
            recommended_cover = income * 20
            st.markdown(f"""
            <div style="background: #051B63; color: white; padding: 1.5rem; border-radius: 1rem;">
                <span style="font-size: 0.8rem; color: #93c5fd; text-transform: uppercase;">Recommended Pure Term Life Cover</span>
                <h2 style="color: white; margin: 0.2rem 0; font-size: 2.2rem;">₹{recommended_cover/10000000:.2f} Crore</h2>
                <p style="font-size: 0.8rem; color: #cbd5e1; margin:0;">Guarantees full financial freedom for your dependents till retirement.</p>
            </div>
            """, unsafe_allow_html=True)
