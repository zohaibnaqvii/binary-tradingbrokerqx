
import React from 'react';
import { 
  BarChart2, 
  History, 
  Wallet, 
  Trophy, 
  Settings, 
  HelpCircle,
  Monitor,
  Globe,
  BookOpen,
  Lock
} from 'lucide-react';
import { useAppContext } from '../store/AppContext';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string | number;
  color?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick, badge, color }) => (
  <button 
    onClick={onClick}
    className={`w-full flex flex-col items-center justify-center py-4 gap-1.5 transition-all group relative ${
      active ? 'bg-[#1e2436] text-blue-400' : 'text-gray-500 hover:text-gray-300'
    }`}
  >
    {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
    <Icon size={22} className={`${active ? 'text-blue-400' : 'group-hover:scale-110 transition-transform duration-200'} ${color || ''}`} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[9px] font-black uppercase tracking-tighter opacity-80">{label}</span>
    {badge && (
       <div className="absolute top-3 right-3 bg-blue-600 text-[8px] font-black text-white px-1.5 py-0.5 rounded-full border border-[#0b0e16]">
         {badge}
       </div>
    )}
  </button>
);

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { isSplitScreen, setIsSplitScreen, trades, user, allTransactions } = useAppContext();
  const activeCount = trades.filter(t => t.status === 'PENDING').length;
  const pendingDeposits = allTransactions.filter(tx => tx.status === 'PENDING').length;

  return (
    <div className="hidden md:flex flex-col w-20 bg-[#151926] border-r border-[#252a3a] h-full z-50 shadow-2xl">
      <div className="flex items-center justify-center py-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/30">
          <span className="text-xl font-black text-white italic tracking-tighter">Q</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col pt-2">
        <SidebarItem 
          icon={BarChart2} 
          label="Trade" 
          active={activeTab === 'trade'} 
          onClick={() => onTabChange('trade')}
        />
        <SidebarItem 
          icon={History} 
          label="Deals" 
          active={activeTab === 'deals'} 
          badge={activeCount > 0 ? activeCount : undefined} 
          onClick={() => onTabChange('deals')}
        />
        {user?.role === 'ADMIN' && (
          <SidebarItem 
            icon={Lock} 
            label="Admin" 
            color="text-red-400"
            active={activeTab === 'admin'} 
            badge={pendingDeposits > 0 ? pendingDeposits : undefined}
            onClick={() => onTabChange('admin')}
          />
        )}
        <SidebarItem 
          icon={Trophy} 
          label="Bonuses" 
          active={activeTab === 'bonuses'}
          onClick={() => onTabChange('bonuses')}
        />
        <SidebarItem 
          icon={Globe} 
          label="Leaderboard" 
          active={activeTab === 'leaderboard'}
          onClick={() => onTabChange('leaderboard')}
        />
        <SidebarItem 
          icon={BookOpen} 
          label="Guide" 
          active={activeTab === 'guide'}
          onClick={() => onTabChange('guide')}
        />
        <SidebarItem 
          icon={Monitor} 
          label={isSplitScreen ? "Single" : "Split"} 
          onClick={() => setIsSplitScreen(!isSplitScreen)}
        />
      </div>

      <div className="pb-6">
        <SidebarItem 
          icon={HelpCircle} 
          label="Support" 
          active={activeTab === 'support'}
          onClick={() => onTabChange('support')} 
        />
        <SidebarItem icon={Settings} label="Settings" />
      </div>
    </div>
  );
};

export default Sidebar;
