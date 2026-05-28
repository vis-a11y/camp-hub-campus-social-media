import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Check for saved user in localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('camphub_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('camphub_user', JSON.stringify(userData));
        setError(null);
        return true;
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed');
        return false;
      }
    } catch (err) {
      setError('Network error');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const newUser = await response.json();
        setUser(newUser);
        localStorage.setItem('camphub_user', JSON.stringify(newUser));
        setError(null);
        return true;
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed');
        return false;
      }
    } catch (err) {
      setError('Network error');
      return false;
    }
  };

  const updateProfile = async (fields) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        localStorage.setItem('camphub_user', JSON.stringify(updated));
        return { ok: true };
      } else {
        const data = await res.json();
        return { ok: false, message: data.message };
      }
    } catch (err) {
      return { ok: false, message: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('camphub_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};
