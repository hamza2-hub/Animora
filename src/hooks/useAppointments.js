import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { appointmentService } from '../services/appointmentService';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments();
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    const fetchSessionAndSubscribe = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const subscription = supabase
        .channel('appointments_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'appointments',
            filter: `owner_id=eq.${user.id}`
          },
          () => {
            fetchAppointments();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    };

    const cleanup = fetchSessionAndSubscribe();
    return () => {
      cleanup.then(unsub => unsub && unsub());
    };
  }, []);

  return { appointments, loading, error, refetch: fetchAppointments };
};
