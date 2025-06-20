import React from 'react';
import { FiZap, FiCheck, FiBookOpen, FiEdit3, FiTarget, FiBook, FiAlertCircle } from 'react-icons/fi';

const GrammarSuggestions = ({ suggestions = [], isLoading, onApplySuggestion, theme, isEmbedded = false, hasText = false, isPostFixState = false, isApplyingFix = false }) => {
  // Only show suggestions if there are actual suggestions AND there's text to analyze
  const mockSuggestions = (suggestions.length > 0 && hasText) ? suggestions : [];

  const getTypeConfig = (type) => {
    switch (type) {
      case 'grammar':
        return {
          icon: FiEdit3,
          label: 'Grammar Issue',
          color: '#667eea',
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        };
      case 'spelling':
        return {
          icon: FiBookOpen,
          label: 'Spelling Issue',
          color: '#fd79a8',
          gradient: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)'
        };
      case 'style':
        return {
          icon: FiTarget,
          label: 'Style Issue',
          color: '#a29bfe',
          gradient: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)'
        };
      case 'vocabulary':
        return {
          icon: FiBook,
          label: 'Vocabulary Issue',
          color: '#00b894',
          gradient: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)'
        };
      default:
        return {
          icon: FiAlertCircle,
          label: 'Writing Issue',
          color: '#636e72',
          gradient: 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)'
        };
    }
  };

  // Professional glassmorphism container style
  const containerStyle = {
    background: isEmbedded ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    minHeight: isEmbedded ? 'auto' : '600px',
    fontFamily: 'Inter, Poppins, sans-serif'
  };

  if (isLoading) {
    return (
      <div className="grammar-suggestions-container" style={containerStyle}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(45, 52, 54, 0.1)', paddingBottom: '24px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '20px',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
          }}>
            <FiZap style={{ width: '28px', height: '28px', color: 'white' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3436', marginBottom: '4px' }}>
              Writing Suggestions
            </h3>
            <p style={{ color: '#636e72', fontSize: '16px', lineHeight: '1.6' }}>
              {isApplyingFix ? 'Applying grammar fix...' : 'Analyzing your text for improvements...'}
            </p>
          </div>
        </div>
        
        {/* Loading State */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid rgba(102, 126, 234, 0.3)',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 24px auto'
            }}></div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3436', marginBottom: '8px' }}>
              {isApplyingFix ? 'Applying Fix...' : 'Analyzing...'}
            </h4>
            <p style={{ color: '#636e72', fontSize: '14px' }}>
              {isApplyingFix ? 'Updating your text with the grammar fix' : 'Reviewing your writing for suggestions'}
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Mobile Responsiveness for Grammar Suggestions */
          @media (max-width: 768px) {
            .grammar-suggestions-container {
              padding: 24px 20px !important;
            }
            
            .grammar-suggestions-container h3 {
              font-size: 20px !important;
            }
            
            .grammar-suggestions-container .suggestion-card {
              padding: 20px 16px !important;
            }
            
            .grammar-suggestions-container .suggestion-header {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 12px !important;
            }
          }
          
          @media (max-width: 480px) {
            .grammar-suggestions-container {
              padding: 20px 16px !important;
            }
            
            .grammar-suggestions-container h3 {
              font-size: 18px !important;
            }
            
            .grammar-suggestions-container .suggestion-card {
              padding: 16px 12px !important;
            }
            
            .grammar-suggestions-container button {
              padding: 8px 16px !important;
              font-size: 12px !important;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="grammar-suggestions-container" style={containerStyle}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(45, 52, 54, 0.1)', paddingBottom: '24px' }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '20px',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
        }}>
          <FiZap style={{ width: '28px', height: '28px', color: 'white' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3436', marginBottom: '4px' }}>
            Writing Suggestions
          </h3>
          <p style={{ color: '#636e72', fontSize: '16px', lineHeight: '1.6' }}>
            {mockSuggestions.length > 0 
              ? `${mockSuggestions.length} improvement${mockSuggestions.length === 1 ? '' : 's'} found`
              : 'Your writing looks great!'
            }
          </p>
        </div>
        {mockSuggestions.length > 0 && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 16px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #55efc4 0%, #81ecec 100%)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 16px rgba(85, 239, 196, 0.3)'
          }}>
            ⚡ {mockSuggestions.length} found
          </div>
        )}
      </div>

      {/* Suggestions Content */}
      <div style={{ overflowY: 'auto', maxHeight: isEmbedded ? 'none' : 'calc(100% - 120px)' }}>
        {mockSuggestions.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #55efc4 0%, #81ecec 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
                boxShadow: '0 10px 30px rgba(85, 239, 196, 0.3)'
              }}>
                <FiCheck style={{ width: '40px', height: '40px', color: 'white' }} />
              </div>
              <h4 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3436', marginBottom: '8px' }}>
                {(hasText && isPostFixState) ? '✅ No grammar issues found.' : (hasText ? 'Perfect Writing!' : 'Perfect Writing!')}
              </h4>
              <p style={{ color: '#636e72', fontSize: '16px', lineHeight: '1.6' }}>
                {(hasText && isPostFixState) 
                  ? 'Great job! Your text looks good. Continue writing to get more suggestions.'
                  : (hasText 
                    ? 'No grammar or style issues found in your text.'
                    : 'Start writing to get AI-powered grammar suggestions.'
                  )
                }
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {mockSuggestions.map((suggestion) => {
              const config = getTypeConfig(suggestion.type);
              const IconComponent = config.icon;
              
              return (
                <div 
                  key={suggestion.id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  {/* Issue Type Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: config.gradient,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 6px 20px ${config.color}40`
                    }}>
                      <IconComponent style={{ width: '20px', height: '20px', color: 'white' }} />
                    </div>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: config.color }}>
                      {config.label}
                    </h4>
                  </div>

                  {/* Content Sections */}
                  <div style={{ marginBottom: '20px' }}>
                    {/* Current Text */}
                    <div style={{ marginBottom: '16px' }}>
                      <p style={{ fontSize: '12px', fontWeight: '600', color: '#e74c3c', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                        ❌ Current Text
                      </p>
                      <p style={{ fontSize: '14px', color: '#2d3436', padding: '12px 16px', background: 'rgba(231, 76, 60, 0.1)', borderRadius: '8px', borderLeft: '3px solid #e74c3c' }}>
                        "{suggestion.original}"
                      </p>
                    </div>

                    {/* Suggested Fix */}
                    <div style={{ marginBottom: '16px' }}>
                      <p style={{ fontSize: '12px', fontWeight: '600', color: '#27ae60', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                        ✅ Suggested Fix
                      </p>
                      <p style={{ fontSize: '14px', color: '#2d3436', padding: '12px 16px', background: 'rgba(39, 174, 96, 0.1)', borderRadius: '8px', borderLeft: '3px solid #27ae60' }}>
                        "{suggestion.suggested}"
                      </p>
                    </div>

                    {/* Explanation */}
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: '600', color: '#636e72', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                        💡 Explanation
                      </p>
                      <p style={{ fontSize: '14px', color: '#636e72', padding: '12px 16px', background: 'rgba(99, 110, 114, 0.1)', borderRadius: '8px', borderLeft: '3px solid #636e72', lineHeight: '1.5' }}>
                        {suggestion.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={() => onApplySuggestion && onApplySuggestion(suggestion)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        background: config.gradient,
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: `0 6px 16px ${config.color}40`,
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = `0 8px 20px ${config.color}60`;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = `0 6px 16px ${config.color}40`;
                      }}
                    >
                      <FiCheck style={{ width: '16px', height: '16px' }} />
                      Apply This Fix
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .grammar-suggestions-container {
          font-family: 'Inter', 'Poppins', sans-serif !important;
        }
        .grammar-suggestions-container * {
          box-sizing: border-box;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GrammarSuggestions; 