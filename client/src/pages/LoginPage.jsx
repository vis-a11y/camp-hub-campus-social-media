import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Zap, ShieldCheck, Activity, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        toast.success('Access Granted - Synchronizing Session');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Identity Verification Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 relative overflow-hidden font-sans">
      {/* IMMERSIVE BG EFFECTS */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-indigo-500/10 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10 animate-pulse-glow"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2 -z-10"></div>
      
      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
         {/* BRANDING SIDE */}
         <div className="hidden lg:flex flex-col space-y-12 animate-fade-in">
            <div className="flex items-center gap-8">
               <div className="w-20 h-20 accent-gradient-bg rounded-[28px] flex items-center justify-center text-white shadow-[0_0_50px_rgba(99,102,241,0.3)] rotate-3">
                  <Zap size={44} fill="white" strokeWidth={0} />
               </div>
               <h1 className="text-7xl font-black text-white uppercase tracking-tighter leading-none">
                  Campus <br /><span className="accent-gradient-text text-8xl italic">Hub</span>
               </h1>
            </div>
            
            <div className="space-y-10">
               <p className="text-3xl font-medium text-slate-400 max-w-lg leading-relaxed">
                  The ultimate academic ecosystem. <br />
                  Connect. Sync. Evolve.
               </p>
               
               <div className="flex flex-col gap-8">
                  {[
                    { icon: ShieldCheck, label: 'Identity Protection v4.0', color: 'text-emerald-500' },
                    { icon: Activity, label: 'Real-time Campus Analytics', color: 'text-sky-500' }
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-6 group cursor-default">
                       <div className={`w-14 h-14 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-all ${feat.color}`}>
                          <feat.icon size={24} />
                       </div>
                       <span className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">{feat.label}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* FORM SIDE */}
         <div className="flex flex-col items-center animate-scale-in">
            <div className="premium-card w-full max-w-[480px] p-12 lg:p-16 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
               
               <div className="w-full mb-12">
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Access Node</h2>
                  <p className="text-slate-500 font-medium text-lg">Verify credentials to begin sync</p>
               </div>
               
               <form onSubmit={handleSubmit} className="w-full space-y-8">
                  <div className="space-y-3">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Symbolic Identifier</label>
                     <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-all" size={20} />
                        <input 
                          type="email" required
                          className="premium-input pl-16 py-5 bg-black/40 border-white/5 text-lg"
                          placeholder="academic@hub.edu"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Authentication Key</label>
                     <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-all" size={20} />
                        <input 
                          type="password" required
                          className="premium-input pl-16 py-5 bg-black/40 border-white/5 text-lg"
                          placeholder="••••••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="flex items-center justify-end">
                     <button type="button" className="text-xs font-black text-indigo-400 hover:text-indigo-300 transition-all uppercase tracking-widest">Restore Access?</button>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading || !formData.email || formData.password.length < 6}
                    className="premium-button w-full py-6 text-sm uppercase tracking-[0.4em] shadow-2xl active:scale-[0.98] mt-4"
                  >
                     {loading ? (
                        <div className="flex items-center justify-center gap-4">
                           <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                           <span>Establishing...</span>
                        </div>
                     ) : (
                       <div className="flex items-center justify-center gap-3">
                          <span>Establish Sync</span>
                          <Send size={18} />
                       </div>
                     )}
                  </button>
               </form>

               <div className="mt-16 w-full pt-10 border-t border-white/5 text-center">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                     New Hub Member? <Link to="/register" className="text-indigo-400 font-black hover:text-indigo-300 transition-all ml-2 underline underline-offset-8">Join Operation</Link>
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LoginPage;
