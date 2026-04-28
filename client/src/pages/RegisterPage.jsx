import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Zap, ShieldCheck, Activity, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await register(formData);
      if (success) {
        toast.success('Identity Created - Welcome to the Hub');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 relative overflow-hidden font-sans">
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
                  Join The <br /><span className="accent-gradient-text text-8xl italic">Hub</span>
               </h1>
            </div>
            <p className="text-3xl font-medium text-slate-400 max-w-lg leading-relaxed">
               Create your symbolic identifier and enter the academic ecosystem.
            </p>
         </div>

         {/* FORM SIDE */}
         <div className="flex flex-col items-center animate-scale-in">
            <div className="premium-card w-full max-w-[540px] p-10 lg:p-14 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
               
               <div className="w-full mb-10">
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Initialize Identity</h2>
                  <p className="text-slate-500 font-medium text-lg">Define your parameters</p>
               </div>
               
               <form onSubmit={handleSubmit} className="w-full space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">First Name</label>
                        <input 
                          type="text" required
                          className="premium-input bg-black/40 border-white/5 py-4"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Last Name</label>
                        <input 
                          type="text" required
                          className="premium-input bg-black/40 border-white/5 py-4"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Identifier</label>
                     <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-all" size={18} />
                        <input 
                          type="email" required
                          className="premium-input pl-16 bg-black/40 border-white/5 py-4"
                          placeholder="academic@hub.edu"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Secure Key</label>
                     <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-all" size={18} />
                        <input 
                          type="password" required
                          className="premium-input pl-16 bg-black/40 border-white/5 py-4"
                          placeholder="••••••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Sector Role</label>
                     <select 
                       className="premium-input bg-black/40 border-white/5 py-4 appearance-none"
                       value={formData.role}
                       onChange={(e) => setFormData({...formData, role: e.target.value})}
                     >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Administrator</option>
                     </select>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="premium-button w-full py-5 text-sm uppercase tracking-[0.4em] shadow-2xl active:scale-[0.98] mt-4"
                  >
                     {loading ? 'Processing...' : 'Complete Operation'}
                  </button>
               </form>

               <div className="mt-12 w-full pt-8 border-t border-white/5 text-center">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                     Already Registered? <Link to="/login" className="text-indigo-400 font-black hover:text-indigo-300 transition-all ml-2 underline underline-offset-8">Establish Sync</Link>
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default RegisterPage;
