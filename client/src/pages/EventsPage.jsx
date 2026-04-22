import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
   Search, Plus, MapPin, Calendar, Clock, ArrowRight, X, Info, Camera, Trash2, ShieldCheck, Terminal, Upload, Sparkles, MoreHorizontal, MessageSquare, Heart, Bookmark, Smile, Minus, PlusSquare, Users, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getMediaUrl } from '../utils/media';

// Premium Experiences Hub for Campus Node Synchronization
const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '10:00 AM',
    location: '',
    type: 'Academic Hub'
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrationsModal, setRegistrationsModal] = useState({ show: false, users: [], eventName: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/academic/events');
      setEvents(data);
    } catch {
      console.error('Event retrieval failed');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.description || !eventForm.date) {
      toast.error('Event details incomplete');
      return;
    }
    
    try {
       let uploadedImageUrl = '';
       if (selectedFile) {
          const formData = new FormData();
          formData.append('file', selectedFile);
          const { data: uploadResp } = await axios.post('/api/upload', formData);
          uploadedImageUrl = uploadResp.url;
       }

       const eventData = {
          ...eventForm,
          image: uploadedImageUrl || imagePreview, // Use uploaded if exists, else fallback
          date: new Date(eventForm.date).toISOString()
       };

       const { data } = await axios.post('/api/academic/events', eventData);
       setEvents([data, ...events]);
       
       setShowCreateModal(false);
       setImagePreview(null);
       setSelectedFile(null);
       setEventForm({ title: '', description: '', date: '', time: '10:00 AM', location: '', type: 'Academic Hub' });
       
       toast.success('Event Established');
    } catch (error) {
       toast.error('Event creation failed');
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const { data } = await axios.post(`/api/academic/events/${eventId}/register`);
      toast.success(data.message || 'Registration complete');
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleViewRegistrants = async (event) => {
    try {
      const { data } = await axios.get(`/api/academic/events/${event._id}/registrations`);
      setRegistrationsModal({
        show: true,
        users: data,
        eventName: event.title
      });
    } catch (err) {
      toast.error('Failed to load registrants');
    }
  };

  const userRole = user?.role?.toLowerCase();
  const canCreate = userRole === 'faculty' || userRole === 'admin';

  return (
    <>
      <div className="max-w-[1240px] mx-auto px-4 py-16 animate-fade-in relative z-10">
        {/* Background Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] accent-gradient-bg opacity-5 blur-[120px] rounded-full -z-10 animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500 opacity-5 blur-[100px] rounded-full -z-10"></div>
        
        {/* Header - Premium Redesign */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-20 px-4">
           <div className="max-w-xl text-center md:text-left">
              <h2 className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                 Campus <span className="accent-gradient-text">Experiences</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
                 Sync with the latest academic symposiums, tech fests, and student-led workshops happening across our campuses.
              </p>
           </div>
           <button 
             onClick={() => {
                if (!user) return navigate('/login');
                if (!canCreate) {
                   return toast.error('Creation module restricted to Faculty Nodes');
                }
                setShowCreateModal(true);
             }}
             className="premium-button py-4 px-10 text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/20 group flex items-center gap-3"
           >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              {user ? (canCreate ? 'Organize Event' : 'Access Restricted') : 'Join to Organize'}
           </button>
        </div>

        {/* Modern Search Hub */}
        <div className="mb-20 max-w-2xl mx-auto px-4">
            <div className="relative group">
               <Search size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
               <input 
                 className="premium-input pl-16 py-5 text-base shadow-xl dark:shadow-none"
                 placeholder="Filter by venue, symposium title, or department..." 
               />
            </div>
        </div>

        {/* Events Grid - Premium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-[500px] bg-slate-50 dark:bg-white/5 rounded-[40px] animate-pulse"></div>)
          ) : events.length > 0 ? (
            events.map(event => (
              <div 
                 key={event._id} 
                 onClick={() => setSelectedEvent(event)}
                 className="premium-card group/card overflow-hidden flex flex-col bg-white dark:bg-slate-900 border-none h-full transition-transform hover:-translate-y-2 cursor-pointer"
              >
                 {/* Event Image - Immersive */}
                 <div className="h-64 overflow-hidden relative">
                    <img src={getMediaUrl(event.image || 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=800')} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover/card:opacity-40 transition-opacity"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                       <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/20">
                          {event.type || 'Academic sync'}
                       </span>
                    </div>
                    {/* Floating Date Badge */}
                    <div className="absolute top-6 right-6 w-14 h-14 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center shadow-xl border border-white/20">
                       <p className="text-indigo-600 font-black text-xl leading-none">
                          {new Date(event.date).getDate()}
                       </p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                       </p>
                    </div>
                 </div>

                 {/* Event Content Details */}
                 <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 rounded-xl campus-story-ring p-0.5">
                          <div className="w-full h-full rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-indigo-500 text-sm overflow-hidden border border-white dark:border-slate-900">
                             {event.organizer?.profilePic ? <img src={getMediaUrl(event.organizer.profilePic)} /> : event.organizer?.firstName?.[0] || 'A'}
                          </div>
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5">Organized by</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{event.organizer?.firstName} {event.organizer?.lastName || 'Campus Hub'}</p>
                       </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-4 group-hover/card:text-indigo-500 transition-colors">
                       {event.title}
                    </h3>
                    
                    <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-3 mb-8">
                       {event.description}
                    </p>
                    
                    <div className="mt-auto space-y-4 pt-6 border-t border-slate-100 dark:border-white/5">
                       <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                          <div className="flex items-center gap-2">
                             <MapPin size={16} className="text-indigo-500" />
                             <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <Clock size={16} className="text-indigo-500" />
                             <span>{event.time}</span>
                          </div>
                       </div>

                        <button 
                           onClick={(e) => { e.stopPropagation(); handleViewRegistrants(event); }}
                           className="w-full py-4 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-indigo-500 text-[11px] font-bold tracking-[0.2em] transition-all uppercase rounded-2xl flex items-center justify-center gap-2"
                        >
                           <Users size={16} /> 
                           {event.registrations?.length || 0} Registered Admissions
                        </button>

                        {!canCreate && (
                           <button 
                              onClick={(e) => { e.stopPropagation(); user ? handleRegister(event._id) : navigate('/login'); }}
                              disabled={event.registrations?.includes(user?._id)}
                              className={`w-full py-4 text-[11px] font-bold tracking-[0.2em] transition-all uppercase rounded-2xl shadow-xl active:scale-95 ${
                                 event.registrations?.includes(user?._id)
                                 ? 'bg-emerald-500/10 text-emerald-600 cursor-not-allowed border border-emerald-500/20 shadow-none'
                                 : 'accent-gradient-bg text-white shadow-indigo-500/20'
                              }`}
                           >
                              {event.registrations?.includes(user?._id) ? 'Confirmed Participation' : 'Claim Seat Now'}
                           </button>
                        )}
                    </div>
                 </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-40 flex flex-col items-center">
               <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300 mb-8 border border-dashed border-slate-300">
                  <Calendar size={40} />
               </div>
               <p className="text-2xl font-bold text-slate-400 uppercase tracking-widest">No Active Experiences</p>
               <p className="text-slate-500 mt-2 font-medium">Check back later for new campus symposiums.</p>
            </div>
          )}
        </div>
      </div>

      {/* Redesigned Creation Modal - Premium */}
      {showCreateModal && (
        <div className="modal-backdrop px-4 z-[200]">
           <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[40px] shadow-3xl overflow-hidden border border-slate-200 dark:border-white/10 animate-fade-in flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                 <button onClick={() => setShowCreateModal(false)} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 rounded-2xl hover:bg-slate-100 transition-all shadow-lg"><X size={28} /></button>
                 <h3 className="text-2xl font-bold dark:text-white">Organize Milestone</h3>
                 <button onClick={handleCreateEvent} className="premium-button py-3 px-8 text-xs uppercase tracking-widest">Establish Sync</button>
              </div>
              
              <div className="p-10 space-y-10 overflow-y-auto no-scrollbar">
                  {/* Full-width Image Selector */}
                  <div className="relative group/upload h-[300px] rounded-[30px] overflow-hidden border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-indigo-500/50 transition-all bg-slate-50 dark:bg-neutral-950 flex flex-col items-center justify-center">
                      {!imagePreview ? (
                         <label className="flex flex-col items-center gap-6 cursor-pointer p-10 text-center">
                            <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-500 mb-2">
                               <Camera size={40} />
                            </div>
                            <div>
                               <p className="text-xl font-bold text-slate-900 dark:text-white">Event Poster</p>
                               <p className="text-sm text-slate-500 mt-1 max-w-[280px]">High-resolution landscape visuals recommended for symposium visibility</p>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            <div className="mt-2 px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-500/20 transition-all uppercase tracking-widest">Design Asset</div>
                         </label>
                      ) : (
                         <div className="w-full h-full relative group/preview">
                            <img src={imagePreview} className="w-full h-full object-cover" />
                            <button onClick={() => setImagePreview(null)} className="absolute top-6 right-6 p-4 bg-black/60 text-white rounded-2xl hover:bg-black transition-all shadow-2xl backdrop-blur-md border border-white/10 animate-fade-in"><Trash2 size={24} /></button>
                         </div>
                      )}
                  </div>

                  <div className="grid gap-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Symbolic Title</label>
                           <input 
                             placeholder="e.g. Annual Tech Symposium 2026"
                             className="premium-input py-4 pr-4" 
                             value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Operational Venue</label>
                           <input 
                             placeholder="Central Library / Main Auditorium"
                             className="premium-input py-4 pr-4" 
                             value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})}
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2 focus-within:text-indigo-500 transition-colors">
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                              <Calendar size={14} /> Sync Date
                           </label>
                           <input 
                             type="date"
                             className="premium-input py-4 pr-4 uppercase italic" 
                             value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})}
                           />
                        </div>
                        <div className="space-y-2 focus-within:text-indigo-500 transition-colors">
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                              <Clock size={14} /> Start Time
                           </label>
                           <input 
                             placeholder="10:30 AM"
                             className="premium-input py-4 pr-4" 
                             value={eventForm.time} onChange={e => setEventForm({...eventForm, time: e.target.value})}
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Mission Narrative</label>
                        <textarea 
                          placeholder="Outline the core objective and learning outcomes of this experience..."
                          className="premium-input min-h-[160px] resize-none py-6 leading-relaxed" 
                          value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})}
                        />
                     </div>
                  </div>
              </div>
           </div>
        </div>
      )}

      {/* Registrations List Modal - Premium */}
      {registrationsModal.show && (
         <div className="modal-backdrop px-4 z-[200]">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] shadow-3xl overflow-hidden border border-slate-200 dark:border-white/10 animate-fade-in flex flex-col">
               <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                  <div className="w-12"></div>
                  <h3 className="text-xl font-bold dark:text-white truncate max-w-xs">{registrationsModal.eventName}</h3>
                  <button onClick={() => setRegistrationsModal({ show: false, users: [], eventName: '' })} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 rounded-2xl hover:bg-slate-100 transition-all shadow-lg"><X size={24} /></button>
               </div>
               <div className="p-8 max-h-[60vh] overflow-y-auto no-scrollbar space-y-4 bg-white dark:bg-slate-900">
                  <div className="flex items-center justify-between p-4 bg-indigo-500/5 rounded-3xl border border-indigo-500/10 mb-4">
                     <p className="text-sm font-bold text-indigo-500 uppercase tracking-[0.2em]">Total Admitted</p>
                     <p className="text-2xl font-black text-indigo-600">{registrationsModal.users.length}</p>
                  </div>
                  
                  {registrationsModal.users.length === 0 ? (
                     <div className="py-20 text-center opacity-20">
                        <Users size={64} className="mx-auto mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest">No synchronization found</p>
                     </div>
                  ) : (
                     registrationsModal.users.map(u => (
                        <div key={u._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-3xl border border-transparent hover:border-indigo-500/30 transition-all group">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center font-bold text-indigo-500 text-lg shadow-md border border-slate-100 dark:border-white/5">
                                 {u.firstName?.[0]}
                              </div>
                              <div>
                                 <p className="text-base font-bold text-slate-900 dark:text-white leading-none mb-1">{u.firstName} {u.lastName}</p>
                                 <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{u.branch || 'Degree Pending'}</p>
                              </div>
                           </div>
                           <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
                              <ShieldCheck size={20} />
                           </div>
                        </div>
                     ))
                  )}
               </div>
            </div>
         </div>
      )}
      {/* Event Details Modal - Premium */}
      {selectedEvent && (
         <div className="modal-backdrop px-4 z-[200]">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-3xl overflow-hidden border border-slate-200 dark:border-white/10 animate-fade-in flex flex-col max-h-[90vh]">
               <div className="h-[300px] sm:h-[400px] relative shrink-0 bg-slate-100 dark:bg-black">
                  <img src={getMediaUrl(selectedEvent.image || 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=800')} className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                  <button onClick={() => setSelectedEvent(null)} className="absolute top-6 right-6 w-12 h-12 bg-black/40 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-black/60 transition-all z-40 outline-none border border-white/10 shadow-2xl"><X size={24} /></button>
                  <div className="absolute bottom-8 left-10 right-10 z-30 pointer-events-none">
                     <h3 className="text-3xl font-black text-white leading-tight drop-shadow-2xl">{selectedEvent.title}</h3>
                     <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em] mt-2 drop-shadow-md flex items-center gap-2">
                        <Activity size={12} /> {selectedEvent.type || 'Mission Node'}
                     </p>
                  </div>
               </div>
               
               <div className="p-8 space-y-8 overflow-y-auto no-scrollbar">
                  <div className="flex flex-wrap gap-8 items-center border-b border-slate-100 dark:border-white/5 pb-8">
                     <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-indigo-500" />
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Date</p>
                           <p className="text-[14px] font-bold text-slate-900 dark:text-white">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 border-l border-slate-100 dark:border-white/5 pl-8">
                        <Clock size={18} className="text-indigo-500" />
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Time</p>
                           <p className="text-[14px] font-bold text-slate-900 dark:text-white">{selectedEvent.time}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 border-l border-slate-100 dark:border-white/5 pl-8">
                        <MapPin size={18} className="text-indigo-500" />
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Venue</p>
                           <p className="text-[14px] font-bold text-slate-900 dark:text-white">{selectedEvent.location}</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">About the Experience</h4>
                     <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-normal whitespace-pre-wrap">{selectedEvent.description}</p>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl campus-story-ring p-0.5">
                           <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center font-bold text-indigo-500 overflow-hidden">
                              {selectedEvent.organizer?.profilePic ? <img src={getMediaUrl(selectedEvent.organizer.profilePic)} /> : selectedEvent.organizer?.firstName?.[0]}
                           </div>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Organized By</p>
                           <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedEvent.organizer?.firstName} {selectedEvent.organizer?.lastName}</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => handleViewRegistrants(selectedEvent)}
                        className="bg-indigo-500/10 text-indigo-600 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-2"
                     >
                        <Users size={16} /> 
                        {selectedEvent.registrations?.length || 0} Joined
                     </button>
                  </div>

                  {!canCreate && (
                     <button 
                        onClick={() => user ? handleRegister(selectedEvent._id) : navigate('/login')}
                        disabled={selectedEvent.registrations?.includes(user?._id)}
                        className={`w-full py-5 rounded-2xl text-[12px] font-bold tracking-[0.2em] transition-all uppercase shadow-2xl ${
                           selectedEvent.registrations?.includes(user?._id)
                           ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                           : 'accent-gradient-bg text-white shadow-indigo-500/20 active:scale-95'
                        }`}
                     >
                        {selectedEvent.registrations?.includes(user?._id) ? 'Seat Reserved' : 'Secure Admission Now'}
                     </button>
                  )}
               </div>
            </div>
         </div>
      )}
    </>
  );
};

export default EventsPage;
