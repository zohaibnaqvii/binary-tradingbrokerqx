
import React, { useMemo, useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  ShieldAlert, 
  Mail, 
  Hash, 
  LogOut, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2,
  Wallet,
  Camera,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useAppContext } from '../store/AppContext';

const Profile: React.FC = () => {
  const { user, setUser, transactions, submitKYC } = useAppContext();
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [kycFiles, setKycFiles] = useState<{front: boolean, back: boolean}>({front: false, back: false});

  if (!user) return null;

  const traderId = useMemo(() => {
    const hash = user.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `TR-${user.id.slice(0, 4).toUpperCase()}-${1000 + (hash % 9000)}`;
  }, [user.id]);

  const handleKYCSubmit = () => {
    if (!kycFiles.front || !kycFiles.back) {
      alert("Please upload both Front and Back of your ID card.");
      return;
    }
    submitKYC();
    setShowKYCModal(false);
  };

  const getTimeRemaining = () => {
    if (!user.kycSubmissionTime) return "";
    const elapsed = Date.now() - user.kycSubmissionTime;
    const remaining = Math.max(0, 30 * 60 * 1000 - elapsed);
    const mins = Math.floor(remaining / 60000);
    return `${mins} min left`;
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-20">
      {/* Header Profile Info */}
      <div className="text-center space-y-2 py-4">
        <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-blue-900/30">
          {user.name[0]}
        </div>
        <h2 className="text-xl font-black text-white">{user.name}</h2>
        <div className="flex items-center justify-center gap-2">
          {user.kycStatus === 'VERIFIED' ? (
            <div className="flex items-center gap-1 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
              <ShieldCheck size={12} /> Verified Account
            </div>
          ) : user.kycStatus === 'PENDING' ? (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-500/20">
                <Clock size={12} className="animate-spin" /> Verifying...
              </div>
              <span className="text-[9px] text-gray-500 font-bold uppercase">{getTimeRemaining()}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20">
              <ShieldAlert size={12} /> Unverified
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Account Details */}
        <div className="bg-[#1c2230] p-4 rounded-2xl border border-white/5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-gray-400">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Email Address</p>
                <p className="text-sm font-black text-white">{user.email}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-gray-400">
                <Hash size={16} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Trader ID</p>
                <p className="text-sm font-black text-white">{traderId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* KYC CTA */}
        {user.kycStatus === 'NONE' && (
          <button 
            onClick={() => setShowKYCModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl flex items-center justify-between group transition-all shadow-lg shadow-blue-900/20"
          >
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-white" />
              <div className="text-left">
                <p className="text-sm font-black text-white uppercase tracking-tight">Submit ID for KYC</p>
                <p className="text-[10px] text-blue-200 font-bold uppercase opacity-80">Withdrawal access will unlock</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-white group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {/* Real Transaction History */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Wallet size={16} className="text-blue-500" />
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Live Transaction Logs</h3>
          </div>
          
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-[#1c2230] border border-white/5 p-3 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'DEPOSIT' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    {tx.type === 'DEPOSIT' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white uppercase">{tx.type}</span>
                      <span className="text-[9px] font-bold text-gray-500 uppercase">{tx.method}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-gray-600 font-bold">
                      <Clock size={10} />
                      {tx.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-black ${tx.type === 'DEPOSIT' ? 'text-green-500' : 'text-orange-500'}`}>
                    {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount}
                  </div>
                  <div className={`flex items-center justify-end gap-1 text-[8px] font-black uppercase ${
                    tx.status === 'SUCCESS' ? 'text-green-500/70' : 'text-blue-400/70'
                  }`}>
                    {tx.status === 'SUCCESS' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
            
            {transactions.length === 0 && (
              <div className="bg-[#1c2230] border border-white/5 p-12 rounded-2xl text-center flex flex-col items-center gap-2 opacity-30">
                <Wallet size={40} />
                <p className="text-[10px] font-black uppercase tracking-widest">No transaction history found</p>
              </div>
            )}
          </div>
        </div>

        {/* Sign Out */}
        <button 
          onClick={() => setUser(null)}
          className="w-full bg-white/5 hover:bg-red-500/10 hover:text-red-500 p-4 rounded-2xl flex items-center gap-3 transition-all text-gray-400 group border border-transparent hover:border-red-500/20"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-black uppercase tracking-tight">Terminate Session</span>
        </button>
      </div>

      {/* Enhanced KYC Modal */}
      {showKYCModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-6">
          <div className="bg-[#151926] w-full max-w-sm rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl p-6 relative animate-in zoom-in duration-300">
            <button onClick={() => setShowKYCModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X size={24}/></button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">ID Verification</h3>
              <p className="text-[11px] text-gray-500 font-bold uppercase leading-relaxed mt-1">Upload 2 clear photos of your original ID</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => setKycFiles(p => ({...p, front: true}))}
                className={`w-full border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center gap-2 ${
                  kycFiles.front ? 'bg-green-500/5 border-green-500/40 text-green-500' : 'border-white/5 text-gray-500 hover:bg-white/5'
                }`}
              >
                {kycFiles.front ? <CheckCircle2 size={24} /> : <Camera size={24} />}
                <span className="text-[11px] font-black uppercase tracking-widest">{kycFiles.front ? 'FRONT LOADED' : 'FRONT OF ID CARD'}</span>
              </button>

              <button 
                onClick={() => setKycFiles(p => ({...p, back: true}))}
                className={`w-full border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center gap-2 ${
                  kycFiles.back ? 'bg-green-500/5 border-green-500/40 text-green-500' : 'border-white/5 text-gray-500 hover:bg-white/5'
                }`}
              >
                {kycFiles.back ? <CheckCircle2 size={24} /> : <Camera size={24} />}
                <span className="text-[11px] font-black uppercase tracking-widest">{kycFiles.back ? 'BACK LOADED' : 'BACK OF ID CARD'}</span>
              </button>

              <button 
                onClick={handleKYCSubmit}
                disabled={!kycFiles.front || !kycFiles.back}
                className={`w-full py-5 rounded-2xl font-black text-sm uppercase transition-all shadow-xl active:scale-95 mt-4 ${
                  kycFiles.front && kycFiles.back 
                    ? 'bg-blue-600 text-white shadow-blue-900/30' 
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                }`}
              >
                START VERIFICATION
              </button>
              
              <div className="flex items-center justify-center gap-2 text-[9px] text-gray-600 font-black uppercase tracking-widest mt-2">
                <Clock size={12} /> Auto-Approving in 30 minutes
              </div>
            </div>
          </div>
        </div>
      )}
      
      <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em] pt-4">
        QTradex Premium Engine v2.7
      </p>
    </div>
  );
};

export default Profile;
