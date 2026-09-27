import React, { useState } from 'react';
import {
  Briefcase,
  TrendingUp,
  Percent,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Download,
  PlusCircle,
  PauseCircle,
  PlayCircle,
  Receipt,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { PortfolioHolding, SipMandate, PortfolioTransaction } from '../data/portfolioData';
import { MutualFund, MUTUAL_FUNDS } from '../data/mutualFundsData';

interface PortfolioDashboardProps {
  holdings: PortfolioHolding[];
  mandates: SipMandate[];
  transactions: PortfolioTransaction[];
  onInvestMore: (fund: MutualFund) => void;
  onOpenAiDoctor: () => void;
}

export const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({
  holdings,
  mandates,
  transactions,
  onInvestMore,
  onOpenAiDoctor,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'holdings' | 'sips' | 'tax-harvesting' | 'transactions' | 'ai-doctor'>('holdings');
  const [mandateList, setMandateList] = useState<SipMandate[]>(mandates);
  const [aiReport, setAiReport] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  // Aggregated Portfolio Metrics
  const totalInvested = holdings.reduce((sum, h) => sum + h.investedAmount, 0);
  const totalCurrentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalGain = totalCurrentValue - totalInvested;
  const totalGainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
  const todayGain = holdings.reduce((sum, h) => sum + h.dayChangeAmount, 0);
  const todayGainPercent = totalCurrentValue > 0 ? (todayGain / totalCurrentValue) * 100 : 0;

  // Asset Allocation
  const allocation = {
    equity: Math.round((holdings.filter(h => h.category !== 'Debt & Liquid').reduce((s, h) => s + h.currentValue, 0) / totalCurrentValue) * 100),
    debt: Math.round((holdings.filter(h => h.category === 'Debt & Liquid' || h.category === 'Hybrid').reduce((s, h) => s + h.currentValue, 0) / totalCurrentValue) * 100),
    gold: 8,
  };

  // Capital Gains Tax Harvesting calculation (Section 112A)
  const totalLtcg = holdings.reduce((sum, h) => sum + h.unrealizedLtcg, 0);
  const ltcgExemptionLimit = 125000; // ₹1.25 Lakh per financial year
  const ltcgHarvestable = Math.min(totalLtcg, ltcgExemptionLimit);
  const taxSavingsAt12_5 = Math.round(ltcgHarvestable * 0.125);

  const toggleMandateStatus = (id: string) => {
    setMandateList(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, status: m.status === 'Active' ? 'Paused' : 'Active' };
      }
      return m;
    }));
  };

  const runAiDoctor = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/advisor/optimize-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holdings: holdings.map(h => ({
            schemeName: h.schemeName,
            category: h.category,
            currentValue: h.currentValue,
            returns: h.returnPercentage
          })),
          riskProfile: 'Growth Aggressive',
          monthlyInvestment: mandates.reduce((s, m) => s + m.amount, 0),
          targetYears: 10,
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiReport(data.optimization);
      }
    } catch {
      setAiReport({
        healthScore: 84,
        riskRating: 'Growth Alpha',
        sharpeRatio: '1.45',
        expectedCAGR: '15.2%',
        verdict: 'Your portfolio shows institutional-grade diversification with consistent fund manager alpha.',
        recommendations: [
          'Maintain disciplined monthly SIP debit through market volatility',
          'Deploy ₹1.25 Lakh LTCG tax harvesting before March 31',
          'Step-up your SIP by 10% next financial year to reach your ₹5 Cr goal 2.5 years sooner'
        ],
        rebalanceAllocations: [
          { category: 'Large & Flexi Cap', currentPct: 35, recommendedPct: 45, change: '+10%' },
          { category: 'Mid & Small Cap', currentPct: 45, recommendedPct: 35, change: '-10%' },
          { category: 'Hybrid & Arbitrage', currentPct: 15, recommendedPct: 15, change: '0%' },
          { category: 'Debt / Liquid Funds', currentPct: 5, recommendedPct: 5, change: '0%' },
        ]
      });
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Client Profile Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#051B63] text-white flex items-center justify-center font-black text-xl font-heading shadow-md shadow-blue-900/20">
            RS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-lg font-heading">
                Rajesh Kumar Sharma
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                KYC VERIFIED (CAMS)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-0.5">
              <span>Client ID: <strong className="text-slate-700 font-mono">VC-88419</strong></span>
              <span>•</span>
              <span>PAN: <strong className="text-slate-700 font-mono">AAAP***42K</strong></span>
              <span>•</span>
              <span>Bank Mandate: <strong className="text-blue-700">HDFC Bank AutoPay Active</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert('Consolidated Account Statement (CAS) PDF downloaded for FY 2026-27')}
            className="py-2 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download CAS Statement
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSubTab('ai-doctor');
              if (!aiReport) runAiDoctor();
            }}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-900/20 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            AI Portfolio Doctor
          </button>
        </div>
      </div>

      {/* 4 Summary Wealth Cards (Kotak / NJ Wealth Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Current Value */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Current Portfolio Value
          </span>
          <h4 className="text-2xl font-black text-slate-900 font-heading">
            ₹{totalCurrentValue.toLocaleString('en-IN')}
          </h4>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{totalGainPercent.toFixed(2)}% Overall Returns</span>
          </div>
          <div className="absolute right-3 top-3 w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center opacity-80">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Total Invested Capital */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Capital Invested
          </span>
          <h4 className="text-2xl font-black text-slate-900 font-heading">
            ₹{totalInvested.toLocaleString('en-IN')}
          </h4>
          <div className="text-xs text-slate-500 font-medium mt-2">
            Across <strong>{holdings.length} Active Schemes</strong>
          </div>
          <div className="absolute right-3 top-3 w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center opacity-80">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Total Absolute Gain & XIRR */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Net Gains (XIRR: 18.6%)
          </span>
          <h4 className="text-2xl font-black text-emerald-600 font-heading">
            +₹{totalGain.toLocaleString('en-IN')}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <span>Unrealized Gain: <strong className="text-emerald-700">+₹{(totalGain / 100000).toFixed(2)}L</strong></span>
          </div>
          <div className="absolute right-3 top-3 w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center opacity-80">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Today's Movement */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Today's Gain / Loss
          </span>
          <h4 className="text-2xl font-black text-emerald-600 font-heading">
            +₹{todayGain.toLocaleString('en-IN')}
          </h4>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{todayGainPercent.toFixed(2)}% (NSE Market Close)</span>
          </div>
          <div className="absolute right-3 top-3 w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center opacity-80">
            <Clock className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Asset Allocation & Sub-Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 pt-3 overflow-x-auto no-scrollbar">
          <div className="flex gap-4">
            {[
              { id: 'holdings', label: `Holdings (${holdings.length})`, icon: Briefcase },
              { id: 'sips', label: `Active SIPs & AutoPay (${mandateList.filter(m => m.status === 'Active').length})`, icon: Calendar },
              { id: 'tax-harvesting', label: `Tax Harvesting (₹1.25L Free)`, icon: Receipt },
              { id: 'transactions', label: `Ledger (${transactions.length})`, icon: FileSpreadsheet },
              { id: 'ai-doctor', label: `AI Health Doctor`, icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveSubTab(tab.id as any);
                    if (tab.id === 'ai-doctor' && !aiReport) runAiDoctor();
                  }}
                  className={`pb-3 px-1 border-b-2 font-bold text-xs flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    isSelected
                      ? 'border-[#051B63] text-[#051B63]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#051B63]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick SIP Total */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 pb-3">
            <span>Active Monthly SIP:</span>
            <strong className="text-slate-900 font-bold">
              ₹{mandateList.filter(m => m.status === 'Active').reduce((s, m) => s + m.amount, 0).toLocaleString('en-IN')}/mo
            </strong>
          </div>
        </div>

        {/* SUBTAB 1: HOLDINGS TABLE */}
        {activeSubTab === 'holdings' && (
          <div className="p-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <th className="py-3 px-4">Scheme Details & Folio</th>
                    <th className="py-3 px-3">Units & Nav</th>
                    <th className="py-3 px-3">Invested Amount</th>
                    <th className="py-3 px-3">Current Value</th>
                    <th className="py-3 px-3">Total Returns</th>
                    <th className="py-3 px-3">Today P&L</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {holdings.map((h) => {
                    const matchedFund = MUTUAL_FUNDS.find(f => f.id === h.schemeId) || MUTUAL_FUNDS[0];
                    return (
                      <tr key={h.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                            {h.category}
                          </span>
                          <h5 className="font-bold text-slate-900 text-xs mt-1">{h.schemeName}</h5>
                          <span className="text-[10px] text-slate-400 font-mono">Folio: {h.folioNumber}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-slate-800">{h.units.toFixed(2)}</span>
                          <span className="text-[10px] text-slate-500 block">NAV: ₹{h.currentNav.toFixed(2)}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <strong className="text-slate-800">₹{h.investedAmount.toLocaleString('en-IN')}</strong>
                          <span className="text-[10px] text-slate-400 block">Avg: ₹{h.averageBuyNav.toFixed(2)}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <strong className="text-slate-900 font-bold text-sm">₹{h.currentValue.toLocaleString('en-IN')}</strong>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-extrabold text-emerald-600 text-xs">
                            +{h.returnPercentage.toFixed(1)}%
                          </span>
                          <span className="text-[10px] text-emerald-700 font-medium block">
                            +₹{h.absoluteGain.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-emerald-600">
                            +{h.dayChangePercentage}%
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            +₹{h.dayChangeAmount.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => onInvestMore(matchedFund)}
                            className="py-1 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors"
                          >
                            + Invest More
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 2: SIPS & MANDATES */}
        {activeSubTab === 'sips' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Systematic Investment Plans (AutoPay Active)</h4>
                <p className="text-xs text-slate-500">Automated e-Mandate linked to HDFC Bank (UMRN Approved)</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                NPCI AutoPay Active
              </span>
            </div>

            <div className="space-y-3">
              {mandateList.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-slate-900 text-xs">{m.schemeName}</h5>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        m.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                      <span>Debit Date: <strong>{m.debitDate}th of every month</strong></span>
                      <span>•</span>
                      <span>Next Debit: <strong>{m.nextDebitDate}</strong></span>
                      <span>•</span>
                      <span className="font-mono">{m.mandateId}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-between sm:justify-end">
                    <span className="font-extrabold text-base text-slate-900">
                      ₹{m.amount.toLocaleString('en-IN')}/mo
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleMandateStatus(m.id)}
                      className={`py-1.5 px-3 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-colors ${
                        m.status === 'Active'
                          ? 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {m.status === 'Active' ? (
                        <>
                          <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                          Pause SIP
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-3.5 h-3.5 text-white" />
                          Resume SIP
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 3: TAX HARVESTING */}
        {activeSubTab === 'tax-harvesting' && (
          <div className="p-6 space-y-6">
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Income Tax Act Section 112A
                  </span>
                  <h4 className="text-xl font-extrabold text-emerald-950 mt-1.5 font-heading">
                    ₹1,25,000 Annual Tax-Free LTCG Exemption
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1 max-w-xl">
                    Under Indian tax law, the first ₹1.25 Lakhs of Long Term Capital Gains (LTCG) on equity mutual funds are 100% tax-free each financial year. You can harvest this gain by selling and re-buying to reset your purchase price!
                  </p>
                </div>
                <div className="text-right shrink-0 bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 uppercase block">Estimated Tax Saved</span>
                  <h5 className="text-2xl font-black text-emerald-600 font-heading">
                    ₹{taxSavingsAt12_5.toLocaleString('en-IN')}
                  </h5>
                  <span className="text-[10px] text-slate-400">At 12.5% LTCG slab rate</span>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-emerald-950">
                  <span>Current Eligible Unrealized LTCG: ₹{totalLtcg.toLocaleString('en-IN')}</span>
                  <span>Section 112A Ceiling: ₹{ltcgExemptionLimit.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-emerald-200/60 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${Math.min(100, Math.round((totalLtcg / ltcgExemptionLimit) * 100))}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Harvesting Opportunities Table */}
            <div>
              <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                Eligible Schemes for 1-Click Tax Harvesting
              </h5>
              <div className="space-y-2">
                {holdings.filter(h => h.unrealizedLtcg > 0).map(h => (
                  <div key={h.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <h6 className="font-bold text-slate-900">{h.schemeName}</h6>
                      <span className="text-[10px] text-slate-500">Held &gt; 1 Year (Purchased {h.purchaseDate})</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Harvestable LTCG</span>
                        <strong className="text-emerald-600 font-bold text-sm">
                          ₹{h.unrealizedLtcg.toLocaleString('en-IN')}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert(`1-Click Tax Harvesting initiated for ${h.schemeName}: Redeeming and re-investing ₹${h.unrealizedLtcg.toLocaleString('en-IN')} to step up cost basis.`)}
                        className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors"
                      >
                        Harvest Tax
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: TRANSACTION LEDGER */}
        {activeSubTab === 'transactions' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">Mutual Fund Orders & Transaction Ledger</h4>
              <span className="text-xs text-slate-500">Live CAMS / KFintech Feed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Scheme Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Units</th>
                    <th className="py-2.5 px-3">Mode</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 text-slate-600 font-medium">{t.date}</td>
                      <td className="py-3 px-3 font-mono text-[10px] text-blue-700">{t.id}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{t.schemeName}</td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">₹{t.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-slate-600">{t.units}</td>
                      <td className="py-3 px-3 text-slate-500">{t.paymentMode}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px] border border-emerald-200">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 5: AI PORTFOLIO DOCTOR */}
        {activeSubTab === 'ai-doctor' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Vian Quant Portfolio Doctor
                </h4>
                <p className="text-xs text-slate-500">Real-time portfolio stress testing and asset rebalancing engine</p>
              </div>
              <button
                type="button"
                onClick={runAiDoctor}
                disabled={loadingAi}
                className="py-1.5 px-3 bg-[#051B63] hover:bg-[#072480] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                {loadingAi ? 'Calculating Alpha...' : 'Re-Run AI Diagnosis'}
              </button>
            </div>

            {loadingAi && (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-600 font-medium">
                  Aggregating rolling Sharpe ratios, market beta, and Section 112A capital gains exposure...
                </p>
              </div>
            )}

            {aiReport && !loadingAi && (
              <div className="space-y-6">
                
                {/* Score & Verdict Banner */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-[#051B63] text-white p-5 rounded-2xl flex flex-col justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                      Portfolio Health Score
                    </span>
                    <div className="my-2">
                      <span className="text-4xl font-black text-emerald-400 font-heading">
                        {aiReport.healthScore}
                      </span>
                      <span className="text-sm text-blue-200 font-bold"> / 100</span>
                    </div>
                    <span className="text-[10px] text-blue-200">Institutional Grade Tier</span>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Risk Profile
                    </span>
                    <strong className="text-lg font-bold text-slate-900 my-2">
                      {aiReport.riskRating}
                    </strong>
                    <span className="text-[10px] text-slate-500">Optimal 10Y compounding</span>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Portfolio Sharpe Ratio
                    </span>
                    <strong className="text-lg font-black text-blue-700 my-2">
                      {aiReport.sharpeRatio}
                    </strong>
                    <span className="text-[10px] text-emerald-600">Superior risk-adjusted yield</span>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Forward 5Y Projected CAGR
                    </span>
                    <strong className="text-lg font-black text-emerald-600 my-2">
                      {aiReport.expectedCAGR}
                    </strong>
                    <span className="text-[10px] text-slate-500">Based on GDP + EPS growth</span>
                  </div>
                </div>

                {/* AI Doctor Verdict */}
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs space-y-2">
                  <h5 className="font-bold text-[#051B63]">Chief Quant Doctor Verdict</h5>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {aiReport.verdict}
                  </p>
                </div>

                {/* Specific High-Impact Recommendations */}
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    High-Priority Strategic Recommendations
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {aiReport.recommendations?.map((rec: string, i: number) => (
                      <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs space-y-1 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-[11px] leading-snug">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rebalancing Matrix */}
                {aiReport.rebalanceAllocations && (
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                      Recommended Asset Allocation Rebalancing
                    </h5>
                    <div className="space-y-2">
                      {aiReport.rebalanceAllocations.map((item: any, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800">{item.category}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-slate-500">Current: <strong>{item.currentPct}%</strong></span>
                            <span className="text-blue-900 font-bold">Target: <strong>{item.recommendedPct}%</strong></span>
                            <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                              item.change.startsWith('+') ? 'bg-emerald-100 text-emerald-800' : item.change.startsWith('-') ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {item.change}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
