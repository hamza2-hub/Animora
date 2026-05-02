import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, Calendar, Users, 
  UserCheck, Syringe, FileText, 
  BarChart2, Menu, X, PawPrint, LogOut 
} from 'lucide-react';
import '../../styles/layout/layout.css';

const doctorLinks = [
  { path: '/doctor-dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/doctor-dashboard/appointments', label: 'Appointments', icon: Calendar },
  { path: '/doctor-dashboard/patients', label: 'Patients', icon: Users },
  { path: '/doctor-dashboard/owners', label: 'Pet Owners', icon: UserCheck },
  { path: '/doctor-dashboard/vaccinations', label: 'Vaccinations', icon: Syringe },
  { path: '/doctor-dashboard/records', label: 'Medical Records', icon: FileText },
  { path: '/doctor-dashboard/analytics', label: 'Analytics', icon: BarChart2 },
];

const userLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/dashboard/pets', label: 'My Pets', icon: PawPrint },
  { path: '/dashboard/appointments', label: 'Appointments', icon: Calendar },
];

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { profile, logout } = useAuth();
  const userRole = profile?.role || 'user';
  
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
              <NavLink 
                to={link.path}
                end={link.end}
                className={({ isActive }) => `nav-link w-full text-left ${isActive ? 'active' : ''}`}
                title={isCollapsed ? link.label : ''}
              >
                <link.icon className="nav-icon" size={22} />
                {!isCollapsed && <span className="nav-label">{link.label}</span>}
              </NavLink>
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
