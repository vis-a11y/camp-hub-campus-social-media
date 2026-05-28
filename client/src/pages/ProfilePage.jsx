import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from '../components/EditProfile/EditProfileModal';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/users/${user.id}/posts`)
        .then(res => res.json())
        .then(data => setUserPosts(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="profile-page-container">
      {/* Cover Photo */}
      <div className="profile-cover-photo">
        {user.coverPhoto ? (
          <img src={user.coverPhoto} alt="Cover" className="cover-img" />
        ) : (
          <div className="cover-placeholder-gradient"></div>
        )}
      </div>

      <div className="profile-header-content">
        <div className="profile-top-section">
          {/* Avatar */}
          <div className="profile-avatar-wrapper">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username || 'U')}&size=150`} 
              alt="Profile" 
              className="profile-avatar"
            />
          </div>

          {/* Action Button */}
          <div className="profile-actions">
            <button className="btn-primary edit-profile-btn" onClick={() => setIsEditModalOpen(true)}>
              Edit Profile
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="profile-info-section">
          <h2 className="profile-username">{user.username}</h2>
          <div className="profile-stats">
            <span><strong>{userPosts.length}</strong> posts</span>
            <span><strong>0</strong> followers</span>
            <span><strong>0</strong> following</span>
          </div>
          
          <div className="profile-details">
            <h3 className="profile-fullname">{user.fullName || user.username}</h3>
            {user.role && (
              <p className="profile-role">
                {user.role === 'faculty' ? '👨‍🏫 Faculty Member' : '🎓 Student'}
              </p>
            )}
            {user.department && (
              <p className="profile-department">🏛️ {user.department}</p>
            )}
            {user.year && (
              <p className="profile-year">📅 {user.year}</p>
            )}
            {user.bio && (
              <p className="profile-bio">{user.bio}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Posts Section */}
      <div className="profile-tabs">
        <div className="profile-tab active">
          <span className="tab-text">POSTS</span>
        </div>
      </div>
      
      {userPosts.length === 0 ? (
        <div className="profile-no-posts">
          <div className="no-posts-icon">📷</div>
          <h2>No Posts Yet</h2>
        </div>
      ) : (
        <div className="profile-grid">
          {userPosts.map(post => (
            <div key={post.id} className="profile-grid-item">
              <img src={post.imageUrl} alt="User post" />
              <div className="grid-item-overlay">
                <span>❤️ {post.likes || 0}</span>
                <span>💬 {post.comments?.length || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditProfileModal onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
};

export default ProfilePage;
