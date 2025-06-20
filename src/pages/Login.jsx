import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signIn } from '../firebase/auth';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiZap, FiEdit3, FiStar, FiCheckCircle } from 'react-icons/fi';

const Login = ({ theme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container" style={{
      fontFamily: 'Inter, Poppins, sans-serif !important',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Animated Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '8%',
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
        borderRadius: '50%',
        opacity: '0.3',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
        borderRadius: '50%',
        opacity: '0.4',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '15%',
        width: '100px',
        height: '100px',
        background: 'linear-gradient(135deg, #55efc4 0%, #81ecec 100%)',
        borderRadius: '50%',
        opacity: '0.2',
        animation: 'float 10s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '25%',
        right: '20%',
        width: '70px',
        height: '70px',
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
        <div style={{ maxWidth: '500px', width: '100%' }}>
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
              ✨ Welcome Back
            </div>
            
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: '900', 
              color: 'white', 
              marginBottom: '16px', 
              lineHeight: '1.1',
              fontFamily: 'Poppins, Inter, sans-serif'
            }}>
              Sign In
            </h1>
            <p style={{ 
              fontSize: '20px', 
              color: 'rgba(255, 255, 255, 0.9)', 
              marginBottom: '0',
              fontWeight: '300',
              lineHeight: '1.6'
            }}>
              Sign in to continue improving your writing
            </p>
          </div>

          {/* Login Form Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '32px',
            padding: '48px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease'
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {error && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(238, 90, 82, 0.2) 100%)',
                  backdropFilter: 'blur(10px)',
                  color: '#e74c3c',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: '1px solid rgba(231, 76, 60, 0.2)',
                  boxShadow: '0 8px 24px rgba(231, 76, 60, 0.1)'
                }}>
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label htmlFor="email" style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#2d3436',
                  fontFamily: 'Inter, Poppins, sans-serif'
                }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <FiMail style={{
                    position: 'absolute',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#636e72',
                    width: '20px',
                    height: '20px',
                    zIndex: 2
                  }} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    style={{
                      width: '100%',
                      padding: '20px 20px 20px 56px',
                      fontSize: '16px',
                      fontFamily: 'Inter, Poppins, sans-serif',
                      color: '#2d3436',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(45, 52, 54, 0.1)',
                      borderRadius: '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.15)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(45, 52, 54, 0.1)';
                      e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.05)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label htmlFor="password" style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#2d3436',
                  fontFamily: 'Inter, Poppins, sans-serif'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{
                    position: 'absolute',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#636e72',
                    width: '20px',
                    height: '20px',
                    zIndex: 2
                  }} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    style={{
                      width: '100%',
                      padding: '20px 56px 20px 56px',
                      fontSize: '16px',
                      fontFamily: 'Inter, Poppins, sans-serif',
                      color: '#2d3436',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(45, 52, 54, 0.1)',
                      borderRadius: '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.15)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(45, 52, 54, 0.1)';
                      e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.05)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.8)';
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
                      color: '#636e72',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#2d3436'}
                    onMouseLeave={(e) => e.target.style.color = '#636e72'}
                  >
                    {showPassword ? <FiEyeOff style={{ width: '20px', height: '20px' }} /> : <FiEye style={{ width: '20px', height: '20px' }} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '20px',
                  fontSize: '18px',
                  fontWeight: '600',
                  fontFamily: 'Inter, Poppins, sans-serif',
                  color: 'white',
                  background: loading 
                    ? 'linear-gradient(135deg, #a0a0a0 0%, #888888 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: loading 
                    ? '0 8px 24px rgba(160, 160, 160, 0.3)'
                    : '0 8px 24px rgba(102, 126, 234, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid white',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <FiArrowRight style={{ width: '20px', height: '20px' }} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '32px', borderTop: '1px solid rgba(45, 52, 54, 0.1)' }}>
              <p style={{ 
                color: '#636e72', 
                fontSize: '16px', 
                fontFamily: 'Inter, Poppins, sans-serif',
                margin: '0'
              }}>
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  style={{
                    color: '#667eea',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#5a6fd8'}
                  onMouseLeave={(e) => e.target.style.color = '#667eea'}
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>

          {/* Features Preview */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '24px', 
            marginTop: '48px' 
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}>
              <FiEdit3 style={{ width: '32px', height: '32px', color: '#ffeaa7', marginBottom: '12px' }} />
              <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginBottom: '8px', fontFamily: 'Inter, Poppins, sans-serif' }}>
                AI Writing Assistant
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: '0', fontFamily: 'Inter, Poppins, sans-serif' }}>
                Real-time grammar and style suggestions
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}>
              <FiStar style={{ width: '32px', height: '32px', color: '#fd79a8', marginBottom: '12px' }} />
              <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginBottom: '8px', fontFamily: 'Inter, Poppins, sans-serif' }}>
                Progress Tracking
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: '0', fontFamily: 'Inter, Poppins, sans-serif' }}>
                Monitor your writing improvement
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page-container {
          font-family: 'Inter', 'Poppins', sans-serif !important;
        }
        .login-page-container * {
          box-sizing: border-box;
        }
        .login-page-container input::placeholder {
          color: rgba(99, 110, 114, 0.7) !important;
          font-family: 'Inter', 'Poppins', sans-serif !important;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Enhanced Mobile Responsiveness */
        @media (max-width: 768px) {
          .login-page-container .floating-element {
            display: none !important;
          }
          
          .login-page-container h1 {
            font-size: 36px !important;
          }
          
          .login-page-container p {
            font-size: 18px !important;
          }
          
          .login-page-container .main-content {
            padding: 20px 16px !important;
          }
          
          .login-page-container .form-card {
            padding: 32px 24px !important;
            margin: 0 16px !important;
          }
          
          .login-page-container .feature-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            margin-top: 32px !important;
          }
          
          .login-page-container .feature-card {
            padding: 20px 16px !important;
          }
        }
        
        @media (max-width: 480px) {
          .login-page-container h1 {
            font-size: 28px !important;
          }
          
          .login-page-container .hero-text {
            font-size: 16px !important;
          }
          
          .login-page-container .form-card {
            padding: 24px 20px !important;
            margin: 0 12px !important;
          }
          
          .login-page-container input {
            padding: 16px 16px 16px 48px !important;
            font-size: 16px !important;
          }
          
          .login-page-container button {
            padding: 18px !important;
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login; 