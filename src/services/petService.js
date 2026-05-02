import { supabase } from '../lib/supabase';

export const petService = {
  async getPets() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addPet(petData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Failsafe: Ensure profile exists to prevent Foreign Key constraint errors
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
    if (!profile) {
      console.warn('Profile missing. Attempting to create profile to satisfy foreign key constraint...');
      await supabase.from('profiles').insert([{
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email.split('@')[0],
        role: user.user_metadata?.role || 'user'
      }]);
    }

    // Parse age to integer to prevent Postgres type errors
    const cleanedPetData = { ...petData };
    if (cleanedPetData.age === '') {
      cleanedPetData.age = null;
    } else if (cleanedPetData.age) {
      cleanedPetData.age = parseInt(cleanedPetData.age, 10);
    }

    const { data, error } = await supabase
      .from('pets')
      .insert([{ ...cleanedPetData, owner_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Supabase Insert Error:', error);
      alert(`Database error: ${error.message}`);
      throw error;
    }
    return data;
  },

  async deletePet(petId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', petId)
      .eq('owner_id', user.id); // Safety: only delete own pets

    if (error) throw error;
  }
};
