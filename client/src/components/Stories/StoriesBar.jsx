import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, ChevronLeft, ChevronRight, Plus, Eye } from 'lucide-react';
import './StoriesBar.css';

const STORY_DURATION = 5000; // 5 seconds per story

const StoriesBar = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [myStory, setMyStory] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUserIndex, setViewerUserIndex] = useState(0); // which user's stories
  const [viewerStoryIndex, setViewerStoryIndex] = useState(0); // which story of that user
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadCaption, setUploadCaption] = useState('');
  const [showViewers, setShowViewers] = useState(false);
  const fileRef = useRef(null);
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  const fetchStories = () => {
    fetch('http://localhost:5000/api/stories')
      .then(r => r.json())
      .then(data => {
        setStories(data);
        const mine = data.filter(s => s.userId === user?.id);
        setMyStory(mine.length > 0 ? mine : null);
      })
      .catch(console.error);
  };

  useEffect(() => { if (user) fetchStories(); }, [user]);

  // Group stories by user
  const grouped = stories.reduce((acc, s) => {
    if (!acc[s.userId]) acc[s.userId] = { userId: s.userId, username: s.username, avatar: s.avatar, stories: [] };
    acc[s.userId].stories.push(s);
    return acc;
  }, {});
  const storyUsers = Object.values(grouped);
  // Put current user first if they have a story
  storyUsers.sort((a, b) => (a.userId === user?.id ? -1 : b.userId === user?.id ? 1 : 0));

  // ---- PROGRESS TIMER ----
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(progressRef.current);
    setProgress(0);
    const start = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / STORY_DURATION) * 100, 100));
    }, 50);
    timerRef.current = setTimeout(() => {
      goNext();
    }, STORY_DURATION);
  }, [viewerUserIndex, viewerStoryIndex]);

  useEffect(() => {
    if (viewerOpen && !paused) startTimer();
    return () => { clearTimeout(timerRef.current); clearInterval(progressRef.current); };
  }, [viewerOpen, viewerUserIndex, viewerStoryIndex, paused]);

  const openViewer = (userIdx) => {
    setViewerUserIndex(userIdx);
    setViewerStoryIndex(0);
    setViewerOpen(true);
    setPaused(false);
    // Mark viewed
    const s = storyUsers[userIdx]?.stories[0];
    if (s) fetch(`http://localhost:5000/api/stories/${s.id}/view`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    });
  };

  const goNext = useCallback(() => {
    const currentUser = storyUsers[viewerUserIndex];
    if (!currentUser) return;
    if (viewerStoryIndex < currentUser.stories.length - 1) {
      setViewerStoryIndex(i => i + 1);
    } else if (viewerUserIndex < storyUsers.length - 1) {
      setViewerUserIndex(i => i + 1);
      setViewerStoryIndex(0);
    } else {
      setViewerOpen(false);
    }
  }, [viewerUserIndex, viewerStoryIndex, storyUsers]);

  const goPrev = useCallback(() => {
    if (viewerStoryIndex > 0) {
      setViewerStoryIndex(i => i - 1);
    } else if (viewerUserIndex > 0) {
      setViewerUserIndex(i => i - 1);
      const prevUser = storyUsers[viewerUserIndex - 1];
      setViewerStoryIndex(prevUser ? prevUser.stories.length - 1 : 0);
    }
  }, [viewerUserIndex, viewerStoryIndex, storyUsers]);

  const currentStoryUser = storyUsers[viewerUserIndex];
  const currentStory = currentStoryUser?.stories[viewerStoryIndex];
  const isMyStory = currentStoryUser?.userId === user?.id;

  // ---- UPLOAD ----
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setUploadPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUploadStory = async (e) => {
    e.preventDefault();
    if (!uploadPreview) return;
    const res = await fetch('http://localhost:5000/api/stories', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id, username: user.username, avatar: user.avatar,
        imageUrl: uploadPreview, caption: uploadCaption
      })
    });
    if (res.ok) {
      setShowUpload(false);
      setUploadPreview(null);
      setUploadCaption('');
      fetchStories();
    }
  };

  const formatTime = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    return h < 1 ? 'Just now' : `${h}h ago`;
  };

  const hasViewed = (s) => s.viewers?.includes(user?.id);
  const allViewedForUser = (su) => su.stories.every(s => hasViewed(s));

  return (
    <>
      {/* ---- STORIES BAR ---- */}
      <div className="stories-container">
        {/* My Story / Add Story */}
        <div className="story-item" onClick={() => {
          if (myStory) openViewer(storyUsers.findIndex(su => su.userId === user.id));
          else setShowUpload(true);
        }}>
          <div className={`story-ring ${myStory ? '' : 'current-user-no-story'}`}>
            <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || user?.username || 'U')}`}
              alt="Your Story" className="story-avatar" />
            {!myStory && <div className="add-story-btn"><Plus size={12} /></div>}
          </div>
          <span className="story-username">Your story</span>
        </div>

        {/* Other users' stories */}
        {storyUsers.filter(su => su.userId !== user?.id).map((su, idx) => {
          const globalIdx = storyUsers.findIndex(s => s.userId === su.userId);
          return (
            <div key={su.userId} className="story-item" onClick={() => openViewer(globalIdx)}>
              <div className={`story-ring ${allViewedForUser(su) ? 'viewed' : ''}`}>
                <img src={su.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(su.username)}`}
                  alt={su.username} className="story-avatar" />
              </div>
              <span className="story-username">{su.username}</span>
            </div>
          );
        })}
      </div>

      {/* ---- STORY VIEWER ---- */}
      {viewerOpen && currentStory && (
        <div className="story-viewer-overlay" onMouseDown={() => setPaused(true)} onMouseUp={() => setPaused(false)}
          onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)}>
          
          {/* Progress bars */}
          <div className="story-progress-bars">
            {currentStoryUser.stories.map((_, i) => (
              <div key={i} className="story-progress-track">
                <div className="story-progress-fill" style={{
                  width: i < viewerStoryIndex ? '100%' : i === viewerStoryIndex ? `${progress}%` : '0%'
                }} />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="story-viewer-header">
            <img src={currentStoryUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentStoryUser.username)}`}
              alt={currentStoryUser.username} className="story-viewer-avatar" />
            <div>
              <p className="story-viewer-username">{currentStoryUser.username}</p>
              <p className="story-viewer-time">{formatTime(currentStory.createdAt)}</p>
            </div>
            {isMyStory && (
              <button className="story-viewers-btn" onClick={e => { e.stopPropagation(); setShowViewers(v => !v); }}>
                <Eye size={18} /> {currentStory.viewers?.length || 0}
              </button>
            )}
            <button className="story-close-btn" onClick={() => setViewerOpen(false)}><X size={24} /></button>
          </div>

          {/* Image */}
          <img src={currentStory.imageUrl} alt="story" className="story-viewer-image" />

          {/* Caption */}
          {currentStory.caption && (
            <div className="story-caption">{currentStory.caption}</div>
          )}

          {/* Tap zones */}
          <button className="story-tap-zone story-tap-left" onClick={e => { e.stopPropagation(); goPrev(); }}>
            <ChevronLeft size={32} />
          </button>
          <button className="story-tap-zone story-tap-right" onClick={e => { e.stopPropagation(); goNext(); }}>
            <ChevronRight size={32} />
          </button>

          {/* Viewers list (my stories only) */}
          {isMyStory && showViewers && (
            <div className="story-viewers-panel" onClick={e => e.stopPropagation()}>
              <p className="story-viewers-title"><Eye size={14} /> {currentStory.viewers?.length || 0} viewers</p>
              {(currentStory.viewers || []).length === 0
                ? <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>No views yet</p>
                : currentStory.viewers.map(uid => (
                  <p key={uid} style={{ fontSize: 13, paddingTop: 4 }}>User {uid.slice(0, 6)}...</p>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ---- UPLOAD STORY MODAL ---- */}
      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="story-upload-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add to Your Story</h3>
              <button className="icon-btn" onClick={() => setShowUpload(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleUploadStory} className="story-upload-form">
              <div className="story-upload-preview" onClick={() => fileRef.current.click()}>
                {uploadPreview
                  ? <img src={uploadPreview} alt="preview" />
                  : <div className="story-upload-placeholder">
                      <Plus size={40} opacity={0.4} />
                      <p>Click to choose a photo</p>
                    </div>
                }
              </div>
              <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={handleFileChange} />
              <input
                type="text"
                placeholder="Add a caption... (optional)"
                value={uploadCaption}
                onChange={e => setUploadCaption(e.target.value)}
                className="story-caption-input"
              />
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 12 }}
                disabled={!uploadPreview}>
                Share Story
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StoriesBar;
