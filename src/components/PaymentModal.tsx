import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  Building,
  CreditCard,
  QrCode,
  ArrowRight,
  Download,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { MutualFund } from '../data/mutualFundsData';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  fund: MutualFund | null;
  onSuccess: (orderData: {
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
  }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  fund,
  onSuccess,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');
  const [investmentType, setInvestmentType] = useState<'SIP' | 'Lumpsum'>('SIP');
  const [frequency, setFrequency] = useState<'Monthly' | 'Daily'>('Monthly');
  const [amount, setAmount] = useState<number>(5000);
  const [sipDate, setSipDate] = useState<number>(10);
  const [isStepUp, setIsStepUp] = useState<boolean>(true);
  const [stepUpPercent, setStepUpPercent] = useState<number>(10);
  
  // Payment Mode
  const [paymentMode, setPaymentMode] = useState<'upi' | 'netbanking' | 'mandate'>('upi');
  const [upiId, setUpiId] = useState<string>('rajesh.sharma@okaxis');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [useExistingFolio, setUseExistingFolio] = useState<boolean>(true);

  // Result state
  const [txnResult, setTxnResult] = useState<{
    txnId: string;
    folioNumber: string;
    bseOrderId: string;
    date: string;
  } | null>(null);

  if (!isOpen || !fund) return null;

  const handleProceedToPayment = () => {
    if (amount < (investmentType === 'SIP' ? fund.minSip : fund.minLumpsum)) {
      alert(`Minimum investment for this scheme is ₹${investmentType === 'SIP' ? fund.minSip : fund.minLumpsum}`);
      return;
    }
    setStep('payment');
  };

  const handleConfirmPayment = () => {
    setStep('processing');
    
    // Simulate real gateway verification and exchange order placement
    setTimeout(() => {
      const generatedTxnId = `VC-TXN-${Date.now().toString().slice(-6)}`;
      const generatedFolio = useExistingFolio
        ? 'PPF/892147/01'
        : `VC-${Math.floor(100000 + Math.random() * 900000)}/01`;
      const generatedBseOrder = `BSE-${Math.floor(10000000 + Math.random() * 90000000)}`;

      const result = {
        txnId: generatedTxnId,
        folioNumber: generatedFolio,
        bseOrderId: generatedBseOrder,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      };

      setTxnResult(result);
      setStep('success');

      // Trigger callback to update client-side holdings in real-time!
      onSuccess({
        schemeName: fund.name,
        schemeId: fund.id,
        category: fund.category,
        amount: Number(amount),
        type: investmentType,
        frequency: investmentType === 'SIP' ? frequency : undefined,
        sipDate: investmentType === 'SIP' ? sipDate : undefined,
        paymentMode: paymentMode === 'upi' ? 'UPI' : paymentMode === 'mandate' ? 'Auto-Debit (NACH)' : 'NetBanking',
        txnId: generatedTxnId,
        folioNumber: generatedFolio,
      });
    }, 2400);
  };

  const handleClose = () => {
    setStep('details');
    setTxnResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-[#051B63] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center font-bold text-base text-blue-200">
              ₹
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight font-heading">
                {step === 'success' ? 'Investment Confirmed!' : 'Invest with Vian Capital'}
              </h3>
              <p className="text-xs text-blue-200">
                {step === 'success' ? 'Folio Allocated • BSE Star MF' : 'SEBI & AMFI Registered Platform'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* STEP 1: INVESTMENT DETAILS */}
          {step === 'details' && (
            <div className="space-y-5">
              {/* Scheme Summary Pill */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                  {fund.category}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1.5">{fund.name}</h4>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200">
                  <span>Current NAV: <strong className="text-slate-800">₹{fund.nav.toFixed(2)}</strong></span>
                  <span>3Y CAGR: <strong className="text-emerald-600">+{fund.returns3Y}%</strong></span>
                  <span>Min SIP: <strong className="text-slate-800">₹{fund.minSip}</strong></span>
                </div>
              </div>

              {/* Type Switcher: SIP vs Lumpsum */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Investment Mode</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setInvestmentType('SIP');
                      if (amount < fund.minSip) setAmount(fund.minSip);
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                      investmentType === 'SIP'
                        ? 'bg-white text-[#051B63] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Systematic Investment (SIP)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInvestmentType('Lumpsum');
                      if (amount < fund.minLumpsum) setAmount(fund.minLumpsum);
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                      investmentType === 'Lumpsum'
                        ? 'bg-white text-[#051B63] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    One-time Lumpsum
                  </button>
                </div>
              </div>

              {/* Amount Input with Quick Presets */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {investmentType === 'SIP' ? 'Monthly SIP Amount' : 'Lumpsum Amount'}
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Min: ₹{investmentType === 'SIP' ? fund.minSip : fund.minLumpsum}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-lg"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {[2500, 5000, 10000, 25000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`text-xs py-1 px-2.5 rounded-lg border font-medium transition-colors ${
                        amount === preset
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                      }`}
                    >
                      ₹{preset.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* SIP Specific Settings */}
              {investmentType === 'SIP' && (
                <div className="space-y-3 p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-800">SIP Frequency</span>
                      <p className="text-[11px] text-slate-500">ZFunds style Daily or Monthly</p>
                    </div>
                    <div className="flex gap-1.5">
                      {(['Monthly', 'Daily'] as const).map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => setFrequency(freq)}
                          className={`text-xs py-1 px-2.5 rounded-md font-semibold transition-all ${
                            frequency === freq
                              ? 'bg-[#051B63] text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700'
                          }`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>

                  {frequency === 'Monthly' && (
                    <div>
                      <label className="text-xs font-medium text-slate-700 flex items-center gap-1 mb-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        Monthly Debit Date
                      </label>
                      <div className="flex items-center gap-2 overflow-x-auto py-1">
                        {[1, 5, 10, 15, 20, 25].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setSipDate(d)}
                            className={`w-9 h-9 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                              sipDate === d
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300'
                            }`}
                          >
                            {d}th
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step-up SIP Toggle */}
                  <div className="pt-2 border-t border-blue-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-800">Annual Step-Up (+{stepUpPercent}%)</span>
                      <p className="text-[10px] text-slate-500">Boosts maturity wealth by ~35% over 10 years</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isStepUp}
                        onChange={(e) => setIsStepUp(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* Folio Option */}
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  id="folioCheck"
                  checked={useExistingFolio}
                  onChange={(e) => setUseExistingFolio(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="folioCheck" className="cursor-pointer">
                  Link to verified CAMS Folio (<strong>PPF/892147/01</strong>)
                </label>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={handleProceedToPayment}
                className="w-full py-3 px-4 rounded-xl bg-[#051B63] hover:bg-[#072480] text-white font-bold text-sm shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 transition-all"
              >
                Proceed to Secure Payment
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit Bank Grade Encryption • Zero Commission Direct Plan</span>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD SELECTION */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-500">Order Total:</span>
                  <p className="font-bold text-slate-900 text-base">₹{amount.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Mode:</span>
                  <p className="font-semibold text-blue-700">{investmentType === 'SIP' ? `${frequency} SIP` : 'Lumpsum'}</p>
                </div>
              </div>

              {/* Payment Mode Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">Select Payment Gateway</label>

                {/* Option 1: Instant UPI */}
                <div
                  onClick={() => setPaymentMode('upi')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMode === 'upi'
                      ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 text-xs">UPI AutoPay / Instant UPI</h5>
                        <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Zero Fees
                    </span>
                  </div>

                  {paymentMode === 'upi' && (
                    <div className="mt-3 pt-3 border-t border-blue-200/60 space-y-2">
                      <label className="text-[11px] font-medium text-slate-700 block">Enter UPI ID / VPA</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@okaxis"
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-blue-600 focus:outline-none"
                        />
                        <button
                          type="button"
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          Show QR
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Option 2: Net Banking */}
                <div
                  onClick={() => setPaymentMode('netbanking')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMode === 'netbanking'
                      ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Building className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-slate-900 text-xs">Internet Banking</h5>
                      <p className="text-[11px] text-slate-500">HDFC, ICICI, SBI, Kotak, Axis & 50+ Banks</p>
                    </div>
                  </div>

                  {paymentMode === 'netbanking' && (
                    <div className="mt-3 pt-3 border-t border-blue-200/60">
                      <label className="text-[11px] font-medium text-slate-700 block mb-1.5">Choose Bank</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Kotak Mahindra Bank'].map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setSelectedBank(b)}
                            className={`py-1.5 px-2 rounded-lg text-xs text-left font-medium border ${
                              selectedBank === b
                                ? 'border-blue-600 bg-white text-blue-700 font-bold'
                                : 'border-slate-200 bg-white text-slate-700'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Option 3: e-Mandate (NACH Auto-Debit) */}
                {investmentType === 'SIP' && (
                  <div
                    onClick={() => setPaymentMode('mandate')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMode === 'mandate'
                        ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 text-xs">Existing Bank e-Mandate</h5>
                        <p className="text-[11px] text-slate-500">HDFC Bank Auto-Debit (UMRN-9912041)</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Pay & Authenticate ₹{amount.toLocaleString('en-IN')}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING STATE */}
          {step === 'processing' && (
            <div className="py-12 px-4 text-center space-y-4">
              <div className="relative mx-auto w-16 h-16">
                <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Securing Investment with Exchange</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Routing via BSE Star MF & NPCI e-Mandate switchboard. Please do not press back or refresh.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-600 font-semibold bg-emerald-50 max-w-xs mx-auto py-1.5 px-3 rounded-full">
                <ShieldCheck className="w-4 h-4" />
                <span>Encrypted Banking Session Active</span>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 'success' && txnResult && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Order Successfully Placed
                </span>
                <h4 className="font-extrabold text-slate-900 text-xl mt-1">₹{amount.toLocaleString('en-IN')}</h4>
                <p className="text-xs text-slate-600 font-medium">{fund.name}</p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono font-bold text-slate-800">{txnResult.txnId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Folio Number:</span>
                  <span className="font-mono font-bold text-blue-700">{txnResult.folioNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">BSE Order ID:</span>
                  <span className="font-mono text-slate-700">{txnResult.bseOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Execution Date:</span>
                  <span className="font-semibold text-slate-800">{txnResult.date}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Units Allocation:</span>
                  <span className="font-semibold text-emerald-600">Applicable T+1 NAV</span>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-lg text-[11px] text-blue-900 flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Confirmation SMS & CAMS CAS statement update sent to your registered mobile and email.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => alert(`Receipt downloaded for ${txnResult.txnId}`)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Receipt
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#051B63] hover:bg-[#072480] text-white text-xs font-bold shadow-md shadow-blue-900/20"
                >
                  View in Portfolio Tracker
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
