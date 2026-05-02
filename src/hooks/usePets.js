import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const usePets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPets([]);
        return;
      }

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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();

    // Setup realtime subscription for this user's pets
    let channel;
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel('public:pets:user')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'pets',
            filter: `owner_id=eq.${user.id}`
          },
          () => {
            // Refetch when data changes
            fetchPets();
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [fetchPets]);

  const removePetFromState = useCallback((petId) => {
    setPets(prev => prev.filter(p => p.id !== petId));
  }, []);

  const addPetToState = useCallback((newPet) => {
    setPets(prev => [newPet, ...prev]);
  }, []);

  return { pets, loading, error, refetch: fetchPets, removePetFromState, addPetToState };
};
