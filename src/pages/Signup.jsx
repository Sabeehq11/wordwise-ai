import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiZap, FiEdit3, FiStar, FiCheckCircle } from 'react-icons/fi';

const Signup = ({ theme }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await signup(email, password, displayName);
      // Redirect to dashboard after successful signup
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="signup-page-container" style={{
        fontFamily: 'Inter, Poppins, sans-serif !important',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Floating Animated Elements */}
        <div style={{
          position: 'absolute',
          top: '8%',
          left: '12%',
          width: '90px',
          height: '90px',
          background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
          borderRadius: '50%',
          opacity: '0.3',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '8%',
          width: '70px',
          height: '70px',
          background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
          borderRadius: '50%',
          opacity: '0.4',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '110px',
          height: '110px',
          background: 'linear-gradient(135deg, #55efc4 0%, #81ecec 100%)',
          borderRadius: '50%',
          opacity: '0.2',
          animation: 'float 10s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '30%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
          borderRadius: '50%',
          opacity: '0.3',
          animation: 'float 7s ease-in-out infinite reverse'
        }}></div>

        {/* Main Content */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '40px 20px',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{ maxWidth: '520px', width: '100%' }}>
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              {/* Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '12px 24px',
                borderRadius: '50px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '32px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <FiZap style={{ width: '20px', height: '20px', marginRight: '8px', color: '#ffeaa7' }} />
                ✨ Join WordWise AI
              </div>
              
              <h1 style={{ 
                fontSize: '48px', 
                fontWeight: '900', 
                color: 'white', 
                marginBottom: '16px', 
                lineHeight: '1.1',
                fontFamily: 'Poppins, Inter, sans-serif'
              }}>
                Start Your Journey
              </h1>
              <p style={{ 
                fontSize: '20px', 
                color: 'rgba(255, 255, 255, 0.9)', 
                marginBottom: '0',
                fontWeight: '300',
                lineHeight: '1.6'
              }}>
                Create your account and unlock AI-powered writing assistance
              </p>
            </div>

            {/* Signup Form Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '32px',
              padding: '48px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 32px 64px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease'
            }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {error && (
                  <div style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '16px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {error}
                  </div>
                )}

                {/* Display Name Field */}
                <div>
                  <label htmlFor="displayName" style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#374151',
                    marginBottom: '8px',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FiUser style={{
                      position: 'absolute',
                      left: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9ca3af',
                      width: '20px',
                      height: '20px'
                    }} />
                    <input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      style={{
                        width: '100%',
                        paddingLeft: '56px',
                        paddingRight: '20px',
                        paddingTop: '18px',
                        paddingBottom: '18px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '2px solid #e5e7eb',
                        borderRadius: '16px',
                        fontSize: '16px',
                        color: '#1f2937',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Inter, sans-serif'
                      }}
                      placeholder="Enter your full name"
                      required
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#374151',
                    marginBottom: '8px',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FiMail style={{
                      position: 'absolute',
                      left: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9ca3af',
                      width: '20px',
                      height: '20px'
                    }} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        paddingLeft: '56px',
                        paddingRight: '20px',
                        paddingTop: '18px',
                        paddingBottom: '18px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '2px solid #e5e7eb',
                        borderRadius: '16px',
                        fontSize: '16px',
                        color: '#1f2937',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Inter, sans-serif'
                      }}
                      placeholder="Enter your email"
                      required
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#374151',
                    marginBottom: '8px',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FiLock style={{
                      position: 'absolute',
                      left: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9ca3af',
                      width: '20px',
                      height: '20px'
                    }} />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        paddingLeft: '56px',
                        paddingRight: '56px',
                        paddingTop: '18px',
                        paddingBottom: '18px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '2px solid #e5e7eb',
                        borderRadius: '16px',
                        fontSize: '16px',
                        color: '#1f2937',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Inter, sans-serif'
                      }}
                      placeholder="Create a password (min. 6 characters)"
                      required
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#6b7280'}
                      onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                    >
                      {showPassword ? <FiEyeOff style={{ width: '20px', height: '20px' }} /> : <FiEye style={{ width: '20px', height: '20px' }} />}
                    </button>
                  </div>
                  <p style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#6b7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Password must be at least 6 characters long
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    background: loading ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 16px 32px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 16px 32px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                >
                  {loading ? (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  ) : (
                    <>
                      Create Account
                      <FiArrowRight style={{ marginLeft: '8px', width: '20px', height: '20px' }} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div style={{ marginTop: '32px', textAlign: 'center' }}>
                <p style={{ color: '#6b7280', fontSize: '16px', fontFamily: 'Inter, sans-serif' }}>
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    style={{
                      fontWeight: '600',
                      color: '#667eea',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            {/* Feature Preview Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '16px',
              marginTop: '48px'
            }}>
              {[
                { icon: FiEdit3, title: 'Smart Writing', desc: 'AI-powered suggestions' },
                { icon: FiCheckCircle, title: 'Grammar Check', desc: 'Perfect your text' },
                { icon: FiStar, title: 'Progress Track', desc: 'Monitor improvement' }
              ].map((feature, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '24px 16px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}>
                  <feature.icon style={{ 
                    width: '32px', 
                    height: '32px', 
                    color: '#ffeaa7', 
                    marginBottom: '12px',
                    margin: '0 auto 12px auto'
                  }} />
                  <h3 style={{ 
                    fontSize: '14px', 
                    fontWeight: '700', 
                    color: 'white', 
                    marginBottom: '4px',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{ 
                    fontSize: '12px', 
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .signup-page-container {
          font-family: 'Inter', 'Poppins', sans-serif !important;
        }
        
        .signup-page-container * {
          font-family: inherit !important;
        }
        
        /* Enhanced Mobile Responsiveness */
        @media (max-width: 768px) {
          .signup-page-container .floating-element {
            display: none !important;
          }
          
          .signup-page-container h1 {
            font-size: 36px !important;
          }
          
          .signup-page-container .main-content {
            padding: 20px 16px !important;
          }
          
          .signup-page-container .form-card {
            padding: 32px 24px !important;
            margin: 0 16px !important;
          }
          
          .signup-page-container .feature-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
            margin-top: 32px !important;
          }
          
          .signup-page-container .feature-card {
            padding: 20px 16px !important;
          }
        }
        
        @media (max-width: 480px) {
          .signup-page-container h1 {
            font-size: 28px !important;
          }
          
          .signup-page-container .hero-text {
            font-size: 16px !important;
          }
          
          .signup-page-container .form-card {
            padding: 24px 20px !important;
            margin: 0 12px !important;
          }
          
          .signup-page-container input {
            padding: 16px 16px 16px 48px !important;
            font-size: 16px !important;
          }
          
          .signup-page-container button {
            padding: 18px !important;
            font-size: 16px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Signup; 