# Vian Capital — Website Source Code (www.viancapital.in)

Official website for **Vian Capital** (`viancapital.in`), India's premier AI-driven wealth management, mutual funds, insurance, and portfolio analytics platform (inspired by NJ Wealth, ZFunds, and Kotak Securities).

---

## 🐍 Running as Python Streamlit App

The project also comes with a complete modular Python Streamlit package!

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Launch Streamlit Application
```bash
streamlit run app.py
```
Or run the dedicated modular package:
```bash
streamlit run streamlit_app/app.py
```
Open `http://localhost:8501` to access the full Python Streamlit Vian Capital portal!

### 3. Modular Python Structure
- `app.py`: Streamlit root launcher
- `requirements.txt`: Python package requirements (Streamlit, Plotly, Pandas, NumPy, Scipy, Google GenAI)
- `streamlit_app/app.py`: Main Streamlit app interface & sidebar navigation
- `streamlit_app/modules/ui_components.py`: Custom CSS & brand vector SVG logo
- `streamlit_app/modules/mutual_funds.py`: Direct mutual funds filtering & comparison
- `streamlit_app/modules/insurance.py`: Health, Term Life, and Motor insurance engine
- `streamlit_app/modules/portfolio.py`: Investor desk with Section 112A Tax Harvesting
- `streamlit_app/modules/data_science.py`: Monte Carlo 1,000-path stochastic simulator with Plotly
- `streamlit_app/modules/calculators.py`: SIP Step-Up, Lumpsum, SWP, ELSS, and HLV calculators
- `streamlit_app/modules/ai_advisor.py`: Multi-agent Gemini financial advisors

---

## 🚀 Node.js / React Quick Start Guide

### 1. Prerequisites
Ensure you have **Node.js (v18 or higher)** and **npm** installed on your system.

### 2. Installation
Open your terminal in the extracted project folder and run:
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Optional: Add your `GEMINI_API_KEY` in `.env` to enable live multi-agent AI financial advisor interactions).*

### 4. Running the Development Server
Start the full-stack server (includes Express backend and Vite frontend with hot reload):
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

### 5. Production Build & Deployment
To build the optimized production assets:
```bash
npm run build
npm start
```

---

## 📁 Project Architecture

- `src/App.tsx`: Main dashboard and multi-view application routing.
- `src/components/VianLogo.tsx`: SVG vector logo of Vian Capital.
- `src/components/MarketTicker.tsx`: Real-time NSE/BSE market ticker.
- `src/components/PaymentModal.tsx`: Secure checkout supporting UPI AutoPay, NetBanking, and e-Mandate.
- `src/components/SchemeDetailModal.tsx`: Mutual fund factsheets with AI Scheme Doctor.
- `src/components/InsuranceDetailModal.tsx`: Health, Term, Motor, and Retirement insurance portal.
- `src/components/PortfolioDashboard.tsx`: Comprehensive client desk with Section 112A Tax Harvesting.
- `src/components/AiAdvisorPanel.tsx`: Multi-agent financial advisor powered by Gemini 3.8 Flash.
- `src/components/DataScienceStudio.tsx`: Monte Carlo 1,000-path stochastic simulator, Efficient Frontier, Stress Testing, and Risk Profiler.
- `src/components/CalculatorsStudio.tsx`: SIP with Step-Up, Lumpsum, SWP, ELSS, and Human Life Value (HLV) calculators.
- `src/components/PartnerNetwork.tsx`: MFD / IFA distributor network with instant partner lead generation.
- `src/data/`: Curated datasets for Indian Mutual Funds, Insurance Plans, and Client Portfolios.
- `server.ts`: Express backend handling AI routes, quant optimizations, and static serving.

---

## 🌐 Deploying to Custom Domain (www.viancapital.in)

### Option A: Cloud Run / Docker / VPS
Deploy the full-stack Node.js server (`server.ts`) directly. It listens on port 3000 (or `process.env.PORT`).

### Option B: Vercel / Netlify / Static Hosting
Run `npm run build` to generate the standalone static web application in the `dist/` directory, which can be deployed to any static host or CDN.
