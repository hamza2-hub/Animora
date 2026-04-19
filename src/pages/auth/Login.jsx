import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PawPrint, User, Stethoscope } from 'lucide-react';
import { useAppContext } from '../../core/context/AppContext';
import Button from '../../components/ui/Button';
import '../../styles/pages/auth.css';

const Login = () => {
  const [role, setRole] = useState('user');
  const navigate = useNavigate();
  const { login } = useAppContext();

  const handleLogin = (e) => {
    e.preventDefault();
    login(role, { firstName: 'John', lastName: 'Doe', email: 'john@example.com' });
    navigate(`/${role}-dashboard`);
  };

  return (
    <div className="auth-container">
      <div className="auth-image-panel">
        <img 
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1200" 
          alt="Happy pets" 
          className="auth-image"
        />
        <div className="auth-image-overlay">
          <h1 className="auth-quote animate-slide-up">"Providing the best care for your furry friends."</h1>
          <p className="text-light animate-slide-up" style={{ animationDelay: '0.1s' }}>Join Animora today and experience world-class veterinary service.</p>
        </div>
      </div>
      
      <div className="auth-form-panel">
        <div className="auth-card auth-panel-enter">
          <div className="auth-header">
            <div className="auth-logo">
              <PawPrint size={36} />
            </div>
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your Animora account</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="role-selector">
              <button 
                type="button" 
                className={`role-btn ${role === 'user' ? 'selected' : ''}`}
                onClick={() => setRole('user')}
              >
                <User size={24} />
                Pet Owner
              </button>
              <button 
                type="button" 
                className={`role-btn ${role === 'doctor' ? 'selected' : ''}`}
                onClick={() => setRole('doctor')}
              >
                <Stethoscope size={24} />
                Veterinarian
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" required className="form-input" placeholder="Enter your email" />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" required className="form-input" placeholder="Enter your password" />
            </div>

            <Button type="submit" className="w-full mt-2">Sign In</Button>
          </form>

          <div className="auth-footer">
            Don't have an account? 
            <Link to="/register" className="auth-link">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
