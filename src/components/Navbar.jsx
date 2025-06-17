import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" className="navbar-brand">
            WordWise
          </Link>
          <span style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            marginLeft: '0.5rem',
            fontWeight: '500'
          }}>
            ESL Assistant
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {currentUser ? (
            // Authenticated user buttons
            <>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <button style={{
                  backgroundColor: 'transparent',
                  color: 'rgba(255, 255, 255, 0.8)',
                  padding: '0.5rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s'
                }}>
                  🏠 Home
                </button>
              </Link>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <button style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s'
                }}>
                  📝 Dashboard
                </button>
              </Link>
              <Link to="/try-it" style={{ textDecoration: 'none' }}>
                <button style={{
                  backgroundColor: 'transparent',
                  color: 'rgba(255, 255, 255, 0.8)',
                  padding: '0.5rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s'
                }}>
                  ✨ Try It
                </button>
              </Link>
              <button 
                onClick={handleLogout}
                style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.8)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s'
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            // Non-authenticated user buttons
            <>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <button style={{
                  backgroundColor: 'transparent',
                  color: 'rgba(255, 255, 255, 0.8)',
                  padding: '0.5rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s'
                }}>
                  🏠 Home
                </button>
              </Link>
              <Link to="/try-it" style={{ textDecoration: 'none' }}>
                <button style={{
                  backgroundColor: 'transparent',
                  color: 'rgba(255, 255, 255, 0.8)',
                  padding: '0.5rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s'
                }}>
                  ✨ Try It
                </button>
              </Link>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  backgroundColor: 'transparent',
                  color: 'rgba(255, 255, 255, 0.8)',
                  padding: '0.5rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s'
                }}>
                  Login
                </button>
              </Link>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s'
                }}>
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 