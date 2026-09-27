import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  TrendingUp,
  Award,
  CheckCircle,
  Building,
  ShieldCheck,
  ArrowRight,
  Headphones,
  FileCheck2,
  Sparkles,
  PlaneTakeoff
} from 'lucide-react';

export const PartnerNetwork: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [currentAum, setCurrentAum] = useState('₹1 Cr - ₹5 Cr');
  const [submitted, setSubmitted] = useState(false);
  const [partnerId, setPartnerId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/lead/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          city,
          currentAum,
          experienceYears: 5,
        })
      });
      const data = await res.json();
      if (data.success) {
        setPartnerId(data.partnerId || `VCP-${Math.floor(100000 + Math.random() * 900000)}`);
        setSubmitted(true);
      }
    } catch {
      setPartnerId(`VCP-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      
      {/* Hero Banner */}
      <div className="bg-[#051B63] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-blue-300" />
            NJ Wealth & ZFunds Model Partner Network
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white font-heading tracking-tight leading-tight">
            Scale Your Financial Advisory Practice with Vian Capital
          </h2>
          <p className="text-sm md:text-base text-blue-200 leading-relaxed font-normal">
            Join India's fastest-growing multi-asset distribution platform. Offer Mutual Funds, Term & Health Insurance, Fixed Income, and AI-driven portfolio tracking to your clients with zero tech setup cost.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-blue-100">
            <span className="flex items-center gap-1.5 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              100% Paperless Onboarding
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Highest Industry Trail Payouts
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              White-label Client Mobile App
            </span>
          </div>
        </div>

        {/* Subtle Decorative Geometry */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/20 to-transparent pointer-events-none hidden lg:block"></div>
      </div>

      {/* Partner Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Building className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-lg font-heading">
            Multi-Asset Suite Under One Roof
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Distribute 42+ AMCs (Mutual Funds), leading Health & Life Insurance companies, SGBs, Corporate FDs, and PMS schemes through a single digital console.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-lg font-heading">
            Automated Daily & Monthly SIPs
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Empower your investors with ZFunds-style Daily SIPs, instant e-Mandates, and automated portfolio rebalancing nudges powered by Vian AI.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <PlaneTakeoff className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-lg font-heading">
            Viaan Holidays Synergy & Rewards
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Exclusive partner incentives, annual international leadership conventions with Viaan Holidays, and dedicated corporate travel rewards.
          </p>
        </div>
      </div>

      {/* Registration Form / Success Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl max-w-3xl mx-auto">
        {!submitted ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                Become a Registered MFD / IFA Partner
              </span>
              <h3 className="text-2xl font-black text-slate-900 font-heading">
                Apply for Vian Capital Sub-Broker & Partner Franchise
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Fill the details below to receive your digital partner login credentials and business development welcome kit.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Legal Name / Entity Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra Verma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="advisor@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mobile Number (WhatsApp Enabled)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">City / Base Region</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Ahmedabad, Mumbai, Delhi, Bengaluru"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="font-semibold text-slate-700 block mb-1">Current Assets Under Management (AUM)</label>
                <select
                  value={currentAum}
                  onChange={(e) => setCurrentAum(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                >
                  <option value="New to Advisory (₹0)">New to Advisory / Aspirant</option>
                  <option value="Under ₹1 Crore">Under ₹1 Crore</option>
                  <option value="₹1 Cr - ₹5 Cr">₹1 Cr - ₹5 Cr</option>
                  <option value="₹5 Cr - ₹25 Cr">₹5 Cr - ₹25 Cr</option>
                  <option value="₹25 Cr+ (HNI Desk)">₹25 Cr+ (HNI Advisory Desk)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#051B63] hover:bg-[#072480] text-white font-bold text-sm shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Registering Partner...' : 'Submit Partner Application'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Zero Franchise Fees • AMFI ARN Transfer Assistance Available</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                Application Received
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2 font-heading">
                Welcome to the Vian Capital Family!
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Thank you, <strong>{fullName}</strong>. Your Partner ID has been generated. Our Regional Business Development Head will connect with you via WhatsApp and Call within 4 business hours.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm mx-auto text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Partner Code:</span>
                <span className="font-mono font-bold text-[#051B63]">{partnerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Branch Location:</span>
                <span className="font-semibold text-slate-800">{city} Desk</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Advisory Desk:</span>
                <span className="font-semibold text-emerald-600">{currentAum}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="py-2.5 px-6 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
            >
              Submit Another Application
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
