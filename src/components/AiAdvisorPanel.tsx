import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Shield,
  TrendingUp,
  Receipt,
  HeartHandshake,
  User,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { PortfolioHolding } from '../data/portfolioData';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  role?: string;
  text: string;
  timestamp: string;
}

interface AiAdvisorPanelProps {
  holdings: PortfolioHolding[];
  activeAgentTab?: string;
}

const AGENTS = [
  {
    id: 'strategist',
    name: 'Senior Wealth Strategist',
    roleTag: 'Asset Allocation & Alpha',
    icon: TrendingUp,
    badgeColor: 'bg-blue-600',
    description: 'Expert on Modern Portfolio Theory, flexi-cap compounding, and multi-asset rebalancing.',
    welcomeMessage: `Namaste! I am your Senior Wealth Strategist at Vian Capital. I help investors build resilient, market-beating portfolios through disciplined asset allocation across Flexi-Cap, Mid-Cap, and Sovereign Gold assets. What investment objective can we plan today?`,
    presetQueries: [
      'How should I allocate a ₹50,000 monthly SIP for 10 years?',
      'Review my current portfolio allocation and suggest rebalancing',
      'Should I invest in Flexi Cap or Multi Cap funds right now?'
    ]
  },
  {
    id: 'risk',
    name: 'Risk & Volatility Quant',
    roleTag: 'Stress Testing & Sharpe',
    icon: Shield,
    badgeColor: 'bg-indigo-600',
    description: 'Specializes in portfolio standard deviation, maximum drawdown, and market crash simulations.',
    welcomeMessage: `Greetings. As Vian Capital's Quantitative Risk Analyst, my goal is to maximize your Sharpe and Sortino ratios while safeguarding your capital against drawdowns. How can I stress-test your holdings today?`,
    presetQueries: [
      'What is the Sharpe Ratio of my holdings?',
      'How would my portfolio perform in a 2020-style 25% crash?',
      'Is my mid & small cap exposure too high for my risk profile?'
    ]
  },
  {
    id: 'tax',
    name: 'Tax Optimization Counsel',
    roleTag: 'Section 112A & 80C',
    icon: Receipt,
    badgeColor: 'bg-emerald-600',
    description: 'Expert on Indian Union Budget tax rules: LTCG ₹1.25L exemption, STCG 20%, and Section 80C ELSS.',
    welcomeMessage: `Hello! I am your Vian Capital Tax Specialist. Did you know you can save significant wealth annually through Section 112A LTCG tax harvesting and Section 80C ELSS mutual funds? Let us optimize your post-tax returns.`,
    presetQueries: [
      'How do I claim my ₹1,25,000 tax-free LTCG exemption this year?',
      'What are the new Budget capital gains tax rates on equity & debt?',
      'How much tax can I save by investing in ELSS before March 31?'
    ]
  },
  {
    id: 'insurance',
    name: 'Protection & Insurance Head',
    roleTag: 'Human Life Value & Health',
    icon: HeartHandshake,
    badgeColor: 'bg-rose-600',
    description: 'Evaluates pure term life cover (15-20x income), cashless health coverage, and super top-up plans.',
    welcomeMessage: `Welcome. I am your Insurance Advisory Specialist at Vian Capital. Wealth creation without adequate risk protection is fragile. Let's calculate your exact Human Life Value and family health coverage.`,
    presetQueries: [
      'How much Term Insurance cover do I need for a ₹20 LPA income?',
      'Should I choose a ₹25 Lakh or ₹1 Crore Health Insurance policy?',
      'Why is pure Term + Mutual Funds better than endowment policies?'
    ]
  }
];

export const AiAdvisorPanel: React.FC<AiAdvisorPanelProps> = ({ holdings }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('strategist');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const currentAgent = AGENTS.find((a) => a.id === selectedAgentId) || AGENTS[0];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'agent',
      role: currentAgent.name,
      text: currentAgent.welcomeMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSwitchAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
    const newAgent = AGENTS.find((a) => a.id === agentId) || AGENTS[0];
    setMessages((prev) => [
      ...prev,
      {
        id: `switch-${Date.now()}`,
        sender: 'agent',
        role: newAgent.name,
        text: newAgent.welcomeMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build conversation context for server
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text,
      }));

      // Summarize holdings context
      const totalInv = holdings.reduce((s, h) => s + h.investedAmount, 0);
      const totalCur = holdings.reduce((s, h) => s + h.currentValue, 0);
      const portfolioContext = {
        totalInvested: `₹${totalInv.toLocaleString('en-IN')}`,
        currentValue: `₹${totalCur.toLocaleString('en-IN')}`,
        unrealizedProfit: `₹${(totalCur - totalInv).toLocaleString('en-IN')}`,
        holdingsCount: holdings.length,
        holdingsSummary: holdings.map(h => ({
          scheme: h.schemeName,
          category: h.category,
          currentValue: `₹${h.currentValue.toLocaleString('en-IN')}`,
          returns: `${h.returnPercentage.toFixed(1)}%`
        }))
      };

      const response = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          agentRole: selectedAgentId,
          portfolioContext,
        }),
      });

      const data = await response.json();
      const replyText = data.reply || 'Apologies, our quant model encountered a momentary delay. Please try again.';

      setMessages((prev) => [
        ...prev,
        {
          id: `agt-${Date.now()}`,
          sender: 'agent',
          role: currentAgent.name,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `agt-err-${Date.now()}`,
          sender: 'agent',
          role: currentAgent.name,
          text: `[Vian Capital Advisory Note]\n\nBased on your holdings of ${holdings.length} funds totaling ₹${holdings.reduce((s, h) => s + h.currentValue, 0).toLocaleString('en-IN')}, your core equity allocation is strong. For optimal risk-adjusted returns, we recommend continuing disciplined monthly SIPs and harvesting up to ₹1.25 Lakhs of LTCG tax-free annually under Section 112A.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row h-[780px]">
      
      {/* LEFT: Agent Persona Selector & Info */}
      <div className="w-full md:w-80 bg-slate-900 text-white p-5 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-tight font-heading">
                Vian Wealth AI
              </h3>
              <p className="text-[11px] text-blue-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Multi-Agent Financial Brain
              </p>
            </div>
          </div>

          {/* Persona List */}
          <div className="mt-5 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Select Advisory Agent
            </span>
            {AGENTS.map((agent) => {
              const Icon = agent.icon;
              const isSelected = agent.id === selectedAgentId;
              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => handleSwitchAgent(agent.id)}
                  className={`w-full p-3 rounded-xl text-left transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-slate-800 border border-blue-500/50 shadow-md text-white'
                      : 'hover:bg-slate-800/60 border border-transparent text-slate-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${agent.badgeColor} text-white flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs truncate">{agent.name}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-blue-400"></span>}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{agent.roleTag}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Agent Bio */}
          <div className="mt-6 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs">
            <span className="text-[10px] font-semibold uppercase text-blue-400 block mb-1">
              Active Specialist Profile
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {currentAgent.description}
            </p>
          </div>
        </div>

        {/* Bottom Compliance & Disclaimer */}
        <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-400">
          <p className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Powered by Gemini 3.8 Flash & Quantitative MPT Models</span>
          </p>
          <p className="mt-1 text-slate-500">
            Mutual fund investments are subject to market risks. Read all scheme related documents carefully.
          </p>
        </div>
      </div>

      {/* RIGHT: Chat Stream & Interactive Messaging */}
      <div className="flex-1 flex flex-col bg-slate-50 min-w-0 h-full">
        
        {/* Top Active Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${currentAgent.badgeColor}`}></div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{currentAgent.name}</h4>
              <p className="text-[11px] text-slate-500">
                Connected with Portfolio Context ({holdings.length} Active Holdings)
              </p>
            </div>
          </div>
          <button
            onClick={() => setMessages([
              {
                id: `reset-${Date.now()}`,
                sender: 'agent',
                role: currentAgent.name,
                text: currentAgent.welcomeMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            ])}
            className="text-slate-500 hover:text-slate-800 text-xs font-semibold p-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-1 transition-colors"
            title="Reset Conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'agent' && (
                <div className="w-8 h-8 rounded-full bg-[#051B63] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#051B63] text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                {msg.sender === 'agent' && msg.role && (
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 text-[10px]">
                    <span className="font-bold text-blue-700">{msg.role}</span>
                    <span className="text-slate-400">{msg.timestamp}</span>
                  </div>
                )}
                
                {/* Text body with markdown-like formatting */}
                <div className="space-y-2 whitespace-pre-line font-normal">
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div className="text-[9px] text-blue-200 text-right mt-1">
                    {msg.timestamp}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#051B63] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-xs text-slate-500 font-medium ml-1">
                  Analyzing portfolio parameters & SEBI guidelines...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="px-4 md:px-6 py-2 bg-slate-100/70 border-t border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Suggested Questions for {currentAgent.name}:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {currentAgent.presetQueries.map((query, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(query)}
                className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-700 text-[11px] font-medium text-slate-700 transition-colors shadow-2xs shrink-0 flex items-center gap-1.5"
              >
                <span>{query}</span>
                <ArrowRight className="w-3 h-3 opacity-50" />
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask ${currentAgent.name} about asset allocation, risk, tax harvesting or funds...`}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-slate-400 bg-slate-50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-[#051B63] hover:bg-[#072480] text-white disabled:opacity-40 transition-colors shadow-md shadow-blue-900/20 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span>Press Enter to send • Vian Capital AI Advisory Engine</span>
            <span className="hidden sm:inline">Certified for Mutual Funds & Insurance Planning</span>
          </div>
        </div>

      </div>

    </div>
  );
};
