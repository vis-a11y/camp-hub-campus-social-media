import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Camera } from 'lucide-react';
import './EditProfileModal.css';

const DEPARTMENTS = [
  'Computer Science', 'Information Technology', 'Electronics & Communication',
  'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering',
  'Business Administration', 'Commerce', 'Arts & Humanities',
  'Science', 'Law', 'Medicine', 'Pharmacy', 'Other'
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Alumni'];

const EditProfileModal = ({ onClose }) => {
  const { user, updateProfile } = useAuth();
  const avatarRef = useRef(null);
  const coverRef = useRef(null);

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    department: user?.department || '',
    year: user?.year || '',
    avatar: user?.avatar || '',
    coverPhoto: user?.coverPhoto || '',
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [coverPreview, setCoverPreview] = useState(user?.coverPhoto || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleImageFile = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'avatar') {
        setAvatarPreview(reader.result);
        setForm(f => ({ ...f, avatar: reader.result }));
      } else {
        setCoverPreview(reader.result);
        setForm(f => ({ ...f, coverPhoto: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const result = await updateProfile(form);
    setSaving(false);
    if (result.ok) {
      onClose();
    } else {
      setError(result.message || 'Failed to save changes.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-profile-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
          <h3>Edit Profile</h3>
          <button
            className="btn-primary"
            style={{ fontSize: 13, padding: '6px 16px' }}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

        <div className="edit-profile-body">
          {error && <p className="edit-error">{error}</p>}

          {/* Cover Photo */}
          <div className="cover-edit-wrap" onClick={() => coverRef.current.click()}>
            {coverPreview
              ? <img src={coverPreview} alt="Cover" className="cover-preview" />
              : <div className="cover-placeholder"><Camera size={28} /><span>Add cover photo</span></div>
            }
            <div className="cover-overlay"><Camera size={22} /><span>Change</span></div>
            <input type="file" accept="image/*" ref={coverRef} style={{ display: 'none' }}
              onChange={e => handleImageFile(e, 'cover')} />
          </div>

          {/* Avatar */}
          <div className="avatar-edit-section">
            <div className="avatar-edit-wrap" onClick={() => avatarRef.current.click()}>
              <img
                src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.fullName || user?.username || 'U')}&size=120&background=random`}
                alt="Avatar"
                className="edit-avatar-img"
              />
              <div className="avatar-overlay"><Camera size={18} /></div>
              <input type="file" accept="image/*" ref={avatarRef} style={{ display: 'none' }}
                onChange={e => handleImageFile(e, 'avatar')} />
            </div>
            <p className="avatar-change-label">Change profile photo</p>
          </div>

          {/* Form Fields */}
          <form className="edit-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                name="fullName"
                type="text"
                placeholder="Your full name"
                value={form.fullName}
                onChange={handleChange}
                maxLength={60}
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                placeholder="Tell something about yourself..."
                value={form.bio}
                onChange={handleChange}
                maxLength={150}
                rows={3}
              />
              <span className="char-count">{form.bio.length}/150</span>
            </div>

            <div className="form-group">
              <label>Department</label>
              <select name="department" value={form.department} onChange={handleChange}>
                <option value="">Select department…</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {user?.role === 'student' && (
              <div className="form-group">
                <label>Year of Study</label>
                <select name="year" value={form.year} onChange={handleChange}>
                  <option value="">Select year…</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
