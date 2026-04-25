import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Settings, Shield, Bell, Camera, AlertTriangle } from 'lucide-react';
import Button from './Button';
import Toggle from './Toggle';
import { toast } from 'react-hot-toast';
import '../../styles/components/ui.css';

const SettingsModal = ({ isOpen, onClose, initialTab = 'profile', user }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Sync initialTab when modal opens
  React.useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleSave = () => {
    toast.success('Settings saved successfully!');
    onClose();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="settings-flex-col"
          >
            <div className="flex items-center gap-6 mb-4">
              <div className="relative group cursor-pointer">
                <div className="avatar-ring flex items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', padding: '4px' }}>
                  <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '2rem', backgroundColor: 'var(--surface)', color: 'var(--primary)', boxShadow: 'none' }}>
                    {user?.firstName?.charAt(0) || 'J'}
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
                  <Camera color="white" size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)', fontSize: '1.25rem', marginBottom: '0.25rem' }}>{user?.firstName || 'John'} {user?.lastName || 'Doe'}</h3>
                <p className="text-muted text-sm">Manage your personal information</p>
              </div>
            </div>

            <div className="settings-grid-2">
              <div className="form-group">
                <label className="form-label text-sm">First Name</label>
                <input type="text" className="form-input" defaultValue={user?.firstName || 'John'} />
              </div>
              <div className="form-group">
                <label className="form-label text-sm">Last Name</label>
                <input type="text" className="form-input" defaultValue={user?.lastName || 'Doe'} />
              </div>
              <div className="form-group settings-col-span-2">
                <label className="form-label text-sm">Email Address</label>
                <input type="email" className="form-input" defaultValue={user?.email || 'john.doe@example.com'} />
              </div>
              <div className="form-group settings-col-span-2">
                <label className="form-label text-sm">Phone Number</label>
                <input type="tel" className="form-input" defaultValue="+1 (555) 123-4567" />
              </div>
            </div>
          </motion.div>
        );
      case 'preferences':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="settings-flex-col">
            <div>
              <h3 className="font-bold mb-2" style={{ color: 'var(--text-main)', fontSize: '1.25rem' }}>App Preferences</h3>
              <p className="text-muted text-sm">Customize how Animora looks and feels.</p>
            </div>
            
            <div className="settings-card">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-bold" style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>Dark Mode</h4>
                  <p className="text-sm text-muted">Switch between light and dark themes</p>
                </div>
                <Toggle isOn={darkMode} onToggle={() => setDarkMode(!darkMode)} />
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '1rem 0' }}></div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold" style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>Compact Sidebar</h4>
                  <p className="text-sm text-muted">Show only icons in the sidebar</p>
                </div>
                <Toggle isOn={false} onToggle={() => {}} />
              </div>
            </div>
          </motion.div>
        );
      case 'notifications':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="settings-flex-col">
            <div>
              <h3 className="font-bold mb-2" style={{ color: 'var(--text-main)', fontSize: '1.25rem' }}>Notifications</h3>
              <p className="text-muted text-sm">Choose what we notify you about.</p>
            </div>

            <div className="settings-card">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-bold" style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>Email Notifications</h4>
                  <p className="text-sm text-muted">Updates about appointments and patients</p>
                </div>
                <Toggle isOn={notifications} onToggle={() => setNotifications(!notifications)} />
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '1rem 0' }}></div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold" style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>Marketing Emails</h4>
                  <p className="text-sm text-muted">Receive news and special offers</p>
                </div>
                <Toggle isOn={marketing} onToggle={() => setMarketing(!marketing)} />
              </div>
            </div>
          </motion.div>
        );
      case 'security':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="settings-flex-col">
            <div>
              <h3 className="font-bold mb-2" style={{ color: 'var(--text-main)', fontSize: '1.25rem' }}>Security Settings</h3>
              <p className="text-muted text-sm">Manage your password and security preferences.</p>
            </div>

            <div className="settings-card" style={{ borderLeft: '4px solid var(--warning)' }}>
              <div className="flex" style={{ gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: '#fff3e0', color: 'var(--warning)', padding: '0.5rem', borderRadius: '50%' }}>
                  <AlertTriangle size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 className="font-bold" style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Change Password</h4>
                  <p className="text-sm text-muted mb-4">It's a good idea to use a strong password that you're not using elsewhere.</p>
                  <Button variant="outline" style={{ borderColor: 'var(--warning)', color: 'var(--warning)' }}>Update Password</Button>
                </div>
              </div>
            </div>

            <div className="settings-card mt-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold" style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>Two-Factor Authentication</h4>
                  <p className="text-sm text-muted">Add an extra layer of security to your account.</p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="modal-wrapper">
        {/* Backdrop */}
        <motion.div 
          className="settings-modal-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div 
          className="settings-modal-container"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Left Sidebar */}
          <div className="settings-modal-sidebar">
            <h2 className="font-bold mb-6" style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>Settings</h2>
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`settings-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Content Area */}
          <div className="settings-modal-content-area">
            {/* Header */}
            <div className="settings-modal-header">
              <button 
                onClick={onClose}
                className="modal-close"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Scrollable Body */}
            <div className="settings-modal-body">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}>
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Fixed Footer */}
            <div className="settings-modal-footer">
              <span className="text-sm text-muted animate-pulse" style={{ marginRight: 'auto' }}>Unsaved changes</span>
              <Button variant="text" onClick={onClose}>Cancel</Button>
              <Button variant="primary" onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SettingsModal;
