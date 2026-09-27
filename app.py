"""
Vian Capital Streamlit Main Entry Point
www.viancapital.in

To run:
streamlit run app.py
"""

import os
import sys

# Ensure streamlit_app is in Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
streamlit_dir = os.path.join(current_dir, 'streamlit_app')
if streamlit_dir not in sys.path:
    sys.path.insert(0, streamlit_dir)

# Execute the main streamlit application
import app as main_app
