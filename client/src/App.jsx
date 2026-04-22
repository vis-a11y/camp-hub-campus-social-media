import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { Toaster } from 'react-hot-toast';
import axios from 'axios';

// POINTED TO REAL-TIME BACKEND
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://campchat-campus-hub-2.onrender.com';
axios.defaults.baseURL = API_BASE_URL;

// Global Response Interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Session expired or unauthorized');
      // We don't force logout/redirect here because of Guest Mode
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
  // RESTRICTIONS REMOVED: All routes are now public.
  // We still provide the user context if available, otherwise features work in guest mode.
  return children; 
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className={`min-h-screen bg-white dark:bg-black font-sans selection:bg-sky-100 dark:selection:bg-sky-900/40`}>
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#262626',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          },
          success: {
            iconTheme: { primary: '#0095f6', secondary: '#fff' }
          }
        }}
      />
      
      <div className="flex">
        {user && <Sidebar />}
        
        {/* Main Content Layout (Responsive Margin) */}
        <div className={`flex-1 transition-all duration-300 ${user ? 'xl:ml-[280px] lg:ml-[85px]' : ''}`}>
          {user && (
            <div className="lg:hidden sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-40">
              <Navbar />
            </div>
          )}
          
          <main className="min-h-screen max-w-[1400px] mx-auto px-0 md:px-8 py-0 md:py-10 animate-fade-in pb-32">
             <Routes>
               <Route path="/login"    element={<LoginPage />} />
               <Route path="/register" element={<RegisterPage />} />
               <Route path="/"         element={<Navigate to="/dashboard" />} />

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
             </Routes>
          </main>
        </div>
      </div>
      
      {user && (
        <div className="lg:hidden">
           <BottomNav />
        </div>
      )}
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
