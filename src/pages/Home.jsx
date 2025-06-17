import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="main-content">
        <div className="hero-section">
          <div style={{ 
            display: 'inline-block', 
            padding: '0.75rem 1.5rem', 
            background: 'rgba(255, 255, 255, 0.2)', 
            borderRadius: '50px', 
            marginBottom: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <span style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontSize: '0.875rem', 
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              ✨ AI-Powered Writing Assistant
            </span>
          </div>
          
          <h1>Improve Your English Writing</h1>
          <p>
            WordWise helps ESL students write better English with real-time grammar checking, 
            intelligent corrections, and AI-powered writing improvement suggestions.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '2rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                background: '#10b981', 
                borderRadius: '50%',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
              }}></span>
              Real-time Grammar Check
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                background: '#3b82f6', 
                borderRadius: '50%',
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
              }}></span>
              AI-Powered Suggestions
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                background: '#f59e0b', 
                borderRadius: '50%',
                boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
              }}></span>
              Writing Analytics
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            marginTop: '3rem',
            flexWrap: 'wrap'
          }}>
            <Link to="/try-it" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '1rem 2rem',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
              }}>
                ✨ Try It Now - Free
              </button>
            </Link>
            
            {currentUser ? (
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '1rem 2rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(0)';
                }}>
                  📝 My Documents
                </button>
              </Link>
            ) : (
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '1rem 2rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(0)';
                }}>
                  🚀 Get Started
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Simple features section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginTop: '4rem',
          padding: '0 1rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Grammar Checking
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', lineHeight: '1.6' }}>
              Get instant feedback on grammar, spelling, and writing style as you type.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
            <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              AI Suggestions
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', lineHeight: '1.6' }}>
              Powered by OpenAI to provide intelligent writing improvement suggestions.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💾</div>
            <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Save & Organize
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', lineHeight: '1.6' }}>
              Save your documents and track your writing progress over time.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home; 