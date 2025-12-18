
import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Chrome } from 'lucide-react';
import { useAppContext } from '../../store/AppContext';

interface Props {
  onClose: () => void;
}

const AuthModal: React.FC<Props> = ({ onClose }) => {
  const { setUser } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      demoBalance: 1000,
      liveBalance: 0,
      isVerified: false
    };
    setUser(mockUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#151926] w-full max-w-md rounded-2xl border border-[#252a3a] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-[#252a3a]">
          <h2 className="text-xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0b0e16] border border-[#252a3a] rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500 transition-all"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    className="w-full bg-[#0b0e16] border border-[#252a3a] rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0b0e16] border border-[#252a3a] rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 mt-2">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-[#252a3a]"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-[#252a3a]"></div>
          </div>

          <button type="button" className="w-full bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
            <Chrome size={20} />
            Continue with Google
          </button>

          <p className="text-center text-xs text-gray-500 mt-2">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-500 font-bold hover:underline">
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
