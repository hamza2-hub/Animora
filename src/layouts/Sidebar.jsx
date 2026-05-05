import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, Calendar, Users, 
  UserCheck, Syringe, FileText, 
  BarChart2, LogOut, Search, UserCircle, PawPrint
} from 'lucide-react';
import Logo from '../components/common/Logo';
import '../styles/layout/layout.css';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { profile, logout } = useAuth();
  const { t } = useTranslation();
  const userRole = profile?.role || 'user';
  
  const doctorLinks = [
    { path: '/doctor-dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard, end: true },
    { path: '/doctor-dashboard/appointments', label: t('sidebar.appointments'), icon: Calendar },
    { path: '/doctor-dashboard/patients', label: t('sidebar.patients'), icon: Users },
    { path: '/doctor-dashboard/owners', label: t('sidebar.pet_owners'), icon: UserCheck },
    { path: '/doctor-dashboard/vaccinations', label: t('sidebar.vaccinations'), icon: Syringe },
    { path: '/doctor-dashboard/records', label: t('sidebar.medical_records'), icon: FileText },
    { path: '/doctor-dashboard/analytics', label: t('sidebar.analytics'), icon: BarChart2 },
    { path: '/doctor-dashboard/profile', label: t('navbar.profile'), icon: UserCircle },
  ];

  const userLinks = [
    { path: '/dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard, end: true },
    { path: '/dashboard/pets', label: t('sidebar.my_pets'), icon: PawPrint },
    { path: '/dashboard/appointments', label: t('sidebar.appointments'), icon: Calendar },
    { path: '/dashboard/doctors', label: t('sidebar.find_doctor'), icon: Search },
  ];

  const links = userRole === 'doctor' ? doctorLinks : userLinks;

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header flex items-center justify-center">
        <div className="brand flex items-center gap-2">
          <Logo size={32} />
          {!isCollapsed && <h2 className="brand-text animate-fade-in">Vetocare</h2>}
        </div>
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
          {!isCollapsed && <span>{t('navbar.logout')}</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
