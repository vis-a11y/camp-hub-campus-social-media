import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // We can reuse login styles

const SignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const { register, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await register({ username, fullName, password, role });
    if (success) {
      navigate('/');
    }
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-logo">CampHub</h1>
        <p className="login-subtitle">Sign up to see photos and videos from your campus friends.</p>
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
          <input 
            type="text" 
            placeholder="Full Name" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            style={{ padding: '10px 8px', borderRadius: '4px', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
          
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="login-divider">
          <div className="line"></div>
        </div>

        <div className="signup-prompt">
          <p>Have an account? <span className="signup-link" onClick={() => navigate('/login')}>Log in</span></p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
