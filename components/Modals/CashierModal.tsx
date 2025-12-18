
import React, { useState, useMemo } from 'react';
import { X, Smartphone, CreditCard, Bitcoin, CheckCircle2, Upload, Copy, Send, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { PAYMENT_CHANNELS, SUPPORT, BONUS_CODES } from '../../constants';
import { useAppContext } from '../../store/AppContext';

interface Props {
  onClose: () => void;
}

const CashierModal: React.FC<Props> = ({ onClose }) => {
  const { addTransaction, user } = useAppContext();
  const [tab, setTab] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT');
  const [method, setMethod] = useState<'EASYPAISA' | 'SADAPAY' | 'CRYPTO_TRC' | 'CRYPTO_BEP' | null>(null);
  const [submittedTx, setSubmittedTx] = useState<{id: string, amount: number, method: string} | null>(null);
  const [selectedBonus, setSelectedBonus] = useState(BONUS_CODES[0].code);
  const [amount, setAmount] = useState<string>('100');
  const [walletAddress, setWalletAddress] = useState('');

  const txId = useMemo(() => Math.random().toString(36).substr(2, 9).toUpperCase(), [submittedTx]);

  const handleTransactionSubmit = (type: 'DEPOSIT' | 'WITHDRAW') => {
    if (!amount || isNaN(Number(amount))) return alert("Invalid amount");
    if (!user) return;
    
    const finalTxId = txId;
    addTransaction({
      id: finalTxId,
      userId: user.id,
      userEmail: user.email,
      type,
      method: method || 'BANK_TRANSFER',
      amount: Number(amount),
      status: 'PENDING',
      date: new Date().toLocaleString()
    });
    setSubmittedTx({ id: finalTxId, amount: Number(amount), method: method || 'BANK' });
  };

  const getTelegramMessage = () => {
    if (!submittedTx) return "";
    return `Hello QTradex Admin,%0A%0AInitiated a ${submittedTx.method} DEPOSIT.%0AAmount: $${submittedTx.amount}%0ATransaction ID: ${submittedTx.id}%0AUser: ${user?.email}%0A%0APlease verify the attached receipt.`;
  };

  if (submittedTx) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
        <div className="bg-[#151926] w-full max-w-sm rounded-[3rem] border border-white/5 p-10 text-center flex flex-col items-center gap-6 shadow-2xl animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-blue-600/20 rounded-[2rem] flex items-center justify-center text-blue-500 mb-2 shadow-inner">
            <Clock size={48} className="animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Action Required</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Transaction Ref: <span className="text-blue-500 font-black">{submittedTx.id}</span></p>
          </div>
          <div className="bg-[#0b0e16] p-6 rounded-2xl border border-white/5 w-full text-left space-y-4">
            <div className="flex items-center gap-3 text-orange-400">
              <AlertCircle size={18} />
              <p className="text-[10px] font-black uppercase tracking-tight">Standard Verification Process</p>
            </div>
            <p className="text-[11px] text-gray-400 font-bold leading-relaxed">
              To complete your $${submittedTx.amount} deposit, click the button below to send your payment screenshot to our automated verification desk on Telegram.
            </p>
          </div>
          <div className="space-y-3 w-full">
            <a 
              href={`https://t.me/${SUPPORT.TELEGRAM.replace('@','')}?text=${getTelegramMessage()}`} 
              target="_blank" 
              rel="noreferrer"
              className="w-full bg-blue-600 py-5 rounded-2xl font-black text-sm text-white uppercase shadow-xl shadow-blue-900/40 active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Verify on Telegram
            </a>
            <button onClick={onClose} className="w-full bg-white/5 py-4 rounded-2xl font-black text-[10px] text-gray-500 uppercase hover:text-white transition-all">Close Terminal</button>
          </div>
        </div>
      </div>
    );
  }

  const renderMethodDetails = () => {
    if (!method) return null;
    const isCrypto = method.startsWith('CRYPTO');
    const config = isCrypto ? PAYMENT_CHANNELS.CRYPTO : (method === 'EASYPAISA' ? PAYMENT_CHANNELS.EASYPAISA : PAYMENT_CHANNELS.SADAPAY);
    
    // Fix: Access properties directly from constants to avoid property access on union types
    let address = '';
    if (method === 'CRYPTO_TRC') {
      address = PAYMENT_CHANNELS.CRYPTO.USDT_TRC20;
    } else if (method === 'CRYPTO_BEP') {
      address = PAYMENT_CHANNELS.CRYPTO.USDT_BEP20;
    } else if (method === 'EASYPAISA') {
      address = PAYMENT_CHANNELS.EASYPAISA.number;
    } else if (method === 'SADAPAY') {
      address = PAYMENT_CHANNELS.SADAPAY.number;
    }

    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-200">
        <div className="bg-[#0b0e16] p-6 rounded-3xl border border-white/10 shadow-inner space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{isCrypto ? 'Wallet Address' : 'Account Details'}</p>
            <span className="text-[9px] font-black bg-blue-600/20 text-blue-500 px-2 py-0.5 rounded-full border border-blue-500/20 uppercase tracking-tighter">Verified Channel</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-black/40 p-4 rounded-2xl border border-white/5 group">
              <p className="text-sm font-black text-white tracking-widest break-all pr-4">{address}</p>
              <button onClick={() => navigator.clipboard.writeText(address || '')} className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-blue-500 transition-all active:scale-90">
                <Copy size={18}/>
              </button>
            </div>
            {!isCrypto && (
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tight">Account Holder: <span className="text-gray-400">{(config as any).accountName}</span></p>
                <p className="text-[10px] text-green-500 font-black uppercase">Instant</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-[10px] text-gray-500 mb-2 block font-black uppercase tracking-widest">Amount ($)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-[#0b0e16] border border-white/10 rounded-2xl py-4 px-4 text-white font-black outline-none focus:border-blue-500 transition-all shadow-inner" placeholder="100" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 mb-2 block font-black uppercase tracking-widest">Promo Code</label>
              <select value={selectedBonus} onChange={e => setSelectedBonus(e.target.value)} className="w-full bg-[#0b0e16] border border-white/10 rounded-2xl py-4 px-4 text-white font-black outline-none transition-all shadow-inner appearance-none cursor-pointer">
                {BONUS_CODES.map(b => <option key={b.code} value={b.code}>{b.code}</option>)}
              </select>
            </div>
          </div>
        </div>

        <button onClick={() => handleTransactionSubmit('DEPOSIT')} className="w-full bg-[#00b15d] py-5 rounded-[1.5rem] font-black text-lg text-white hover:bg-[#00c869] transition-all shadow-2xl shadow-green-900/30 active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3">
          Initialize Deposit <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[#151926] w-full max-w-5xl h-[90vh] md:h-[85vh] rounded-[3rem] border border-white/10 flex flex-col overflow-hidden shadow-2xl animate-in fade-in duration-300">
        <div className="flex justify-between items-center p-8 border-b border-white/5 bg-[#1c2230]/50">
          <div className="flex gap-10">
            <button onClick={() => { setTab('DEPOSIT'); setMethod(null); }} className={`text-2xl font-black pb-3 border-b-4 transition-all uppercase tracking-tighter ${tab === 'DEPOSIT' ? 'border-blue-500 text-white' : 'border-transparent text-gray-600'}`}>Add Liquidity</button>
            <button onClick={() => { setTab('WITHDRAW'); setMethod(null); }} className={`text-2xl font-black pb-3 border-b-4 transition-all uppercase tracking-tighter ${tab === 'WITHDRAW' ? 'border-blue-500 text-white' : 'border-transparent text-gray-600'}`}>Extract Profits</button>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-colors"><X size={28} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-10 md:flex-row">
          {tab === 'DEPOSIT' ? (
            <>
              <div className="w-full md:w-1/3 flex flex-col gap-3">
                <p className="text-[10px] text-gray-600 uppercase font-black tracking-[0.4em] mb-2 px-1">Network Gateway</p>
                {[
                  { id: 'EASYPAISA', label: 'EasyPaisa', sub: 'PKR Instant', icon: Smartphone, color: 'text-green-500', bg: 'bg-green-500/10' },
                  { id: 'SADAPAY', label: 'SadaPay', sub: 'PKR Instant', icon: Smartphone, color: 'text-teal-400', bg: 'bg-teal-500/10' },
                  { id: 'CRYPTO_TRC', label: 'USDT TRC20', sub: 'Tron Network', icon: Bitcoin, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                  { id: 'CRYPTO_BEP', label: 'USDT BEP20', sub: 'BSC Network', icon: Bitcoin, color: 'text-yellow-500', bg: 'bg-yellow-500/10' }
                ].map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id as any)} className={`flex items-center gap-4 p-5 rounded-[1.5rem] border transition-all hover:scale-[1.03] ${method === m.id ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-900/20' : 'bg-[#1e2436] border-white/5'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method === m.id ? 'bg-white/20' : m.bg} ${method === m.id ? 'text-white' : m.color}`}><m.icon size={26} /></div>
                    <div className="text-left">
                      <span className={`text-sm font-black block ${method === m.id ? 'text-white' : 'text-gray-200'}`}>{m.label}</span>
                      <span className={`text-[10px] font-bold uppercase ${method === m.id ? 'text-blue-200' : 'text-gray-500'}`}>{m.sub}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex-1">
                {!method ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-20 p-10 border-4 border-dashed border-white/5 rounded-[3rem]">
                    <CreditCard size={80} className="mb-6 text-gray-500" />
                    <p className="text-xl font-black uppercase tracking-[0.3em]">Authorize Gateway</p>
                  </div>
                ) : renderMethodDetails()}
              </div>
            </>
          ) : (
            <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center gap-8 py-10 opacity-30 select-none">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-gray-500"><AlertCircle size={48} /></div>
              <p className="text-xl font-black uppercase tracking-widest text-center">Withdrawals currently paused for system audit</p>
            </div>
          )}
        </div>

        <div className="bg-[#1c2230] p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5">
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-3 text-[10px] text-gray-500 font-black uppercase tracking-widest"><CheckCircle2 size={16} className="text-green-500" /> AES-256 Encryption</div>
             <div className="flex items-center gap-3 text-[10px] text-gray-500 font-black uppercase tracking-widest"><CheckCircle2 size={16} className="text-green-500" /> PCI-DSS Compliant</div>
          </div>
          <p className="text-[10px] font-black text-gray-700 italic uppercase">System operational status: 100% stable</p>
        </div>
      </div>
    </div>
  );
};

export default CashierModal;
