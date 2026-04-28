import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
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

const AppGalaxy = () => (
  <div className="flex relative min-h-screen bg-white dark:bg-[#020617]">
    <Sidebar />
    <div className="flex-1 flex flex-col xl:ml-[280px] lg:ml-[85px] ml-0">
      <div className="lg:hidden sticky top-0 z-40">
        <Navbar />
      </div>
      <main className="flex-1 max-w-[1440px] mx-auto w-full p-4 md:p-8 lg:p-12 pb-32">
        <Outlet />
      </main>
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  </div>
);

const AuthGalaxy = () => (
  <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
    <Outlet />
  </div>
);

const AppRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <>
      <Toaster position="bottom-left" />
      <Routes>
        {!user ? (
          <Route element={<AuthGalaxy />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Route>
        ) : (
          <Route element={<AppGalaxy />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/study-groups" element={<StudyGroups />} />
            <Route path="/chats" element={<ChatSystem />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        )}
      </Routes>
    </>
  );
};

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
