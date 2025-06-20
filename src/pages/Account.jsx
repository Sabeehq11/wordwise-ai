import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setDisplayName(currentUser.displayName || '');
    setEmail(currentUser.email || '');
  }, [currentUser, navigate]);

  const getInitials = (name) => {
    if (!name) return currentUser?.email?.charAt(0).toUpperCase() || 'U';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const formatJoinDate = (user) => {
    if (!user?.metadata?.creationTime) return 'Recently';
    return new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      <div className="main-content">
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem',
            color: 'white',
            position: 'relative'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}>
                  {getInitials(currentUser?.displayName)}
                </div>
                
                <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    {currentUser?.displayName || 'User'}
                  </h1>
                  <p style={{ opacity: 0.9, fontSize: '1rem' }}>
                    {currentUser?.email}
                  </p>
                  <p style={{ opacity: 0.7, fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    Member since {formatJoinDate(currentUser)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={{
            padding: '1.5rem 2rem 0',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { id: 'profile', label: 'Profile Settings', icon: '👤' },
                { id: 'security', label: 'Security', icon: '🔒' },
                { id: 'usage', label: 'Usage Stats', icon: '📊' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '12px 12px 0 0',
                    backgroundColor: activeTab === tab.id ? '#3b82f6' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#6b7280',
                    fontWeight: activeTab === tab.id ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '2rem' }}>
            {activeTab === 'profile' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
                  Profile Settings
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                    border: '2px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem',
                      fontSize: '1.5rem'
                    }}>
                      👤
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                      Profile Complete
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Your profile is set up and ready to go!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
                  Security Settings
                </h2>
                <div style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  borderRadius: '16px',
                  border: '1px solid #bbf7d0'
                }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#166534' }}>
                    🔒 Account Security
                  </h3>
                  <p style={{ color: '#166534', lineHeight: '1.6' }}>
                    Your account is secured with Firebase Authentication. Contact support for password changes.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
                  Usage Statistics
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {[
                    { label: 'Documents Created', value: '12', icon: '📝', color: '#3b82f6' },
                    { label: 'Grammar Checks', value: '147', icon: '✅', color: '#10b981' },
                    { label: 'Words Analyzed', value: '8,453', icon: '📊', color: '#8b5cf6' },
                    { label: 'Issues Fixed', value: '89', icon: '🔧', color: '#f59e0b' }
                  ].map((stat, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
                        border: `2px solid ${stat.color}40`,
                        borderRadius: '16px',
                        padding: '1.5rem',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: `${stat.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '1.5rem'
                      }}>
                        {stat.icon}
                      </div>
                      <div style={{ fontSize: '2rem', fontWeight: '700', color: stat.color, marginBottom: '0.5rem' }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account; 