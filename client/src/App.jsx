import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import StudyGroups from './pages/StudyGroups';
import ChatSystem from './pages/ChatSystem';
import ExplorePage from './pages/ExplorePage';
import NotificationsPage from './pages/NotificationsPage';
import ConnectionsPage from './pages/ConnectionsPage';
import EventsPage from './pages/EventsPage';
import ProjectsPage from './pages/ProjectsPage';
import Navbar from './components/ui/Navbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

// POINTED TO REAL-TIME BACKEND
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5001' : 'https://campchat-campus-hub-2.onrender.com');
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true; // Crucial for session cookies

// Global Response Interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Session expired or unauthorized');
    }
    if (!error.response) {
      toast.error('Network Error: Connectivity with Hub lost', { id: 'network-err' });
    }
    return Promise.reject(error);
  }
);

if (import.meta.env.DEV) {
  console.log('🚀 API Base URL:', API_BASE_URL);
}

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children; 
};

function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Use location.pathname as primary, window.location.pathname as secondary fallback
  const currentPath = (location.pathname || window.location.pathname || '').toLowerCase();
  
  // 2. Extremely broad Auth Page check - hide on login, register, or the root landing
  const isAuthPage = currentPath.includes('login') || 
                     currentPath.includes('register') || 
                     currentPath === '/' || 
                     currentPath === '';

  if (loading) return null;

  // Final confirmation: show navigation ONLY if we have a user AND we are NOT on an auth/root page
  const showNavigation = !!user && !isAuthPage;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-indigo-500/10 overflow-x-hidden">
      <Toaster position="bottom-left" />
      
      <div className="flex relative min-h-screen">
        {/* SIDEBAR: Absolute guard against showing on login/register */}
        {showNavigation && <Sidebar />}
        
        {/* Main Content Layout */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${showNavigation ? 'xl:ml-[280px] lg:ml-[85px]' : 'ml-0'}`}>
          {/* Mobile Top Navbar: Same absolute guard */}
          {showNavigation && (
            <div className="lg:hidden sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-40 border-b border-slate-100 dark:border-white/5">
              <Navbar />
            </div>
          )}
          
          <main className={`flex-1 ${!isAuthPage ? 'max-w-[1440px] mx-auto w-full px-0 md:px-8 py-0 md:py-10 pb-32' : 'w-full flex items-center justify-center'}`}>
             <Routes>
               {/* Authentication Routes: Force redirect if already logged in */}
               <Route path="/login"    element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
               <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
               
               {/* Root Redirect: Directs to login if guest, dashboard if member */}
               <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />

               {/* Protected Application Routes */}
               <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
               <Route path="/profile"       element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
               <Route path="/profile/:id"   element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
               <Route path="/study-groups"  element={<ProtectedRoute><StudyGroups /></ProtectedRoute>} />
               <Route path="/chats"         element={<ProtectedRoute><ChatSystem /></ProtectedRoute>} />
               <Route path="/explore"       element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
               <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
               <Route path="/connections"   element={<ProtectedRoute><ConnectionsPage /></ProtectedRoute>} />
               <Route path="/events"        element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
               <Route path="/projects"      element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
               
               {/* Fallback to Root */}
               <Route path="*" element={<Navigate to="/" replace />} />
             </Routes>
          </main>
          
          {/* Mobile Bottom Navigation */}
          {showNavigation && (
            <div className="lg:hidden">
               <BottomNav />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
