
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Asset, Trade, AccountType, Transaction } from '../types';
import { INITIAL_ASSETS } from '../constants';

interface MarketOverride {
  assetId: string;
  trend: 'UP' | 'DOWN' | 'VOLATILE' | 'RANGING' | 'NORMAL';
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  allUsers: User[];
  allTransactions: Transaction[];
  activeAccount: AccountType;
  setActiveAccount: (type: AccountType) => void;
  assets: Asset[];
  trades: Trade[];
  transactions: Transaction[];
  addTrade: (trade: Trade) => void;
  addTransaction: (tx: Transaction) => void;
  updateBalance: (amount: number, type: AccountType, userId?: string) => void;
  approveTransaction: (txId: string) => void;
  rejectTransaction: (txId: string) => void;
  setMarketOverride: (assetId: string, trend: MarketOverride['trend']) => void;
  marketOverrides: MarketOverride[];
  submitKYC: () => void;
  isSplitScreen: boolean;
  setIsSplitScreen: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const getPriceAtTime = (assetId: string, timestampMs: number, basePrice: number, overrideTrend?: string) => {
  const t = timestampMs / 1000;
  const assetSeed = assetId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  
  // Deterministic Base Character
  let character = assetSeed % 4; 
  if (overrideTrend === 'UP') character = 0;
  else if (overrideTrend === 'DOWN') character = 1;
  else if (overrideTrend === 'VOLATILE') character = 2;
  else if (overrideTrend === 'RANGING') character = 3;

  let noise = 0;
  const frequencies = [0.00002, 0.00008, 0.0003, 0.001, 0.004, 0.015, 0.06, 0.2, 0.8, 2.5, 8.0, 20.0];
  const amplitudes = [0.12, 0.06, 0.03, 0.015, 0.008, 0.004, 0.002, 0.001, 0.0005, 0.0002, 0.0001, 0.00005];
  
  frequencies.forEach((f, i) => {
    const phase1 = assetSeed * (i + 1.234);
    const phase2 = assetSeed * (i + 5.678);
    noise += Math.sin(t * f + phase1) * amplitudes[i];
    noise += Math.cos(t * f * 1.618 + phase2) * (amplitudes[i] * 0.4);
  });

  let multiplier = 1.0;
  const trendSpeed = 0.00002 * (1 + (seededRandom(assetSeed) * 2));
  
  switch(character) {
    case 0: noise += (t * trendSpeed); multiplier = 0.9 + (seededRandom(assetSeed + 1) * 0.5); break;
    case 1: noise -= (t * trendSpeed); multiplier = 0.9 + (seededRandom(assetSeed + 2) * 0.5); break;
    case 2: multiplier = 3.5 + (seededRandom(assetSeed + 3) * 4.0); break;
    case 3: noise *= 0.3; multiplier = 0.4 + (seededRandom(assetSeed + 4) * 0.2); break;
  }

  const finalPrice = basePrice * (1 + (noise * multiplier));
  return Math.max(0.00001, finalPrice);
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('qt_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('qt_all_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [allTransactions, setAllTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('qt_all_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [marketOverrides, setMarketOverrides] = useState<MarketOverride[]>(() => {
    const saved = localStorage.getItem('qt_market_overrides');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeAccount, setActiveAccount] = useState<AccountType>(() => {
    const saved = localStorage.getItem('qt_account_type');
    return (saved as AccountType) || 'DEMO';
  });

  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('qt_trades');
    return saved ? JSON.parse(saved) : [];
  });

  const [isSplitScreen, setIsSplitScreen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('qt_user', JSON.stringify(user));
      setAllUsers(prev => {
        const index = prev.findIndex(u => u.id === user.id);
        if (index === -1) return [...prev, user];
        const next = [...prev];
        next[index] = user;
        return next;
      });
    } else localStorage.removeItem('qt_user');
  }, [user]);

  useEffect(() => localStorage.setItem('qt_all_users', JSON.stringify(allUsers)), [allUsers]);
  useEffect(() => localStorage.setItem('qt_all_transactions', JSON.stringify(allTransactions)), [allTransactions]);
  useEffect(() => localStorage.setItem('qt_market_overrides', JSON.stringify(marketOverrides)), [marketOverrides]);
  useEffect(() => localStorage.setItem('qt_account_type', activeAccount), [activeAccount]);
  useEffect(() => localStorage.setItem('qt_trades', JSON.stringify(trades)), [trades]);

  const setMarketOverride = (assetId: string, trend: MarketOverride['trend']) => {
    setMarketOverrides(prev => {
      const filtered = prev.filter(o => o.assetId !== assetId);
      if (trend === 'NORMAL') return filtered;
      return [...filtered, { assetId, trend }];
    });
  };

  const updateBalance = useCallback((amount: number, type: AccountType, userId?: string) => {
    const targetId = userId || user?.id;
    if (!targetId) return;
    setAllUsers(prev => prev.map(u => {
      if (u.id === targetId) {
        const key = type === 'DEMO' ? 'demoBalance' : 'liveBalance';
        const updatedUser = { ...u, [key]: Math.max(0, u[key] + amount) };
        if (u.id === user?.id) setUser(updatedUser);
        return updatedUser;
      }
      return u;
    }));
  }, [user]);

  const addTransaction = useCallback((tx: Transaction) => {
    setAllTransactions(prev => [tx, ...prev]);
  }, []);

  const approveTransaction = useCallback((txId: string) => {
    setAllTransactions(prev => prev.map(tx => {
      if (tx.id === txId && tx.status === 'PENDING') {
        updateBalance(tx.amount, 'LIVE', tx.userId);
        return { ...tx, status: 'SUCCESS' };
      }
      return tx;
    }));
  }, [updateBalance]);

  const rejectTransaction = useCallback((txId: string) => {
    setAllTransactions(prev => prev.map(tx => {
      if (tx.id === txId && tx.status === 'PENDING') return { ...tx, status: 'REJECTED' };
      return tx;
    }));
  }, []);

  const addTrade = useCallback((trade: Trade) => setTrades(prev => [trade, ...prev]), []);

  const submitKYC = useCallback(() => {
    setUser(prev => prev ? { ...prev, kycStatus: 'PENDING', kycSubmissionTime: Date.now() } : null);
  }, []);

  useEffect(() => {
    const ticker = setInterval(() => {
      const now = Date.now();
      setAssets(prev => prev.map(asset => {
        const base = INITIAL_ASSETS.find(a => a.id === asset.id)?.price || 1.0;
        const override = marketOverrides.find(o => o.assetId === asset.id);
        const newPrice = getPriceAtTime(asset.id, now, base, override?.trend);
        return { ...asset, price: newPrice, change: ((newPrice - base) / base) * 100 };
      }));
    }, 50); 
    return () => clearInterval(ticker);
  }, [marketOverrides]);

  useEffect(() => {
    const settlementTicker = setInterval(() => {
      const now = Date.now();
      setTrades(prev => {
        let changed = false;
        const next = prev.map(trade => {
          if (trade.status !== 'PENDING' || trade.endTime > now) return trade;
          changed = true;
          const currentAsset = assets.find(a => a.id === trade.assetId);
          if (!currentAsset) return { ...trade, status: 'LOST' as const };
          const win = trade.direction === 'UP' ? currentAsset.price > trade.entryPrice : currentAsset.price < trade.entryPrice;
          if (win) {
            const profit = trade.amount + (trade.amount * (trade.payout / 100));
            updateBalance(profit, trade.accountType);
          }
          return { ...trade, status: win ? 'WON' : 'LOST', exitPrice: currentAsset.price };
        });
        return changed ? next : prev;
      });
    }, 200);
    return () => clearInterval(settlementTicker);
  }, [assets, updateBalance]);

  const transactions = allTransactions.filter(tx => tx.userId === user?.id);

  return (
    <AppContext.Provider value={{
      user, setUser, allUsers, allTransactions, activeAccount, setActiveAccount, 
      assets, trades, transactions, addTrade, addTransaction, updateBalance,
      approveTransaction, rejectTransaction, setMarketOverride, marketOverrides, 
      submitKYC, isSplitScreen, setIsSplitScreen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
