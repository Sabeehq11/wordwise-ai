import React from 'react';
import Editor from '../components/Editor';
import { FiArrowRight, FiStar, FiZap, FiEdit3, FiCheck } from 'react-icons/fi';

const TryIt = ({ theme }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
      {/* Hero Section - Matching Home Page */}
      <section style={{ 
        padding: '120px 20px 80px 20px', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Floating Elements - Same as Home Page */}
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
          {/* Badge - Same Style as Home */}
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
            <FiStar style={{ width: '20px', height: '20px', marginRight: '8px', color: '#ffeaa7' }} />
            ✨ AI-Powered Writing Assistant
          </div>
          
          {/* Main Headline - Same Style as Home */}
          <h1 style={{ 
            fontSize: '80px', 
            fontWeight: '900', 
            color: 'white', 
            marginBottom: '24px', 
            lineHeight: '1.1',
            fontFamily: 'Poppins, Inter, sans-serif'
          }}>
            Experience AI-Powered Writing
          </h1>
          
          {/* Subheadline - Same Style as Home */}
          <p style={{ 
            fontSize: '24px', 
            color: 'rgba(255, 255, 255, 0.9)', 
            marginBottom: '48px', 
            maxWidth: '800px', 
            margin: '0 auto 48px auto',
            fontWeight: '300',
            lineHeight: '1.6'
          }}>
            Get instant feedback on your writing. No account required—just start typing and see the magic happen.
          </p>
          
          {/* Features List - Same Style as Home */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', textAlign: 'left', marginBottom: '64px', maxWidth: '800px', margin: '0 auto 64px auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', color: 'white' }}>
              <FiCheck style={{ width: '24px', height: '24px', color: '#55efc4', marginRight: '12px', marginTop: '4px', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '4px', fontSize: '18px' }}>Real-time Analysis</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>Get instant suggestions as you type</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', color: 'white' }}>
              <FiCheck style={{ width: '24px', height: '24px', color: '#55efc4', marginRight: '12px', marginTop: '4px', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '4px', fontSize: '18px' }}>Smart Suggestions</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>AI-powered grammar and style help</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', color: 'white' }}>
              <FiCheck style={{ width: '24px', height: '24px', color: '#55efc4', marginRight: '12px', marginTop: '4px', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '4px', fontSize: '18px' }}>Instant Feedback</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>Learn while you write</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editor Section - Professional Card Design Like Home Page */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ 
              fontSize: '60px', 
              fontWeight: '900', 
              color: '#2d3436', 
              marginBottom: '24px',
              fontFamily: 'Poppins, Inter, sans-serif'
            }}>
              Try It Now
            </h2>
            <p style={{ fontSize: '24px', color: '#636e72', maxWidth: '600px', margin: '0 auto' }}>
              Start writing and experience the power of AI-driven grammar assistance
            </p>
          </div>

          {/* Main Editor Container - Same Style as Home Feature Cards */}
          <div className="feature-card" style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}>
            {/* Editor Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(45, 52, 54, 0.1)', paddingBottom: '24px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '24px',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
              }}>
                <FiEdit3 style={{ width: '40px', height: '40px', color: 'white' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436', marginBottom: '8px' }}>
                  Document Editor
                </h3>
                <p style={{ color: '#636e72', fontSize: '18px', lineHeight: '1.6' }}>
                  AI-powered writing assistance with real-time feedback
                </p>
              </div>
            </div>

            {/* Editor Content */}
            <div>
              <Editor isPublic={true} theme={theme} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Same Style as Home Page */}
      <section style={{ 
        padding: '120px 20px', 
        background: 'linear-gradient(135deg, #ff7675 0%, #fd79a8 50%, #fdcb6e 100%)',
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
            Love what you see?
          </h2>
          <p style={{ 
            fontSize: '24px', 
            color: 'rgba(255, 255, 255, 0.9)', 
            marginBottom: '48px', 
            maxWidth: '600px', 
            margin: '0 auto 48px auto' 
          }}>
            Sign up now to save your documents, track your progress, and unlock advanced AI writing features.
          </p>
          
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', alignItems: 'center', marginBottom: '64px', flexWrap: 'wrap' }}>
            <a 
              href="/signup"
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
            </a>
            <a 
              href="/dashboard"
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
              Go to Dashboard
            </a>
          </div>
          
          {/* Features List - Same as Home */}
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
      
      <style jsx>{`
        /* Mobile Responsiveness for Try It Page */
        @media (max-width: 768px) {
          .floating {
            display: none !important;
          }
          
          section {
            padding: 60px 16px 40px 16px !important;
          }
          
          h1 {
            font-size: 48px !important;
          }
          
          h2 {
            font-size: 40px !important;
          }
          
          p {
            font-size: 18px !important;
          }
          
          .feature-card {
            padding: 24px 20px !important;
          }
          
          .feature-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          
          .cta-buttons {
            flex-direction: column !important;
            gap: 16px !important;
          }
        }
        
        @media (max-width: 480px) {
          section {
            padding: 40px 12px 30px 12px !important;
          }
          
          h1 {
            font-size: 36px !important;
          }
          
          h2 {
            font-size: 32px !important;
          }
          
          p {
            font-size: 16px !important;
          }
          
          .feature-card {
            padding: 20px 16px !important;
          }
          
          .editor-header {
            flex-direction: column !important;
            text-align: center !important;
            gap: 16px !important;
          }
          
          .cta-button {
            padding: 16px 32px !important;
            font-size: 18px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TryIt; 