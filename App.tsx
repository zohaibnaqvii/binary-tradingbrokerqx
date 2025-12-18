
import React, { useState, useMemo } from 'react';
import { HelpCircle, Send, ShieldCheck, Lock, Globe, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { AppProvider, useAppContext } from './store/AppContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import TradingChart from './components/TradingChart';
import TradePanel from './components/TradePanel';
import MobileNav from './components/MobileNav';
import CashierModal from './components/Modals/CashierModal';
import DealsHistory from './components/DealsHistory';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import { SUPPORT } from './constants';

const AuthPage: React.FC = () => {
  const { setUser } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate professional network latency
    setTimeout(() => {
      const storedUsers = JSON.parse(localStorage.getItem('registered_users_v2') || '{}');
      
      // ADMIN ACCESS: Special email for admin
      const isAdmin = email === 'admin@qtradex.com';
      
      if (storedUsers[email]) {
        if (storedUsers[email] === password) {
          setUser({ 
            id: email, 
            email, 
            name: isAdmin ? 'Platform Admin' : email.split('@')[0], 
            demoBalance: 10000.00, 
            liveBalance: 0, 
            isVerified: isAdmin,
            kycStatus: isAdmin ? 'VERIFIED' : 'NONE',
            role: isAdmin ? 'ADMIN' : 'USER'
          });
        } else {
          setError('Invalid credentials. Please verify your password or contact security support.');
          setIsLoading(false);
        }
      } else {
        storedUsers[email] = password;
        localStorage.setItem('registered_users_v2', JSON.stringify(storedUsers));
        setUser({ 
          id: email, 
          email, 
          name: isAdmin ? 'Platform Admin' : email.split('@')[0], 
          demoBalance: 10000.00, 
          liveBalance: 0, 
          isVerified: isAdmin,
          kycStatus: isAdmin ? 'VERIFIED' : 'NONE',
          role: isAdmin ? 'ADMIN' : 'USER'
        });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-[#06080f] flex flex-col items-center justify-center p-6 font-sans overflow-y-auto overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Branding */}
      <div className="w-full max-w-sm text-center mb-10 z-10 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="relative inline-block mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 w-24 h-24 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(37,99,235,0.3)] border border-white/10">
            <span className="text-5xl font-black text-white italic tracking-tighter">Q</span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-[#06080f] flex items-center justify-center">
            <ShieldCheck size={16} className="text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">QTradex</h1>
        <div className="flex items-center justify-center gap-3">
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] opacity-80">Elite Trading Terminal</span>
          <div className="w-1 h-1 bg-gray-700 rounded-full" />
          <span className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em]">v2.7 Stable</span>
        </div>
      </div>
      
      {/* Auth Container */}
      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-500">
        <form onSubmit={handleAuth} className="bg-[#0f121d]/80 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
          
          <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[11px] text-gray-400 font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                 <Globe size={12} className="text-blue-500" /> Authorized Login
               </label>
               <input 
                  required
                  type="email" 
                  autoComplete="email"
                  placeholder="name@provider.com" 
                  value={email} 
                  onChange={e=>{setEmail(e.target.value); setError('');}} 
                  className="w-full bg-[#06080f] border border-white/5 p-5 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-[#080b15] transition-all text-white font-black placeholder:text-gray-700 shadow-inner" 
               />
            </div>
            
            <div className="space-y-2">
               <div className="flex justify-between items-center ml-1">
                 <label className="text-[11px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2">
                   <Lock size={12} className="text-blue-500" /> Secure Key
                 </label>
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[10px] text-gray-600 font-bold uppercase hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={14}/> : <Eye size={14}/>}
                 </button>
               </div>
               <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  autoComplete="current-password"
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e=>{setPassword(e.target.value); setError('');}} 
                  className="w-full bg-[#06080f] border border-white/5 p-5 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-[#080b15] transition-all text-white font-black placeholder:text-gray-700 shadow-inner" 
               />
            </div>
          </div>

          {error && (
            <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl space-y-4 animate-in shake duration-300">
              <div className="flex items-center gap-3 text-red-500">
                <AlertTriangle size={18} />
                <p className="text-[11px] font-black uppercase tracking-tight leading-relaxed">{error}</p>
              </div>
              <a href={`https://t.me/${SUPPORT.TELEGRAM.replace('@','')}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 bg-red-500/20 rounded-xl text-[10px] font-black text-red-400 uppercase hover:bg-red-500/30 transition-all border border-red-500/20">
                 System Recovery Support
              </a>
            </div>
          )}

          <div className="space-y-4">
            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-white hover:bg-blue-500 transition-all active:scale-[0.98] shadow-[0_15px_30px_rgba(37,99,235,0.2)] flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "INITIALIZE SESSION"
              )}
            </button>
            
            <div className="flex items-center justify-center gap-6 py-2">
               <div className="flex items-center gap-1.5 opacity-40">
                 <CheckCircle2 size={12} className="text-green-500" />
                 <span className="text-[9px] font-black text-white uppercase tracking-widest">SSL Secure</span>
               </div>
               <div className="flex items-center gap-1.5 opacity-40">
                 <CheckCircle2 size={12} className="text-green-500" />
                 <span className="text-[9px] font-black text-white uppercase tracking-widest">KYC Ready</span>
               </div>
               <div className="flex items-center gap-1.5 opacity-40">
                 <CheckCircle2 size={12} className="text-green-500" />
                 <span className="text-[9px] font-black text-white uppercase tracking-widest">256-Bit</span>
               </div>
            </div>
          </div>
        </form>

        {/* Risk Disclosure */}
        <div className="mt-12 text-center space-y-6 max-w-sm mx-auto opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 justify-center text-orange-500">
            <AlertTriangle size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Risk Disclosure</span>
          </div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter leading-relaxed">
            Trading binary options involves significant risk and can result in the loss of your invested capital. You should not invest money that you cannot afford to lose. Ensure that you fully understand the risks involved before trading on our terminal.
          </p>
          <div className="flex justify-center gap-6 text-[9px] text-gray-700 font-black uppercase tracking-widest">
            <span className="hover:text-blue-500 cursor-pointer">Terms of Service</span>
            <span className="hover:text-blue-500 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-blue-500 cursor-pointer">AML Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { assets, user } = useAppContext();
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0].id);
  const [isCashierOpen, setIsCashierOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('trade');

  const selectedAsset = useMemo(() => 
    assets.find(a => a.id === selectedAssetId) || assets[0],
    [assets, selectedAssetId]
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'trade':
        return <TradingChart asset={selectedAsset} />;
      case 'deals':
      case 'history':
        return <div className="h-full overflow-hidden bg-[#0b0e16]"><DealsHistory /></div>;
      case 'leaderboard':
        return <div className="p-4 h-full overflow-y-auto bg-[#0b0e16] custom-scrollbar"><Leaderboard /></div>;
      case 'profile':
        return <div className="p-4 h-full overflow-y-auto bg-[#0b0e16] custom-scrollbar"><Profile /></div>;
      case 'admin':
        return user?.role === 'ADMIN' ? <AdminDashboard /> : <TradingChart asset={selectedAsset} />;
      case 'support':
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-500 shadow-inner">
              <HelpCircle size={56} strokeWidth={1.5} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Live Assistance</h2>
              <p className="text-gray-500 text-sm font-bold max-w-xs mx-auto">Instant resolutions for deposits, payouts, and account verification.</p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
               <a href={`https://t.me/${SUPPORT.TELEGRAM.replace('@','')}`} target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-white transition-all shadow-2xl shadow-blue-900/30 active:scale-95 group">
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                  TELEGRAM CHAT
               </a>
               <a href={`mailto:${SUPPORT.EMAIL}`} className="bg-white/5 hover:bg-white/10 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-gray-300 transition-all border border-white/5">
                  Official Email: {SUPPORT.EMAIL}
               </a>
            </div>
            <div className="flex flex-col items-center gap-1">
               <span className="text-green-500 text-xs font-black uppercase tracking-[0.2em] animate-pulse">{SUPPORT.MESSAGE}</span>
               <span className="text-[10px] text-gray-600 font-bold">Typical reply time: 30 seconds</span>
            </div>
          </div>
        );
      default:
        return <TradingChart asset={selectedAsset} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0b0e16] text-white overflow-hidden flex-col font-sans">
      <TopBar onOpenCashier={() => setIsCashierOpen(true)} />
      
      <div className="flex-1 flex overflow-hidden relative">
        <div className="hidden md:block">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 relative overflow-hidden bg-[#0b0e16]">
            {renderContent()}
          </div>
          
          <div className="md:hidden flex flex-col w-full">
            {activeTab === 'trade' && <TradePanel asset={selectedAsset} onAssetSelect={(a) => setSelectedAssetId(a.id)} />}
            <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>

        {activeTab === 'trade' && (
          <div className="hidden md:block w-80 bg-[#151926] border-l border-white/5 overflow-hidden">
             <TradePanel asset={selectedAsset} onAssetSelect={(a) => setSelectedAssetId(a.id)} />
          </div>
        )}
      </div>

      {isCashierOpen && <CashierModal onClose={() => setIsCashierOpen(false)} />}
    </div>
  );
};

const MainContent: React.FC = () => {
  const { user } = useAppContext();
  return user ? <Dashboard /> : <AuthPage />;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
