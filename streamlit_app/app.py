import streamlit as st
import os
import sys

# Add current directory to path for module imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from modules.ui_components import (
    apply_custom_css, 
    render_logo, 
    render_market_ticker, 
    render_footer
)
from modules.mutual_funds import render_mutual_funds_page
from modules.insurance import render_insurance_page
from modules.portfolio import render_portfolio_dashboard
from modules.data_science import render_data_science_studio
from modules.calculators import render_calculators_page
from modules.ai_advisor import render_ai_advisor

# Configure Streamlit Page
st.set_page_config(
    page_title="Vian Capital | Wealth Management, Mutual Funds & Insurance",
    page_icon="💼",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Apply Brand Styling
apply_custom_css()

# Render Top Ticker
render_market_ticker()

# Sidebar Navigation
with st.sidebar:
    render_logo(size="medium")
    st.markdown("**India's Premier Wealth Platform**")
    st.caption("Inspired by NJ Wealth, ZFunds & Kotak Securities")
    
    st.markdown("---")
    nav = st.radio(
        "Navigation",
        [
            "🏠 Home Overview",
            "📈 Mutual Funds Explorer",
            "🛡️ Insurance Solutions",
            "💼 Portfolio Tracker Desk",
            "🤖 Vian Wealth AI Advisor",
            "🔬 Quant & Data Science",
            "🧮 Financial Calculators",
            "🤝 Partner Network Desk"
        ],
        index=0
    )
    
    st.markdown("---")
    st.markdown("**Client Profile:**")
    st.caption("👤 Rajesh Kumar Sharma (HNI)")
    st.caption("💳 Portfolio: ₹27,82,450 (+50.8%)")
    st.caption("🏛️ HDFC Bank AutoPay Active")
    
    st.markdown("---")
    # Direct ZIP download link if available
    zip_path = os.path.join(os.path.dirname(__file__), "..", "viancapital-website.zip")
    if os.path.exists(zip_path):
        with open(zip_path, "rb") as f:
            st.download_button(
                label="📦 Download Complete Project ZIP",
                data=f.read(),
                file_name="viancapital-website.zip",
                mime="application/zip",
                use_container_width=True
            )

# Main Navigation Router
if nav == "🏠 Home Overview":
    st.markdown("""
    <div class="main-header">
        <span class="badge-blue" style="background: rgba(255,255,255,0.2); color: #dbeafe;">AMFI & IRDAI REGISTERED WEALTH PLATFORM</span>
        <h1 style="color: white; margin: 0.6rem 0; font-size: 2.5rem; letter-spacing: -1px;">
            Intelligent Wealth Management & Insurance for High-Growth India
        </h1>
        <p style="color: #cbd5e1; font-size: 1.05rem; max-width: 800px; margin-bottom: 1.5rem;">
            Automated Daily & Monthly SIPs, quantitative portfolio tracking, zero-commission direct mutual funds, 
            and comprehensive life protection inspired by NJ Wealth, ZFunds & Kotak Securities.
        </p>
        <div style="display: flex; gap: 2rem; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 1rem; font-size: 0.9rem;">
            <div>Assets Tracked: <b>₹4,250+ Cr</b></div>
            <div>Active Investors: <b>150,000+</b></div>
            <div>Claim Settlement: <b style="color: #4ade80;">99.4%</b></div>
            <div>Partner MFD Network: <b>3,800+</b></div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown("""
        <div class="metric-card">
            <h4 style="color:#051B63; margin-top:0;">Top SIP Funds</h4>
            <p style="font-size:0.8rem; color:#64748b;">Daily & Monthly SIPs from ₹100 with zero brokerage and paperless e-Mandate.</p>
        </div>
        """, unsafe_allow_html=True)
    with col2:
        st.markdown("""
        <div class="metric-card">
            <h4 style="color:#e11d48; margin-top:0;">Health & Term Cover</h4>
            <p style="font-size:0.8rem; color:#64748b;">Up to ₹1 Cr coverage from ₹890/mo with 13,500+ cashless network hospitals.</p>
        </div>
        """, unsafe_allow_html=True)
    with col3:
        st.markdown("""
        <div class="metric-card">
            <h4 style="color:#4f46e5; margin-top:0;">Vian Wealth AI</h4>
            <p style="font-size:0.8rem; color:#64748b;">Multi-agent quant advisory for real-time asset allocation & Section 112A tax harvesting.</p>
        </div>
        """, unsafe_allow_html=True)
    with col4:
        st.markdown("""
        <div class="metric-card">
            <h4 style="color:#16a34a; margin-top:0;">Monte Carlo Sim</h4>
            <p style="font-size:0.8rem; color:#64748b;">Simulate 1,000 forward paths to project your goal achievement odds.</p>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("### ✈️ Viaan Holidays Travel & Goal SIP Synergy")
    st.info("Plan your next international luxury vacation to Switzerland, London, or Maldives with dedicated Goal SIPs. Earn exclusive travel discounts and complimentary concierge with Viaan Holidays!")

elif nav == "📈 Mutual Funds Explorer":
    render_mutual_funds_page()

elif nav == "🛡️ Insurance Solutions":
    render_insurance_page()

elif nav == "💼 Portfolio Tracker Desk":
    render_portfolio_dashboard()

elif nav == "🤖 Vian Wealth AI Advisor":
    render_ai_advisor()

elif nav == "🔬 Quant & Data Science":
    render_data_science_studio()

elif nav == "🧮 Financial Calculators":
    render_calculators_page()

elif nav == "🤝 Partner Network Desk":
    st.subheader("🤝 Vian Capital Partner & Sub-Broker Franchise Desk")
    st.caption("NJ Wealth & ZFunds B2B Distribution Model for MFDs, IFAs & Chartered Accountants")
    st.markdown("""
    - **100% Paperless Client Onboarding** via digital CAMS/KFintech integration.
    - **Multi-Asset Product Suite:** 42+ AMCs, leading Life & Health Insurers, SGBs & Corporate FDs.
    - **Automated Trail Payouts:** Industry-leading revenue share with zero setup cost.
    """)
    st.success("Partner ID Registration Open: Enter your ARN or mobile number to join our 3,800+ national advisor network.")

# Render Footer
render_footer()
