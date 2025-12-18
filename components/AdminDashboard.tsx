
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Search, 
  Clock,
  Plus,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Layers
} from 'lucide-react';
import { useAppContext } from '../store/AppContext';

const AdminDashboard: React.FC = () => {
  const { 
    allUsers, 
    allTransactions, 
    approveTransaction, 
    rejectTransaction, 
    updateBalance,
    assets,
    setMarketOverride,
    marketOverrides
  } = useAppContext();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'DEPOSITS' | 'USERS' | 'MARKET'>('DEPOSITS');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState<string>('');

  const pendingDeposits = useMemo(() => 
    allTransactions.filter(tx => tx.type === 'DEPOSIT' && tx.status === 'PENDING'),
    [allTransactions]
  );

  const filteredUsers = useMemo(() => 
    allUsers.filter(u => u.email.toLowerCase().includes(search.toLowerCase()) || u.name.toLowerCase().includes(search.toLowerCase())),
    [allUsers, search]
  );

  const stats = useMemo(() => ({
    totalUsers: allUsers.length,
    pendingVolume: pendingDeposits.reduce((acc, tx) => acc + tx.amount, 0),
    totalLiveBalance: allUsers.reduce((acc, u) => acc + u.liveBalance, 0)
  }), [allUsers, pendingDeposits]);

  const handleAddBalance = (userId: string) => {
    const amount = parseFloat(addAmount);
    if (isNaN(amount)) return alert("Enter valid amount");
    updateBalance(amount, 'LIVE', userId);
    setAddAmount('');
    setEditingUserId(null);
  };

  return (
    <div className="h-full flex flex-col bg-[#0b0e16] p-4 md:p-8 gap-6 overflow-y-auto custom-scrollbar">
      {/* Admin Header Ticker */}
      <div className="flex items-center gap-4 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl animate-pulse">
        <Zap className="text-red-500" size={20} />
        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Administrative Override Terminal Active - System Control v2.7</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#151926] p-6 rounded-[2rem] border border-white/5 flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500"><Users /></div>
          <div>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest opacity-60">Total Traders</p>
            <p className="text-2xl font-black text-white">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="bg-[#151926] p-6 rounded-[2rem] border border-white/5 flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center text-orange-500"><Clock /></div>
          <div>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest opacity-60">Pending Requests</p>
            <p className="text-2xl font-black text-white">${stats.pendingVolume.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-[#151926] p-6 rounded-[2rem] border border-white/5 flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 bg-green-600/10 rounded-2xl flex items-center justify-center text-green-500"><TrendingUp /></div>
          <div>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest opacity-60">Global Liability</p>
            <p className="text-2xl font-black text-white">${stats.totalLiveBalance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-[#151926] p-1.5 rounded-2xl border border-white/5 self-start shadow-inner">
        {[
          { id: 'DEPOSITS', label: 'Payments', icon: CreditCard },
          { id: 'USERS', label: 'Database', icon: Users },
          { id: 'MARKET', label: 'Market Control', icon: Activity }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)} 
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {tab.id === 'DEPOSITS' && pendingDeposits.length > 0 && (
              <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full">{pendingDeposits.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-[#151926] rounded-[2.5rem] border border-white/5 flex-1 flex flex-col overflow-hidden shadow-2xl relative">
        <div className="p-6 border-b border-white/5 flex items-center justify-between gap-4 bg-[#1c2230]/50">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder={`Search ${activeTab.toLowerCase()}...`} 
              className="w-full bg-[#0b0e16] border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500/50 transition-all font-bold text-sm text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'DEPOSITS' && (
            <div className="divide-y divide-white/5">
              {pendingDeposits.length === 0 ? (
                <div className="p-20 text-center opacity-20 flex flex-col items-center gap-4">
                  <CreditCard size={64} className="text-gray-500" />
                  <p className="text-xl font-black uppercase tracking-widest">No Active Requests</p>
                </div>
              ) : (
                pendingDeposits.map(tx => (
                  <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20"><CreditCard /></div>
                      <div>
                        <p className="text-sm font-black text-white">{tx.userEmail}</p>
                        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase mt-1">
                          <span className="text-blue-400">{tx.method}</span>
                          <span className="w-1 h-1 bg-gray-700 rounded-full" />
                          <span>{tx.date}</span>
                          <span className="w-1 h-1 bg-gray-700 rounded-full" />
                          <span className="text-gray-400 italic">ID: {tx.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="text-right">
                        <p className="text-2xl font-black text-green-500">${tx.amount.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">DEPOSIT VALUE</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => approveTransaction(tx.id)} className="bg-green-600 hover:bg-green-500 text-white px-6 py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
                          <CheckCircle size={16} /> Confirm
                        </button>
                        <button onClick={() => rejectTransaction(tx.id)} className="bg-red-600/10 hover:bg-red-600/20 text-red-500 px-6 py-4 rounded-2xl transition-all active:scale-95 flex items-center gap-2 font-black uppercase text-[10px] border border-red-500/20">
                          <XCircle size={16} /> Block
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'USERS' && (
            <div className="divide-y divide-white/5">
              {filteredUsers.map(u => (
                <div key={u.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl flex items-center justify-center text-gray-400 font-black text-xl uppercase shadow-inner">{u.name[0]}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-white">{u.name}</p>
                        {u.role === 'ADMIN' && <span className="bg-red-500/20 text-red-500 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-red-500/20 tracking-tighter">Root Administrator</span>}
                      </div>
                      <p className="text-xs text-gray-500 font-bold mt-0.5">{u.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-10">
                    <div className="flex gap-8">
                      <div className="text-right">
                        <p className="text-sm font-black text-white">${u.liveBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        <p className="text-[9px] text-green-500 font-black uppercase tracking-widest opacity-60">LIVE PORTFOLIO</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-white">${u.demoBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        <p className="text-[9px] text-orange-400 font-black uppercase tracking-widest opacity-60">PRACTICE ACC</p>
                      </div>
                    </div>
                    
                    <div className="w-48 flex justify-end">
                      {editingUserId === u.id ? (
                        <div className="flex gap-2 animate-in slide-in-from-right duration-200">
                          <input 
                            autoFocus
                            type="number" 
                            placeholder="Add Amount..."
                            value={addAmount}
                            onChange={e => setAddAmount(e.target.value)}
                            className="bg-[#0b0e16] border border-blue-500/50 p-3 rounded-xl text-sm font-black w-28 outline-none text-white shadow-inner"
                          />
                          <button onClick={() => handleAddBalance(u.id)} className="bg-blue-600 p-3 rounded-xl text-white hover:bg-blue-500 shadow-lg"><CheckCircle size={18}/></button>
                          <button onClick={() => setEditingUserId(null)} className="bg-white/5 p-3 rounded-xl text-gray-500 hover:text-white"><XCircle size={18}/></button>
                        </div>
                      ) : (
                        <button onClick={() => setEditingUserId(u.id)} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-black uppercase text-[10px] transition-all active:scale-95 shadow-lg tracking-widest">
                          <Plus size={14} /> Inject Funds
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'MARKET' && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map(asset => {
                const currentOverride = marketOverrides.find(o => o.assetId === asset.id);
                return (
                  <div key={asset.id} className="bg-[#1c2230] p-6 rounded-[2rem] border border-white/5 space-y-6 hover:border-blue-500/30 transition-all shadow-xl">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-inner ${asset.category === 'Crypto' ? 'bg-orange-500/20' : 'bg-blue-500/20'}`}>
                          {asset.symbol[0]}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">{asset.symbol}</p>
                          <p className="text-[9px] text-gray-500 font-bold uppercase">{asset.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono font-black text-blue-400">{asset.price.toFixed(5)}</p>
                        <p className={`text-[9px] font-bold ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                       <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Trend Override</p>
                       <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'UP', label: 'Up Trend', icon: ArrowUpRight, color: 'hover:bg-green-600/20' },
                            { id: 'DOWN', label: 'Down Trend', icon: ArrowDownRight, color: 'hover:bg-red-600/20' },
                            { id: 'VOLATILE', label: 'Volatile', icon: Activity, color: 'hover:bg-orange-600/20' },
                            { id: 'RANGING', label: 'Ranging', icon: Layers, color: 'hover:bg-blue-600/20' }
                          ].map(t => (
                            <button 
                              key={t.id}
                              onClick={() => setMarketOverride(asset.id, (currentOverride?.trend === t.id ? 'NORMAL' : t.id) as any)}
                              className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all text-[10px] font-black uppercase ${
                                currentOverride?.trend === t.id 
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                                : `bg-[#0b0e16] border-white/5 text-gray-500 ${t.color}`
                              }`}
                            >
                              <t.icon size={12} />
                              {t.label}
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <p className="text-center text-[10px] text-gray-700 font-black uppercase tracking-[0.5em] opacity-40">
        QTradex Authorized Control Terminal | System ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
      </p>
    </div>
  );
};

export default AdminDashboard;
