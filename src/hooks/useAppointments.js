import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from './useAuth';

export const useAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isInitialFetch = useRef(true);

  const fetchAppointments = useCallback(async (isSilent = false) => {
    if (!user) return;
    
    try {
      if (!isSilent) setLoading(true);
      const data = await appointmentService.getAppointments();
      setAppointments(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message);
    } finally {
      if (!isSilent) setLoading(false);
      isInitialFetch.current = false;
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    fetchAppointments();

    const channel = supabase
      .channel(`appointments_changes_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `owner_id=eq.${user.id}`
        },
        () => {
          // Refetch silently when data changes
          fetchAppointments(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchAppointments]);

  return { appointments, loading, error, refetch: fetchAppointments };
};
