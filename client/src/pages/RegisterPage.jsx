import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Zap, Users, Briefcase, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'student',
    branch: 'Computer Engineering'
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
        toast.success('Identity Established - Welcome to the Hub');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration Synchronicity Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 p-6 relative overflow-hidden font-sans">
      {/* Immersive Background Effects */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] rounded-full -translate-y-1/2 -translate-x-1/2 -z-10 animate-pulse-glow"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-sky-500/5 blur-[120px] rounded-full translate-y-1/2 translate-x-1/2 -z-10"></div>
      
      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
         {/* Branding Side */}
         <div className="hidden lg:flex flex-col space-y-12 animate-fade-in order-last lg:order-first">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 accent-gradient-bg rounded-[24px] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20">
                  <Zap size={36} fill="white" strokeWidth={0} />
               </div>
               <h1 className="text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                  Join the <br /><span className="accent-gradient-text text-7xl italic">Circuit</span>
               </h1>
            </div>
            
            <div className="space-y-8">
               <p className="text-2xl font-medium text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                  Establish your unique academic identity. <br />
                  Secure. Verified. Global.
               </p>
               
               <div className="grid grid-cols-1 gap-6">
                  {[
                    { icon: GraduationCap, label: 'Degree Tracking & Insights', color: 'text-emerald-500' },
                    { icon: Users, label: 'Community Societies', color: 'text-sky-500' },
                    { icon: Briefcase, label: 'Campus Placement Sync', color: 'text-indigo-500' }
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
            <div className="premium-card w-full max-w-[500px] p-8 lg:p-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border-slate-100 dark:border-white/10 shadow-3xl flex flex-col items-center">
               <div className="lg:hidden mb-10 flex flex-col items-center">
                  <div className="w-14 h-14 accent-gradient-bg rounded-2xl flex items-center justify-center text-white shadow-xl mb-3">
                     <Zap size={28} fill="white" />
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Campus Hub</h1>
               </div>

               <div className="w-full text-center lg:text-left mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Identity Registry</h2>
                  <p className="text-slate-500 text-sm mt-1">Configure your academic node parameters</p>
               </div>
               
               <form onSubmit={handleSubmit} className="w-full space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">First Name</label>
                        <input 
                          type="text" required
                          className="premium-input py-3.5 text-sm shadow-inner"
                          placeholder="Alan"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Last Name</label>
                        <input 
                          type="text" required
                          className="premium-input py-3.5 text-sm shadow-inner"
                          placeholder="Turing"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Institutional Email</label>
                     <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-all" size={16} />
                        <input 
                          type="email" required
                          className="premium-input pl-12 py-3.5 text-sm shadow-inner"
                          placeholder="id@institution.edu"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Secure Passkey</label>
                     <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-all" size={16} />
                        <input 
                          type="password" required
                          className="premium-input pl-12 py-3.5 text-sm shadow-inner"
                          placeholder="••••••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Role Classification</label>
                        <select 
                          className="premium-input py-3.5 text-sm appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-10"
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                           <option value="student">Student Node</option>
                           <option value="faculty">Faculty Node</option>
                           <option value="admin">Administrator</option>
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Branch/Dept</label>
                        <select 
                          className="premium-input py-3.5 text-sm appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-10"
                          value={formData.branch}
                          onChange={(e) => setFormData({...formData, branch: e.target.value})}
                        >
                           <option value="Computer Engineering">Computer Engineering</option>
                           <option value="Information Technology Engineering">Information Technology Engineering</option>
                           <option value="Civil Engineering">Civil Engineering</option>
                           <option value="Mechanical Engineering">Mechanical Engineering</option>
                           <option value="EXTC Engineering">EXTC Engineering</option>
                           <option value="Others">Others</option>
                        </select>
                     </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading || !formData.email || formData.password.length < 6}
                    className="premium-button w-full py-4 text-sm uppercase tracking-[0.3em] shadow-xl shadow-indigo-500/20 active:scale-[0.98] mt-4"
                  >
                     {loading ? (
                        <div className="flex items-center justify-center gap-3">
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           <span>Processing...</span>
                        </div>
                     ) : 'Register Identity'}
                  </button>

                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mt-6">
                     By registering you accept the <span className="text-indigo-500">Academic Protocol</span>
                  </p>
               </form>

               <div className="mt-10 w-full pt-8 border-t border-slate-100 dark:border-white/5 text-center">
                  <p className="text-sm font-medium text-slate-500">
                     Already Registered? <Link to="/login" className="text-indigo-500 font-bold hover:text-indigo-600 transition-all uppercase tracking-widest ml-1">Log in</Link>
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default RegisterPage;
