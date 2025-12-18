
import React from 'react';
import { ChevronRight, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { Asset } from '../types';

interface Props {
  selectedAsset: Asset;
  onSelect: (asset: Asset) => void;
}

const AssetBar: React.FC<Props> = ({ selectedAsset, onSelect }) => {
  const { assets } = useAppContext();

  return (
    <div className="h-14 bg-[#151926] border-b border-[#252a3a] flex items-center px-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="flex items-center gap-1 border-r border-[#252a3a] pr-4 mr-4">
        <button className="flex items-center gap-2 bg-[#252a3a] hover:bg-[#2d3446] px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
          <Search size={14} className="text-gray-400" />
          <span>All Assets</span>
        </button>
      </div>

      <div className="flex gap-2">
        {assets.map(asset => (
          <button 
            key={asset.id}
            onClick={() => onSelect(asset)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-all ${
              selectedAsset.id === asset.id 
                ? 'bg-[#1e2436] border-blue-500/50 shadow-lg' 
                : 'border-transparent hover:bg-[#1e2436] grayscale opacity-70 hover:grayscale-0 hover:opacity-100'
            }`}
          >
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold text-gray-200">{asset.symbol}</span>
              <span className="text-[9px] text-gray-500">{asset.name}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-white">{asset.price.toFixed(2)}</span>
              <span className={`text-[9px] font-medium ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
              </span>
            </div>
            <div className="bg-blue-600/10 px-1.5 py-0.5 rounded text-[10px] font-bold text-blue-400">
              {asset.payout}%
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AssetBar;
