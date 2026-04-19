import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../core/context/AppContext';
import { 
  LayoutDashboard, Calendar, Users, 
  UserCheck, Syringe, FileText, 
  BarChart2, Menu, X, PawPrint, LogOut 
} from 'lucide-react';
import '../../styles/layout/layout.css';

const doctorLinks = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'owners', label: 'Pet Owners', icon: UserCheck },
  { id: 'vaccinations', label: 'Vaccinations', icon: Syringe },
  { id: 'records', label: 'Medical Records', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
];

const userLinks = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pets', label: 'My Pets', icon: PawPrint },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
];

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { userRole, logout, activeTab, setActiveTab } = useAppContext();
  
  const links = userRole === 'doctor' ? doctorLinks : userLinks;

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header flex items-center justify-between">
        <div className="brand flex items-center gap-2">
          <div className="logo-wrapper">
            <PawPrint className="logo-icon" size={28} />
          </div>
          {!isCollapsed && <h2 className="brand-text animate-fade-in">Animora</h2>}
        </div>
        <button className="toggle-btn md-hidden" onClick={toggleSidebar}>
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {links.map((link, idx) => (
            <li key={idx} style={{ marginBottom: '0.5rem' }}>
              <button 
                onClick={() => setActiveTab(link.id)}
                className={`nav-link w-full text-left ${activeTab === link.id ? 'active' : ''}`}
                title={isCollapsed ? link.label : ''}
              >
                <link.icon className="nav-icon" size={22} />
                {!isCollapsed && <span className="nav-label">{link.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn flex items-center gap-2 w-full">
          <LogOut size={22} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
