import { supabase } from '../lib/supabase';

export const appointmentService = {
  async getAppointments() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        pets (name, type),
        doctor:profiles!doctor_id (full_name)
      `)
      .eq('owner_id', user.id)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getDoctors() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('role', 'doctor');

    if (error) throw error;
    return data;
  },

  async createAppointment(appointmentData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('appointments')
      .insert([{ 
        ...appointmentData, 
        owner_id: user.id,
        files: appointmentData.files || [],
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
