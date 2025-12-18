
export type AccountType = 'DEMO' | 'LIVE';
export type TimeFrame = '5s' | '10s' | '30s' | '1m' | '2m' | '5m' | '15m' | '30m' | '1h' | '4h';
export type TradeDuration = '5s' | '10s' | '1m' | '2m' | '5m' | '30m';
export type KYCStatus = 'NONE' | 'PENDING' | 'VERIFIED';
export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  demoBalance: number;
  liveBalance: number;
  isVerified: boolean;
  kycStatus: KYCStatus;
  kycSubmissionTime?: number;
  avatar?: string;
  role: UserRole;
}

export interface Transaction {
  id: string;
  userId: string;
  userEmail: string;
  type: 'DEPOSIT' | 'WITHDRAW';
  method: string;
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'REJECTED';
  date: string;
  screenshot?: string;
}

export interface Asset {
  id: string;
  name: string;
  category: 'Forex' | 'Crypto' | 'Commodities';
  symbol: string;
  price: number;
  change: number;
  payout: number;
}

export interface CandlestickData {
  time: number; // timestamp
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Trade {
  id: string;
  userId: string;
  assetId: string;
  assetSymbol: string;
  amount: number;
  direction: 'UP' | 'DOWN';
  entryPrice: number;
  exitPrice?: number;
  status: 'PENDING' | 'WON' | 'LOST';
  startTime: number;
  endTime: number;
  payout: number;
  accountType: AccountType;
}

export interface AISignal {
  direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number;
  reason: string;
}
