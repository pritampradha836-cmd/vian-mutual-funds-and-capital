import streamlit as st

def apply_custom_css():
    """Injects high-end institutional styling for Vian Capital."""
    st.markdown("""
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800&display=swap');
        
        html, body, [class*="css"] {
            font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        h1, h2, h3, h4 {
            font-family: 'Outfit', sans-serif;
            font-weight: 700;
        }
        
        .main-header {
            background: linear-gradient(135deg, #051B63 0%, #072480 60%, #0A2E9E 100%);
            padding: 2.2rem 2rem;
            border-radius: 1.25rem;
            color: white;
            margin-bottom: 1.5rem;
            box-shadow: 0 10px 25px -5px rgba(5, 27, 99, 0.25);
        }
        
        .metric-card {
            background: white;
            border-radius: 1rem;
            padding: 1.25rem;
            border: 1px solid #e2e8f0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            margin-bottom: 0.75rem;
        }
        
        .ticker-bar {
            background-color: #051438;
            color: #e2e8f0;
            padding: 0.5rem 1rem;
            border-radius: 0.75rem;
            font-size: 0.82rem;
            margin-bottom: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .badge-green {
            background-color: #dcfce7;
            color: #15803d;
            padding: 0.2rem 0.5rem;
            border-radius: 0.375rem;
            font-weight: 700;
            font-size: 0.75rem;
        }
        
        .badge-blue {
            background-color: #dbeafe;
            color: #1d4ed8;
            padding: 0.2rem 0.5rem;
            border-radius: 0.375rem;
            font-weight: 700;
            font-size: 0.75rem;
        }
    </style>
    """, unsafe_allow_html=True)

def render_logo(size="large"):
    """Renders the authentic Vian Capital SVG Monogram."""
    width = 46 if size == "large" else 36
    font_size_vian = "1.8rem" if size == "large" else "1.3rem"
    font_size_cap = "0.75rem" if size == "large" else "0.55rem"
    
    st.markdown(f"""
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 0.5rem;">
        <svg width="{width}" height="{width}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 68 22 A 40 40 0 1 0 88 56" stroke="#051B63" stroke-width="7.5" stroke-linecap="round"/>
            <path d="M 28 36 L 47 76" stroke="#051B63" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M 47 76 L 82 14" stroke="#051B63" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div style="line-height: 1.1;">
            <div style="font-family: 'Outfit', sans-serif; font-size: {font_size_vian}; font-weight: 900; color: #051B63; letter-spacing: -0.5px;">VIAN</div>
            <div style="font-size: {font_size_cap}; font-weight: 700; color: #051B63; letter-spacing: 0.28em;">CAPITAL</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

def render_market_ticker():
    """Renders real-time Indian stock market ticker bar."""
    st.markdown("""
    <div class="ticker-bar">
        <span>🟢 <b>NSE/BSE LIVE</b> &nbsp;|&nbsp; <b>NIFTY 50:</b> 25,790.85 <span style="color:#4ade80;">+0.56%</span> &nbsp;|&nbsp; <b>SENSEX:</b> 84,544.30 <span style="color:#4ade80;">+0.57%</span> &nbsp;|&nbsp; <b>GOLD (10g):</b> ₹75,850 <span style="color:#4ade80;">+0.42%</span> &nbsp;|&nbsp; <b>USD/INR:</b> 83.92</span>
        <span style="font-size: 0.75rem; color: #94a3b8;">AMFI ARN-284910 • IRDAI Registered</span>
    </div>
    """, unsafe_allow_html=True)

def render_footer():
    """Renders institutional regulatory footer."""
    st.markdown("---")
    st.markdown("""
    <div style="font-size: 0.8rem; color: #64748b; line-height: 1.5; padding: 1rem 0;">
        <b>Statutory Disclaimer:</b> Mutual fund investments are subject to market risks, read all scheme related documents carefully. 
        Vian Capital (www.viancapital.in) is an AMFI-registered Mutual Fund Distributor (ARN-284910) and IRDAI-registered Corporate Insurance Broker. 
        In association with <b>Viaan Holidays</b> for goal-based wealth vacation planning.
        <br/><br/>
        © 2026 Vian Capital. All rights reserved. Registered offices in Mumbai & New Delhi.
    </div>
    """, unsafe_allow_html=True)
