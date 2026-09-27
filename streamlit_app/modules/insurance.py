import streamlit as st
import pandas as pd

INSURANCE_DATA = [
    {
        "id": "health-01",
        "type": "Health Insurance",
        "name": "Care Supreme Comprehensive Health Plan",
        "insurer": "Care Health Insurance",
        "cover": "₹25 Lakhs",
        "monthly_premium": 980,
        "annual_premium": 11450,
        "claim_ratio": "95.2%",
        "features": ["Unlimited 100% restoration", "0% Copay", "11,200+ Cashless Hospitals"],
    },
    {
        "id": "health-02",
        "type": "Health Insurance",
        "name": "Optima Secure 4X Health Shield",
        "insurer": "HDFC ERGO General Insurance",
        "cover": "₹50 Lakhs",
        "monthly_premium": 1540,
        "annual_premium": 17890,
        "claim_ratio": "98.8%",
        "features": ["2X Cover from Day 1", "Zero Consumables Deduction", "13,500+ Cashless Garages & Hospitals"],
    },
    {
        "id": "term-01",
        "type": "Term Life",
        "name": "Click 2 Protect Super Pure Term Plan",
        "insurer": "HDFC Life Insurance",
        "cover": "₹1.5 Crore",
        "monthly_premium": 1120,
        "annual_premium": 12900,
        "claim_ratio": "99.5%",
        "features": ["Terminal Illness Payout", "Waiver of Premium on Disability", "Smart Return of Premium at 60"],
    },
    {
        "id": "term-02",
        "type": "Term Life",
        "name": "Smart Total Elite Protection (STEP)",
        "insurer": "Max Life Insurance",
        "cover": "₹2 Crore",
        "monthly_premium": 1480,
        "annual_premium": 16950,
        "claim_ratio": "99.6%",
        "features": ["4-Hour Claim Settlement", "64 Critical Illness Add-on", "Non-smoker Special Discounts"],
    },
    {
        "id": "motor-01",
        "type": "Motor Insurance",
        "name": "AutoSecure 0% Bumper-to-Bumper Zero Dep",
        "insurer": "Tata AIG General Insurance",
        "cover": "Full IDV + 0% Dep",
        "monthly_premium": 680,
        "annual_premium": 7850,
        "claim_ratio": "97.2%",
        "features": ["8,200+ Cashless Garages", "Engine & Gearbox Protection", "24x7 Roadside Assistance"],
    },
]

def render_insurance_page():
    st.subheader("🛡️ Seamless Insurance Solutions")
    st.caption("IRDAI-certified Health, Pure Term Life, Motor & Retirement Annuities")
    
    plan_types = ["All Plans", "Health Insurance", "Term Life", "Motor Insurance"]
    selected_type = st.radio("Select Category", plan_types, horizontal=True)
    
    filtered_plans = INSURANCE_DATA
    if selected_type != "All Plans":
        filtered_plans = [p for p in filtered_plans if p["type"] == selected_type]
        
    for plan in filtered_plans:
        with st.container():
            st.markdown(f"""
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="background: #fef2f2; color: #b91c1c; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; font-weight:700;">{plan['type']}</span>
                    <span style="color: #16a34a; font-weight: 700; font-size: 0.8rem;">{plan['claim_ratio']} Claim Settlement</span>
                </div>
                <h4 style="color: #0f172a; margin: 0.5rem 0 0.2rem 0;">{plan['name']}</h4>
                <p style="color: #64748b; font-size: 0.82rem;">{plan['insurer']}</p>
                <div style="display: flex; gap: 2rem; font-size: 0.85rem; border-top: 1px solid #f1f5f9; padding-top: 0.6rem;">
                    <div><span style="color:#64748b;">Cover:</span> <b>{plan['cover']}</b></div>
                    <div><span style="color:#64748b;">Monthly Premium:</span> <b style="color:#16a34a;">₹{plan['monthly_premium']:,}/mo</b></div>
                    <div><span style="color:#64748b;">Annual Premium:</span> <b>₹{plan['annual_premium']:,}</b></div>
                </div>
                <ul style="font-size: 0.8rem; color: #475569; margin-top: 0.5rem;">
                    {''.join([f"<li>{f}</li>" for f in plan['features']])}
                </ul>
            </div>
            """, unsafe_allow_html=True)
            
            if st.button("Generate Instant Digital Proposal", key=f"ins_{plan['id']}"):
                st.success(f"Proposal generated for {plan['name']}. IRDAI e-Insurance account (eIA) linked.")
