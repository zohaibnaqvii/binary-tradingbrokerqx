
import React, { useState } from 'react';
import { Plus, Minus, ChevronDown, Search, X, Clock } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { Asset, TradeDuration } from '../types';

interface Props {
  asset: Asset;
  onAssetSelect: (asset: Asset) => void;
}

const DURATIONS: { label: TradeDuration; seconds: number }[] = [
  { label: '5s', seconds: 5 },
  { label: '10s', seconds: 10 },
  { label: '1m', seconds: 60 },
  { label: '2m', seconds: 120 },
  { label: '5m', seconds: 300 },
  { label: '30m', seconds: 1800 },
];

const TradePanel: React.FC<Props> = ({ asset, onAssetSelect }) => {
  const { user, activeAccount, addTrade, updateBalance, assets } = useAppContext();
  const [amount, setAmount] = useState<number>(100);
  const [durationIdx, setDurationIdx] = useState(0); 
  const [showAssetMenu, setShowAssetMenu] = useState(false);
  const [search, setSearch] = useState('');

  const currentBalance = user ? (activeAccount === 'DEMO' ? user.demoBalance : user.liveBalance) : 0;
  const currentDuration = DURATIONS[durationIdx];
  const payoutAmount = (amount * asset.payout / 100);

  const handleDurationChange = (type: 'plus' | 'minus') => {
    if (type === 'plus') {
      setDurationIdx(prev => Math.min(DURATIONS.length - 1, prev + 1));
    } else {
      setDurationIdx(prev => Math.max(0, prev - 1));
    }
  };

  const handleTrade = (direction: 'UP' | 'DOWN') => {
    if (!user) return;
    if (amount > currentBalance || amount < 1) return alert('Insufficient Balance');

    addTrade({
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      assetId: asset.id,
      assetSymbol: asset.symbol,
      amount,
      direction,
      entryPrice: asset.price,
      status: 'PENDING',
      startTime: Date.now(),
      endTime: Date.now() + currentDuration.seconds * 1000,
      payout: asset.payout,
      accountType: activeAccount
    });
    updateBalance(-amount, activeAccount);
  };

  return (
    <div className="w-full h-auto bg-[#151926] p-2 md:p-4 flex flex-col gap-1 md:gap-4 border-t border-white/5 md:pb-6 overflow-hidden">
      {/* Asset Display */}
      <div className="flex md:hidden items-center justify-between mb-1">
         <button onClick={() => setShowAssetMenu(true)} className="flex items-center gap-1.5 bg-[#1c222d] px-2 py-1 rounded-lg border border-white/5">
            <span className="text-[10px] font-black text-white">{asset.symbol}</span>
            <span className="text-[10px] font-black text-orange-400">{asset.payout}%</span>
            <ChevronDown size={10} className="text-gray-500" />
         </button>
         <div className="text-[9px] font-bold text-gray-500">PAYOUT: <span className="text-green-500">${(payoutAmount + amount).toFixed(2)}</span></div>
      </div>

      <div className="flex flex-row md:flex-col gap-2">
         {/* Duration Selector with +/- */}
         <div className="flex-1 flex flex-col gap-1">
            <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest text-center hidden md:block">Time</label>
            <div className="bg-[#1c222d] border border-white/5 rounded-xl h-10 md:h-14 flex items-center px-1 md:px-2 shadow-sm">
               <button 
                  onClick={() => handleDurationChange('minus')} 
                  className="w-8 h-8 md:w-10 md:h-10 bg-[#252a3a] rounded-lg text-gray-400 flex items-center justify-center hover:bg-[#2d3446] active:scale-95 transition-all"
               >
                 <Minus size={14} />
               </button>
               <div className="flex-1 text-center flex flex-col justify-center">
                  <span className="text-xs md:text-xl font-black text-white font-mono leading-none">{currentDuration.label}</span>
                  <span className="text-[8px] text-gray-500 font-bold uppercase md:hidden">Exp</span>
               </div>
               <button 
                  onClick={() => handleDurationChange('plus')} 
                  className="w-8 h-8 md:w-10 md:h-10 bg-[#252a3a] rounded-lg text-gray-400 flex items-center justify-center hover:bg-[#2d3446] active:scale-95 transition-all"
               >
                 <Plus size={14} />
               </button>
            </div>
         </div>

         {/* Amount Selector with +/- */}
         <div className="flex-1 flex flex-col gap-1">
            <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest text-center hidden md:block">Investment</label>
            <div className="bg-[#1c222d] border border-white/5 rounded-xl h-10 md:h-14 flex items-center px-1 md:px-2 shadow-sm">
               <button onClick={() => setAmount(Math.max(1, amount - 5))} className="w-8 h-8 md:w-10 md:h-10 bg-[#252a3a] rounded-lg text-gray-400 flex items-center justify-center hover:bg-[#2d3446] active:scale-95 transition-all"><Minus size={14} /></button>
               <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="flex-1 bg-transparent text-center text-xs md:text-xl font-black text-white font-mono outline-none min-w-0"
               />
               <button onClick={() => setAmount(amount + 5)} className="w-8 h-8 md:w-10 md:h-10 bg-[#252a3a] rounded-lg text-gray-400 flex items-center justify-center hover:bg-[#2d3446] active:scale-95 transition-all"><Plus size={14} /></button>
            </div>
         </div>
      </div>

      <div className="flex flex-row md:flex-col gap-2 mt-2">
         <button onClick={() => handleTrade('UP')} className="flex-1 h-12 md:h-16 bg-[#00ab61] hover:bg-[#00c86e] rounded-xl flex flex-col md:flex-row items-center justify-center md:justify-between px-2 md:px-6 transition-all active:scale-95 shadow-lg group">
            <div className="flex flex-col items-center md:items-start">
               <span className="text-[8px] md:text-[10px] font-black text-green-200/50 uppercase leading-none">High</span>
               <span className="text-xs md:text-xl font-black text-white uppercase">CALL</span>
            </div>
            <ArrowUp size={24} className="hidden md:block group-hover:-translate-y-1 transition-transform" />
         </button>
         
         <button onClick={() => handleTrade('DOWN')} className="flex-1 h-12 md:h-16 bg-[#ff4b2b] hover:bg-[#ff5d41] rounded-xl flex flex-col md:flex-row items-center justify-center md:justify-between px-2 md:px-6 transition-all active:scale-95 shadow-lg group">
            <div className="flex flex-col items-center md:items-start">
               <span className="text-[8px] md:text-[10px] font-black text-red-200/50 uppercase leading-none">Low</span>
               <span className="text-xs md:text-xl font-black text-white uppercase">PUT</span>
            </div>
            <ArrowDown size={24} className="hidden md:block group-hover:translate-y-1 transition-transform" />
         </button>
      </div>

      {showAssetMenu && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md p-4 flex items-center justify-center">
          <div className="bg-[#151926] w-full max-w-md rounded-3xl border border-white/10 overflow-hidden flex flex-col max-h-[85vh] shadow-2xl">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#1c2230]">
              <div className="flex items-center gap-3 flex-1">
                <Search size={18} className="text-gray-500" />
                <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search asset..." className="flex-1 bg-transparent text-white outline-none font-bold placeholder:text-gray-700" />
              </div>
              <button onClick={() => setShowAssetMenu(false)} className="text-gray-500 hover:text-white p-2"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 divide-y divide-white/5">
              {assets.filter(a => a.symbol.toLowerCase().includes(search.toLowerCase())).map(a => (
                <button key={a.id} onClick={() => { onAssetSelect(a); setShowAssetMenu(false); }} className="flex items-center justify-between p-4 hover:bg-white/5 w-full text-left rounded-xl transition-colors">
                  <div className="flex flex-col"><span className="text-sm font-black text-white">{a.symbol}</span><span className="text-[10px] text-gray-500 font-bold uppercase">{a.category}</span></div>
                  <div className="text-right"><span className="text-sm font-black text-orange-400 block">{a.payout}%</span><span className="text-[10px] text-green-500 font-bold">{a.price.toFixed(5)}</span></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Icon Placeholders to avoid build errors if lucide versions differ
const ArrowUp = ({size, className}: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>;
const ArrowDown = ({size, className}: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>;

export default TradePanel;
