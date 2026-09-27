import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle,
  Building2,
  Calendar,
  HeartPulse,
  Award,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { InsurancePlan } from '../data/insuranceData';

interface InsuranceDetailModalProps {
  plan: InsurancePlan | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InsuranceDetailModal: React.FC<InsuranceDetailModalProps> = ({
  plan,
  isOpen,
  onClose,
}) => {
  const [applicantName, setApplicantName] = useState('Rajesh Sharma');
  const [applicantAge, setApplicantAge] = useState(34);
  const [applicantCity, setApplicantCity] = useState('Mumbai');
  const [applicantPhone, setApplicantPhone] = useState('+91 98201 44892');
  const [paymentFrequency, setPaymentFrequency] = useState<'monthly' | 'annual'>('annual');
  const [hasPreExisting, setHasPreExisting] = useState(false);
  const [isSmoker, setIsSmoker] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [policyId, setPolicyId] = useState('');

  if (!isOpen || !plan) return null;

  const calculatedPremium = paymentFrequency === 'annual'
    ? (isSmoker && plan.type === 'term' ? Math.round(plan.annualPremium * 1.35) : plan.annualPremium)
    : (isSmoker && plan.type === 'term' ? Math.round(plan.monthlyPremium * 1.35) : plan.monthlyPremium);

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedPolicy = `VIAN-POL-${Math.floor(1000000 + Math.random() * 9000000)}`;
    setPolicyId(generatedPolicy);
    setIsSuccess(true);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-[#051B63] text-white p-6 relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-200 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                {plan.type.toUpperCase()} INSURANCE • IRDAI APPROVED
              </span>
              <h3 className="text-xl font-bold text-white mt-1.5 font-heading">
                {plan.name}
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                Underwritten by {plan.insurer} • {plan.claimRatio} Claim Settlement Ratio
              </p>
            </div>
            <button
              onClick={handleResetAndClose}
              className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-blue-400/20 text-xs">
            <div>
              <span className="text-blue-300 block text-[10px]">Sum Insured</span>
              <span className="text-base font-extrabold text-white">{plan.coverAmount}</span>
            </div>
            <div>
              <span className="text-blue-300 block text-[10px]">Starting Premium</span>
              <span className="text-base font-extrabold text-emerald-400">
                ₹{plan.monthlyPremium}/mo
              </span>
            </div>
            <div>
              <span className="text-blue-300 block text-[10px]">Cashless Network</span>
              <span className="text-base font-extrabold text-white">
                {plan.cashlessHospitals ? `${plan.cashlessHospitals.toLocaleString('en-IN')}+` : 'Pan-India'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5">
          {!isSuccess ? (
            <>
              {/* Key Features */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  Policy Coverage Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {plan.keyFeatures.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-[11px] font-medium leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax & Extra Details */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[11px] block">Tax Savings Eligible</span>
                  <span className="text-[11px] text-emerald-800">
                    {plan.type === 'health'
                      ? 'Deduct up to ₹75,000 under Section 80D (Self & Senior Parents)'
                      : 'Deduct up to ₹1,50,000 under Section 80C & Tax-free under Sec 10(10D)'}
                  </span>
                </div>
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              </div>

              {/* Instant Application & Custom Quote Form */}
              <form onSubmit={handleSubmitApplication} className="space-y-4 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Instant Quotation & Proposal
                  </h4>
                  <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentFrequency('monthly')}
                      className={`px-2 py-1 rounded-md text-[11px] font-semibold ${
                        paymentFrequency === 'monthly' ? 'bg-white shadow-xs text-blue-900' : 'text-slate-600'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentFrequency('annual')}
                      className={`px-2 py-1 rounded-md text-[11px] font-semibold ${
                        paymentFrequency === 'annual' ? 'bg-white shadow-xs text-blue-900' : 'text-slate-600'
                      }`}
                    >
                      Annual (Save 15%)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Age (Years)</label>
                    <input
                      type="number"
                      min={18}
                      max={70}
                      value={applicantAge}
                      onChange={(e) => setApplicantAge(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">City / Pincode</label>
                    <input
                      type="text"
                      value={applicantCity}
                      onChange={(e) => setApplicantCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Health / Lifestyle Toggles */}
                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  {plan.type === 'term' && (
                    <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSmoker}
                        onChange={(e) => setIsSmoker(e.target.checked)}
                        className="rounded text-blue-600"
                      />
                      <span>Tobacco / Cigarette consumer in the last 24 months</span>
                    </label>
                  )}
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasPreExisting}
                      onChange={(e) => setHasPreExisting(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Existing medical conditions (Diabetes, Hypertension, Thyroid)</span>
                  </label>
                </div>

                {/* Premium Summary & Instant Purchase */}
                <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-600 block">
                      Total Premium ({paymentFrequency})
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <strong className="text-xl font-extrabold text-[#051B63]">
                        ₹{calculatedPremium.toLocaleString('en-IN')}
                      </strong>
                      <span className="text-[10px] text-slate-500">+18% GST Applicable</span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-[#051B63] hover:bg-[#072480] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Issue Policy Instantly
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Policy Success Confirmation */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
                  Policy Proposal Successfully Issued
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-2 font-heading">{plan.name}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Policy Certificate & Tele-Medical link dispatched to {applicantPhone}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Proposal Number:</span>
                  <span className="font-mono font-bold text-[#051B63]">{policyId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Proposer Name:</span>
                  <span className="font-semibold text-slate-800">{applicantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sum Assured / Cover:</span>
                  <span className="font-bold text-emerald-600">{plan.coverAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Annual Premium:</span>
                  <span className="font-bold text-slate-900">₹{calculatedPremium.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-center justify-center gap-2">
                <PhoneCall className="w-4 h-4 text-blue-600" />
                <span>Our Dedicated Claims & Onboarding Officer is assigned to your account.</span>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="py-2.5 px-6 rounded-xl bg-[#051B63] text-white text-xs font-bold hover:bg-[#072480]"
              >
                Done
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
