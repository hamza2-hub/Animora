import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, Clock, History, Search, X } from 'lucide-react';
import AppointmentCard from '../../components/doctor/AppointmentCard';
import AppointmentEmptyState from '../../components/doctor/AppointmentEmptyState';
import AppointmentDetailsModal from '../../components/doctor/AppointmentDetailsModal';
import { appointmentService } from '../../services/appointmentService';
import { supabase } from '../../lib/supabase';
import '../../styles/pages/dashboard.css';
import '../../styles/pages/appointments.css';

const DoctorAppointments = () => {

  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState('today');
  const [search, setSearch] = useState('');

  const fetchAppointments = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const data = await appointmentService.getAppointmentsForVet(user.id);
      setAllAppointments(data || []);

      if (selectedAppointment) {
        const updated = data?.find(a => a.id === selectedAppointment.id);
        if (updated) setSelectedAppointment(updated);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    const channel = supabase
      .channel('doctor_appointments_page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => fetchAppointments(true))
      .subscribe();

    return () => channel.unsubscribe();
  }, []); // eslint-disable-line


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
      <div className="dashboard-header flex justify-between items-start flex-wrap gap-4 mb-6">
        <div>
          <h1 className="dashboard-title">Appointments</h1>
          <p className="dashboard-subtitle">Manage your daily schedule and visit history</p>
        </div>
        <div className="stats-badge flex items-center gap-2 bg-primary-light text-primary-dark px-4 py-2 rounded-full text-xs font-bold shrink-0">
          <CalendarCheck size={14} /> {todayApts.length} Today · {upcomingApts.length} Upcoming · {previousApts.length} Past
        </div>
      </div>

      {/* Tab bar + Search row */}
      <div className="flex items-center gap-4 flex-wrap mb-5">
        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearch(''); }}
              className={`tab-btn flex items-center gap-2 px-4 py-2 rounded-lg border-none cursor-pointer font-semibold text-xs transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'bg-transparent text-slate-500'}`}
            >
              <tab.icon size={14} />
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === tab.id ? 'bg-primary-light text-primary-dark' : 'bg-slate-200 text-slate-500'}`}>
                {tab.data.length}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by pet, owner, or reason…"
            className="w-full pl-10 pr-10 py-2 border-1.5 border-slate-200 rounded-xl text-xs outline-none bg-white text-slate-900 transition-all focus:border-primary focus:ring-4 focus:ring-emerald-50"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-slate-400 flex items-center">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="section-card p-5">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + search}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2.5"
            >
              {filtered.length === 0 ? (
                <AppointmentEmptyState tab={search ? 'search' : activeTab} />
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
