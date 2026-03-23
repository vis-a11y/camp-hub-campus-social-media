import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Zap, ShieldCheck, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(formData.email, formData.password);
    if (success) {
      toast.success('Access Granted - Synchronizing Session');
      navigate('/dashboard');
    } else {
      toast.error('Identity Verification Failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 p-6 relative overflow-hidden font-sans">
      {/* Immersive Background Effects */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10 animate-pulse-glow"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 -z-10"></div>
      
      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
         {/* Branding Side */}
         <div className="hidden lg:flex flex-col space-y-12 animate-fade-in">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 accent-gradient-bg rounded-[24px] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20">
                  <Zap size={36} fill="white" strokeWidth={0} />
               </div>
               <h1 className="text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                  Campus <br /><span className="accent-gradient-text text-7xl italic">Hub</span>
               </h1>
            </div>
            
            <div className="space-y-8">
               <p className="text-2xl font-medium text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                  The ultimate academic ecosystem. <br />
                  Connect. Sync. Evolve.
               </p>
               
               <div className="flex flex-col gap-6">
                  {[
                    { icon: ShieldCheck, label: 'Identity Protection v4.0', color: 'text-emerald-500' },
                    { icon: Activity, label: 'Real-time Campus Analytics', color: 'text-sky-500' }
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-4 group cursor-default">
                       <div className={`w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 dark:border-white/5 group-hover:scale-110 transition-transform ${feat.color}`}>
                          <feat.icon size={20} />
                       </div>
                       <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{feat.label}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Form Side */}
         <div className="flex flex-col items-center animate-scale-in">
            <div className="premium-card w-full max-w-[440px] p-10 lg:p-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border-slate-100 dark:border-white/10 shadow-3xl flex flex-col items-center">
               <div className="lg:hidden mb-12 flex flex-col items-center">
                  <div className="w-16 h-16 accent-gradient-bg rounded-2xl flex items-center justify-center text-white shadow-xl mb-4">
                     <Zap size={32} fill="white" />
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Campus Hub</h1>
               </div>

               <div className="w-full text-center lg:text-left mb-10">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Access Node</h2>
                  <p className="text-slate-500 text-sm mt-1">Verify your credentials to synchronize data</p>
               </div>
               
               <form onSubmit={handleSubmit} className="w-full space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Symbolic Identifier</label>
                     <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-all" size={18} />
                        <input 
                          type="email" required
                          className="premium-input pl-14 py-4 text-sm shadow-inner"
                          placeholder="academic@domain.edu"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Authentication Key</label>
                     <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-all" size={18} />
                        <input 
                          type="password" required
                          className="premium-input pl-14 py-4 text-sm shadow-inner"
                          placeholder="••••••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="flex items-center justify-end">
                     <a href="#" className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-all uppercase tracking-widest">Restore Access?</a>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading || !formData.email || formData.password.length < 6}
                    className="premium-button w-full py-5 text-sm uppercase tracking-[0.3em] shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
                  >
                     {loading ? (
                        <div className="flex items-center justify-center gap-3">
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           <span>Verifying...</span>
                        </div>
                     ) : 'Establish Sync'}
                  </button>
               </form>

               <div className="mt-12 w-full pt-8 border-t border-slate-100 dark:border-white/5 text-center">
                  <p className="text-sm font-medium text-slate-500">
                     New Hub Member? <Link to="/register" className="text-indigo-500 font-bold hover:text-indigo-600 transition-all uppercase tracking-widest ml-1">Join Operation</Link>
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LoginPage;
