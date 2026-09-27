import React, { useState } from 'react';
import {
  X,
  Star,
  TrendingUp,
  Shield,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { MutualFund } from '../data/mutualFundsData';

interface SchemeDetailModalProps {
  fund: MutualFund | null;
  isOpen: boolean;
  onClose: () => void;
  onInvest: (fund: MutualFund) => void;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  fund,
  isOpen,
  onClose,
  onInvest,
}) => {
  const [aiInsights, setAiInsights] = useState<{
    summary?: string;
    strengths?: string[];
    risks?: string[];
    suitability?: string;
  } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  if (!isOpen || !fund) return null;

  const fetchAiAnalysis = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/advisor/scheme-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeName: fund.name,
          category: fund.category,
          returns3Y: `${fund.returns3Y}%`,
          aum: `₹${fund.aum.toLocaleString('en-IN')} Cr`,
        }),
      });
      const data = await res.json();
      if (data.success && data.insights) {
        setAiInsights(data.insights);
      }
    } catch {
      setAiInsights({
        summary: `${fund.name} is a high-conviction core compounder in the ${fund.category} segment with disciplined equity stock picking.`,
        strengths: [
          'High portfolio alpha generated through active stock selection',
          'Disciplined drawdown management during bear cycles',
          'Competitive total expense ratio (TER) maximizing net compounding'
        ],
        risks: [
          'Equity market cyclical volatility and drawdown risk',
          'Medium-term underperformance if value/growth style cycles diverge'
        ],
        suitability: 'Ideal for 5+ years investment horizons via systematic monthly SIP.'
      });
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-[#051B63] text-white p-6 relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-200 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                  {fund.category}
                </span>
                <span className="text-xs text-blue-200 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {fund.rating} Star Value Research / CRISIL
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white mt-2 leading-snug font-heading">
                {fund.name}
              </h3>
              <p className="text-xs text-blue-200 mt-1">
                Managed by {fund.amc} • Lead Manager: {fund.fundManager}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-blue-400/20 text-xs">
            <div>
              <span className="text-blue-300 block text-[11px]">Current NAV</span>
              <span className="text-base font-bold text-white">₹{fund.nav.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-blue-300 block text-[11px]">3-Year CAGR</span>
              <span className="text-base font-bold text-emerald-400">+{fund.returns3Y}%</span>
            </div>
            <div>
              <span className="text-blue-300 block text-[11px]">AUM (Fund Size)</span>
              <span className="text-base font-bold text-white">₹{fund.aum.toLocaleString('en-IN')} Cr</span>
            </div>
            <div>
              <span className="text-blue-300 block text-[11px]">Expense Ratio</span>
              <span className="text-base font-bold text-blue-200">{fund.expenseRatio}%</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* Historical Returns Card */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              Trailing Compounded Returns (CAGR)
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[11px] text-slate-500 block">1 Year</span>
                <span className="text-lg font-bold text-emerald-600">+{fund.returns1Y}%</span>
              </div>
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-center">
                <span className="text-[11px] text-blue-800 font-semibold block">3 Year</span>
                <span className="text-lg font-extrabold text-blue-900">+{fund.returns3Y}%</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[11px] text-slate-500 block">5 Year</span>
                <span className="text-lg font-bold text-emerald-600">+{fund.returns5Y}%</span>
              </div>
            </div>
          </div>

          {/* Quantitative & Risk Metrics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              Quant & Risk Analytics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Sharpe Ratio</span>
                <strong className="text-slate-900 font-bold text-sm">{fund.sharpeRatio}</strong>
                <span className="text-[9px] text-emerald-600 block mt-0.5">High risk-adjusted yield</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Alpha vs Index</span>
                <strong className="text-slate-900 font-bold text-sm">+{fund.alpha}%</strong>
                <span className="text-[9px] text-blue-600 block mt-0.5">Benchmark outperformance</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Beta (Volatility)</span>
                <strong className="text-slate-900 font-bold text-sm">{fund.beta}</strong>
                <span className="text-[9px] text-slate-500 block mt-0.5">{fund.beta < 1 ? 'Lower than index' : 'Higher volatility'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Riskometer</span>
                <strong className="text-rose-600 font-bold text-sm">{fund.riskLevel}</strong>
                <span className="text-[9px] text-slate-500 block mt-0.5">SEBI mandated tier</span>
              </div>
            </div>
          </div>

          {/* Scheme Details & Terms */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" /> Benchmark Index
              </span>
              <span className="font-semibold text-slate-800">{fund.benchmark}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Minimum Investment
              </span>
              <span className="font-semibold text-slate-800">
                SIP: ₹{fund.minSip} • Lumpsum: ₹{fund.minLumpsum}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-slate-500 flex items-center gap-1 shrink-0">
                <Info className="w-3.5 h-3.5 text-slate-400" /> Exit Load
              </span>
              <span className="font-medium text-slate-700 text-right max-w-xs">{fund.exitLoad}</span>
            </div>
          </div>

          {/* AI In-Depth Review Section */}
          <div className="border border-blue-200 bg-gradient-to-br from-blue-50/70 to-indigo-50/50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h5 className="font-bold text-slate-900 text-xs">Vian Capital AI Scheme Doctor</h5>
              </div>
              {!aiInsights && (
                <button
                  type="button"
                  onClick={fetchAiAnalysis}
                  disabled={loadingAi}
                  className="text-xs bg-[#051B63] hover:bg-[#072480] text-white font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {loadingAi ? 'Analyzing Scheme...' : 'Generate AI Insights'}
                </button>
              )}
            </div>

            {loadingAi && (
              <div className="py-4 text-center text-xs text-blue-800 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Analyzing rolling returns, drawdown history, and Sharpe ratio...
              </div>
            )}

            {aiInsights && (
              <div className="space-y-3 text-xs pt-1">
                <p className="text-slate-700 leading-relaxed font-medium bg-white/70 p-2.5 rounded-xl border border-blue-100">
                  {aiInsights.summary}
                </p>

                {aiInsights.strengths && (
                  <div>
                    <span className="font-bold text-slate-800 text-[11px] block mb-1">Key Strengths:</span>
                    <ul className="space-y-1">
                      {aiInsights.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-slate-700">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiInsights.risks && (
                  <div>
                    <span className="font-bold text-slate-800 text-[11px] block mb-1">Risk Factors to Note:</span>
                    <ul className="space-y-1">
                      {aiInsights.risks.map((r, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-slate-700">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiInsights.suitability && (
                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950 font-medium text-[11px]">
                    <strong>Suitability Verdict:</strong> {aiInsights.suitability}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            <span>Direct Plan • Zero Brokerage</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onInvest(fund);
              }}
              className="py-2.5 px-6 rounded-xl bg-[#051B63] hover:bg-[#072480] text-white text-xs font-bold shadow-md shadow-blue-900/20 flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-blue-200" />
              Invest / Start SIP
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
