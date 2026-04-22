import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Plus, Search, MoreHorizontal, Sparkles, Heart, MessageSquare, ShieldCheck, 
  UserPlus, ChevronRight, LayoutGrid, Info, Calendar, MapPin, X, Terminal, Activity, User, Mail, ShieldAlert, CheckCircle2, UserCheck, Zap, Briefcase, GraduationCap, ArrowRight, Target, Bookmark, Smile, PlusSquare, Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { getMediaUrl } from '../utils/media';

const StudyGroups = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('clubs');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalType, setModalType] = useState('Club'); 
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  
  const [clubs, setClubs] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'committees') {
      setActiveTab('committees');
    }
  }, [location.search]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'clubs') {
        const { data } = await axios.get('/api/academic/clubs');
        setClubs(data);
      } else {
        const { data } = await axios.get('/api/academic/committees');
        setCommittees(data);
      }
    } catch (error) {
       console.error('Data retrieval failed');
       setClubs([]);
       setCommittees([]);
    } finally {
      setLoading(false);
    }
  };

  const [committeeForm, setCommitteeForm] = useState({
    name: '',
    description: '',
    department: 'Computer Science',
    head: '',
    incharge: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleJoinClub = async (id) => {
    try {
       await axios.post(`/api/academic/clubs/${id}/join`);
       toast.success(`Success`);
       fetchData();
    } catch (error) {
       toast.error('Could not join');
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!committeeForm.name.trim() || !committeeForm.description.trim()) {
        toast.error('Details incomplete');
        return;
    }
    
    try {
       const endpoint = activeTab === 'clubs' ? '/api/academic/clubs' : '/api/academic/committees';
       let logoUrl = '';
       if (logoFile) {
          const formData = new FormData();
          formData.append('file', logoFile);
          const { data: uploadData } = await axios.post('/api/upload', formData);
          logoUrl = uploadData.url;
       }

       const payload = { ...committeeForm, logo: logoUrl };
       const { data } = await axios.post(endpoint, payload);
       
       toast.success(`${committeeForm.name} Created!`);
       setShowCreateModal(false);
       setCommitteeForm({ name: '', description: '', department: 'Computer Science', head: '', incharge: '' });
       setLogoFile(null);
       setLogoPreview(null);
       fetchData();
    } catch (error) {
       toast.error('Creation failed');
    }
  };

  const userRole = user?.role?.toLowerCase();
  const canAccessCreation = userRole === 'faculty' || userRole === 'admin';

  return (
    <>
      <div className="max-w-[1020px] mx-auto px-4 py-8 sm:py-16 animate-fade-in relative z-10 h-screen overflow-y-auto no-scrollbar">
        <div className="absolute inset-0 bg-white dark:bg-black pointer-events-none"></div>
        
        {/* Header (Instagram Style) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-12 sm:mb-20 px-4 relative z-10">
           <div className="flex flex-col text-center sm:text-left">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight uppercase leading-none">Clubs & <span className="text-sky-500">Committees</span></h2>
              <p className="text-[14px] text-slate-400 font-medium uppercase tracking-[0.2em] mt-4 flex items-center justify-center sm:justify-start gap-4">
                 Real-Time Discovery Protocol v9.3
              </p>
           </div>
           <button 
             onClick={() => {
                if (!user) return navigate('/login');
                if (!canAccessCreation) {
                  return toast.error('Creation restricted to Faculty Nodes', {
                      style: { borderRadius: '12px', background: '#000', color: '#fff', fontSize: '11px', fontWeight: '700' }
                  });
                }
                setModalType(activeTab === 'clubs' ? 'Club' : 'Committee');
                setShowCreateModal(true);
             }}
             className="bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl text-[14px] font-bold tracking-tight hover:opacity-80 transition-all shadow-md active:scale-95"
           >
              <PlusSquare size={20} strokeWidth={2.5} className="inline mr-3" /> {user ? (canAccessCreation ? `Create ${activeTab === 'clubs' ? 'Club' : 'Committee'}` : 'Module Restricted') : 'Join to Create'}
           </button>
        </div>

        {/* Filter Tabs (Instagram Style) */}
        <div className="flex gap-12 mb-12 border-b border-slate-100 dark:border-white/10 px-4 overflow-x-auto no-scrollbar relative z-10 justify-center sm:justify-start">
           {['clubs', 'committees'].map(tab => (
              <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-3 text-[14px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white' : 'text-slate-400 hover:text-slate-600'}`}
              >
                  {tab}
              </button>
           ))}
        </div>

        {/* Search Interaction */}
        <div className="mb-12 relative group z-10 px-4">
            <Search size={22} className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
            <input className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full pl-16 pr-8 py-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400 uppercase tracking-widest shadow-sm" placeholder={`Search for real-time campus ${activeTab}...`} />
        </div>

        {/* Grid Content */}
        {activeTab === 'clubs' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-14 px-4 relative z-10 h-fit pb-32">
              {loading ? (
                  [1,2,3].map(i => <div key={i} className="h-96 bg-slate-50 dark:bg-white/5 rounded-xl animate-pulse"></div>)
              ) : clubs.length > 0 ? (
                  clubs.map(club => (
                      <div key={club._id} className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden flex flex-col group/card hover:shadow-2xl transition-all duration-300 relative animate-slide-up h-fit">
                          {/* Club Card Header (Like IG post header) */}
                          <div className="p-3 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-sky-500 text-xs uppercase">{club.name?.[0] || 'C'}</div>
                                <div>
                                   <p className="text-[13px] font-bold text-slate-900 dark:text-white lowercase leading-tight">campus_club_node</p>
                                   <p className="text-[11px] text-slate-500 opacity-80 leading-tight italic">{club.category || 'Academic'}</p>
                                </div>
                             </div>
                             <MoreHorizontal size={20} className="text-slate-400 cursor-pointer" />
                          </div>

                          {/* Club Image Area */}
                          <div className="h-64 sm:h-72 overflow-hidden relative group/img">
                              <img src={getMediaUrl(club.image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800')} alt={club.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                              <div className="absolute top-4 left-4 bg-sky-500 text-white px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest italic shadow-xl rotate-3 border border-white/20">
                                  ACTIVE HUB
                              </div>
                          </div>

                          {/* Standard IG Icons */}
                          <div className="p-4 border-b border-slate-100 dark:border-white/5 flex gap-4">
                             <Heart size={24} className="text-slate-900 dark:text-white hover:opacity-50 transition-all cursor-pointer" />
                             <MessageSquare size={24} className="text-slate-900 dark:text-white hover:opacity-50 transition-all cursor-pointer" />
                             <Bookmark size={24} className="ml-auto text-slate-900 dark:text-white hover:opacity-50 transition-all cursor-pointer" />
                          </div>

                          <div className="p-4 space-y-4 flex-1 flex flex-col overflow-hidden">
                              <p className="text-[13px] font-bold text-slate-900 dark:text-white lowercase">{club.members?.length || 0} nodes followed</p>
                              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white tracking-tight uppercase leading-tight group-hover:text-sky-500 transition-colors truncate">{club.name}</h3>
                              <button 
                                onClick={() => user ? handleJoinClub(club._id) : navigate('/login')}
                                className={`w-full py-2 rounded-lg font-bold text-sm uppercase tracking-widest transition-all italic border ${
                                  club.members?.includes(user?._id) 
                                  ? 'bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10' 
                                  : 'bg-sky-500 text-white border-transparent hover:opacity-80 active:scale-95 shadow-md'
                                }`}
                              >
                                 {club.members?.includes(user?._id) ? 'Followed' : 'Follow Hub'}
                              </button>
                          </div>
                      </div>
                  ))
              ) : (
                  <div className="col-span-1 md:col-span-3 py-24 text-center opacity-40 flex flex-col items-center">
                     <Target size={64} className="mb-4 text-slate-400" />
                     <p className="text-lg font-bold uppercase tracking-widest text-slate-400">No Hubs Found</p>
                  </div>
              )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 px-4 relative z-10 h-fit pb-32">
              {loading ? (
                  [1,2].map(i => <div key={i} className="h-40 bg-slate-50 dark:bg-white/5 rounded-xl animate-pulse"></div>)
              ) : committees.length > 0 ? (
                  committees.map(committee => (
                      <div key={committee._id} className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between group transition-all duration-300 hover:bg-slate-50 dark:hover:bg-white/5 relative overflow-hidden animate-slide-up shadow-sm">
                          <div className="flex-1 space-y-4">
                              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-sky-500 italic flex items-center gap-3">
                                 <ShieldCheck size={18} /> Administrative Council
                              </span>
                              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight uppercase leading-tight">{committee.name}</h3>
                              <p className="text-sm font-normal text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl italic opacity-90 line-clamp-2">"{committee.description}"</p>
                          </div>
                          <div className="flex items-center gap-8 mt-6 sm:mt-0 pt-6 sm:pt-0 sm:border-l border-slate-100 dark:border-white/5 sm:pl-10">
                              <button 
                                onClick={() => setSelectedCommittee(committee)}
                                className="px-8 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg font-bold text-[13px] uppercase tracking-widest transition-all hover:opacity-80 active:scale-95 shadow-md"
                              >
                                 DETAILS <ArrowRight size={20} strokeWidth={4} className="inline ml-3" />
                              </button>
                          </div>
                      </div>
                  ))
              ) : (
                  <div className="py-24 text-center opacity-40 flex flex-col items-center">
                     <Target size={64} className="mb-4 text-slate-400" />
                     <p className="text-lg font-bold uppercase tracking-widest text-slate-400">No Councils Found</p>
                  </div>
              )}
          </div>
        )}
      </div>

      {/* VIEW DETAILS MODAL (Standard IG Template) */}
      {selectedCommittee && (
        <div className="modal-backdrop px-4">
           <div className="bg-white dark:bg-black w-full max-w-2xl rounded-2xl shadow-3xl overflow-hidden border border-slate-200 dark:border-white/10 animate-scale-in">
              <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-white dark:bg-black sticky top-0 z-10">
                 <button onClick={() => setSelectedCommittee(null)} className="hover:opacity-50"><X size={28} /></button>
                 <h3 className="text-[16px] font-bold">Details: {selectedCommittee.name}</h3>
                 <div className="w-8"></div>
              </div>
              
              <div className="p-10 space-y-12 max-h-[85vh] overflow-y-auto no-scrollbar">
                 <div className="flex flex-col sm:flex-row gap-8 items-start border-b border-slate-100 dark:border-white/5 pb-8">
                     <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0 flex items-center justify-center">
                        {selectedCommittee.logo ? <img src={getMediaUrl(selectedCommittee.logo)} className="w-full h-full object-cover" /> : <ShieldCheck size={40} className="text-sky-500 opacity-50" />}
                     </div>
                     <div className="flex-1 space-y-4">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-2">Mission Objective</h4>
                        <p className="text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed italic opacity-95">"{selectedCommittee.description}"</p>
                     </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 border-b border-slate-100 dark:border-white/5 pb-8">
                    <div className="space-y-6">
                       <h4 className="text-[11px] font-bold text-sky-500 uppercase tracking-widest pl-2">Committee Head</h4>
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-sky-500 text-xs shadow-sm">H</div>
                          <div>
                             <p className="text-[13px] font-bold text-slate-900 dark:text-white lowercase leading-none">{selectedCommittee.head || 'pending_assignment'}</p>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h4 className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest pl-2">Faculty In-Charge</h4>
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-emerald-500 text-xs shadow-sm">I</div>
                          <p className="text-[13px] font-bold text-slate-900 dark:text-white lowercase leading-none">{selectedCommittee.incharge || 'pending_assignment'}</p>
                       </div>
                    </div>
                 </div>
                 
                 {/* Hub Integration */}
                 {selectedCommittee.chatGroup && (
                     <div className="pt-4 flex justify-between items-center text-slate-900 dark:text-white">
                         <div className="flex flex-col gap-1">
                             <span className="text-[11px] font-bold text-purple-500 uppercase tracking-[0.3em]">Communication Array</span>
                             <span className="text-[13px] font-bold text-slate-500 italic">Peer-to-Peer Encrypted Form</span>
                         </div>
                         <button onClick={() => window.location.href='/chats'} className="px-6 py-2 border-2 border-slate-900 dark:border-white rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                             Join Sync
                         </button>
                     </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* CREATE HUB MODAL (Standard IG Template) */}
      {showCreateModal && (
        <div className="modal-backdrop px-4">
           <div className="bg-white dark:bg-black w-full max-w-2xl rounded-2xl shadow-3xl overflow-hidden border border-slate-200 dark:border-white/10 animate-scale-in">
              <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-white dark:bg-black sticky top-0 z-10">
                 <button onClick={() => setShowCreateModal(false)} className="hover:opacity-50"><X size={28} /></button>
                 <h3 className="text-[16px] font-bold">New {modalType}</h3>
                 <button onClick={handleSubmit} className="text-sky-500 font-bold text-[14px] hover:text-slate-900 dark:hover:text-white transition-all">Create</button>
              </div>
              
              <div className="p-8 space-y-10 max-h-[85vh] overflow-y-auto no-scrollbar">
                 {/* Visual Selector for Identity Logo */}
                 <div className="w-24 h-24 mx-auto rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center relative group/logo cursor-pointer overflow-hidden">
                    <input type="file" accept="image/*" className="hidden" id="hub-logo-upload" onChange={handleLogoChange} />
                    <label htmlFor="hub-logo-upload" className="absolute inset-0 z-10 cursor-pointer"></label>
                    {!logoPreview ? (
                        <div className="flex flex-col items-center opacity-50 group-hover/logo:opacity-100 transition-opacity">
                            <Plus size={24} />
                            <span className="text-[10px] uppercase font-bold tracking-widest mt-1">Logo</span>
                        </div>
                    ) : (
                        <img src={logoPreview} className="w-full h-full object-cover" />
                    )}
                 </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-2">Hub Name</label>
                            <input 
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-400 shadow-inner" 
                                placeholder="Enter identifier..." 
                                value={committeeForm.name}
                                onChange={e => setCommitteeForm({...committeeForm, name: e.target.value})}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-2">Department</label>
                            <select 
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm font-bold outline-none transition-all uppercase appearance-none cursor-pointer shadow-inner"
                                value={committeeForm.department}
                                onChange={e => setCommitteeForm({...committeeForm, department: e.target.value})}
                            >
                                <option>Computer Science</option>
                                <option>Information Technology</option>
                                <option>Mechanical Engineering</option>
                                <option>Administrative</option>
                            </select>
                        </div>
                    </div>

                    {modalType === 'Committee' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-slate-100 dark:border-white/5 pt-8">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-2">Committee Head</label>
                                <input 
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-400 shadow-inner" 
                                    placeholder="Enter commander..." 
                                    value={committeeForm.head}
                                    onChange={e => setCommitteeForm({...committeeForm, head: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-2">Faculty In-Charge</label>
                                <input 
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-400 shadow-inner" 
                                    placeholder="Enter faculty controller..." 
                                    value={committeeForm.incharge}
                                    onChange={e => setCommitteeForm({...committeeForm, incharge: e.target.value})}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2 pt-4">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-2">Objective Overview</label>
                        <textarea 
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-8 py-6 text-sm font-medium outline-none transition-all resize-none min-h-[160px] italic shadow-inner placeholder:text-slate-400" 
                            placeholder="Describe the operational objectives..."
                            value={committeeForm.description}
                            onChange={e => setCommitteeForm({...committeeForm, description: e.target.value})}
                        />
                    </div>
                </form>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default StudyGroups;
