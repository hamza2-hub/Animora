import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const usePatients = () => {
  const { profile } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = useCallback(async (isSilent = false) => {
    if (!profile?.id) return;

    try {
      if (!isSilent) setLoading(true);
      setError(null);

      // First get all pet IDs that belong to this doctor's appointments
      const { data: aptData, error: aptError } = await supabase
        .from('appointments')
        .select('pet_id')
        .eq('doctor_id', profile.id);

      if (aptError) throw aptError;

      const petIds = [...new Set((aptData || []).map(a => a.pet_id).filter(Boolean))];

      if (petIds.length === 0) {
        setPatients([]);
        return;
      }

      // Then fetch only those pets
      const { data, error } = await supabase
        .from('pets')
        .select('*, profiles(full_name)')
        .in('id', petIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err.message);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    fetchPatients();

    if (!profile?.id) return;

    // Only listen to appointment/pet changes relevant to this doctor
    const channel = supabase
      .channel(`patients_${profile.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments',
        filter: `doctor_id=eq.${profile.id}`,
      }, () => fetchPatients(true))
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [fetchPatients, profile?.id]);

  return { patients, loading, error, refetch: fetchPatients };
};
