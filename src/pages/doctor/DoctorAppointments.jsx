import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck, History, Clock, User, Stethoscope,
  AlertTriangle, CheckCircle, ChevronRight, Search, X
} from 'lucide-react';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import AppointmentDetailsModal from '../../components/doctor/AppointmentDetailsModal';
import { supabase } from '../../lib/supabase';
import '../../styles/pages/dashboard.css';

/* ── status config ─────────────────────────── */
const STATUS_CFG = {
  pending:     { bg: '#fef9c3', color: '#a16207', dot: '#eab308', label: 'Pending' },
  confirmed:   { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6', label: 'Confirmed' },
  in_progress: { bg: '#d1fae5', color: '#065f46', dot: '#10b981', label: 'In Progress' },
  completed:   { bg: '#e0f2fe', color: '#0369a1', dot: '#0ea5e9', label: 'Completed' },
  cancelled:   { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444', label: 'Cancelled' },
};
const getStatusCfg = (s) => STATUS_CFG[s?.toLowerCase()] || STATUS_CFG.pending;

/* ── single appointment card ───────────────── */
const AppointmentCard = ({ app, onViewDetails, isPast }) => {
  const cfg = getStatusCfg(app.status);
  const date = new Date(app.date);
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: '0 12px 28px rgba(16,185,129,0.10)', borderColor: 'var(--primary)' }}
      style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: 'var(--border-radius-md)',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        opacity: isPast ? 0.85 : 1,
      }}
    >
      {/* Left accent bar */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: cfg.dot, borderRadius: '4px 0 0 4px' }} />

      {/* Date / time block */}
      <div style={{ textAlign: 'center', minWidth: 56, paddingLeft: 6, flexShrink: 0 }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
          {date.getDate()}
        </p>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {date.toLocaleDateString('en-US', { month: 'short' })}
        </p>
        <p style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600, marginTop: 2 }}>
          {timeStr}
        </p>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 44, background: 'var(--border)', flexShrink: 0 }} />

      {/* Icon */}
      <div style={{
        width: 42, height: 42, borderRadius: '50%', background: cfg.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {app.status === 'completed'
          ? <CheckCircle size={18} style={{ color: cfg.color }} />
          : app.status === 'cancelled'
          ? <X size={18} style={{ color: cfg.color }} />
          : <Stethoscope size={18} style={{ color: cfg.color }} />
        }
      </div>

      {/* Main info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
          <p style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {app.pets?.name || 'Unknown Pet'}
          </p>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.15rem 0.55rem', borderRadius: 99, background: cfg.bg, fontSize: '0.68rem', fontWeight: 700, color: cfg.color, flexShrink: 0 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot }} />
            {cfg.label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {app.pets?.type && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              🐾 {app.pets.type}{app.pets.breed ? ` · ${app.pets.breed}` : ''}
            </span>
          )}
          {app.owner?.full_name && (
            <span style={{ fontSize: '0.78rem', color: '#059669', display: 'flex', alignItems: 'center', gap: 3, background: '#ecfdf5', padding: '0.15rem 0.5rem', borderRadius: 6, border: '1px solid #a7f3d0' }}>
              <User size={10} /> {app.owner.full_name}
            </span>
          )}
          {app.notes && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              · {app.notes}
            </span>
          )}
        </div>
      </div>

      {/* View Details button */}
      <Button
        variant="outline"
        onClick={() => onViewDetails(app)}
        style={{ fontSize: '0.8rem', padding: '0.45rem 0.875rem', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}
      >
        Details <ChevronRight size={14} />
      </Button>
    </motion.div>
  );
};

/* ── empty state ───────────────────────────── */
const EmptyState = ({ tab }) => (
  <div style={{ 
    textAlign: 'center', 
    padding: '3.5rem 1rem', 
    color: 'var(--text-muted)',
    border: '1px solid rgba(255, 255, 255, 0.5)', 
    borderRadius: '24px', 
    background: 'linear-gradient(145deg, #ffffff, #f0f4f8)', 
    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,1)',
    overflow: 'hidden',
    position: 'relative'
  }}>
    <div style={{
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 60%)',
      pointerEvents: 'none'
    }}></div>
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary)' }}>
        {tab === 'previous' ? <History size={28} /> : <CalendarCheck size={28} />}
      </div>
      <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4, color: 'var(--text-main)' }}>
        {tab === 'today' ? 'No appointments today' : tab === 'upcoming' ? 'No upcoming appointments' : 'No previous appointments'}
      </p>
      <p style={{ fontSize: '0.875rem' }}>
        {tab === 'today' ? 'Your schedule is clear for today.' : tab === 'upcoming' ? 'Nothing scheduled yet.' : 'Completed visits will appear here.'}
      </p>
    </div>
  </div>
);

/* ── Main Page ─────────────────────────────── */
const DoctorAppointments = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState('today');
  const [search, setSearch] = useState('');

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, pets(name, type, breed, age), owner:profiles!owner_id(full_name)')
        .order('date', { ascending: false });

      if (error) throw error;
      setAllAppointments(data || []);

      if (selectedAppointment) {
        const updated = data?.find(a => a.id === selectedAppointment.id);
        if (updated) setSelectedAppointment(updated);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    const channel = supabase
      .channel('doctor_appointments_page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, fetchAppointments)
      .subscribe();
    return () => channel.unsubscribe();
  }, []); // eslint-disable-line

  /* ── Partition into tabs ── */
  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const todayEnd   = new Date(now); todayEnd.setHours(23, 59, 59, 999);

  const todayApts    = allAppointments.filter(a => { const d = new Date(a.date); return d >= todayStart && d <= todayEnd; });
  const upcomingApts = allAppointments.filter(a => new Date(a.date) > todayEnd);
  const previousApts = allAppointments.filter(a => new Date(a.date) < todayStart);

  const TABS = [
    { id: 'today',    label: "Today",    icon: CalendarCheck, data: todayApts },
    { id: 'upcoming', label: "Upcoming", icon: Clock,         data: upcomingApts },
    { id: 'previous', label: "Previous", icon: History,       data: previousApts },
  ];

  /* ── Apply search filter ── */
  const activeData = TABS.find(t => t.id === activeTab)?.data || [];
  const filtered = activeData.filter(a => {
    const q = search.toLowerCase();
    return (
      (a.pets?.name?.toLowerCase() || '').includes(q) ||
      (a.owner?.full_name?.toLowerCase() || '').includes(q) ||
      (a.notes?.toLowerCase() || '').includes(q) ||
      (a.pets?.type?.toLowerCase() || '').includes(q)
    );
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="dashboard-title">Appointments</h1>
          <p className="dashboard-subtitle">Manage your daily schedule and visit history</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.5rem 1rem', borderRadius: 99, fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
          <CalendarCheck size={14} /> {todayApts.length} Today · {upcomingApts.length} Upcoming · {previousApts.length} Past
        </div>
      </div>

      {/* Tab bar + Search row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: 'var(--border-radius-md)', flexShrink: 0 }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearch(''); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '0.5rem 1rem', borderRadius: 'var(--border-radius-sm)',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.2s',
                background: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? 'var(--text-main)' : 'var(--text-muted)',
                boxShadow: activeTab === tab.id ? 'var(--shadow-soft)' : 'none',
              }}
            >
              <tab.icon size={14} />
              {tab.label}
              <span style={{
                padding: '0.1rem 0.4rem', borderRadius: 99, fontSize: '0.7rem', fontWeight: 800,
                background: activeTab === tab.id ? 'var(--primary-light)' : 'var(--border)',
                color: activeTab === tab.id ? 'var(--primary-dark)' : 'var(--text-muted)',
              }}>
                {tab.data.length}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by pet, owner, or reason…"
            style={{
              width: '100%', padding: '0.55rem 2rem 0.55rem 2rem',
              border: '1.5px solid var(--border)', borderRadius: 'var(--border-radius-md)',
              fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none',
              background: 'var(--surface)', color: 'var(--text-main)',
              boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-light)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="section-card" style={{ padding: '1.25rem' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 78, borderRadius: 'var(--border-radius-md)' }} />)}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + search}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
            >
              {filtered.length === 0 ? (
                <EmptyState tab={search ? 'search' : activeTab} />
              ) : (
                filtered.map((app, i) => (
                  <motion.div key={app.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <AppointmentCard
                      app={app}
                      isPast={activeTab === 'previous'}
                      onViewDetails={setSelectedAppointment}
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <AppointmentDetailsModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
        onUpdate={fetchAppointments}
      />
    </div>
  );
};

export default DoctorAppointments;
