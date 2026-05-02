import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Join pets with profiles to get the owner's full_name
      const { data, error } = await supabase
        .from('pets')
        .select(`
          *,
          profiles(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();

    // Setup realtime subscription for all pets (doctor view)
    const subscription = supabase
      .channel('public:pets:all')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pets'
        },
        () => {
          // Refetch when any pet data changes
          fetchPatients();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchPatients]);

  return { patients, loading, error, refetch: fetchPatients };
};
