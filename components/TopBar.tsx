
import React from 'react';
import { ChevronDown, Bell } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

interface Props {
  onOpenCashier?: () => void;
}

const TopBar: React.FC<Props> = ({ onOpenCashier }) => {
  const { user, activeAccount, setActiveAccount } = useAppContext();
  const balance = user ? (activeAccount === 'DEMO' ? user.demoBalance : user.liveBalance) : 0;

  if (!user) return null;

  return (
    <div className="h-14 bg-[#1c2230] flex items-center justify-between px-3 z-50 border-b border-[#2d3446]">
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-[#2d3446] px-3 py-1.5 rounded-lg gap-2 cursor-pointer hover:bg-[#353b4d] transition-colors"
             onClick={() => setActiveAccount(activeAccount === 'DEMO' ? 'LIVE' : 'DEMO')}>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-black uppercase tracking-tighter ${activeAccount === 'DEMO' ? 'text-orange-400' : 'text-green-500'}`}>
                {activeAccount}
              </span>
              <span className="text-sm font-black text-white">
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative p-2 bg-[#2d3446] rounded-lg cursor-pointer">
          <Bell size={18} className="text-gray-300" />
          <span className="absolute -top-1 -right-1 bg-[#ff4b2b] text-[8px] font-black text-white px-1 rounded-full border border-[#1c2230]">36</span>
        </div>
        
        <button 
          onClick={onOpenCashier}
          className="bg-[#00b15d] hover:bg-[#00c869] text-white px-5 py-2 rounded-lg text-sm font-black transition-all shadow-lg shadow-green-900/20 active:scale-95"
        >
          Deposit
        </button>
      </div>
    </div>
  );
};

export default TopBar;
