import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Compass, MessageCircle, Heart, PlusSquare, Menu, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ onOpenCreate }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { icon: <Home />, label: 'Home', path: '/' },
    { icon: <Search />, label: 'Search', path: '/search' },
    { icon: <Compass />, label: 'Discover', path: '/discover' },
    { icon: <Calendar />, label: 'Events', path: '/events' },
    { icon: <MessageCircle />, label: 'Messages', path: '/messages' },
    { icon: <Heart />, label: 'Notifications', path: '/notifications' },
    { icon: <PlusSquare />, label: 'Create', action: onOpenCreate },
    { 
      icon: <img src={user?.avatar || "https://i.pravatar.cc/150"} alt="Profile" style={{width: '24px', height: '24px', borderRadius: '50%'}}/>, 
      label: 'Profile', 
      path: '/profile' 
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Link to="/">
          <h2>CampHub</h2>
        </Link>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return item.path ? (
            <Link key={index} to={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
              <div className="nav-icon">{item.icon}</div>
              <span className="nav-label">{item.label}</span>
            </Link>
          ) : (
            <button key={index} className="nav-item" onClick={item.action}>
              <div className="nav-icon">{item.icon}</div>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <button className="nav-item" onClick={logout}>
          <div className="nav-icon"><LogOut /></div>
          <span className="nav-label">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
