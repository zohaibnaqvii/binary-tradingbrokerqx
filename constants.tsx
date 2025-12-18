
import { Asset } from './types';

export const PKR_CONVERSION_RATE = 300;

export const PAYMENT_CHANNELS = {
  EASYPAISA: { name: 'EasyPaisa', number: '0300-1234567', accountName: 'Admin Account' },
  SADAPAY: { name: 'SadaPay', number: '03488432489', accountName: 'Tanzila' },
  CRYPTO: {
    USDT_TRC20: 'TZDeaPnUcBRPvkpDQmkBEHeRd6D1aX4Gve',
    BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    USDT_BEP20: '0x6a153ab88caadd1a1a4305977c7a9e0a5d3fc8ad'
  }
};

export const SUPPORT = { 
  EMAIL: 'payments@qtradex.com', 
  TELEGRAM: '@qtradexsupport',
  MESSAGE: 'Instant Reply Available'
};

export const BONUS_CODES = [
  { code: 'WELCOME76', value: '76%', description: 'First deposit bonus' },
  { code: 'TRADEX10', value: '10%', description: 'Risk-free trade code' },
  { code: 'NEWBIE', value: '50%', description: 'Starter pack bonus' },
  { code: 'PROTRADER', value: '100%', description: 'VIP high-roller bonus' }
];

const generateOTCAssets = (): Asset[] => {
  const pairs = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY',
    'NZD/USD', 'USD/CHF', 'AUD/JPY', 'CAD/JPY', 'EUR/AUD', 'EUR/CAD', 'GBP/CAD', 'AUD/CAD',
    'NZD/JPY', 'GBP/AUD', 'USD/INR', 'USD/PKR', 'USD/BRL', 'USD/TRY', 'USD/ZAR', 'USD/MXN'
  ];
  
  const assets: Asset[] = pairs.map((p, i) => ({
    id: `fx-${i}`,
    name: `${p} (OTC)`,
    category: 'Forex',
    symbol: p,
    price: 1.0 + Math.random() * 2,
    change: (Math.random() - 0.5) * 2,
    payout: 90 + Math.floor(Math.random() * 8)
  }));

  assets.push(
    { id: 'c1', name: 'Bitcoin (OTC)', category: 'Crypto', symbol: 'BTC/USD', price: 92450.50, change: 1.2, payout: 92 },
    { id: 'c2', name: 'Ethereum (OTC)', category: 'Crypto', symbol: 'ETH/USD', price: 2840.15, change: -0.5, payout: 90 },
    { id: 'm1', name: 'Gold (OTC)', category: 'Commodities', symbol: 'XAU/USD', price: 2350.40, change: 0.8, payout: 95 },
    { id: 'm2', name: 'Silver (OTC)', category: 'Commodities', symbol: 'XAG/USD', price: 28.15, change: 1.5, payout: 91 },
    { id: 'm3', name: 'Crude Oil (OTC)', category: 'Commodities', symbol: 'WTI', price: 78.45, change: -1.2, payout: 88 },
    { id: 'c3', name: 'Solana (OTC)', category: 'Crypto', symbol: 'SOL/USD', price: 145.20, change: 4.2, payout: 93 }
  );

  return assets;
};

export const INITIAL_ASSETS = generateOTCAssets();

export const COUNTRY_FLAGS: Record<string, string> = { PK: '🇵🇰', US: '🇺🇸', IN: '🇮🇳', BR: '🇧🇷', RU: '🇷🇺', ID: '🇮🇩', TR: '🇹🇷', VN: '🇻🇳' };
export const NAMES_POOL = ['Ahmed K.', 'Sarah J.', 'Muhammad A.', 'Elena S.', 'Rajesh M.', 'Lucia F.', 'Ivan P.', 'Budi H.', 'Mehmet Y.', 'Minh T.', 'David L.'];
