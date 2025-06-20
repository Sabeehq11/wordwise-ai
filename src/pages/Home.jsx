import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiZap, FiShield, FiUsers, FiStar, FiArrowRight, FiCheck } from 'react-icons/fi';

const Home = ({ theme }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Hero Section */}
      <section className="hero-gradient" style={{ 
        padding: '120px 20px', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Floating Elements */}
        <div className="floating" style={{
          position: 'absolute',
          top: '80px',
          left: '10%',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
          borderRadius: '50%',
          opacity: 0.3
        }}></div>
        <div className="floating" style={{
          position: 'absolute',
          top: '160px',
          right: '15%',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
          borderRadius: '50%',
          opacity: 0.4
        }}></div>
        <div className="floating" style={{
          position: 'absolute',
          bottom: '80px',
          left: '25%',
          width: '50px',
          height: '50px',
          background: 'linear-gradient(135deg, #55efc4 0%, #81ecec 100%)',
          borderRadius: '50%',
          opacity: 0.3
        }}></div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
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
            ✨ AI-Powered Writing Assistant
          </div>
          
          {/* Main Headline */}
          <h1 style={{ 
            fontSize: '80px', 
            fontWeight: '900', 
            color: 'white', 
            marginBottom: '24px', 
            lineHeight: '1.1',
            fontFamily: 'Poppins, Inter, sans-serif'
          }}>
            Write with
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 50%, #fd79a8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              confidence.
            </span>
          </h1>
          
          {/* Subheadline */}
          <p style={{ 
            fontSize: '24px', 
            color: 'rgba(255, 255, 255, 0.9)', 
            marginBottom: '48px', 
            maxWidth: '800px', 
            margin: '0 auto 48px auto',
            fontWeight: '300',
            lineHeight: '1.6'
          }}>
            WordWise AI is the next-generation writing assistant designed specifically for ESL students. Get real-time, context-aware feedback that doesn't just correct your mistakes—it helps you learn and improve.
          </p>
          
          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', alignItems: 'center', marginBottom: '64px', flexWrap: 'wrap' }}>
            <NavLink 
              to="/try" 
              className="vibrant-button"
              style={{ 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)',
                color: 'white',
                fontWeight: '700',
                padding: '20px 40px',
                borderRadius: '16px',
                fontSize: '20px',
                boxShadow: '0 15px 35px rgba(255, 107, 107, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              Try It Free
              <FiArrowRight style={{ marginLeft: '12px', width: '24px', height: '24px' }} />
            </NavLink>
            <NavLink 
              to="/dashboard" 
              style={{ 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                padding: '20px 40px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                color: 'white',
                fontWeight: '600',
                fontSize: '20px',
                borderRadius: '16px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              Go to Dashboard →
            </NavLink>
          </div>
          
          {/* Social Proof */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '24px' }}>
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} style={{ width: '24px', height: '24px', color: '#ffeaa7', fill: '#ffeaa7' }} />
              ))}
            </div>
            <span style={{ fontSize: '20px', fontWeight: '600' }}>Trusted by students worldwide</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '120px 20px', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ 
              fontSize: '60px', 
              fontWeight: '900', 
              color: '#2d3436', 
              marginBottom: '24px',
              fontFamily: 'Poppins, Inter, sans-serif'
            }}>
              Why Choose WordWise AI?
            </h2>
            <p style={{ fontSize: '24px', color: '#636e72', maxWidth: '600px', margin: '0 auto' }}>
              Built with cutting-edge AI technology to provide the most accurate and helpful writing assistance
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
            {/* Feature 1 */}
            <div className="feature-card" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
              }}>
                <FiZap style={{ width: '40px', height: '40px', color: 'white' }} />
              </div>
              <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436', marginBottom: '16px' }}>
                AI-Powered Analysis
              </h3>
              <p style={{ color: '#636e72', fontSize: '18px', lineHeight: '1.6' }}>
                Advanced GPT-4o technology provides intelligent grammar checking and style suggestions
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="feature-card" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                boxShadow: '0 10px 30px rgba(0, 184, 148, 0.3)'
              }}>
                <FiShield style={{ width: '40px', height: '40px', color: 'white' }} />
              </div>
              <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436', marginBottom: '16px' }}>
                Privacy First
              </h3>
              <p style={{ color: '#636e72', fontSize: '18px', lineHeight: '1.6' }}>
                Your documents are secure and private. We never share or store your personal content
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="feature-card" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                boxShadow: '0 10px 30px rgba(253, 121, 168, 0.3)'
              }}>
                <FiUsers style={{ width: '40px', height: '40px', color: 'white' }} />
              </div>
              <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436', marginBottom: '16px' }}>
                ESL Focused
              </h3>
              <p style={{ color: '#636e72', fontSize: '18px', lineHeight: '1.6' }}>
                Specifically designed for English as Second Language students with educational explanations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" style={{ 
        padding: '120px 20px', 
        background: 'linear-gradient(135deg, #ff7675 0%, #fd79a8 50%, #fdcb6e 100%)',
        borderRadius: '0px',
        margin: '0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h2 style={{ 
            fontSize: '60px', 
            fontWeight: '900', 
            color: 'white', 
            marginBottom: '24px',
            fontFamily: 'Poppins, Inter, sans-serif'
          }}>
            Ready to improve your writing?
          </h2>
          <p style={{ 
            fontSize: '24px', 
            color: 'rgba(255, 255, 255, 0.9)', 
            marginBottom: '48px', 
            maxWidth: '600px', 
            margin: '0 auto 48px auto' 
          }}>
            Join thousands of students who are already writing better with WordWise AI
          </p>
          
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', alignItems: 'center', marginBottom: '64px', flexWrap: 'wrap' }}>
            <NavLink 
              to="/signup" 
              style={{ 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                padding: '20px 48px',
                background: 'white',
                color: '#fd79a8',
                fontWeight: '700',
                fontSize: '24px',
                borderRadius: '16px',
                boxShadow: '0 15px 35px rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              Get Started Free
              <FiArrowRight style={{ marginLeft: '12px', width: '24px', height: '24px' }} />
            </NavLink>
            <NavLink 
              to="/try" 
              style={{ 
                textDecoration: 'none',
                padding: '20px 48px',
                background: 'transparent',
                color: 'white',
                fontWeight: '600',
                fontSize: '24px',
                borderRadius: '16px',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                transition: 'all 0.3s ease'
              }}
            >
              Try Demo
            </NavLink>
          </div>
          
          {/* Features List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', color: 'white' }}>
              <FiCheck style={{ width: '24px', height: '24px', color: '#55efc4', marginRight: '12px', marginTop: '4px', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '4px', fontSize: '18px' }}>Real-time Feedback</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>Get instant suggestions as you type</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', color: 'white' }}>
              <FiCheck style={{ width: '24px', height: '24px', color: '#55efc4', marginRight: '12px', marginTop: '4px', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '4px', fontSize: '18px' }}>Educational Explanations</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>Learn why changes are suggested</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', color: 'white' }}>
              <FiCheck style={{ width: '24px', height: '24px', color: '#55efc4', marginRight: '12px', marginTop: '4px', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '4px', fontSize: '18px' }}>Multiple Languages</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>Support for various language backgrounds</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 