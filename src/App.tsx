import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Search,
  SlidersHorizontal,
  CheckCircle,
  Briefcase,
  Layers,
  HeartPulse,
  Activity,
  Calculator,
  Users,
  Shield,
  PlaneTakeoff,
  PhoneCall,
  Mail,
  MapPin,
  ChevronRight,
  Star,
  Zap,
  Clock,
  RotateCcw,
  Percent
} from 'lucide-react';
import { VianLogo } from './components/VianLogo';
import { Navbar } from './components/Navbar';
import { PaymentModal } from './components/PaymentModal';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { InsuranceDetailModal } from './components/InsuranceDetailModal';
import { PortfolioDashboard } from './components/PortfolioDashboard';
import { AiAdvisorPanel } from './components/AiAdvisorPanel';
import { DataScienceStudio } from './components/DataScienceStudio';
import { CalculatorsStudio } from './components/CalculatorsStudio';
import { PartnerNetwork } from './components/PartnerNetwork';

import { MUTUAL_FUNDS, MutualFund } from './data/mutualFundsData';
import { INSURANCE_PLANS, InsurancePlan } from './data/insuranceData';
import {
  INITIAL_HOLDINGS,
  INITIAL_MANDATES,
  INITIAL_TRANSACTIONS,
  PortfolioHolding,
  SipMandate,
  PortfolioTransaction
} from './data/portfolioData';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('home');

  // Portfolio State (Mutable to reflect real-time user transactions)
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(INITIAL_HOLDINGS);
  const [mandates, setMandates] = useState<SipMandate[]>(INITIAL_MANDATES);
  const [transactions, setTransactions] = useState<PortfolioTransaction[]>(INITIAL_TRANSACTIONS);

  // Modals State
  const [selectedFundForDetail, setSelectedFundForDetail] = useState<MutualFund | null>(null);
  const [selectedFundForPayment, setSelectedFundForPayment] = useState<MutualFund | null>(null);
  const [selectedInsuranceForDetail, setSelectedInsuranceForDetail] = useState<InsurancePlan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);

  // Filter States
  const [fundSearch, setFundSearch] = useState<string>('');
  const [selectedFundCategory, setSelectedFundCategory] = useState<string>('All');
  const [insuranceTypeFilter, setInsuranceTypeFilter] = useState<string>('all');

  // Investor Persona State
  const [isHniProfile, setIsHniProfile] = useState<boolean>(true);

  const userProfile = isHniProfile
    ? {
        name: 'Rajesh Kumar Sharma',
        id: 'VC-88419',
        invested: `₹${holdings.reduce((s, h) => s + h.investedAmount, 0).toLocaleString('en-IN')}`,
        portfolioVal: `₹${holdings.reduce((s, h) => s + h.currentValue, 0).toLocaleString('en-IN')}`,
      }
    : {
        name: 'Pritam Pradhan',
        id: 'VC-10928',
        invested: '₹6,50,000',
        portfolioVal: '₹9,84,200',
      };

  // Filtered Mutual Funds
  const filteredFunds = MUTUAL_FUNDS.filter((fund) => {
    const matchesSearch =
      fund.name.toLowerCase().includes(fundSearch.toLowerCase()) ||
      fund.amc.toLowerCase().includes(fundSearch.toLowerCase()) ||
      fund.category.toLowerCase().includes(fundSearch.toLowerCase());
    const matchesCategory =
      selectedFundCategory === 'All' || fund.category === selectedFundCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered Insurance Plans
  const filteredInsurance = INSURANCE_PLANS.filter((plan) => {
    return insuranceTypeFilter === 'all' || plan.type === insuranceTypeFilter;
  });

  // Handle successful investment order callback
  const handleInvestmentSuccess = (orderData: {
    schemeName: string;
    schemeId: string;
    category: string;
    amount: number;
    type: 'SIP' | 'Lumpsum';
    frequency?: 'Monthly' | 'Daily';
    sipDate?: number;
    paymentMode: string;
    txnId: string;
    folioNumber: string;
  }) => {
    const matchedFund = MUTUAL_FUNDS.find((f) => f.id === orderData.schemeId);
    const applicableNav = matchedFund ? matchedFund.nav : 100;
    const allocatedUnits = Number((orderData.amount / applicableNav).toFixed(2));

    // 1. Add to Transactions
    const newTxn: PortfolioTransaction = {
      id: orderData.txnId,
      date: new Date().toISOString().split('T')[0],
      schemeName: orderData.schemeName,
      type: orderData.type,
      amount: orderData.amount,
      nav: applicableNav,
      units: allocatedUnits,
      status: 'Completed',
      paymentMode: orderData.paymentMode as any,
    };
    setTransactions((prev) => [newTxn, ...prev]);

    // 2. Add or Update in Holdings
    setHoldings((prev) => {
      const existingIndex = prev.findIndex((h) => h.schemeName === orderData.schemeName);
      if (existingIndex > -1) {
        const existing = prev[existingIndex];
        const updatedUnits = existing.units + allocatedUnits;
        const updatedInvested = existing.investedAmount + orderData.amount;
        const updatedCurrent = updatedUnits * existing.currentNav;
        const updatedAbsoluteGain = updatedCurrent - updatedInvested;
        const updatedPercentage = (updatedAbsoluteGain / updatedInvested) * 100;

        const updated = [...prev];
        updated[existingIndex] = {
          ...existing,
          units: updatedUnits,
          investedAmount: updatedInvested,
          currentValue: updatedCurrent,
          absoluteGain: updatedAbsoluteGain,
          returnPercentage: updatedPercentage,
          sipActive: orderData.type === 'SIP' ? true : existing.sipActive,
        };
        return updated;
      } else {
        const newHolding: PortfolioHolding = {
          id: `hold-${Date.now()}`,
          schemeId: orderData.schemeId,
          schemeName: orderData.schemeName,
          category: orderData.category,
          folioNumber: orderData.folioNumber,
          units: allocatedUnits,
          averageBuyNav: applicableNav,
          currentNav: applicableNav,
          investedAmount: orderData.amount,
          currentValue: orderData.amount,
          absoluteGain: 0,
          returnPercentage: 0,
          dayChangePercentage: 0.1,
          dayChangeAmount: Math.round(orderData.amount * 0.001),
          unrealizedLtcg: 0,
          unrealizedStcg: 0,
          purchaseDate: new Date().toISOString().split('T')[0],
          sipActive: orderData.type === 'SIP',
          sipAmount: orderData.type === 'SIP' ? orderData.amount : undefined,
        };
        return [newHolding, ...prev];
      }
    });

    // 3. Add to Mandates if it is a SIP
    if (orderData.type === 'SIP') {
      const newMandate: SipMandate = {
        id: `man-${Date.now()}`,
        schemeName: orderData.schemeName,
        amount: orderData.amount,
        frequency: orderData.frequency || 'Monthly',
        debitDate: orderData.sipDate || 10,
        nextDebitDate: '2026-10-10',
        bankName: 'HDFC Bank (A/C **4892)',
        mandateId: `UMRN-HDFC-${Math.floor(1000000 + Math.random() * 9000000)}`,
        status: 'Active',
      };
      setMandates((prev) => [newMandate, ...prev]);
    }
  };

  const openInvestModal = (fund: MutualFund) => {
    setSelectedFundForPayment(fund);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Primary Sticky Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSipModal={() => openInvestModal(MUTUAL_FUNDS[0])}
        userProfile={userProfile}
        onSwitchProfile={() => setIsHniProfile(!isHniProfile)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12">
        
        {/* ========================================================================= */}
        {/* TAB 1: HOME PAGE OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            
            {/* Hero Section */}
            <div className="relative rounded-3xl bg-gradient-to-br from-[#051B63] via-[#072480] to-[#0A2E9E] text-white p-8 md:p-14 overflow-hidden shadow-2xl">
              <div className="max-w-3xl relative z-10 space-y-6">
                
                {/* Regulatory Trust Badge */}
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>AMFI Registered Mutual Fund Distributor • IRDAI Insurance Broker</span>
                </div>

                {/* Hero Title */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-heading tracking-tight leading-[1.1]">
                  Intelligent Wealth Management & Insurance for High-Growth India
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-lg text-blue-100 font-normal leading-relaxed max-w-2xl">
                  Inspired by NJ Wealth & ZFunds. Automated Daily & Monthly SIPs, quantitative portfolio tracking, zero-commission direct mutual funds, and comprehensive life protection.
                </p>

                {/* Key Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('mutual-funds')}
                    className="py-3 px-6 rounded-xl bg-white hover:bg-slate-100 text-[#051B63] text-sm font-bold shadow-lg shadow-black/10 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Explore Mutual Funds</span>
                    <ArrowRight className="w-4 h-4 text-[#051B63]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('portfolio')}
                    className="py-3 px-6 rounded-xl bg-blue-600/40 hover:bg-blue-600/60 text-white text-sm font-bold border border-blue-400/40 flex items-center gap-2 transition-all backdrop-blur-xs"
                  >
                    <Briefcase className="w-4 h-4 text-blue-200" />
                    <span>View Investor Desk</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('ai-advisor')}
                    className="py-3 px-5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-sm font-bold border border-emerald-400/30 flex items-center gap-2 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Talk to AI Advisor</span>
                  </button>
                </div>

                {/* Live Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-blue-400/20 text-xs">
                  <div>
                    <span className="text-blue-300 block text-[11px]">Assets Tracked</span>
                    <strong className="text-xl sm:text-2xl font-black text-white font-heading">₹4,250+ Cr</strong>
                  </div>
                  <div>
                    <span className="text-blue-300 block text-[11px]">Active Investors</span>
                    <strong className="text-xl sm:text-2xl font-black text-white font-heading">150,000+</strong>
                  </div>
                  <div>
                    <span className="text-blue-300 block text-[11px]">Claim Settlement</span>
                    <strong className="text-xl sm:text-2xl font-black text-emerald-400 font-heading">99.4%</strong>
                  </div>
                  <div>
                    <span className="text-blue-300 block text-[11px]">Partner MFD Network</span>
                    <strong className="text-xl sm:text-2xl font-black text-white font-heading">3,800+</strong>
                  </div>
                </div>

              </div>

              {/* Decorative Background Artwork */}
              <div className="absolute -right-12 -bottom-12 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none"></div>
              <div className="absolute right-12 top-12 opacity-10 pointer-events-none hidden lg:block">
                <VianLogo size="xl" variant="white" showText={false} />
              </div>
            </div>

            {/* Quick Feature Launchpad Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              <div
                onClick={() => setActiveTab('mutual-funds')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                  Top Performing SIP Funds
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Start Daily or Monthly SIPs from ₹100 with zero brokerage and paperless CAMS mandate.
                </p>
                <span className="text-[11px] font-bold text-blue-600 mt-3 inline-flex items-center gap-1">
                  View Schemes <ChevronRight className="w-3 h-3" />
                </span>
              </div>

              <div
                onClick={() => setActiveTab('insurance')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-rose-700 transition-colors">
                  Health & Term Life Cover
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Up to ₹1 Crore coverage starting at ₹890/month with 13,500+ cashless hospitals and 0% copay.
                </p>
                <span className="text-[11px] font-bold text-rose-600 mt-3 inline-flex items-center gap-1">
                  Compare Plans <ChevronRight className="w-3 h-3" />
                </span>
              </div>

              <div
                onClick={() => setActiveTab('ai-advisor')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-700 transition-colors">
                  Vian Wealth AI Doctors
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Multi-agent advisors for real-time asset allocation, risk stress-testing, and LTCG tax optimization.
                </p>
                <span className="text-[11px] font-bold text-indigo-600 mt-3 inline-flex items-center gap-1">
                  Launch AI Agents <ChevronRight className="w-3 h-3" />
                </span>
              </div>

              <div
                onClick={() => setActiveTab('data-science')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                  Monte Carlo Wealth Sim
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Simulate 1,000 probabilistic forward market paths and calculate your exact goal achievement odds.
                </p>
                <span className="text-[11px] font-bold text-emerald-600 mt-3 inline-flex items-center gap-1">
                  Run Simulation <ChevronRight className="w-3 h-3" />
                </span>
              </div>

            </div>

            {/* Featured Mutual Funds Showcase */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-heading">
                    Handpicked High-Alpha Mutual Funds
                  </h3>
                  <p className="text-xs text-slate-500">
                    Highest Sharpe ratio and lowest expense ratio direct growth schemes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('mutual-funds')}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                >
                  View All {MUTUAL_FUNDS.length} Schemes <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {MUTUAL_FUNDS.slice(0, 3).map((fund) => (
                  <div
                    key={fund.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {fund.category}
                        </span>
                        <div className="flex items-center text-amber-500 text-xs gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-slate-800">{fund.rating}.0</span>
                        </div>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm mt-2 line-clamp-1">
                        {fund.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{fund.amc}</p>

                      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">3Y CAGR</span>
                          <strong className="text-emerald-600 font-extrabold text-sm">+{fund.returns3Y}%</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Sharpe</span>
                          <strong className="text-slate-800 font-bold">{fund.sharpeRatio}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Min SIP</span>
                          <strong className="text-slate-800 font-bold">₹{fund.minSip}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-5 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setSelectedFundForDetail(fund)}
                        className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                      >
                        Factsheet
                      </button>
                      <button
                        type="button"
                        onClick={() => openInvestModal(fund)}
                        className="flex-1 py-2 rounded-xl bg-[#051B63] hover:bg-[#072480] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Invest</span>
                        <ArrowRight className="w-3.5 h-3.5 text-blue-200" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Synergy Feature: Viaan Holidays Goal SIP */}
            <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-[#051B63] text-white rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden">
              <div className="max-w-2xl relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 border border-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                  <PlaneTakeoff className="w-3.5 h-3.5 text-amber-300" />
                  Viaan Holidays Strategic Partnership
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-white font-heading">
                  Turn Your Dream Vacations Into Wealth-Funded Realities
                </h3>

                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
                  Plan your family's Swiss Alps escape, London city breaks, or Maldives luxury retreats with automated Goal-Based SIPs. Earn exclusive travel discounts and complimentary airport concierge through Viaan Holidays when you invest with Vian Capital!
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('calculators');
                    }}
                    className="py-2.5 px-5 bg-white text-[#051B63] font-bold text-xs rounded-xl shadow-md hover:bg-slate-100 transition-colors"
                  >
                    Calculate Vacation Goal SIP
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('partners')}
                    className="py-2.5 px-5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-colors"
                  >
                    Corporate Travel & Wealth Rewards
                  </button>
                </div>
              </div>

              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-400/10 to-transparent pointer-events-none"></div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MUTUAL FUNDS EXPLORER */}
        {/* ========================================================================= */}
        {activeTab === 'mutual-funds' && (
          <div className="space-y-6">
            
            {/* Header & Search Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 font-heading">
                    Explore Direct Mutual Funds
                  </h3>
                  <p className="text-xs text-slate-500">
                    Invest in 24+ top AMCs with zero commission, daily/monthly SIPs, and automated e-Mandate
                  </p>
                </div>

                {/* Search Box */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fundSearch}
                    onChange={(e) => setFundSearch(e.target.value)}
                    placeholder="Search scheme, fund house, manager..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50"
                  />
                </div>
              </div>

              {/* Category Pills Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
                {[
                  'All',
                  'Flexi Cap',
                  'Large Cap',
                  'Mid Cap',
                  'Small Cap',
                  'ELSS Tax Saver',
                  'Hybrid',
                  'Index Funds',
                  'Debt & Liquid',
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedFundCategory(cat)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedFundCategory === cat
                        ? 'bg-[#051B63] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scheme Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFunds.map((fund) => (
                <div
                  key={fund.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {fund.category}
                      </span>
                      <div className="flex items-center text-amber-500 text-xs gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-800">{fund.rating}.0</span>
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-2 line-clamp-1">
                      {fund.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{fund.amc}</p>

                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">3Y CAGR</span>
                        <strong className="text-emerald-600 font-extrabold text-sm">+{fund.returns3Y}%</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">AUM</span>
                        <strong className="text-slate-800 font-bold">₹{fund.aum.toLocaleString('en-IN')} Cr</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Min SIP</span>
                        <strong className="text-slate-800 font-bold">₹{fund.minSip}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedFundForDetail(fund)}
                      className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                    >
                      Factsheet
                    </button>
                    <button
                      type="button"
                      onClick={() => openInvestModal(fund)}
                      className="flex-1 py-2 rounded-xl bg-[#051B63] hover:bg-[#072480] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Start SIP</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-200" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: INSURANCE SOLUTIONS */}
        {/* ========================================================================= */}
        {activeTab === 'insurance' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-heading">
                  Comprehensive Insurance Solutions
                </h3>
                <p className="text-xs text-slate-500">
                  IRDAI-certified Health, Pure Term Life, Motor & Tax-Free Retirement Annuity plans
                </p>
              </div>

              {/* Type Filter */}
              <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
                {[
                  { id: 'all', label: 'All Plans' },
                  { id: 'health', label: 'Health Insurance' },
                  { id: 'term', label: 'Term Life' },
                  { id: 'motor', label: 'Motor' },
                  { id: 'savings', label: 'Retirement' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setInsuranceTypeFilter(type.id)}
                    className={`py-1.5 px-3 rounded-lg font-semibold transition-colors ${
                      insuranceTypeFilter === type.id
                        ? 'bg-white text-[#051B63] shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Insurance Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInsurance.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                        {plan.type.toUpperCase()}
                      </span>
                      {plan.badge && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                        {plan.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {plan.insurer} • {plan.claimRatio} Claim Settlement
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Sum Insured</span>
                        <strong className="text-slate-900 font-extrabold text-sm">{plan.coverAmount}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Starting Premium</span>
                        <strong className="text-emerald-600 font-extrabold text-sm">
                          ₹{plan.monthlyPremium.toLocaleString('en-IN')}/mo
                        </strong>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      {plan.keyFeatures.slice(0, 3).map((feat, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedInsuranceForDetail(plan)}
                      className="w-full py-2.5 rounded-xl bg-[#051B63] hover:bg-[#072480] text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      Instant Quote & Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PORTFOLIO TRACKER (KOTAK / NJ WEALTH STYLE) */}
        {/* ========================================================================= */}
        {activeTab === 'portfolio' && (
          <PortfolioDashboard
            holdings={holdings}
            mandates={mandates}
            transactions={transactions}
            onInvestMore={(fund) => openInvestModal(fund)}
            onOpenAiDoctor={() => setActiveTab('ai-advisor')}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 5: AI FINANCIAL ADVISORS */}
        {/* ========================================================================= */}
        {activeTab === 'ai-advisor' && (
          <AiAdvisorPanel holdings={holdings} />
        )}

        {/* ========================================================================= */}
        {/* TAB 6: DATA SCIENCE & QUANT BENCH */}
        {/* ========================================================================= */}
        {activeTab === 'data-science' && (
          <DataScienceStudio holdings={holdings} />
        )}

        {/* ========================================================================= */}
        {/* TAB 7: CALCULATORS STUDIO */}
        {/* ========================================================================= */}
        {activeTab === 'calculators' && (
          <CalculatorsStudio
            onInvestWithPreset={(fund, amount) => {
              openInvestModal(fund);
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 8: PARTNER NETWORK (NJ WEALTH MODEL) */}
        {/* ========================================================================= */}
        {activeTab === 'partners' && (
          <PartnerNetwork />
        )}

      </main>

      {/* Interactive Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        fund={selectedFundForPayment}
        onSuccess={handleInvestmentSuccess}
      />

      <SchemeDetailModal
        isOpen={!!selectedFundForDetail}
        fund={selectedFundForDetail}
        onClose={() => setSelectedFundForDetail(null)}
        onInvest={(fund) => openInvestModal(fund)}
      />

      <InsuranceDetailModal
        isOpen={!!selectedInsuranceForDetail}
        plan={selectedInsuranceForDetail}
        onClose={() => setSelectedInsuranceForDetail(null)}
      />

      {/* Comprehensive Institutional Footer */}
      <footer className="bg-[#051438] text-slate-400 text-xs border-t border-blue-950 mt-16 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            
            {/* Col 1: Brand & Logo */}
            <div className="md:col-span-2 space-y-3">
              <VianLogo size="lg" variant="light" />
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm mt-3">
                Vian Capital (www.viancapital.in) is India's leading technology-first wealth management and multi-asset distribution platform. We partner with individual investors, HNIs, and financial advisors to build enduring compounding engines.
              </p>
              <div className="pt-2 flex flex-col gap-1 text-[11px] text-slate-300">
                <span>AMFI Registered Mutual Fund Distributor ARN-284910</span>
                <span>IRDAI Composite Corporate Insurance Broker Reg: CA-89104</span>
                <span>BSE Star MF Member Code: 51204 • NSE NMF II Broker ID: VC991</span>
              </div>
            </div>

            {/* Col 2: Products */}
            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Investment Products</h5>
              <ul className="space-y-1.5 text-slate-400">
                <li><button onClick={() => setActiveTab('mutual-funds')} className="hover:text-white">Mutual Funds Direct</button></li>
                <li><button onClick={() => setActiveTab('mutual-funds')} className="hover:text-white">Daily & Monthly SIP</button></li>
                <li><button onClick={() => setActiveTab('insurance')} className="hover:text-white">Health Insurance</button></li>
                <li><button onClick={() => setActiveTab('insurance')} className="hover:text-white">Pure Term Life Cover</button></li>
                <li><button onClick={() => setActiveTab('mutual-funds')} className="hover:text-white">ELSS Tax Savers</button></li>
              </ul>
            </div>

            {/* Col 3: Quant & Advisory */}
            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Quant & AI Tools</h5>
              <ul className="space-y-1.5 text-slate-400">
                <li><button onClick={() => setActiveTab('ai-advisor')} className="hover:text-white">Vian Wealth AI Advisor</button></li>
                <li><button onClick={() => setActiveTab('data-science')} className="hover:text-white">Monte Carlo Simulation</button></li>
                <li><button onClick={() => setActiveTab('data-science')} className="hover:text-white">Modern Portfolio Theory</button></li>
                <li><button onClick={() => setActiveTab('portfolio')} className="hover:text-white">Sec 112A Tax Harvesting</button></li>
                <li><button onClick={() => setActiveTab('calculators')} className="hover:text-white">SIP & HLV Calculators</button></li>
              </ul>
            </div>

            {/* Col 4: Corporate & Synergy */}
            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Partners & Synergy</h5>
              <ul className="space-y-1.5 text-slate-400">
                <li><button onClick={() => setActiveTab('partners')} className="hover:text-white">Become a Wealth Partner</button></li>
                <li><button onClick={() => setActiveTab('partners')} className="hover:text-white">IFA / MFD Sub-Broker Desk</button></li>
                <li><span className="text-blue-300 font-semibold">Viaan Holidays Travel Desk</span></li>
                <li><span>Registered Offices: Mumbai & Delhi</span></li>
                <li><span className="font-mono">support@viancapital.in</span></li>
              </ul>
            </div>

          </div>

          {/* Regulatory Risk Disclaimer Bar */}
          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500 space-y-2 leading-relaxed">
            <p>
              <strong>Statutory Disclaimers:</strong> Mutual fund investments are subject to market risks, read all scheme related documents carefully. The NAVs of the schemes may go up or down depending upon the factors and forces affecting the securities market. Past performance is not indicative of future returns. The quantitative models, Monte Carlo simulations, and AI-driven recommendations are for informational and wealth-planning purposes and do not constitute a guarantee of principal or assured returns.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-slate-400">
              <span>© {new Date().getFullYear()} Vian Capital (viancapital.in). In Association with Viaan Holidays. All Rights Reserved.</span>
              <div className="flex gap-4">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>SEBI Investor Charter</span>
              </div>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
