import React from 'react';
import Navbar from '../components/Navbar';
import Editor from '../components/Editor';

const TryIt = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="main-content">
        <div className="hero-section" style={{ paddingBottom: '2rem' }}>
          <div style={{ 
            display: 'inline-block', 
            padding: '0.75rem 1.5rem', 
            background: 'rgba(255, 255, 255, 0.2)', 
            borderRadius: '50px', 
            marginBottom: '1.5rem',
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
              ✨ Try WordWise for Free
            </span>
          </div>
          
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Test Your Writing
          </h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '0' }}>
            Try our AI-powered grammar checker below. Your text is never saved or shared.
          </p>
        </div>
        
        <Editor isPublic={true} />
      </main>
    </div>
  );
};

export default TryIt; 