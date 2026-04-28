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

/**
 * MainLayout: Only rendered for protected application routes.
 * This is the ultimate guard against sidebar overlap on login pages.
 */
const MainLayout = ({ user }) => {
  return (
    <div className="flex relative min-h-screen">
      {/* SIDEBAR: Only exists in this layout */}
      <Sidebar />
      
      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col transition-all duration-300 xl:ml-[280px] lg:ml-[85px] ml-0">
        {/* Mobile Top Navbar */}
        <div className="lg:hidden sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-40 border-b border-slate-100 dark:border-white/5">
          <Navbar />
        </div>
        
        <main className="flex-1 max-w-[1440px] mx-auto w-full px-0 md:px-8 py-0 md:py-10 pb-32">
          <Outlet />
        </main>
        
        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden">
           <BottomNav />
        </div>
      </div>
    </div>
  );
};

function AppRoutes() {
  const { user, loading } = useAuth();
  
  if (loading) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-indigo-500/10 overflow-x-hidden">
      <Toaster position="bottom-left" />
      
      <Routes>
        {/* 1. AUTH WORLD: Pure pages with zero navigation overhead */}
        <Route path="/login"    element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
        
        {/* 2. APP WORLD: Wrapped in MainLayout for all internal features */}
        <Route element={user ? <MainLayout user={user} /> : <Navigate to="/login" replace />}>
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/profile"       element={<ProfilePage />} />
          <Route path="/profile/:id"   element={<ProfilePage />} />
          <Route path="/study-groups"  element={<StudyGroups />} />
          <Route path="/chats"         element={<ChatSystem />} />
          <Route path="/explore"       element={<ExplorePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/connections"   element={<ConnectionsPage />} />
          <Route path="/events"        element={<EventsPage />} />
          <Route path="/projects"      element={<ProjectsPage />} />
        </Route>

        {/* 3. GLOBAL REDIRECTS */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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
