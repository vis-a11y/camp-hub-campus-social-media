import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Sync Established');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Identity Mismatch');
    }
  };

  return (
    <div className="animate-scale-in w-full max-w-[480px]">
      <div className="premium-card p-12 lg:p-16 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 accent-gradient-bg rounded-2xl flex items-center justify-center text-white shadow-2xl">
            <Zap size={32} fill="white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Campus</h2>
            <span className="text-xl font-black accent-gradient-text uppercase tracking-tighter leading-none italic">Hub OS</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Node Identifier</label>
            <input 
              type="email" 
              className="premium-input" 
              placeholder="email@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Key</label>
            <input 
              type="password" 
              className="premium-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="premium-button w-full flex items-center justify-center gap-3 group">
            <span>Establish Sync</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
          <p className="text-slate-500 text-sm font-medium italic">New identity node?</p>
          <Link to="/register" className="text-indigo-400 font-black uppercase tracking-widest text-xs hover:text-white transition-colors">Initialize</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
