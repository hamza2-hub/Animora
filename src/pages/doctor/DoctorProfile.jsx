import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save, User, Stethoscope, Clock, MapPin,
  AlignLeft, Loader2, CheckCircle, Edit3, Award
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import '../../styles/pages/dashboard.css';

/* ─── Avatar ──────────────────────────────── */
const Avatar = ({ url, name, size = 100 }) => {
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];
  const initials = (name || '').split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
  return url ? (
    <img src={url} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${color}22, ${color}55)`,
      border: `3px solid ${color}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color, fontWeight: 800, fontSize: size * 0.32,
    }}>
      {initials || <User size={size * 0.4} />}
    </div>
  );
};

/* ─── Field ──────────────────────────────── */
const Field = ({ label, icon, children, hint }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      <span style={{ color: 'var(--primary)' }}>{icon}</span>
      {label}
    </label>
    {children}
    {hint && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{hint}</p>}
  </div>
);

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem',
  border: '1.5px solid var(--border)',
  borderRadius: 'var(--border-radius-md)',
  fontSize: '0.9rem', fontFamily: 'inherit',
  color: 'var(--text-main)', background: '#f8fafc',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
};

/* ─── ProfilePreviewCard ─────────────────── */
const ProfilePreviewCard = ({ profile, formData }) => {
  const name = profile?.full_name || 'Your Name';
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-soft)' }}>
      <div style={{ height: 8, background: 'linear-gradient(90deg, var(--primary), #34d399)' }} />
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
        <div style={{ position: 'relative' }}>
          <Avatar url={profile?.avatar_url} name={name} size={88} />
          <div style={{ position: 'absolute', bottom: 2, right: 2, width: 16, height: 16, borderRadius: '50%', background: '#10b981', border: '2px solid white' }} />
        </div>

        <div>
          <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>Dr. {name}</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600, marginTop: 2 }}>
            {formData.specialty || 'Specialty not set'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 2 }}>
          {[1,2,3,4,5].map(i => (
            <svg key={i} width={13} height={13} fill="#f59e0b" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          ))}
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 4 }}>4.9</span>
        </div>

        <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[
            { icon: <Award size={13} />, val: formData.experience_years ? `${formData.experience_years} yrs experience` : null },
            { icon: <MapPin size={13} />, val: formData.clinic_address || null },
          ].filter(x => x.val).map(({ icon, val }) => (
            <div key={val} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)', justifyContent: 'center' }}>
              <span style={{ color: 'var(--primary)', flexShrink: 0 }}>{icon}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Completion Meter ───────────────────── */
const CompletionMeter = ({ formData }) => {
  const fields = [formData.specialty, formData.experience_years, formData.clinic_address, formData.bio];
  const filled = fields.filter(Boolean).length;
  const pct = Math.round((filled / fields.length) * 100);
  const color = pct === 100 ? 'var(--primary)' : pct >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow-soft)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Profile Completion</span>
        <span style={{ fontSize: '1rem', fontWeight: 800, color }}>{pct}%</span>
      </div>
      <div style={{ height: 8, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.75rem' }}>
        {[
          { label: 'Specialty', val: formData.specialty },
          { label: 'Experience', val: formData.experience_years },
          { label: 'Clinic Address', val: formData.clinic_address },
          { label: 'Bio / CV', val: formData.bio },
        ].map(({ label, val }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: val ? 'var(--text-main)' : 'var(--text-muted)' }}>
            <CheckCircle size={13} style={{ color: val ? 'var(--primary)' : 'var(--border)', flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Main page ──────────────────────────── */
const DoctorProfile = () => {
  const { user, profile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ specialty: '', experience_years: '', clinic_address: '', bio: '' });

  useEffect(() => {
    if (profile) {
      setFormData({
        specialty: profile.specialty || '',
        experience_years: profile.experience_years || '',
        clinic_address: profile.clinic_address || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const focusInput = e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-light)'; e.target.style.background = 'white'; };
  const blurInput = e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await profileService.updateDoctorProfile(user.id, {
        ...formData,
        experience_years: formData.experience_years ? parseInt(formData.experience_years, 10) : null,
      });
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease forwards', maxWidth: 1100, margin: '0 auto' }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="dashboard-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Edit3 size={22} style={{ color: 'var(--primary)' }} />
          My Public Profile
        </h1>
        <p className="dashboard-subtitle">Manage what pet owners see when they browse for a doctor</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>

          {/* ── LEFT: form panels ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Professional info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-soft)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-dark)', flexShrink: 0 }}>
                  <Stethoscope size={18} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1rem' }}>Professional Details</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Visible to pet owners searching for a doctor</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <Field label="Specialty" icon={<Stethoscope size={13} />}>
                  <input
                    name="specialty" value={formData.specialty} onChange={handleChange}
                    placeholder="e.g. Feline Specialist, Surgery"
                    style={inputStyle} onFocus={focusInput} onBlur={blurInput}
                  />
                </Field>

                <Field label="Years of Experience" icon={<Clock size={13} />}>
                  <input
                    type="number" name="experience_years" value={formData.experience_years} onChange={handleChange}
                    placeholder="e.g. 8" min="0" max="60"
                    style={inputStyle} onFocus={focusInput} onBlur={blurInput}
                  />
                </Field>

                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label="Clinic Address" icon={<MapPin size={13} />}>
                    <input
                      name="clinic_address" value={formData.clinic_address} onChange={handleChange}
                      placeholder="e.g. 12 Animal Care Lane, Algiers"
                      style={inputStyle} onFocus={focusInput} onBlur={blurInput}
                    />
                  </Field>
                </div>
              </div>
            </motion.div>

            {/* Bio / CV */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-soft)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', flexShrink: 0 }}>
                  <AlignLeft size={18} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1rem' }}>Professional Bio & CV</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tell pet owners about your education, experience, and approach</p>
                </div>
              </div>

              <textarea
                name="bio" value={formData.bio} onChange={handleChange}
                placeholder="Write a compelling bio — include your education, years in practice, areas of expertise, your philosophy of care, and any specializations..."
                rows={9}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7, minHeight: 200 }}
                onFocus={focusInput} onBlur={blurInput}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'right' }}>
                {formData.bio.length} characters
              </p>
            </motion.div>

            {/* Save button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button type="submit" disabled={isSaving} style={{ minWidth: 160, gap: 8 }}>
                {isSaving
                  ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
                  : <><Save size={18} /> Save Profile</>
                }
              </Button>
            </motion.div>
          </div>

          {/* ── RIGHT: sidebar ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '1.5rem' }}>
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>Preview</p>
              <ProfilePreviewCard profile={profile} formData={formData} />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 }}>
              <CompletionMeter formData={formData} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}
              style={{ background: 'var(--primary-light)', borderRadius: 'var(--border-radius-lg)', padding: '1.1rem 1.25rem' }}
            >
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: 6 }}>💡 Tips</p>
              <ul style={{ paddingLeft: '1rem', margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {['Add a specialty to appear in filtered searches', 'A complete bio increases booking rate by 3×', 'Keep your address up-to-date for easy navigation'].map(tip => (
                  <li key={tip} style={{ fontSize: '0.78rem', color: 'var(--primary-dark)', lineHeight: 1.5 }}>{tip}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </form>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          form > div { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          form > div > div:first-child > div:first-child > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default DoctorProfile;
