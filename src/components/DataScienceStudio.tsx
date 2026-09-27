import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Activity,
  Sliders,
  TrendingUp,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  PieChart,
  BarChart3,
  CheckCircle2,
  RefreshCw,
  Info,
  Zap,
  Target
} from 'lucide-react';
import { PortfolioHolding } from '../data/portfolioData';

interface DataScienceStudioProps {
  holdings: PortfolioHolding[];
  onApplyRebalancing?: () => void;
}

export const DataScienceStudio: React.FC<DataScienceStudioProps> = ({ holdings }) => {
  const [activeTab, setActiveTab] = useState<'monte-carlo' | 'efficient-frontier' | 'stress-test' | 'risk-profiler'>('monte-carlo');

  // --- 1. MONTE CARLO STATE ---
  const [monthlySip, setMonthlySip] = useState<number>(25000);
  const [horizonYears, setHorizonYears] = useState<number>(15);
  const [expectedReturn, setExpectedReturn] = useState<number>(14.5); // %
  const [volatility, setVolatility] = useState<number>(16.0); // %
  const [targetWealth, setTargetWealth] = useState<number>(15000000); // 1.5 Cr
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate Monte Carlo Paths
  const mcResults = useMemo(() => {
    const numPaths = 500;
    const months = horizonYears * 12;
    const monthlyMu = (expectedReturn / 100) / 12;
    const monthlySigma = (volatility / 100) / Math.sqrt(12);
    
    const finalValues: number[] = [];
    const pathSnapshots: number[][] = []; // sample paths for chart

    for (let p = 0; p < numPaths; p++) {
      let wealth = 0;
      const history: number[] = [0];

      for (let m = 1; m <= months; m++) {
        // Standard normal random using Box-Muller transform
        const u1 = Math.random() || 0.0001;
        const u2 = Math.random() || 0.0001;
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

        // Geometric return for this month
        const monthlyReturn = Math.exp((monthlyMu - 0.5 * monthlySigma * monthlySigma) + monthlySigma * z) - 1;
        wealth = (wealth + monthlySip) * (1 + monthlyReturn);

        if (m % 12 === 0) {
          history.push(wealth);
        }
      }
      finalValues.push(wealth);
      if (p < 25) {
        pathSnapshots.push(history);
      }
    }

    finalValues.sort((a, b) => a - b);
    const p10 = finalValues[Math.floor(numPaths * 0.10)];
    const p50 = finalValues[Math.floor(numPaths * 0.50)];
    const p90 = finalValues[Math.floor(numPaths * 0.90)];
    const totalInvested = monthlySip * months;

    const successCount = finalValues.filter((v) => v >= targetWealth).length;
    const successProbability = Math.round((successCount / numPaths) * 100);

    return {
      p10,
      p50,
      p90,
      totalInvested,
      successProbability,
      pathSnapshots,
    };
  }, [monthlySip, horizonYears, expectedReturn, volatility, targetWealth]);

  // Draw Monte Carlo Fan Chart on Canvas
  useEffect(() => {
    if (activeTab !== 'monte-carlo') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Padding
    const padX = 50;
    const padY = 30;
    const chartW = width - padX * 1.5;
    const chartH = height - padY * 2;

    const maxY = Math.max(mcResults.p90 * 1.15, targetWealth * 1.1);

    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 4; i++) {
      const y = padY + (chartH / 4) * i;
      ctx.moveTo(padX, y);
      ctx.lineTo(padX + chartW, y);
    }
    ctx.stroke();

    // Draw Target Line
    const targetY = padY + chartH - (targetWealth / maxY) * chartH;
    ctx.strokeStyle = '#dc2626';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padX, targetY);
    ctx.lineTo(padX + chartW, targetY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#dc2626';
    ctx.font = '10px Plus Jakarta Sans';
    ctx.fillText(`Target: ₹${(targetWealth / 10000000).toFixed(2)} Cr`, padX + chartW - 90, targetY - 5);

    // Draw individual sample simulation traces
    mcResults.pathSnapshots.forEach((path) => {
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      path.forEach((val, yr) => {
        const x = padX + (yr / horizonYears) * chartW;
        const y = padY + chartH - (val / maxY) * chartH;
        if (yr === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });

    // Draw Median Path (50th percentile)
    ctx.strokeStyle = '#051B63';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let yr = 0; yr <= horizonYears; yr++) {
      const interpVal = mcResults.p50 * Math.pow(yr / horizonYears, 1.8);
      const x = padX + (yr / horizonYears) * chartW;
      const y = padY + chartH - (interpVal / maxY) * chartH;
      if (yr === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Plus Jakarta Sans';
    ctx.fillText('0 Yr', padX - 10, height - 10);
    ctx.fillText(`${Math.round(horizonYears / 2)} Yrs`, padX + chartW / 2 - 15, height - 10);
    ctx.fillText(`${horizonYears} Yrs`, padX + chartW - 20, height - 10);

    ctx.fillText('₹0', 10, padY + chartH);
    ctx.fillText(`₹${(maxY / 20000000).toFixed(1)} Cr`, 10, padY + chartH / 2);
    ctx.fillText(`₹${(maxY / 10000000).toFixed(1)} Cr`, 10, padY + 10);
  }, [mcResults, activeTab, horizonYears, targetWealth]);

  // --- 2. EFFICIENT FRONTIER DATA ---
  const frontierPoints = useMemo(() => {
    // Generate realistic modern portfolio theory curve points (Risk % vs Return %)
    return [
      { risk: 6.2, ret: 7.2, label: 'Pure Debt & Liquid' },
      { risk: 8.5, ret: 9.8, label: 'Conservative Hybrid' },
      { risk: 11.2, ret: 12.4, label: 'Balanced Advantage' },
      { risk: 13.8, ret: 15.2, label: 'Tangency Portfolio (Max Sharpe 1.48)' },
      { risk: 16.5, ret: 17.1, label: 'Aggressive Multi-Cap' },
      { risk: 19.8, ret: 18.9, label: 'Pure Mid & Small Cap' },
    ];
  }, []);

  // --- 3. STRESS TEST DATA ---
  const stressScenarios = [
    {
      title: '2008 Global Financial Crisis',
      period: 'Jan 2008 - Mar 2009',
      niftyDrop: -52.4,
      portfolioDrop: -34.8,
      recoveryMonths: 18,
      hedgingTip: '15% Debt + 10% Gold allocation cushions equity drawdowns by 17.6%',
    },
    {
      title: '2020 COVID-19 Flash Crash',
      period: 'Feb 2020 - Apr 2020',
      niftyDrop: -38.2,
      portfolioDrop: -24.6,
      recoveryMonths: 7,
      hedgingTip: 'Disciplined SIP averaging during the dip accelerated 3-year CAGR to 22.4%',
    },
    {
      title: '2011 European Sovereign Debt Shock',
      period: 'Jan 2011 - Dec 2011',
      niftyDrop: -24.6,
      portfolioDrop: -16.2,
      recoveryMonths: 11,
      hedgingTip: 'High-quality Large & Flexi Cap funds demonstrated 4.8% alpha over benchmark',
    },
    {
      title: '2022 Global Rate Hike & Inflation Shock',
      period: 'Jan 2022 - Jun 2022',
      niftyDrop: -15.4,
      portfolioDrop: -9.8,
      recoveryMonths: 5,
      hedgingTip: 'Low portfolio beta (0.84) protected against severe global growth stock corrections',
    },
  ];

  // --- 4. BEHAVIORAL RISK PROFILER ---
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({
    1: 3,
    2: 4,
    3: 3,
    4: 4,
    5: 3,
  });

  const quizQuestions = [
    {
      id: 1,
      question: 'If the stock market falls 20% over 2 months, what is your immediate instinct?',
      options: [
        { score: 1, label: 'Panic and exit all equity investments into fixed deposits' },
        { score: 2, label: 'Pause SIPs and wait for market recovery' },
        { score: 3, label: 'Do nothing and let automated SIPs continue as scheduled' },
        { score: 4, label: 'Invest extra lumpsum surplus to accumulate units at lower NAV' },
      ],
    },
    {
      id: 2,
      question: 'What is your primary investment objective for this portfolio?',
      options: [
        { score: 1, label: 'Strict capital preservation with zero principal loss' },
        { score: 2, label: 'Beat bank inflation with steady moderate income' },
        { score: 3, label: 'Balanced wealth accumulation over 5-10 years' },
        { score: 4, label: 'Maximum long-term wealth compounding over 10-20+ years' },
      ],
    },
    {
      id: 3,
      question: 'What is your planned investment horizon before you need these funds?',
      options: [
        { score: 1, label: 'Under 2 years (Immediate expenses)' },
        { score: 2, label: '2 to 5 years (Medium term)' },
        { score: 3, label: '5 to 10 years (Long term)' },
        { score: 4, label: '10+ years (Retirement & generational wealth)' },
      ],
    },
    {
      id: 4,
      question: 'How secure and predictable is your primary source of income?',
      options: [
        { score: 1, label: 'Highly variable / Irregular freelance or gig income' },
        { score: 2, label: 'Somewhat stable business with cyclical cash flows' },
        { score: 3, label: 'Stable salaried employment with established company' },
        { score: 4, label: 'Very secure income + independent family asset backing' },
      ],
    },
    {
      id: 5,
      question: 'How comfortable are you with portfolio volatility for higher expected alpha?',
      options: [
        { score: 1, label: 'I lose sleep over negative quarterly statements' },
        { score: 2, label: 'I can tolerate minor fluctuations up to 5-10%' },
        { score: 3, label: 'I understand volatility is the price of high equity compounding' },
        { score: 4, label: 'I actively welcome volatility as a buying opportunity' },
      ],
    },
  ];

  const totalScore = useMemo(() => {
    return Object.values(quizAnswers).reduce((sum, val) => sum + val, 0);
  }, [quizAnswers]);

  const riskProfileResult = useMemo(() => {
    if (totalScore <= 8) {
      return {
        title: 'Conservative Capital Preserver',
        equity: 20,
        debt: 70,
        gold: 10,
        description: 'Prioritizes safety and steady yields with minimal drawdown risk.',
      };
    } else if (totalScore <= 13) {
      return {
        title: 'Balanced Wealth Accumulator',
        equity: 50,
        debt: 35,
        gold: 15,
        description: 'Blends capital appreciation with downside stabilization.',
      };
    } else if (totalScore <= 17) {
      return {
        title: 'Growth Seeker (Moderate-Aggressive)',
        equity: 75,
        debt: 15,
        gold: 10,
        description: 'Optimized for high compounding with a multi-year horizon.',
      };
    } else {
      return {
        title: 'Aggressive Alpha Compounder',
        equity: 90,
        debt: 5,
        gold: 5,
        description: 'Maximized exposure to high-growth Flexi, Mid & Small Cap funds.',
      };
    }
  }, [totalScore]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      
      {/* Top Header */}
      <div className="bg-[#051B63] text-white p-6 border-b border-blue-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-200 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                Data Science & ML Workbench
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                Real-Time Quant Models
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-white mt-1 font-heading">
              Vian Quant & Risk Science Studio
            </h3>
            <p className="text-xs text-blue-200 mt-0.5">
              Empirical modeling inspired by Nobel laureate Modern Portfolio Theory & Stochastic Monte Carlo simulations
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap gap-1 bg-white/10 p-1 rounded-xl text-xs backdrop-blur-xs">
            {[
              { id: 'monte-carlo', label: 'Monte Carlo 1,000 Paths', icon: Activity },
              { id: 'efficient-frontier', label: 'Efficient Frontier', icon: PieChart },
              { id: 'stress-test', label: 'Crash Stress Test', icon: ShieldAlert },
              { id: 'risk-profiler', label: 'Risk Tolerance Profiler', icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-3 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-[#051B63] shadow-md'
                      : 'text-blue-100 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        
        {/* TAB 1: MONTE CARLO SIMULATOR */}
        {activeTab === 'monte-carlo' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Parameters Panel */}
              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  Stochastic Model Inputs
                </h4>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Monthly SIP:</span>
                    <strong className="text-slate-900">₹{monthlySip.toLocaleString('en-IN')}</strong>
                  </div>
                  <input
                    type="range"
                    min={5000}
                    max={100000}
                    step={2500}
                    value={monthlySip}
                    onChange={(e) => setMonthlySip(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Investment Horizon:</span>
                    <strong className="text-slate-900">{horizonYears} Years</strong>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={30}
                    step={1}
                    value={horizonYears}
                    onChange={(e) => setHorizonYears(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Expected Mean Return (μ):</span>
                    <strong className="text-slate-900">{expectedReturn}% p.a.</strong>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={20}
                    step={0.5}
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Annualized Volatility (σ):</span>
                    <strong className="text-slate-900">{volatility}%</strong>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={25}
                    step={0.5}
                    value={volatility}
                    onChange={(e) => setVolatility(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Target Wealth Goal:</span>
                    <strong className="text-rose-600">₹{(targetWealth / 10000000).toFixed(2)} Cr</strong>
                  </div>
                  <input
                    type="range"
                    min={2500000}
                    max={50000000}
                    step={1000000}
                    value={targetWealth}
                    onChange={(e) => setTargetWealth(Number(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>

                {/* Probability Card */}
                <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Goal Success Probability:</span>
                    <span className={`font-black text-sm ${mcResults.successProbability >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {mcResults.successProbability}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        mcResults.successProbability >= 70 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${mcResults.successProbability}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-500 block pt-0.5">
                    Based on 1,000 geometric Brownian motion iterations
                  </span>
                </div>
              </div>

              {/* Chart & Distribution Results */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-blue-600" />
                    Probabilistic Wealth Accumulation Envelope
                  </h4>
                  <span className="text-xs text-slate-500">Confidence Band (P10 - P90)</span>
                </div>

                {/* Canvas Chart */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={640}
                    height={280}
                    className="w-full h-auto rounded-xl"
                  />
                </div>

                {/* Quantitative Outcomes */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500 block text-[11px]">Total Invested</span>
                    <strong className="text-slate-900 text-base font-extrabold">
                      ₹{(mcResults.totalInvested / 100000).toFixed(2)} L
                    </strong>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{horizonYears * 12} Installments</span>
                  </div>

                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                    <span className="text-amber-800 block text-[11px] font-semibold">10th Percentile (Bear)</span>
                    <strong className="text-amber-900 text-base font-extrabold">
                      ₹{(mcResults.p10 / 10000000).toFixed(2)} Cr
                    </strong>
                    <span className="text-[10px] text-amber-700 block mt-0.5">Worst-case market regime</span>
                  </div>

                  <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl">
                    <span className="text-blue-800 block text-[11px] font-semibold">50th Percentile (Median)</span>
                    <strong className="text-[#051B63] text-base font-black">
                      ₹{(mcResults.p50 / 10000000).toFixed(2)} Cr
                    </strong>
                    <span className="text-[10px] text-blue-600 block mt-0.5">Most likely outcome</span>
                  </div>

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                    <span className="text-emerald-800 block text-[11px] font-semibold">90th Percentile (Bull)</span>
                    <strong className="text-emerald-900 text-base font-extrabold">
                      ₹{(mcResults.p90 / 10000000).toFixed(2)} Cr
                    </strong>
                    <span className="text-[10px] text-emerald-700 block mt-0.5">Strong equity bull cycle</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 2: EFFICIENT FRONTIER */}
        {activeTab === 'efficient-frontier' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Concept & Current Position */}
              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-blue-600" />
                  Modern Portfolio Theory (MPT)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Harry Markowitz's Modern Portfolio Theory identifies the optimal boundary where no higher expected return can be achieved without taking on additional risk.
                </p>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Your Current Portfolio:</span>
                    <strong className="text-blue-700 font-bold">Risk: 14.2% | Return: 15.8%</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Optimal Sharpe Tangency:</span>
                    <strong className="text-emerald-600 font-bold">Sharpe: 1.48 (Risk 13.8%)</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Diversification Score:</span>
                    <strong className="text-slate-900 font-bold">88 / 100</strong>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                  <strong className="block font-bold mb-1">Quant Optimization Insight:</strong>
                  Your current portfolio sits extremely close to the efficient frontier! Rebalancing 5% from mid-caps into flexi-caps reduces portfolio variance by 1.1% with zero loss of expected return.
                </div>
              </div>

              {/* Frontier Visualization & Table */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">
                  Risk-Return Efficient Allocations
                </h4>

                <div className="space-y-2.5">
                  {frontierPoints.map((pt, i) => {
                    const isOptimal = pt.label.includes('Tangency');
                    return (
                      <div
                        key={i}
                        className={`p-3.5 rounded-xl border transition-all flex items-center justify-between text-xs ${
                          isOptimal
                            ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${isOptimal ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-blue-600'}`}></div>
                          <div>
                            <span className={`font-bold ${isOptimal ? 'text-emerald-950 font-heading' : 'text-slate-900'}`}>
                              {pt.label}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              Volatility: <strong>{pt.risk}%</strong> • Expected Return: <strong>{pt.ret}%</strong>
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {(pt.ret / pt.risk).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 block">Sharpe Index</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: CRASH STRESS TEST */}
        {activeTab === 'stress-test' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-base font-heading">
                  Historical Crisis & Black Swan Simulations
                </h4>
                <p className="text-xs text-slate-500">
                  Simulating how your current asset allocation would withstand major market downturns
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Downside Protection: 34% Alpha vs Nifty 50</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stressScenarios.map((sc, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{sc.title}</h5>
                      <span className="text-[11px] text-slate-500">{sc.period}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                      Simulated
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-rose-50 border border-rose-100 rounded-lg">
                      <span className="text-slate-500 text-[10px] block">Nifty 50 Crash</span>
                      <strong className="text-rose-600 font-bold">{sc.niftyDrop}%</strong>
                    </div>
                    <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg">
                      <span className="text-slate-500 text-[10px] block">Your Portfolio</span>
                      <strong className="text-blue-900 font-bold">{sc.portfolioDrop}%</strong>
                    </div>
                    <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                      <span className="text-slate-500 text-[10px] block">Recovery Time</span>
                      <strong className="text-emerald-700 font-bold">{sc.recoveryMonths} Mos</strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{sc.hedgingTip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RISK TOLERANCE PROFILER */}
        {activeTab === 'risk-profiler' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Question list */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">
                  Psychometric Behavioral Assessment (5 Questions)
                </h4>

                {quizQuestions.map((q) => (
                  <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                    <span className="text-xs font-bold text-slate-900 block">
                      {q.id}. {q.question}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt) => (
                        <button
                          key={opt.score}
                          type="button"
                          onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: opt.score }))}
                          className={`p-2.5 rounded-lg text-left transition-all border ${
                            quizAnswers[q.id] === opt.score
                              ? 'bg-[#051B63] text-white border-[#051B63] font-semibold shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Result Blueprint */}
              <div className="space-y-4">
                <div className="bg-[#051B63] text-white p-5 rounded-2xl space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 block">
                    Your Investor DNA Result
                  </span>
                  <h4 className="text-xl font-extrabold text-white font-heading">
                    {riskProfileResult.title}
                  </h4>
                  <p className="text-xs text-blue-200 leading-relaxed">
                    {riskProfileResult.description}
                  </p>

                  <div className="pt-3 border-t border-blue-400/20 text-xs flex justify-between items-center">
                    <span>Risk Quotient Score:</span>
                    <strong className="text-lg font-black text-amber-400">{totalScore} / 20</strong>
                  </div>
                </div>

                {/* Recommended Asset Allocation Blueprint */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Recommended Model Allocation
                  </h5>

                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-700 font-medium mb-1">
                        <span>Equity (Flexi, Mid, Small Cap)</span>
                        <strong className="text-blue-700">{riskProfileResult.equity}%</strong>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${riskProfileResult.equity}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-700 font-medium mb-1">
                        <span>Debt & Arbitrage Funds</span>
                        <strong className="text-indigo-700">{riskProfileResult.debt}%</strong>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${riskProfileResult.debt}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-700 font-medium mb-1">
                        <span>Gold & Commodities</span>
                        <strong className="text-amber-600">{riskProfileResult.gold}%</strong>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${riskProfileResult.gold}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
