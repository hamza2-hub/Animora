import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const usePets = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isInitialFetch = useRef(true);

  const fetchPets = useCallback(async (isSilent = false) => {
    if (!user) return;
    
    try {
      if (!isSilent) setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPets(data || []);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError(err.message);
    } finally {
      if (!isSilent) setLoading(false);
      isInitialFetch.current = false;
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setPets([]);
      setLoading(false);
      return;
    }

    fetchPets();

    const channel = supabase
      .channel(`pets_changes_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pets',
          filter: `owner_id=eq.${user.id}`
        },
        () => {
          // Refetch silently when data changes
          fetchPets(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchPets]);

  const removePetFromState = useCallback((petId) => {
    setPets(prev => prev.filter(p => p.id !== petId));
  }, []);

  const addPetToState = useCallback((newPet) => {
    setPets(prev => [newPet, ...prev]);
  }, []);

  return { pets, loading, error, refetch: fetchPets, removePetFromState, addPetToState };
};
