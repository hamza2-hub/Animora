import { supabase } from '../lib/supabase';

export const profileService = {
  async getDoctorProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, specialty, bio, experience_years, clinic_address')
      .eq('role', 'doctor');

    if (error) throw error;
    return data;
  },

  async updateDoctorProfile(userId, profileData) {
    const { error } = await supabase
      .from('profiles')
      .update({
        specialty: profileData.specialty,
        bio: profileData.bio,
        experience_years: profileData.experience_years,
        clinic_address: profileData.clinic_address
      })
      .eq('id', userId);

    if (error) throw error;
    return true;
  }
};
