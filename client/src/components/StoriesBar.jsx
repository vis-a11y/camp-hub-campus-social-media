import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, X, ChevronLeft, ChevronRight, Send, Camera, Image, Activity, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getMediaUrl } from '../utils/media';

const StoriesBar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [showMusicPicker, setShowMusicPicker] = useState(false);

  const mockMusic = [
    { id: 1, title: 'Campus Lo-Fi', artist: 'Study Beats', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 2, title: 'Morning Lecture', artist: 'Ambient Focus', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 3, title: 'Gym Session', artist: 'High Energy', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  ];
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [viewedStories, setViewedStories] = useState(() => {
    return JSON.parse(localStorage.getItem('campchat_viewed_stories') || '[]');
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    localStorage.setItem('campchat_viewed_stories', JSON.stringify(viewedStories));
  }, [viewedStories]);

  const fetchStories = async () => {
    try {
      const { data } = await axios.get('/api/academic/stories');
      const grouped = data.reduce((acc, story) => {
        const authorId = story.author?._id;
        if (!acc[authorId]) {
          acc[authorId] = {
            author: story.author,
            stories: [],
            hasUnseen: false
          };
        }
        acc[authorId].stories.push(story);
        if (!viewedStories.includes(story._id)) {
           acc[authorId].hasUnseen = true;
        }
        return acc;
      }, {});
      setStories(Object.values(grouped));
    } catch {
       setStories([]);
    }
  };

  const handleCreateStory = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data: uploadData } = await axios.post('/api/upload', formData);
      await axios.post('/api/academic/stories', { 
        imageUrl: uploadData.url,
        music: selectedMusic
      });
      toast.success('Added to story');
      fetchStories();
      setShowCreateStory(false);
      setSelectedMusic(null); // Clear selected music after story creation
    } catch {
      toast.error('Could not add to story');
    } finally {
      setIsUploading(false);
    }
  };

  const openViewer = (index) => {
    setActiveStoryIndex(index);
    setShowStoryViewer(true);
  };

  return (
    <div className="flex items-center gap-5 overflow-x-auto no-scrollbar py-6 px-4 mb-6 bg-transparent">
      {/* Create Story */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0 group">
        <div 
          className="relative cursor-pointer" 
          onClick={() => user ? fileInputRef.current.click() : navigate('/login')}
        >
          <div className="w-[74px] h-[74px] rounded-full p-[3px] bg-slate-200 dark:bg-white/10 group-hover:scale-105 transition-all duration-300">
            <div className="w-full h-full rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
               {user?.profilePic ? (
                 <img src={getMediaUrl(user.profilePic)} className="w-full h-full object-cover" />
               ) : (
                 <div className="text-sm font-bold text-indigo-500 uppercase">
                    {user ? user.firstName?.[0] : <User size={20} />}
                 </div>
               )}
            </div>
          </div>
          <div className="absolute bottom-1 right-1 w-6 h-6 accent-gradient-bg rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-lg ring-2 ring-indigo-500/20">
             <Plus size={14} strokeWidth={4} />
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleCreateStory} disabled={isUploading} />
        </div>
        <span className="text-[12px] text-slate-500 dark:text-slate-400 font-semibold tracking-tight">
           {user ? 'Your Story' : 'Join the Hub'}
        </span>
      </div>

      {/* Stories List */}
      {stories.map((group, idx) => (
        <button 
          key={group.author?._id} 
          onClick={() => openViewer(idx)}
          className="flex flex-col items-center gap-2 flex-shrink-0 group/story transition-all active:scale-95"
        >
          <div className={`w-[74px] h-[74px] rounded-full flex items-center justify-center p-[3.5px] ${group.hasUnseen ? 'accent-gradient-bg shadow-lg shadow-indigo-500/20' : 'bg-slate-200 dark:bg-white/10'}`}>
            <div className="w-full h-full rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-white dark:bg-slate-800">
              {group.author?.profilePic 
                ? <img src={getMediaUrl(group.author.profilePic)} alt="" className="w-full h-full object-cover rounded-full" />
                : <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-indigo-500 uppercase">{group.author?.firstName?.[0]}</div>}
            </div>
          </div>
          <span className="text-[12px] text-slate-700 dark:text-slate-300 truncate w-16 text-center font-semibold lowercase tracking-tight">
            {group.author?.firstName}
          </span>
        </button>
      ))}

      {/* Story Viewer Component */}
      {showStoryViewer && stories[activeStoryIndex] && (
        <StoryViewer 
          authorGroup={stories[activeStoryIndex]} 
          onClose={() => setShowStoryViewer(false)}
          onNext={() => {
            if (activeStoryIndex < stories.length - 1) setActiveStoryIndex(activeStoryIndex + 1);
            else setShowStoryViewer(false);
          }}
          onPrev={() => {
            if (activeStoryIndex > 0) setActiveStoryIndex(activeStoryIndex - 1);
          }}
          viewedStories={viewedStories}
          setViewedStories={setViewedStories}
        />
      )}
    </div>
  );
};

const StoryViewer = ({ authorGroup, onClose, onNext, onPrev, viewedStories, setViewedStories }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef(null);

  const safeIdx = currentIdx >= authorGroup.stories.length ? 0 : currentIdx;
  const story = authorGroup.stories[safeIdx];

  useEffect(() => {
    if (story?.music) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = story.music.url; // Use story.music.url for the audio source
        audioRef.current.loop = true; // Ensure audio loops
        audioRef.current.play().catch(() => {});
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ''; // Clear source if no music
    }
  }, [currentIdx, story]);

  useEffect(() => {
    setCurrentIdx(0);
    setProgress(0);
  }, [authorGroup]);

  useEffect(() => {
    if (!story) return;
    const id = story._id;
    if (!viewedStories.includes(id)) {
        setViewedStories(prev => [...prev, id]);
        axios.post(`/api/academic/stories/${id}/view`).catch(() => {});
    }
  }, [story, viewedStories, setViewedStories]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setProgress(p => p + 1);
    }, 50);

    return () => clearInterval(timer);
  }, [isPaused, currentIdx, authorGroup]);

  useEffect(() => {
    if (progress >= 100) {
      setProgress(0);
      if (currentIdx < authorGroup.stories.length - 1) {
        setCurrentIdx(c => c + 1);
      } else {
        onNext();
      }
    }
  }, [progress, currentIdx, authorGroup.stories.length, onNext]);

  const handleNext = () => {
    setProgress(0);
    if (currentIdx < authorGroup.stories.length - 1) {
      setCurrentIdx(c => c + 1);
    } else {
      onNext();
    }
  };

  const handlePrev = () => {
    setProgress(0);
    if (currentIdx > 0) {
      setCurrentIdx(c => c - 1);
    } else {
      onPrev();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] glass-morphism flex items-center justify-center animate-fade-in sm:px-4">
       <button onClick={onClose} className="absolute top-8 right-8 p-3 text-white/50 hover:text-white transition-all z-[110] bg-white/5 rounded-full hover:bg-white/10 hidden sm:block">
          <X size={32} />
       </button>

       <div className="relative w-full h-full sm:h-[90vh] sm:max-w-[420px] sm:rounded-3xl overflow-hidden bg-black shadow-2xl flex flex-col border border-white/10">
          {/* Progress Bar View */}
          <div className="absolute top-6 inset-x-6 flex gap-1.5 z-30 pointer-events-none">
             {authorGroup.stories.map((_, i) => (
                <div key={i} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                   <div 
                      className="bg-white h-full transition-all duration-75"
                      style={{ 
                        width: i < currentIdx ? '100%' : i === currentIdx ? `${progress}%` : '0%'
                      }}
                   ></div>
                </div>
             ))}
          </div>

          {/* Header */}
          <div className="absolute top-10 inset-x-6 flex items-center justify-between z-30 pointer-events-none">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-white/50 overflow-hidden shadow-lg">
                   {authorGroup.author?.profilePic 
                      ? <img src={getMediaUrl(authorGroup.author.profilePic)} className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm uppercase">{authorGroup.author?.firstName?.[0]}</div>}
                </div>
                <div>
                   <p className="text-white text-[14px] font-bold lowercase leading-none">{authorGroup.author?.firstName}_{authorGroup.author?.lastName?.toLowerCase()}</p>
                   {story && <p className="text-white/60 text-[11px] font-medium mt-1 uppercase tracking-wider">{formatDistanceToNow(new Date(story.createdAt))} ago</p>}
                </div>
             </div>
             <button onClick={onClose} className="p-2 text-white/70 hover:text-white transition-all pointer-events-auto sm:hidden">
                <X size={24} />
             </button>
          </div>

          {/* Image & Control Area */}
          <div 
             className="flex-1 bg-neutral-950 flex items-center justify-center overflow-hidden relative"
             onMouseDown={() => setIsPaused(true)}
             onMouseUp={() => setIsPaused(false)}
             onTouchStart={() => setIsPaused(true)}
             onTouchEnd={() => setIsPaused(false)}
          >
             {story?.music && (
                <div className="absolute top-24 left-6 z-40 animate-pulse">
                   <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl flex items-center gap-4 shadow-2xl">
                      <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                         <Activity size={20} />
                      </div>
                      <div>
                         <p className="text-white text-xs font-bold uppercase tracking-widest">{story.music.title}</p>
                         <p className="text-white/60 text-[10px] uppercase font-medium">{story.music.artist}</p>
                      </div>
                   </div>
                   <audio ref={audioRef} src={story.music.url} loop hidden />
                </div>
             )}
             
             {story?.imageUrl && <img src={getMediaUrl(story.imageUrl)} className="w-full h-full object-contain" alt="" />}
             
             {/* Interaction Areas */}
             <div className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer" onClick={(e) => { e.stopPropagation(); handlePrev(); }}></div>
             <div className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleNext(); }}></div>
          </div>

          {/* Footer Input */}
          <div className="p-6 pb-12 sm:pb-8 flex gap-4 items-center z-30 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-auto border-t border-white/5">
              <input 
                type="text" 
                placeholder="Type a response..." 
                className="flex-1 bg-white/10 border border-white/10 rounded-2xl py-3 px-6 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-white/10 placeholder:text-white/40 transition-all"
              />
              <button className="p-3 bg-white/10 rounded-2xl text-white hover:bg-white/20 transition-all">
                <Send size={20} />
              </button>
          </div>
       </div>
    </div>
  );
};

export default StoriesBar;
