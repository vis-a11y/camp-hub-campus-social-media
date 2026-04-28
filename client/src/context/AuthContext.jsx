import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// Configure API base URL for production support
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async (token) => {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data } = await axios.get(`${API_BASE_URL}/auth/me`);
        setUser(data);
        localStorage.setItem('campchat_user', JSON.stringify(data));
      } catch (err) {
        console.warn('Session verification failed, reverting to guest mode');
        logout();
      } finally {
        setLoading(false);
      }
    };

    const storedUser = localStorage.getItem('campchat_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.token) {
          verifySession(parsed.token);
          return;
        }
      } catch {
        localStorage.removeItem('campchat_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    setUser(data);
    localStorage.setItem('campchat_user', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    navigate('/dashboard');
    return true;
  };

  const register = async (userData) => {
    const { data } = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    setUser(data);
    localStorage.setItem('campchat_user', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    navigate('/dashboard');
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campchat_user');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    localStorage.setItem('campchat_user', JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
