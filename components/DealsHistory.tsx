
import React, { useState, useEffect } from 'react';
import { History, Clock, ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

const DealsHistory: React.FC = () => {
  const { trades } = useAppContext();
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeTrades = trades.filter(t => t.status === 'PENDING');
  const pastTrades = trades.filter(t => t.status !== 'PENDING');

  return (
    <div className="flex flex-col h-full bg-[#151926]">
      <div className="px-4 py-4 border-b border-white/5 flex items-center justify-between bg-[#1c2230]">
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Trade History</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black bg-blue-600/20 text-blue-500 px-2 py-0.5 rounded-full border border-blue-500/30">
            {trades.length} Total
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {activeTrades.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-tighter px-1">Active Deals</p>
            {activeTrades.map(trade => {
              const remaining = Math.max(0, Math.floor((trade.endTime - Date.now()) / 1000));
              const progress = Math.max(0, Math.min(100, (remaining / ((trade.endTime - trade.startTime) / 1000)) * 100));
              
              return (
                <div key={trade.id} className="bg-[#1c222d] p-3 rounded-xl border border-blue-500/30 shadow-lg relative overflow-hidden group transition-all hover:border-blue-500/60">
                  <div className="absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      {trade.direction === 'UP' ? <TrendingUp size={16} className="text-green-500" /> : <TrendingDown size={16} className="text-red-500" />}
                      <span className="text-[11px] font-black text-white">{trade.assetSymbol}</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-400">
                      <Clock size={12} />
                      <span className="text-[11px] font-mono font-black">{remaining}s</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-500 font-bold uppercase">Investment</span>
                      <span className="text-sm font-black">${trade.amount}</span>
                    </div>
                    <div className="text-right">
                       <span className="text-[9px] text-gray-500 font-bold uppercase">Expected</span>
                       <span className="block text-sm font-black text-green-500">${(trade.amount + (trade.amount * trade.payout / 100)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pastTrades.length > 0 ? (
          <div className="space-y-2 pt-2">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter px-1">Closed Deals</p>
            {pastTrades.slice(0, 20).map(trade => (
              <div key={trade.id} className="bg-[#0b0e16]/50 p-3 rounded-xl border border-white/5 transition-all hover:bg-[#1c222d]">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {trade.direction === 'UP' ? <ArrowUpCircle size={14} className="text-green-500/50" /> : <ArrowDownCircle size={14} className="text-red-500/50" />}
                    <span className="text-[10px] font-black text-gray-300">{trade.assetSymbol}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[11px] font-black ${trade.status === 'WON' ? 'text-green-500' : 'text-red-500'}`}>
                      {trade.status === 'WON' ? `+$${(trade.amount * trade.payout / 100).toFixed(2)}` : `-$${trade.amount}`}
                    </span>
                    <span className="block text-[8px] text-gray-600 font-bold">{new Date(trade.endTime).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeTrades.length === 0 && (
          <div className="py-20 text-center opacity-20 flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <History size={32} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">No Active Deals</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsHistory;
