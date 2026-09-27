import React, { useState } from 'react';
import {
  Menu,
  X,
  TrendingUp,
  Shield,
  PieChart,
  Bot,
  Activity,
  Calculator,
  Users,
  Search,
  ArrowRight,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { VianLogo } from './VianLogo';
import { MarketTicker } from './MarketTicker';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSipModal: () => void;
  userProfile: { name: string; id: string; invested: string; portfolioVal: string };
  onSwitchProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSipModal,
  userProfile,
  onSwitchProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'mutual-funds', label: 'Mutual Funds', badge: 'Zero Fee' },
    { id: 'insurance', label: 'Insurance' },
    { id: 'portfolio', label: 'Portfolio Tracker', badge: 'Kotak/NJ Desk' },
    { id: 'ai-advisor', label: 'Vian AI Advisor', badge: 'Multi-Agent' },
    { id: 'data-science', label: 'Quant & ML Tools' },
    { id: 'calculators', label: 'Calculators' },
    { id: 'partners', label: 'Partner Desk' },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* 1. Live Market Indices Ticker */}
      <MarketTicker />

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer shrink-0"
          >
            <VianLogo size="md" variant="dark" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold">
            {navItems.map((item) => {
              const isCurrent = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-xl transition-all relative flex items-center gap-1.5 ${
                    isCurrent
                      ? 'text-[#051B63] bg-blue-50/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        isCurrent
                          ? 'bg-[#051B63] text-white'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isCurrent && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#051B63] rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Elements */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* User Profile Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="hidden sm:flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-[#051B63] text-white flex items-center justify-center font-bold text-xs">
                  {userProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-slate-900 block truncate max-w-[100px]">
                    {userProfile.name}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    {userProfile.portfolioVal}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 px-3 z-50 text-xs space-y-2">
                  <div className="pb-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{userProfile.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">ID: {userProfile.id}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Portfolio Value:</span>
                      <strong className="text-slate-900">{userProfile.portfolioVal}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Invested:</span>
                      <strong className="text-slate-700">{userProfile.invested}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleNavClick('portfolio');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-semibold"
                  >
                    View Full Investor Desk
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSwitchProfile();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-blue-50 text-blue-700 font-bold flex items-center justify-between"
                  >
                    <span>Switch Investor Persona</span>
                    <UserCheck className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Quick Action: Start SIP */}
            <button
              type="button"
              onClick={onOpenSipModal}
              className="py-2 sm:py-2.5 px-3.5 sm:px-4 rounded-xl bg-[#051B63] hover:bg-[#072480] text-white text-xs font-bold shadow-md shadow-blue-900/20 flex items-center gap-1.5 transition-all"
            >
              <TrendingUp className="w-3.5 h-3.5 text-blue-200" />
              <span>Start SIP</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`py-2.5 px-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between ${
                  activeTab === item.id
                    ? 'bg-[#051B63] text-white font-bold'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === item.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-600">
            <span>Investor: <strong>{userProfile.name}</strong></span>
            <button
              type="button"
              onClick={onSwitchProfile}
              className="text-blue-700 font-bold text-xs"
            >
              Switch Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
