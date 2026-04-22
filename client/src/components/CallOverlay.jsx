import React, { useState, useEffect } from 'react';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff, Maximize2, Minimize2, Camera, RefreshCcw, Smile, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMediaUrl } from '../utils/media';

const CallOverlay = ({ isOpen, type, contact, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    let interval;
    if (isOpen) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`fixed z-[1000] transition-all duration-500 ${
          isMinimized 
          ? 'bottom-32 right-8 w-64 h-48 rounded-3xl overflow-hidden shadow-2xl border-2 border-indigo-500/50' 
          : 'inset-0 bg-slate-950 flex flex-col items-center justify-center'
        }`}
      >
        {/* Deep Atmosphere Background for Video */}
        {type === 'video' && !isVideoOff && (
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-black overflow-hidden">
              {/* Mock Video Stream */}
              <div className="w-full h-full opacity-60 bg-[url('https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=1200')] bg-cover bg-center animate-pulse-slow"></div>
              <div className="absolute inset-0 backdrop-blur-[20px] bg-slate-950/40"></div>
           </div>
        )}

        {/* Dynamic Header */}
        <div className={`absolute top-0 left-0 right-0 p-8 flex justify-between items-start z-10 ${isMinimized ? 'p-4' : ''}`}>
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl flex items-center justify-center">
                 {contact?.profilePic ? (
                   <img 
                     src={getMediaUrl(contact.profilePic)} 
                     className="w-full h-full object-cover" 
                     alt="" 
                     onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${contact.firstName}+${contact.lastName}&background=6366f1&color=fff&bold=true`; }}
                   />
                 ) : (
                   <div className="w-full h-full bg-slate-800 flex items-center justify-center text-sky-500 font-bold">{contact?.firstName?.[0]}</div>
                 )}
              </div>
              <div className={isMinimized ? 'hidden' : 'block'}>
                 <h2 className="text-white font-bold text-xl lowercase">{contact?.firstName}_{contact?.lastName?.toLowerCase()}</h2>
                 <p className="text-indigo-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
                    {type === 'video' ? 'Encrypted Video Link' : 'Secure Audio Node'}
                 </p>
              </div>
           </div>
           
           <div className="flex gap-4">
              <button onClick={() => setIsMinimized(!isMinimized)} className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all">
                 {isMinimized ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
              </button>
           </div>
        </div>

        {/* Central Display */}
        {!isMinimized && (
           <div className="relative flex flex-col items-center gap-8 mt-20">
              {/* Profile Orb */}
              <div className="relative group">
                 <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-[40px] overflow-hidden border-4 border-indigo-500/30 shadow-3xl transform group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                    {contact?.profilePic ? (
                      <img 
                        src={getMediaUrl(contact.profilePic)} 
                        className="w-full h-full object-cover" 
                        alt="" 
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${contact.firstName}+${contact.lastName}&background=6366f1&color=fff&bold=true`; }}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-4xl font-bold text-sky-500 uppercase italic transition-all">{contact?.firstName?.[0]}</div>
                    )}
                 </div>
                 {/* Audio Pulse Visualizer */}
                 <div className="absolute -inset-8">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`absolute inset-0 border-2 border-indigo-500/20 rounded-[60px] animate-ping-slow`} style={{ animationDelay: `${i * 1.5}s` }}></div>
                    ))}
                 </div>
              </div>

              <div className="text-center space-y-2">
                 <p className="text-white/60 text-lg font-medium tracking-tight bg-white/5 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">{formatTime(timer)}</p>
              </div>
           </div>
        )}

        {/* Self View (Video Call) */}
        {type === 'video' && !isMinimized && (
           <div className="absolute bottom-32 right-12 w-48 h-64 rounded-3xl border-2 border-white/20 shadow-2xl overflow-hidden bg-slate-900 z-20 group">
              {isVideoOff ? (
                 <div className="w-full h-full flex items-center justify-center text-white/20">
                    <VideoOff size={48} />
                 </div>
              ) : (
                 <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1522071823991-b9671f9d7f1f?w=400')] bg-cover bg-center"></div>
              )}
              <div className="absolute bottom-4 left-4 right-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="p-2 bg-black/40 backdrop-blur-md rounded-xl text-white"><RefreshCcw size={16} /></button>
              </div>
           </div>
        )}

        {/* Action Controls */}
        <div className={`absolute left-0 right-0 transition-all ${isMinimized ? 'bottom-4' : 'bottom-12'} flex justify-center`}>
           <div className={`bg-white/10 backdrop-blur-2xl px-8 py-5 rounded-[32px] border border-white/10 flex items-center gap-6 sm:gap-10 shadow-2xl ${isMinimized ? 'px-4 py-3 gap-4' : ''}`}>
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isMuted ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-white/10 text-white hover:bg-white/20'} ${isMinimized ? 'w-10 h-10' : ''}`}
              >
                 {isMuted ? <MicOff size={isMinimized ? 18 : 24} /> : <Mic size={isMinimized ? 18 : 24} />}
              </button>

              {type === 'video' && (
                <button 
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isVideoOff ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-white/10 text-white hover:bg-white/20'} ${isMinimized ? 'w-10 h-10' : ''}`}
                >
                   {isVideoOff ? <VideoOff size={isMinimized ? 18 : 24} /> : <Video size={isMinimized ? 18 : 24} />}
                </button>
              )}

              <button 
                onClick={onEndCall}
                className={`w-16 h-16 rounded-[24px] bg-rose-600 text-white flex items-center justify-center shadow-2xl shadow-rose-600/40 hover:scale-110 active:scale-95 transition-all ${isMinimized ? 'w-12 h-12' : ''}`}
              >
                 <PhoneOff size={isMinimized ? 22 : 32} variant="bold" />
              </button>

              {!isMinimized && (
                <>
                  <button className="w-14 h-14 rounded-2xl bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all">
                     <Smile size={24} />
                  </button>
                  <button className="w-14 h-14 rounded-2xl bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all">
                     <MoreVertical size={24} />
                  </button>
                </>
              )}
           </div>
        </div>

        {/* Global Particle FX for Call Vibe */}
        {!isMinimized && (
           <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] animate-blob"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
           </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default CallOverlay;
