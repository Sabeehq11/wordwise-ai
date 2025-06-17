import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { signup, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) clearError();
    if (validationError) setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setValidationError('Password should be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      await signup(formData.email, formData.password, formData.name);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      // Error will be displayed via context
    }
    
    setLoading(false);
  };

  const displayError = error || validationError;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <div className="form-container">
          <h2 className="form-title">Create Account</h2>
          
          {displayError && (
            <div className="error-message" style={{ marginBottom: '1rem' }}>
              {displayError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
                minLength="6"
              />
              <small style={{ color: '#6b7280', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                Password must be at least 6 characters
              </small>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="form-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280' }}>
            Already have an account?{' '}
            <Link to="/login" className="form-link">Sign in here</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup; 