import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PawPrint, User, Stethoscope } from 'lucide-react';
import { useAppContext } from '../../core/context/AppContext';
import Button from '../../components/ui/Button';
import '../../styles/pages/auth.css';

const Register = () => {
  const [role, setRole] = useState('user');
  const navigate = useNavigate();
  const { login } = useAppContext();

  const handleRegister = (e) => {
    e.preventDefault();
    login(role, { firstName: 'New', lastName: 'User', email: 'new@example.com' });
    navigate(`/${role}-dashboard`);
  };

  return (
    <div className="auth-container">
      <div className="auth-image-panel">
        <img 
          src="https://images.unsplash.com/photo-1544568100-847a9ec5c583?auto=format&fit=crop&q=80&w=1200" 
          alt="Cute dog and cat" 
          className="auth-image"
        />
        <div className="auth-image-overlay">
          <h1 className="auth-quote animate-slide-up">"Your pet's health is our top priority."</h1>
          <p className="text-light animate-slide-up" style={{ animationDelay: '0.1s' }}>Sign up and give your pets the care they deserve.</p>
        </div>
      </div>
      
      <div className="auth-form-panel">
        <div className="auth-card auth-panel-enter">
          <div className="auth-header" style={{ marginBottom: '1.5rem' }}>
            <div className="auth-logo" style={{ padding: '0.75rem', marginBottom: '0.5rem' }}>
              <PawPrint size={28} />
            </div>
            <h2 className="auth-title" style={{ fontSize: '1.5rem' }}>Create Account</h2>
          </div>

          <form onSubmit={handleRegister}>
            <div className="role-selector" style={{ marginBottom: '1rem' }}>
              <button 
                type="button" 
                className={`role-btn ${role === 'user' ? 'selected' : ''}`}
                onClick={() => setRole('user')}
              >
                <User size={20} />
                Pet Owner
              </button>
              <button 
                type="button" 
                className={`role-btn ${role === 'doctor' ? 'selected' : ''}`}
                onClick={() => setRole('doctor')}
              >
                <Stethoscope size={20} />
                Veterinarian
              </button>
            </div>

            <div className="flex gap-3">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">First Name</label>
                <input type="text" required className="form-input" placeholder="First" />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Last Name</label>
                <input type="text" required className="form-input" placeholder="Last" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" required className="form-input" placeholder="Enter your email" />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" required className="form-input" placeholder="Phone Number" />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" required className="form-input" placeholder="Create password" />
            </div>

            <Button type="submit" className="w-full mt-2">Sign Up</Button>
          </form>

          <div className="auth-footer" style={{ marginTop: '1rem' }}>
            Already have an account? 
            <Link to="/login" className="auth-link">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
