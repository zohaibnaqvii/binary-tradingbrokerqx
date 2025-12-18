
import React from 'react';
import { HelpCircle, User, Trophy, LayoutGrid, BarChart2 } from 'lucide-react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileNav: React.FC<Props> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center justify-around bg-[#111622] border-t border-white/5 py-1 px-2 z-50 h-14">
      <button 
        onClick={() => onTabChange('trade')}
        className={`transition-all flex flex-col items-center flex-1 ${activeTab === 'trade' ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}
      >
        <BarChart2 size={20} />
        <span className="text-[8px] font-black uppercase mt-0.5 tracking-tighter">Trade</span>
      </button>
      
      <button 
        onClick={() => onTabChange('deals')}
        className={`transition-all flex flex-col items-center flex-1 ${activeTab === 'deals' ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}
      >
        <LayoutGrid size={20} />
        <span className="text-[8px] font-black uppercase mt-0.5 tracking-tighter">History</span>
      </button>

      <button 
        onClick={() => onTabChange('leaderboard')}
        className={`transition-all flex flex-col items-center relative flex-1 ${activeTab === 'leaderboard' ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}
      >
        <Trophy size={20} />
        <span className="text-[8px] font-black uppercase mt-0.5 tracking-tighter">Top</span>
      </button>

      <button 
        onClick={() => onTabChange('support')}
        className={`transition-all flex flex-col items-center flex-1 ${activeTab === 'support' ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}
      >
        <HelpCircle size={20} />
        <span className="text-[8px] font-black uppercase mt-0.5 tracking-tighter">Support</span>
      </button>
      
      <button 
        onClick={() => onTabChange('profile')}
        className={`transition-all flex flex-col items-center flex-1 ${activeTab === 'profile' ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}
      >
        <User size={20} />
        <span className="text-[8px] font-black uppercase mt-0.5 tracking-tighter">Profile</span>
      </button>
    </div>
  );
};

export default MobileNav;
