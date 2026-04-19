import React from 'react';
import { Menu, Search, Bell, Plus } from 'lucide-react';
import { useAppContext } from '../../core/context/AppContext';
import Button from '../ui/Button';
import '../../styles/layout/layout.css';

const Navbar = ({ toggleSidebar }) => {
  const { user, userRole } = useAppContext();

  return (
    <header className="navbar flex items-center justify-between">
      <div className="navbar-left flex items-center gap-4">
        <button className="menu-btn hover-bg" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search anything..." className="search-input" />
        </div>
      </div>

      <div className="navbar-right flex items-center gap-4">
        {userRole === 'doctor' && (
          <Button variant="primary" className="add-btn hide-mobile">
            <Plus size={18} /> Add Patient
          </Button>
        )}
        
        <button className="notification-btn hover-bg relative">
          <Bell size={22} />
          <span className="notification-dot"></span>
        </button>

        <div className="profile-wrapper flex items-center gap-3 cursor-pointer hover-bg">
          <div className="profile-info text-right hide-mobile">
            <p className="profile-name">{user?.firstName} {user?.lastName}</p>
            <p className="profile-role text-muted text-sm capitalize">{userRole}</p>
          </div>
          <div className="avatar">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
