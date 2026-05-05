import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export const useDoctorDashboard = () => {
  const [stats, setStats] = useState({
    patientsCount: 0,
    todayAppointmentsCount: 0,
    emergencyCount: 0,
  });
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isInitialFetch = useRef(true);

  const fetchAll = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);

      // Today's date range
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      // Fetch all in parallel
      const [petsRes, todayAppRes, emergencyRes, scheduleRes, prevRes] = await Promise.all([
        // All pets (patient count + recent patients)
        supabase
          .from('pets')
          .select('*, profiles(full_name)')
          .order('created_at', { ascending: false }),

        // Today's appointments count
        supabase
          .from('appointments')
          .select('id', { count: 'exact' })
          .gte('date', todayStart.toISOString())
          .lte('date', todayEnd.toISOString()),

        // Emergency pets count
        supabase
          .from('pets')
          .select('id', { count: 'exact' })
          .eq('status', 'emergency'),

        // Today's full schedule with pet info
        supabase
          .from('appointments')
          .select('*, pets(name, type), owner:profiles!owner_id(full_name)')
          .gte('date', todayStart.toISOString())
          .lte('date', todayEnd.toISOString())
          .order('date', { ascending: true }),

        // Previous appointments (before today, most recent first)
        supabase
          .from('appointments')
          .select('*, pets(name, type), owner:profiles!owner_id(full_name)')
          .lt('date', todayStart.toISOString())
          .order('date', { ascending: false })
          .limit(20),
      ]);

      // Check errors
      if (petsRes.error) throw petsRes.error;
      if (todayAppRes.error) throw todayAppRes.error;
      if (emergencyRes.error) throw emergencyRes.error;
      if (scheduleRes.error) throw scheduleRes.error;
      if (prevRes.error) throw prevRes.error;

      setStats({
        patientsCount: petsRes.data?.length ?? 0,
        todayAppointmentsCount: todayAppRes.count ?? 0,
        emergencyCount: emergencyRes.count ?? 0,
      });

      setRecentPatients(petsRes.data?.slice(0, 5) ?? []);
      setTodaySchedule(scheduleRes.data ?? []);
      setPreviousAppointments(prevRes.data ?? []);
      setError(null);
    } catch (err) {
      console.error('Doctor Dashboard Error:', err);
      setError(err.message);
      toast.error('Failed to load dashboard data.');
    } finally {
      if (!isSilent) setLoading(false);
      isInitialFetch.current = false;
    }
  }, []);

  useEffect(() => {
    fetchAll();

    // Real-time subscriptions
    const petsChannel = supabase
      .channel('doctor_dashboard_pets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pets' }, () => fetchAll(true))
      .subscribe();

    const appointmentsChannel = supabase
      .channel('doctor_dashboard_appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => fetchAll(true))
      .subscribe();

    return () => {
      supabase.removeChannel(petsChannel);
      supabase.removeChannel(appointmentsChannel);
    };
  }, [fetchAll]);

  return { stats, todaySchedule, previousAppointments, recentPatients, loading, error };
};
