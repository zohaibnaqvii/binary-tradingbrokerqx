
import React, { useMemo } from 'react';
import { Trophy, ArrowUp } from 'lucide-react';
import { NAMES_POOL, COUNTRY_FLAGS } from '../constants';

const Leaderboard: React.FC = () => {
  const leaders = useMemo(() => {
    return NAMES_POOL.slice(0, 8).map((name, i) => ({
      rank: i + 1,
      name,
      country: Object.keys(COUNTRY_FLAGS)[Math.floor(Math.random() * Object.keys(COUNTRY_FLAGS).length)],
      profit: Math.floor(Math.random() * 50000) + 10000,
      avatar: `https://picsum.photos/seed/${name}/100/100`
    }));
  }, []);

  return (
    <div className="bg-[#151926] p-4 rounded-2xl border border-[#252a3a]">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={20} className="text-yellow-500" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Top Traders Today</h3>
      </div>
      <div className="space-y-3">
        {leaders.map((leader) => (
          <div key={leader.rank} className="flex items-center justify-between p-3 bg-[#1e2436] rounded-xl hover:bg-[#252a3a] transition-all group cursor-default">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                leader.rank === 1 ? 'bg-yellow-500 text-black' : 
                leader.rank === 2 ? 'bg-gray-300 text-black' : 
                leader.rank === 3 ? 'bg-orange-500 text-white' : 'bg-[#0b0e16] text-gray-500'
              }`}>
                {leader.rank}
              </div>
              <img src={leader.avatar} className="w-8 h-8 rounded-full border border-[#252a3a]" alt="" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-200">{leader.name}</span>
                  <span className="text-xs">{COUNTRY_FLAGS[leader.country]}</span>
                </div>
                <span className="text-[10px] text-gray-500">{leader.country}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-500">
              <ArrowUp size={12} />
              <span className="text-xs font-bold">${leader.profit.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full text-center py-3 text-xs text-blue-400 font-bold hover:text-blue-300 mt-2 transition-colors">
        VIEW FULL RANKINGS
      </button>
    </div>
  );
};

export default Leaderboard;
