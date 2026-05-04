import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, Plus, User, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import SettingsModal from '../ui/SettingsModal';
import { toast } from 'react-hot-toast';
import '../../styles/layout/layout.css';

const Navbar = ({ toggleSidebar }) => {
  const { user, profile, logout } = useAuth();
  const userRole = profile?.role || 'user';
  const fullName = profile?.full_name || 'User';
  
  const settingsUser = {
    firstName: fullName.split(' ')[0],
    lastName: fullName.split(' ').slice(1).join(' '),
    email: user?.email || '',
  };
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('profile');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar flex items-center justify-between">
      <div className="navbar-left flex items-center gap-4">
        <button className="menu-btn hover-bg hide-desktop" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search anything..." className="search-input" />
        </div>
      </div>

      <div className="navbar-right flex items-center gap-4">
        {userRole === 'doctor' && (
          <Button variant="primary" className="add-btn hide-mobile" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add Patient
          </Button>
        )}
        
        <button className="notification-btn hover-bg relative">
          <Bell size={22} />
          <span className="notification-dot"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <div 
            className="profile-wrapper flex items-center gap-3 cursor-pointer hover-bg"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="profile-info text-right hide-mobile">
              <p className="profile-name">{fullName}</p>
              <p className="profile-role text-muted text-sm capitalize">{userRole}</p>
            </div>
            <div className="avatar">
              {fullName.charAt(0)}
            </div>
          </div>

          {isProfileOpen && (
            <div className="dropdown-menu">
              <button 
                className="dropdown-item" 
                onClick={() => { setIsProfileOpen(false); setSettingsTab('profile'); setIsSettingsModalOpen(true); }}
              >
                <User size={18} /> Profile
              </button>
              <button 
                className="dropdown-item" 
                onClick={() => { setIsProfileOpen(false); setSettingsTab('preferences'); setIsSettingsModalOpen(true); }}
              >
                <Settings size={18} /> Settings
              </button>
              <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '0.5rem 0' }}></div>
              <button className="dropdown-item danger" onClick={logout}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Patient</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              setIsModalOpen(false); 
              toast.success('Patient added successfully!'); 
            }}>
              <div className="form-group">
                <label className="form-label">Owner Name</label>
                <input type="text" className="form-input" placeholder="e.g. Jane Smith" required />
              </div>
              <div className="form-group">
                <label className="form-label">Pet Name</label>
                <input type="text" className="form-input" placeholder="e.g. Bella" required />
              </div>
              <div className="form-group">
                <label className="form-label">Pet Type / Breed</label>
                <input type="text" className="form-input" placeholder="e.g. Dog / Golden Retriever" required />
              </div>
              <div className="flex gap-4 mt-6 justify-end">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Patient</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Premium Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
        initialTab={settingsTab}
        user={settingsUser}
      />
    </header>
  );
};

export default Navbar;
