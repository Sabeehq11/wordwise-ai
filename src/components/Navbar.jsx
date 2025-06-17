import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            backgroundColor: 'rgba(59, 130, 246, 0.9)',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            marginLeft: '0.5rem',
            fontWeight: '500',
            backdropFilter: 'blur(10px)'
          }}>
            ESL Assistant
          </span>
        </div>
        
        {/* Mobile hamburger button */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Desktop navigation */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {currentUser ? (
            // Authenticated user buttons
            <>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <button style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s'
                }}>
                  🏠 HOME
                </button>
              </Link>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <button style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.9)',
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
                  📝 DASHBOARD
                </button>
              </Link>
              <Link to="/try-it" style={{ textDecoration: 'none' }}>
                <button style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s'
                }}>
                  ✨ TRY IT
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
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s'
                }}>
                  🏠 HOME
                </button>
              </Link>
              <Link to="/try-it" style={{ textDecoration: 'none' }}>
                <button style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s'
                }}>
                  ✨ TRY IT
                </button>
              </Link>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s'
                }}>
                  LOGIN
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
                  SIGN UP
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile navigation menu */}
        <div 
          className={`mobile-nav ${isMobileMenuOpen ? 'mobile-nav-open' : ''}`}
          style={{
            display: 'none',
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(102, 126, 234, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '1rem',
            borderRadius: '0 0 1rem 1rem',
            flexDirection: 'column',
            gap: '0.5rem',
            transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
            opacity: isMobileMenuOpen ? 1 : 0,
            transition: 'all 0.3s ease'
          }}
        >
          {currentUser ? (
            <>
              <Link to="/" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                <button style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'left'
                }}>
                  🏠 HOME
                </button>
              </Link>
              <Link to="/dashboard" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                <button style={{
                  width: '100%',
                  backgroundColor: 'rgba(59, 130, 246, 0.9)',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'left'
                }}>
                  📝 DASHBOARD
                </button>
              </Link>
              <Link to="/try-it" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                <button style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'left'
                }}>
                  ✨ TRY IT
                </button>
              </Link>
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(220, 38, 38, 0.8)',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'left'
                }}
              >
                SIGN OUT
              </button>
            </>
          ) : (
            <>
              <Link to="/" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                <button style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'left'
                }}>
                  🏠 HOME
                </button>
              </Link>
              <Link to="/try-it" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                <button style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'left'
                }}>
                  ✨ TRY IT
                </button>
              </Link>
              <Link to="/login" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                <button style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'left'
                }}>
                  LOGIN
                </button>
              </Link>
              <Link to="/signup" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                <button style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'left'
                }}>
                  SIGN UP
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