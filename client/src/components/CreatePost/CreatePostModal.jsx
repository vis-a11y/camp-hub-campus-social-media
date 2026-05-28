import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './CreatePostModal.css';

const CreatePostModal = ({ onClose }) => {
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imagePreview && !caption) return;
    
    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          username: user.username,
          avatar: user.avatar,
          imageUrl: imagePreview || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
          caption: caption
        })
      });
      if (res.ok) {
        onClose();
        // Option: we could trigger a feed refresh here, but it requires lifting state
        window.location.reload(); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="back-btn" onClick={onClose}>✕</button>
          <h3>Create new post</h3>
          <button className="share-btn" onClick={handleSubmit}>Share</button>
        </div>
        
        <div className="modal-body">
          <div className="image-upload-area">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            ) : (
              <div className="upload-placeholder">
                <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <p>Drag photos and videos here</p>
                <label className="btn-primary" style={{cursor: 'pointer', marginTop: '20px', display: 'inline-block'}}>
                  Select from computer
                  <input type="file" accept="image/*" onChange={handleImageSelect} style={{display: 'none'}} />
                </label>
              </div>
            )}
          </div>
          
          <div className="caption-area">
            <div className="user-info">
              <img src={user?.avatar || "https://i.pravatar.cc/150"} alt="User" className="avatar" style={{width: '28px', height: '28px'}} />
              <span style={{fontWeight: 600, fontSize: '14px'}}>{user?.username}</span>
            </div>
            <textarea 
              placeholder="Write a caption..." 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
