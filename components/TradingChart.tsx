
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ComposedChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  ReferenceLine,
  Bar,
  Cell
} from 'recharts';
import { Asset, TimeFrame } from '../types';
import { Clock, ChevronDown, Activity } from 'lucide-react';
import { useAppContext, getPriceAtTime } from '../store/AppContext';
import { INITIAL_ASSETS } from '../constants';

interface Props {
  asset: Asset;
}

const timeFrameMap: Record<TimeFrame, number> = {
  '5s': 5, '10s': 10, '30s': 30, '1m': 60, '2m': 120, '5m': 300, '15m': 900, '30m': 1800, '1h': 3600, '4h': 14400
};

const TIMEFRAMES: TimeFrame[] = ['5s', '10s', '30s', '1m', '2m', '5m', '15m', '30m', '1h'];

const TradingChart: React.FC<Props> = ({ asset }) => {
  const { trades } = useAppContext();
  const [history, setHistory] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<TimeFrame>('1m');
  const [showTimeframes, setShowTimeframes] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(45); 
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  const COLORS = {
    UP: '#00ab61',
    DOWN: '#ff4b2b',
    GRID: '#161b26',
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    setZoomLevel(prev => {
      const sensitivity = 2;
      const delta = e.deltaY > 0 ? sensitivity : -sensitivity;
      return Math.max(20, Math.min(150, prev + delta));
    });
  }, []);

  /**
   * Reconstructs a historical candle using deterministic sampling.
   * This ensures the chart never changes history when reopened.
   */
  const getCandleAtTime = useCallback((assetId: string, timeMs: number, periodMs: number) => {
    const base = INITIAL_ASSETS.find(a => a.id === assetId)?.price || 1.0;
    
    const open = getPriceAtTime(assetId, timeMs, base);
    const close = getPriceAtTime(assetId, timeMs + periodMs, base);
    
    // Sample high/low within the period
    const samples = 8;
    let high = Math.max(open, close);
    let low = Math.min(open, close);
    
    for (let i = 1; i < samples; i++) {
      const p = getPriceAtTime(assetId, timeMs + (periodMs * (i / samples)), base);
      high = Math.max(high, p);
      low = Math.min(low, p);
    }

    return {
      time: timeMs,
      open,
      close,
      high,
      low,
      bodyRange: [Math.min(open, close), Math.max(open, close)],
      wickRange: [low, high],
      isUp: close >= open
    };
  }, []);

  // Continuous deterministic history loader
  useEffect(() => {
    const period = timeFrameMap[timeframe];
    const periodMs = period * 1000;
    
    const refreshHistory = () => {
      const now = Date.now();
      const currentPeriodStart = Math.floor(now / periodMs) * periodMs;
      
      const count = 200; 
      const newHistory = [];
      for (let i = count; i > 0; i--) {
        const t = currentPeriodStart - (i * periodMs);
        newHistory.push(getCandleAtTime(asset.id, t, periodMs));
      }
      
      // Live formation candle
      const liveCandle = getCandleAtTime(asset.id, currentPeriodStart, periodMs);
      liveCandle.close = asset.price;
      liveCandle.high = Math.max(liveCandle.high, asset.price);
      liveCandle.low = Math.min(liveCandle.low, asset.price);
      liveCandle.bodyRange = [Math.min(liveCandle.open, asset.price), Math.max(liveCandle.open, asset.price)];
      liveCandle.wickRange = [Math.min(liveCandle.low, asset.price), Math.max(liveCandle.high, asset.price)];
      liveCandle.isUp = asset.price >= liveCandle.open;
      
      newHistory.push(liveCandle);
      setHistory(newHistory);
      
      const remaining = Math.ceil((currentPeriodStart + periodMs - now) / 1000);
      setSecondsRemaining(remaining);
    };

    refreshHistory();
    const interval = setInterval(refreshHistory, 100); 
    return () => clearInterval(interval);
  }, [asset.id, asset.price, timeframe, getCandleAtTime]);

  const chartData = useMemo(() => {
    const visible = history.slice(-zoomLevel);
    const lastT = history[history.length - 1]?.time || Date.now();
    const period = timeFrameMap[timeframe] * 1000;
    const futurePadding = Math.ceil(zoomLevel * 0.2);
    
    const placeholders = Array.from({ length: futurePadding }).map((_, i) => ({
      time: lastT + (i + 1) * period,
      isPlaceholder: true
    }));
    
    return [...visible, ...placeholders];
  }, [history, zoomLevel, timeframe]);

  const yDomain = useMemo(() => {
    const realData = chartData.filter(d => !d.isPlaceholder);
    if (realData.length === 0) return [asset.price * 0.99, asset.price * 1.01];
    const prices = realData.flatMap(d => [d.high, d.low]);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.4 || (asset.price * 0.001);
    return [min - padding, max + padding];
  }, [chartData, asset.price]);

  const activeTradesForAsset = useMemo(() => 
    trades.filter(t => t.assetId === asset.id && t.status === 'PENDING'),
    [trades, asset.id]
  );

  return (
    <div 
      onWheel={handleWheel}
      className="absolute inset-0 w-full h-full bg-[#0b0e16] flex flex-col overflow-hidden select-none cursor-crosshair"
    >
      <div className="absolute top-4 left-4 right-4 z-40 flex justify-between items-start pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <div className="bg-[#1c222d]/90 p-2 rounded-xl flex items-center gap-2 border border-white/5 backdrop-blur-md shadow-2xl">
             <Activity size={18} className="text-blue-500" />
             <div className="h-4 w-[1px] bg-white/10 mx-1" />
             <div className="flex flex-col">
                <span className="text-[10px] text-white font-black uppercase tracking-tighter flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  PERSISTENT OTC FEED
                </span>
                <span className="text-[8px] text-gray-500 font-bold uppercase">{asset.name}</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col items-end pointer-events-auto gap-2">
          <div className="bg-[#1c2230]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-1 shadow-2xl flex items-center gap-1">
            <div className="bg-blue-600/20 px-4 py-2.5 rounded-xl flex items-center gap-2 border border-blue-500/20">
              <Clock size={16} className="text-blue-400" />
              <span className="text-sm font-black text-white font-mono leading-none">
                {secondsRemaining}s
              </span>
            </div>
            <div className="relative h-full flex items-center">
              <button 
                onClick={() => setShowTimeframes(!showTimeframes)}
                className="px-4 py-2.5 hover:bg-white/5 rounded-xl flex items-center gap-2 transition-colors group"
              >
                <span className="text-[10px] font-black text-gray-300 group-hover:text-white uppercase">{timeframe}</span>
                <ChevronDown size={14} className={`text-gray-500 transition-transform ${showTimeframes ? 'rotate-180' : ''}`} />
              </button>
              {showTimeframes && (
                <div className="absolute top-full right-0 mt-2 bg-[#1c2230] border border-white/10 rounded-2xl overflow-hidden z-[60] shadow-2xl grid grid-cols-3 gap-1 p-2 min-w-[180px] animate-in fade-in zoom-in duration-200">
                  {TIMEFRAMES.map(tf => (
                    <button 
                      key={tf}
                      onClick={() => { setTimeframe(tf); setShowTimeframes(false); }}
                      className={`p-2.5 text-[10px] font-black rounded-lg transition-colors text-center uppercase ${timeframe === tf ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Activity className="text-blue-600 animate-pulse" size={48} />
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Connecting to OTC Stream...</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barGap={0} barCategoryGap="15%">
              <CartesianGrid stroke={COLORS.GRID} vertical={false} strokeDasharray="3 3" opacity={0.5} />
              <XAxis dataKey="time" hide domain={['dataMin', 'dataMax']} />
              <YAxis 
                orientation="right" 
                domain={yDomain} 
                mirror 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fill: '#6b7280', fontWeight: 'bold'}} 
              />
              
              {activeTradesForAsset.map(trade => (
                <ReferenceLine 
                  key={`trade-${trade.id}`}
                  y={trade.entryPrice}
                  stroke={trade.direction === 'UP' ? '#00ab61' : '#ff4b2b'}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              ))}

              <Bar dataKey="wickRange" isAnimationActive={false} barSize={2}>
                {chartData.map((entry, idx) => (
                  <Cell key={`w-${idx}`} fill={entry.isUp ? COLORS.UP : COLORS.DOWN} />
                ))}
              </Bar>

              <Bar dataKey="bodyRange" isAnimationActive={false}>
                {chartData.map((entry, idx) => (
                  <Cell 
                    key={`b-${idx}`} 
                    fill={entry.isUp ? COLORS.UP : COLORS.DOWN} 
                    stroke={entry.isUp ? '#00ff8c' : '#ff7a61'} 
                    strokeWidth={0.5} 
                  />
                ))}
              </Bar>

              <ReferenceLine 
                y={asset.price} 
                stroke="#3b82f6" 
                strokeWidth={2} 
                strokeDasharray="3 3"
                label={({ viewBox }) => (
                  <g>
                    <text 
                      x={viewBox.width - 10} 
                      y={viewBox.y + 5} 
                      fill="#ffffff" 
                      fontSize={16} 
                      fontWeight="900" 
                      textAnchor="end"
                      className="drop-shadow-2xl pointer-events-none font-mono"
                      style={{ textShadow: '0px 0px 8px rgba(0,0,0,1)' }}
                    >
                      {asset.price.toFixed(5)}
                    </text>
                  </g>
                )}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <style>{`
        .recharts-bar-rectangle { transition: height 0.05s linear; }
        .recharts-cartesian-grid-horizontal line { stroke: ${COLORS.GRID}; opacity: 0.15; }
      `}</style>
    </div>
  );
};

export default TradingChart;
