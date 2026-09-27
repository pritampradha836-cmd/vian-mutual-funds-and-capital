import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Clock, ShieldCheck } from 'lucide-react';

interface IndexItem {
  symbol: string;
  value: number;
  change: number;
  percent: string;
  isUp: boolean;
}

export const MarketTicker: React.FC = () => {
  const [indices, setIndices] = useState<IndexItem[]>([
    { symbol: 'NIFTY 50', value: 25790.85, change: 142.30, percent: '+0.56%', isUp: true },
    { symbol: 'SENSEX', value: 84544.30, change: 480.15, percent: '+0.57%', isUp: true },
    { symbol: 'NIFTY BANK', value: 53890.10, change: -75.40, percent: '-0.14%', isUp: false },
    { symbol: 'NIFTY MIDCAP 150', value: 21420.60, change: 198.80, percent: '+0.94%', isUp: true },
    { symbol: 'GOLD (10g)', value: 75850.00, change: 320.00, percent: '+0.42%', isUp: true },
    { symbol: 'USD / INR', value: 83.92, change: -0.04, percent: '-0.05%', isUp: false },
  ]);
  const [lastUpdated, setLastUpdated] = useState<string>('Live');

  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const res = await fetch('/api/market/ticker');
        const data = await res.json();
        if (data.success && Array.isArray(data.indices)) {
          setIndices(data.indices);
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      } catch {
        // use fallback state
      }
    };

    fetchTicker();
    const interval = setInterval(fetchTicker, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#051438] text-slate-200 border-b border-blue-950/60 text-xs py-1.5 px-4 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Status Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[10px] hidden sm:inline">
            NSE / BSE LIVE
          </span>
          <span className="text-slate-400 text-[10px] hidden md:inline">
            <Clock className="w-3 h-3 inline mr-1 opacity-70" />
            {lastUpdated}
          </span>
        </div>

        {/* Center: Scrolling / Horizontal Flex Tickers */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
          {indices.map((idx) => (
            <div key={idx.symbol} className="flex items-center gap-1.5 shrink-0">
              <span className="text-slate-400 font-medium text-[11px]">{idx.symbol}</span>
              <span className="font-bold text-white text-[11px]">
                {idx.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span
                className={`flex items-center text-[10px] font-semibold px-1 py-0.5 rounded ${
                  idx.isUp ? 'text-emerald-400 bg-emerald-950/40' : 'text-rose-400 bg-rose-950/40'
                }`}
              >
                {idx.isUp ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                {idx.percent}
              </span>
            </div>
          ))}
        </div>

        {/* Right: Regulatory accreditation */}
        <div className="hidden lg:flex items-center gap-2 shrink-0 text-[10px] text-slate-400">
          <ShieldCheck className="w-3 h-3 text-blue-400" />
          <span>AMFI ARN-284910 • IRDAI Registered</span>
        </div>
      </div>
    </div>
  );
};
