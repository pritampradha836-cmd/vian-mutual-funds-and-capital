import React, { useState, useMemo } from 'react';
import {
  Calculator,
  TrendingUp,
  Coins,
  Repeat,
  Receipt,
  HeartPulse,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { MUTUAL_FUNDS, MutualFund } from '../data/mutualFundsData';

interface CalculatorsStudioProps {
  onInvestWithPreset?: (fund: MutualFund, amount: number) => void;
}

export const CalculatorsStudio: React.FC<CalculatorsStudioProps> = ({ onInvestWithPreset }) => {
  const [calcType, setCalcType] = useState<'sip' | 'lumpsum' | 'swp' | 'elss' | 'hlv'>('sip');

  // --- SIP State ---
  const [sipAmount, setSipAmount] = useState<number>(10000);
  const [sipYears, setSipYears] = useState<number>(15);
  const [sipReturn, setSipReturn] = useState<number>(14);
  const [isStepUp, setIsStepUp] = useState<boolean>(true);
  const [stepUpPercent, setStepUpPercent] = useState<number>(10);
  const [adjustInflation, setAdjustInflation] = useState<boolean>(false);

  // --- Lumpsum State ---
  const [lumpAmount, setLumpAmount] = useState<number>(500000);
  const [lumpYears, setLumpYears] = useState<number>(10);
  const [lumpReturn, setLumpReturn] = useState<number>(15);

  // --- SWP State ---
  const [swpInitialCorpus, setSwpInitialCorpus] = useState<number>(5000000);
  const [swpMonthlyWithdrawal, setSwpMonthlyWithdrawal] = useState<number>(35000);
  const [swpYears, setSwpYears] = useState<number>(15);
  const [swpReturn, setSwpReturn] = useState<number>(9.5);

  // --- ELSS Tax Saver State ---
  const [annualIncome, setAnnualIncome] = useState<number>(1800000);
  const [elssAmount, setElssAmount] = useState<number>(150000);

  // --- HLV (Human Life Value) State ---
  const [hlvAnnualIncome, setHlvAnnualIncome] = useState<number>(1800000);
  const [hlvCurrentAge, setHlvCurrentAge] = useState<number>(32);
  const [hlvRetireAge, setHlvRetireAge] = useState<number>(60);
  const [hlvLiabilities, setHlvLiabilities] = useState<number>(3500000); // Home loan etc
  const [hlvLiquidAssets, setHlvLiquidAssets] = useState<number>(1200000);

  // 1. SIP Calculations
  const sipResult = useMemo(() => {
    let totalInvested = 0;
    let totalWealth = 0;
    let currentSip = sipAmount;
    const monthlyRate = (sipReturn / 100) / 12;

    for (let yr = 1; yr <= sipYears; yr++) {
      for (let m = 1; m <= 12; m++) {
        totalInvested += currentSip;
        // Remaining months compounded
        const monthsRemaining = (sipYears * 12) - ((yr - 1) * 12 + m);
        totalWealth += currentSip * Math.pow(1 + monthlyRate, monthsRemaining);
      }
      if (isStepUp) {
        currentSip += currentSip * (stepUpPercent / 100);
      }
    }

    let finalWealth = totalWealth;
    if (adjustInflation) {
      // 6% inflation deflator
      finalWealth = totalWealth / Math.pow(1.06, sipYears);
    }

    const estimatedGains = Math.max(0, finalWealth - totalInvested);

    return {
      totalInvested: Math.round(totalInvested),
      finalWealth: Math.round(finalWealth),
      estimatedGains: Math.round(estimatedGains),
    };
  }, [sipAmount, sipYears, sipReturn, isStepUp, stepUpPercent, adjustInflation]);

  // 2. Lumpsum Calculation
  const lumpsumResult = useMemo(() => {
    const rate = lumpReturn / 100;
    const finalAmount = lumpAmount * Math.pow(1 + rate, lumpYears);
    return {
      invested: lumpAmount,
      finalAmount: Math.round(finalAmount),
      gains: Math.round(finalAmount - lumpAmount),
    };
  }, [lumpAmount, lumpYears, lumpReturn]);

  // 3. SWP Calculation
  const swpResult = useMemo(() => {
    let corpus = swpInitialCorpus;
    let totalWithdrawn = 0;
    const monthlyRate = (swpReturn / 100) / 12;
    const totalMonths = swpYears * 12;

    for (let m = 1; m <= totalMonths; m++) {
      corpus = corpus * (1 + monthlyRate) - swpMonthlyWithdrawal;
      totalWithdrawn += swpMonthlyWithdrawal;
      if (corpus <= 0) {
        corpus = 0;
        break;
      }
    }

    return {
      totalWithdrawn,
      remainingCorpus: Math.round(corpus),
    };
  }, [swpInitialCorpus, swpMonthlyWithdrawal, swpYears, swpReturn]);

  // 4. ELSS Tax Saver
  const elssResult = useMemo(() => {
    // 30% slab + 4% cess = 31.2% tax rate
    const eligibleAmount = Math.min(elssAmount, 150000);
    const taxSaved = Math.round(eligibleAmount * 0.312);
    // 3-year historical CAGR ~ 18%
    const projected3YVal = Math.round(eligibleAmount * Math.pow(1.18, 3));
    return {
      eligibleAmount,
      taxSaved,
      projected3YVal,
    };
  }, [elssAmount]);

  // 5. HLV Calculation
  const hlvResult = useMemo(() => {
    const earningYears = Math.max(1, hlvRetireAge - hlvCurrentAge);
    // 70% of income dedicated to family living
    const annualFamilyNeeds = hlvAnnualIncome * 0.70;
    // Discount rate 8% - 5% inflation = 3% real discount rate
    const pvFactor = (1 - Math.pow(1 + 0.03, -earningYears)) / 0.03;
    const pvOfEarnings = annualFamilyNeeds * pvFactor;
    const recommendedCover = Math.round(pvOfEarnings + hlvLiabilities - hlvLiquidAssets);

    return {
      earningYears,
      recommendedCover: Math.max(5000000, recommendedCover),
      ruleOfThumbCover: hlvAnnualIncome * 20, // 20x annual income standard
    };
  }, [hlvAnnualIncome, hlvCurrentAge, hlvRetireAge, hlvLiabilities, hlvLiquidAssets]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="bg-[#051B63] text-white p-6 border-b border-blue-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-200 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                Wealth Architecture
              </span>
              <span className="text-xs text-blue-200">SEBI & AMFI Formula Grounded</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white mt-1 font-heading">
              Financial Calculators & Goal Planning
            </h3>
            <p className="text-xs text-blue-200 mt-0.5">
              Accurate compounding projections for SIP, Lumpsum, SWP, Tax Optimization & Life Coverage
            </p>
          </div>

          {/* Calculator Switcher */}
          <div className="flex flex-wrap gap-1 bg-white/10 p-1 rounded-xl text-xs">
            {[
              { id: 'sip', label: 'SIP Compounding', icon: Repeat },
              { id: 'lumpsum', label: 'Lumpsum Wealth', icon: Coins },
              { id: 'swp', label: 'SWP Monthly Income', icon: TrendingUp },
              { id: 'elss', label: 'ELSS Tax Saver', icon: Receipt },
              { id: 'hlv', label: 'Insurance Cover HLV', icon: HeartPulse },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = calcType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCalcType(tab.id as any)}
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

      {/* Body */}
      <div className="p-6">
        
        {/* 1. SIP CALCULATOR */}
        {calcType === 'sip' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Inputs */}
            <div className="lg:col-span-6 space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                Customize SIP Parameters
              </h4>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium">Monthly Investment Amount:</span>
                  <strong className="text-base text-slate-900 font-bold">₹{sipAmount.toLocaleString('en-IN')}</strong>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={100000}
                  step={1000}
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex gap-2 mt-1.5">
                  {[5000, 10000, 25000, 50000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSipAmount(amt)}
                      className={`text-[11px] py-0.5 px-2 rounded-md border font-medium ${
                        sipAmount === amt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium">Investment Period:</span>
                  <strong className="text-base text-slate-900 font-bold">{sipYears} Years</strong>
                </div>
                <input
                  type="range"
                  min={1}
                  max={35}
                  step={1}
                  value={sipYears}
                  onChange={(e) => setSipYears(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium">Expected Annual CAGR:</span>
                  <strong className="text-base text-slate-900 font-bold">{sipReturn}%</strong>
                </div>
                <input
                  type="range"
                  min={8}
                  max={25}
                  step={0.5}
                  value={sipReturn}
                  onChange={(e) => setSipReturn(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Step-up SIP Toggle */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Annual Step-Up SIP (+{stepUpPercent}%)</span>
                    <p className="text-[11px] text-slate-500">Increases SIP each year in tandem with salary increments</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isStepUp}
                    onChange={(e) => setIsStepUp(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs font-medium text-slate-700">Adjust for Inflation (6%)</span>
                    <p className="text-[10px] text-slate-500">Shows future corpus in today's purchasing power value</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={adjustInflation}
                    onChange={(e) => setAdjustInflation(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="bg-[#051B63] text-white p-6 rounded-2xl shadow-lg space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Projected Maturity Wealth ({sipYears} Years)
                </span>
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black text-white font-heading">
                    ₹{(sipResult.finalWealth / 10000000).toFixed(2)} Crore
                  </h3>
                  <span className="text-xs text-emerald-400 font-semibold mt-1 block">
                    (₹{sipResult.finalWealth.toLocaleString('en-IN')})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-400/20 text-xs">
                  <div>
                    <span className="text-blue-300 block text-[11px]">Total Capital Invested</span>
                    <strong className="text-base text-white font-bold">
                      ₹{sipResult.totalInvested.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-blue-300 block text-[11px]">Estimated Wealth Gain</span>
                    <strong className="text-base text-emerald-400 font-bold">
                      ₹{sipResult.estimatedGains.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                {/* Visual Ratio Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="w-full bg-blue-900/60 h-3 rounded-full overflow-hidden flex">
                    <div
                      className="bg-blue-400 h-full"
                      style={{ width: `${Math.round((sipResult.totalInvested / sipResult.finalWealth) * 100)}%` }}
                      title="Invested Amount"
                    ></div>
                    <div
                      className="bg-emerald-400 h-full flex-1"
                      title="Estimated Gains"
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-blue-200">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      Invested ({Math.round((sipResult.totalInvested / sipResult.finalWealth) * 100)}%)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Compounded Gains ({100 - Math.round((sipResult.totalInvested / sipResult.finalWealth) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-900 text-xs">Ready to start this SIP?</h5>
                  <p className="text-[11px] text-slate-500">Pick top-rated direct growth fund with zero commission</p>
                </div>
                {onInvestWithPreset && (
                  <button
                    type="button"
                    onClick={() => onInvestWithPreset(MUTUAL_FUNDS[0], sipAmount)}
                    className="py-2.5 px-4 bg-[#051B63] hover:bg-[#072480] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all shrink-0"
                  >
                    Start ₹{sipAmount.toLocaleString('en-IN')} SIP
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. LUMPSUM CALCULATOR */}
        {calcType === 'lumpsum' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">One-Time Lumpsum Parameters</h4>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium">Initial Lumpsum Capital:</span>
                  <strong className="text-base text-slate-900 font-bold">₹{lumpAmount.toLocaleString('en-IN')}</strong>
                </div>
                <input
                  type="range"
                  min={25000}
                  max={5000000}
                  step={25000}
                  value={lumpAmount}
                  onChange={(e) => setLumpAmount(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium">Compounding Horizon:</span>
                  <strong className="text-base text-slate-900 font-bold">{lumpYears} Years</strong>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={lumpYears}
                  onChange={(e) => setLumpYears(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium">Expected Annual CAGR:</span>
                  <strong className="text-base text-slate-900 font-bold">{lumpReturn}%</strong>
                </div>
                <input
                  type="range"
                  min={8}
                  max={25}
                  step={0.5}
                  value={lumpReturn}
                  onChange={(e) => setLumpReturn(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#051B63] text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Projected Maturity Value ({lumpYears} Years)
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-white font-heading mt-2">
                  ₹{(lumpsumResult.finalAmount / 10000000).toFixed(2)} Crore
                </h3>
                <span className="text-xs text-emerald-400 font-semibold mt-1 block">
                  (₹{lumpsumResult.finalAmount.toLocaleString('en-IN')})
                </span>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-blue-400/20 text-xs">
                  <div>
                    <span className="text-blue-300 block text-[11px]">Original Capital</span>
                    <strong className="text-base text-white font-bold">
                      ₹{lumpsumResult.invested.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-blue-300 block text-[11px]">Compounded Gains</span>
                    <strong className="text-base text-emerald-400 font-bold">
                      ₹{lumpsumResult.gains.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-900/60 rounded-xl text-xs text-blue-200 mt-6 border border-blue-400/20">
                Rule of 72: At {lumpReturn}% CAGR, your principal doubles roughly every {(72 / lumpReturn).toFixed(1)} years!
              </div>
            </div>
          </div>
        )}

        {/* 3. SWP (SYSTEMATIC WITHDRAWAL PLAN) */}
        {calcType === 'swp' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">Retirement Regular Cash Flow Parameters</h4>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium">Initial Retirement Corpus:</span>
                  <strong className="text-base text-slate-900 font-bold">₹{(swpInitialCorpus / 10000000).toFixed(2)} Cr</strong>
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={25000000}
                  step={500000}
                  value={swpInitialCorpus}
                  onChange={(e) => setSwpInitialCorpus(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium">Desired Monthly Pension / Payout:</span>
                  <strong className="text-base text-slate-900 font-bold">₹{swpMonthlyWithdrawal.toLocaleString('en-IN')}</strong>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={150000}
                  step={5000}
                  value={swpMonthlyWithdrawal}
                  onChange={(e) => setSwpMonthlyWithdrawal(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium">Duration of Payouts:</span>
                  <strong className="text-base text-slate-900 font-bold">{swpYears} Years</strong>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={swpYears}
                  onChange={(e) => setSwpYears(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#051B63] text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Total Monthly Cash Flow Received
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-white font-heading mt-2">
                  ₹{(swpResult.totalWithdrawn / 100000).toFixed(2)} Lakhs
                </h3>
                <span className="text-xs text-blue-200 mt-1 block">
                  (₹{swpMonthlyWithdrawal.toLocaleString('en-IN')} every month for {swpYears} years)
                </span>

                <div className="mt-6 pt-4 border-t border-blue-400/20 text-xs">
                  <span className="text-blue-300 block text-[11px]">Remaining Corpus Balance</span>
                  <strong className="text-2xl font-black text-emerald-400">
                    ₹{swpResult.remainingCorpus.toLocaleString('en-IN')}
                  </strong>
                  <p className="text-[11px] text-blue-200 mt-1">
                    Your principal remains intact and continues to compound even after monthly payouts!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. ELSS TAX SAVER */}
        {calcType === 'elss' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">Section 80C Tax Savings Inputs</h4>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium">Annual Taxable Income:</span>
                  <strong className="text-base text-slate-900 font-bold">₹{annualIncome.toLocaleString('en-IN')}</strong>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={5000000}
                  step={100000}
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium">ELSS Investment (Max ₹1.5L for 80C):</span>
                  <strong className="text-base text-slate-900 font-bold">₹{elssAmount.toLocaleString('en-IN')}</strong>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={150000}
                  step={5000}
                  value={elssAmount}
                  onChange={(e) => setElssAmount(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#051B63] text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Direct Income Tax Saved
                </span>
                <h3 className="text-4xl font-black text-white font-heading mt-2">
                  ₹{elssResult.taxSaved.toLocaleString('en-IN')}
                </h3>
                <span className="text-xs text-blue-200 mt-1 block">
                  Under Old Tax Regime Section 80C (31.2% effective tax bracket)
                </span>

                <div className="mt-6 pt-4 border-t border-blue-400/20 text-xs">
                  <span className="text-blue-300 block text-[11px]">Projected Corpus at 3-Year Lock-in Maturity</span>
                  <strong className="text-2xl font-black text-emerald-400">
                    ₹{elssResult.projected3YVal.toLocaleString('en-IN')}
                  </strong>
                  <p className="text-[11px] text-blue-200 mt-1">
                    ELSS holds the shortest mandatory lock-in (3 years) among all Section 80C instruments (vs 5 yrs FD, 15 yrs PPF).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. HUMAN LIFE VALUE (HLV) */}
        {calcType === 'hlv' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">Human Life Value (HLV) Parameters</h4>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">Your Annual Take-Home Income:</span>
                  <strong className="text-slate-900 font-bold">₹{hlvAnnualIncome.toLocaleString('en-IN')}</strong>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={6000000}
                  step={100000}
                  value={hlvAnnualIncome}
                  onChange={(e) => setHlvAnnualIncome(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">Current Age: {hlvCurrentAge} Yrs</label>
                  <input
                    type="range"
                    min={21}
                    max={55}
                    value={hlvCurrentAge}
                    onChange={(e) => setHlvCurrentAge(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">Retirement Target: {hlvRetireAge} Yrs</label>
                  <input
                    type="range"
                    min={50}
                    max={70}
                    value={hlvRetireAge}
                    onChange={(e) => setHlvRetireAge(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">Total Liabilities (Home loan, car loan):</span>
                  <strong className="text-slate-900 font-bold">₹{hlvLiabilities.toLocaleString('en-IN')}</strong>
                </div>
                <input
                  type="range"
                  min={0}
                  max={15000000}
                  step={500000}
                  value={hlvLiabilities}
                  onChange={(e) => setHlvLiabilities(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#051B63] text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Recommended Pure Term Insurance Shield
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-white font-heading mt-2">
                  ₹{(hlvResult.recommendedCover / 10000000).toFixed(2)} Crore
                </h3>
                <span className="text-xs text-emerald-400 font-semibold mt-1 block">
                  Guarantees your family's financial freedom for {hlvResult.earningYears} earning years
                </span>

                <div className="mt-6 pt-4 border-t border-blue-400/20 text-xs space-y-2">
                  <div className="flex justify-between text-blue-200">
                    <span>Standard 20x Rule of Thumb:</span>
                    <strong className="text-white">₹{(hlvResult.ruleOfThumbCover / 10000000).toFixed(2)} Cr</strong>
                  </div>
                  <div className="flex justify-between text-blue-200">
                    <span>Liabilities Fully Protected:</span>
                    <strong className="text-white">₹{(hlvLiabilities / 100000).toFixed(1)} Lakhs</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-900/60 rounded-xl text-xs text-blue-200 mt-4 border border-blue-400/20">
                A ₹2 Crore cover costs as low as ~₹1,100 per month for a healthy non-smoker at age 32.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
