import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// SYNCED API CORE
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? 'http://localhost:5001' : 'https://campchat-campus-hub-2.onrender.com');

axios.defaults.baseURL = API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const stored = localStorage.getItem('hub_identity');
      if (!stored) {
        setLoading(false);
        return;
      }

      try {
        const { token } = JSON.parse(stored);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data } = await axios.get('/api/auth/me');
        setUser({ ...data, token });
      } catch (err) {
        localStorage.removeItem('hub_identity');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('hub_identity', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return true;
  };

  const register = async (userData) => {
    const { data } = await axios.post('/api/auth/register', userData);
    setUser(data);
    localStorage.setItem('hub_identity', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hub_identity');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
