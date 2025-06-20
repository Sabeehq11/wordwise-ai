import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logOut } from '../firebase/auth';
import { FiDroplet, FiChevronDown, FiUser, FiLogOut, FiSettings, FiEdit3 } from 'react-icons/fi';

const Navbar = ({ theme, themes, currentTheme, onThemeChange }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <header className="navbar-modern" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: `rgba(${theme?.primary ? theme.primary.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ') : '255, 255, 255'}, 0.1)`,
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${theme?.colors?.primary || theme?.primary}20`,
      boxShadow: `0 4px 20px ${theme?.colors?.primary || theme?.primary}15`
    }}>
      <nav style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <NavLink to="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            textDecoration: 'none',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              <FiEdit3 style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <span style={{
              fontSize: '32px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: 'Poppins, Inter, sans-serif'
            }}>
              WordWise AI
            </span>
          </NavLink>
          
          {/* Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <NavLink 
              to="/" 
              style={({ isActive }) => ({
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '16px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                background: isActive 
                  ? `linear-gradient(135deg, ${theme?.colors?.primary || theme?.primary} 0%, ${theme?.colors?.secondary || theme?.secondary} 100%)` 
                  : 'transparent',
                color: isActive ? 'white' : '#2d3436',
                boxShadow: isActive ? `0 4px 15px ${theme?.colors?.primary || theme?.primary}30` : 'none'
              })}
            >
              Home
            </NavLink>
            <NavLink 
              to="/try" 
              style={({ isActive }) => ({
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '16px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                background: isActive 
                  ? `linear-gradient(135deg, ${theme?.colors?.primary || theme?.primary} 0%, ${theme?.colors?.secondary || theme?.secondary} 100%)` 
                  : 'transparent',
                color: isActive ? 'white' : '#2d3436',
                boxShadow: isActive ? `0 4px 15px ${theme?.colors?.primary || theme?.primary}30` : 'none'
              })}
            >
              Try It Free
            </NavLink>
            {currentUser && (
              <NavLink 
                to="/dashboard" 
                style={({ isActive }) => ({
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  background: isActive 
                    ? `linear-gradient(135deg, ${theme?.colors?.primary || theme?.primary} 0%, ${theme?.colors?.secondary || theme?.secondary} 100%)` 
                    : 'transparent',
                  color: isActive ? 'white' : '#2d3436',
                  boxShadow: isActive ? `0 4px 15px ${theme?.colors?.primary || theme?.primary}30` : 'none'
                })}
              >
                Dashboard
              </NavLink>
            )}
          </div>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Theme Selector */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                className="theme-button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 24px',
                  background: `linear-gradient(135deg, ${theme?.colors?.primary || theme?.primary} 0%, ${theme?.colors?.secondary || theme?.secondary} 100%)`,
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 8px 25px ${theme?.colors?.primary || theme?.primary}30`
                }}
              >
                <FiDroplet style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                Themes
                <FiChevronDown style={{ width: '16px', height: '16px', marginLeft: '8px' }} />
              </button>
              
              {showThemeSelector && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '8px',
                  width: '320px',
                  background: `rgba(${theme?.primary ? theme.primary.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ') : '255, 255, 255'}, 0.95)`,
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: `0 20px 40px ${theme?.colors?.primary || theme?.primary}15`,
                  border: `1px solid ${theme?.colors?.primary || theme?.primary}20`,
                  padding: '16px',
                  zIndex: 50
                }}>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#2d3436',
                    padding: '8px 12px',
                    marginBottom: '16px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    🎨 Choose Your Theme
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {[
                      { key: 'blue', name: 'Ocean Blue', desc: 'Professional & Clean', colors: ['#3b82f6', '#6366f1'] },
                      { key: 'green', name: 'Forest Green', desc: 'Natural & Peaceful', colors: ['#10b981', '#65a30d'] },
                      { key: 'purple', name: 'Royal Purple', desc: 'Elegant & Creative', colors: ['#a855f7', '#ec4899'] }
                    ].map((themeOption) => (
                      <button
                        key={themeOption.key}
                        onClick={() => {
                          onThemeChange(themeOption.key);
                          setShowThemeSelector(false);
                        }}
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          background: currentTheme === themeOption.key 
                            ? `linear-gradient(135deg, ${themeOption.colors[0]}20, ${themeOption.colors[1]}20)` 
                            : 'transparent',
                          border: currentTheme === themeOption.key 
                            ? `2px solid ${themeOption.colors[0]}` 
                            : '2px solid transparent',
                          cursor: 'pointer',
                          boxShadow: currentTheme === themeOption.key ? `0 4px 15px ${themeOption.colors[0]}30` : 'none'
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: `linear-gradient(135deg, ${themeOption.colors[0]}, ${themeOption.colors[1]})`,
                          marginBottom: '12px',
                          boxShadow: `0 4px 12px ${themeOption.colors[0]}40`
                        }}></div>
                        <div style={{ fontWeight: '600', color: '#2d3436', fontSize: '14px', marginBottom: '4px' }}>
                          {themeOption.name}
                        </div>
                        <div style={{ color: '#636e72', fontSize: '12px' }}>
                          {themeOption.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            {currentUser ? (
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 24px',
                    background: `linear-gradient(135deg, ${theme?.colors?.primary || theme?.primary} 0%, ${theme?.colors?.secondary || theme?.secondary} 100%)`,
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '16px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: `0 8px 25px ${theme?.colors?.primary || theme?.primary}30`
                  }}
                >
                  <FiUser style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                  <FiChevronDown style={{ width: '16px', height: '16px', marginLeft: '8px' }} />
                </button>
                
                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    marginTop: '8px',
                    width: '220px',
                    background: `rgba(${theme?.primary ? theme.primary.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ') : '255, 255, 255'}, 0.95)`,
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    boxShadow: `0 20px 40px ${theme?.colors?.primary || theme?.primary}15`,
                    border: `1px solid ${theme?.colors?.primary || theme?.primary}20`,
                    padding: '8px',
                    zIndex: 50
                  }}>
                    <NavLink 
                      to="/account" 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        color: '#2d3436',
                        textDecoration: 'none',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        background: 'transparent'
                      }}
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FiSettings style={{ width: '18px', height: '18px', marginRight: '12px' }} />
                      Account Settings
                    </NavLink>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        color: '#e17055',
                        background: 'transparent',
                        border: 'none',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <FiLogOut style={{ width: '18px', height: '18px', marginRight: '12px' }} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <NavLink 
                  to="/login" 
                  style={{
                    padding: '12px 24px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    color: '#2d3436',
                    fontWeight: '600',
                    fontSize: '16px',
                    borderRadius: '12px',
                    border: `2px solid ${theme?.colors?.primary || theme?.primary}20`,
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Sign In
                </NavLink>
                <NavLink 
                  to="/signup" 
                  style={{
                    padding: '12px 24px',
                    background: `linear-gradient(135deg, ${theme?.colors?.primary || theme?.primary} 0%, ${theme?.colors?.secondary || theme?.secondary} 100%)`,
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    boxShadow: `0 8px 25px ${theme?.colors?.primary || theme?.primary}30`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  Get Started
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar; 