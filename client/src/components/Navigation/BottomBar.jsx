import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, PlusSquare, MessageCircle, LogOut, Calendar, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './BottomBar.css';

const BottomBar = ({ onOpenCreate }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { icon: <Home />, path: '/' },
    { icon: <Search />, path: '/search' },
    { icon: <Calendar />, path: '/events' },
    { icon: <PlusSquare />, action: onOpenCreate },
    { icon: <Bell />, path: '/notifications' },
    { icon: <MessageCircle />, path: '/messages' },
    { 
      icon: <img src={user?.avatar || "https://i.pravatar.cc/150"} alt="Profile" style={{width: '24px', height: '24px', borderRadius: '50%'}}/>, 
      path: '/profile' 
    },
    { icon: <LogOut />, action: () => { logout(); navigate('/'); } }
  ];

  return (
    <div className="bottom-bar">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        return item.path ? (
          <Link key={index} to={item.path} className={`bottom-item ${isActive ? 'active' : ''}`}>
            {item.icon}
          </Link>
        ) : (
          <button key={index} className="bottom-item" onClick={item.action}>
            {item.icon}
          </button>
        );
      })}
    </div>
  );
};

export default BottomBar;
