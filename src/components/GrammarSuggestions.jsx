import React, { useState, useEffect } from 'react';
import { useGrammar } from '../contexts/GrammarContext';
import ApplyButton from './ApplyButton';

const GrammarSuggestions = ({ onManualCheck, currentContent, onApplyCorrection }) => {
  const { corrections, legacyCorrections, stats, suggestions, legacySuggestions, loading: grammarLoading } = useGrammar();
  const aiLoading = false; // AI suggestions use the same loading state
  const [activeTab, setActiveTab] = useState('corrections');
  const [isBackgroundChecking, setIsBackgroundChecking] = useState(false);

  // Add scroll detection to prevent animation glitches
  useEffect(() => {
    let scrollTimer = null;
    
    const handleScroll = () => {
      document.body.classList.add('scrolling');
      
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        document.body.classList.remove('scrolling');
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  const hasContent = currentContent && currentContent.trim().length > 0;
  const hasCorrections = corrections && corrections.length > 0;
  const hasLegacyCorrections = legacyCorrections && legacyCorrections.length > 0;
  const hasAnyCorrections = hasCorrections || hasLegacyCorrections;
  const hasStats = stats && stats.words > 0;
  const hasSuggestions = suggestions && suggestions.length > 0;
  const hasLegacySuggestions = legacySuggestions && legacySuggestions.length > 0;
  const hasAnySuggestions = hasSuggestions || hasLegacySuggestions;

  // Auto-switch to corrections tab when they become available
  useEffect(() => {
    if (hasAnyCorrections) {
      setActiveTab('corrections');
    }
  }, [hasAnyCorrections]);

  const renderTabButton = (tabName, label, count = null, isLoading = false) => (
    <button
      onClick={() => setActiveTab(tabName)}
      style={{
        flex: 1,
        padding: '0.5rem 0.75rem',
        border: 'none',
        backgroundColor: activeTab === tabName ? '#3b82f6' : '#f3f4f6',
        color: activeTab === tabName ? 'white' : '#374151',
        borderRadius: '0.375rem',
        fontSize: '0.75rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem'
      }}
    >
      {isLoading && (
        <div
          style={{
            width: '12px',
            height: '12px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      )}
      {label}
      {count !== null && (
        <span
          style={{
            backgroundColor: activeTab === tabName ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
            color: activeTab === tabName ? 'white' : '#6b7280',
            padding: '0.125rem 0.375rem',
            borderRadius: '1rem',
            fontSize: '0.625rem',
            fontWeight: '600'
          }}
        >
          {count}
        </span>
      )}
    </button>
  );

  const renderCorrections = () => {
    // Only show loading spinner on manual checks or when no content has been checked yet
    if (grammarLoading && !hasAnyCorrections && !hasContent) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              border: '3px solid #e5e7eb',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}
          />
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Checking grammar with dual AI services...
          </p>
        </div>
      );
    }

    // Show demo corrections if API key is not configured and text has obvious errors
    if (!hasAnyCorrections && !isApiKeyConfigured && hasContent) {
      const demoCorrections = [];
      const lowerText = currentContent.toLowerCase();
      
      // Check for common spelling mistakes
      if (lowerText.includes('mayeb')) {
        demoCorrections.push({
          original: 'mayeb',
          corrected: 'maybe',
          explanation: 'Spelling correction: "maybe" is the correct spelling.',
          type: 'spelling'
        });
      }
      if (lowerText.includes('proetim')) {
        demoCorrections.push({
          original: 'proetim',
          corrected: 'protein',
          explanation: 'Spelling correction: "protein" is the correct spelling.',
          type: 'spelling'
        });
      }
      if (lowerText.includes('proetimb')) {
        demoCorrections.push({
          original: 'proetimb',
          corrected: 'protein',
          explanation: 'Spelling correction: "protein" is the correct spelling.',
          type: 'spelling'
        });
      }
      if (lowerText.includes('teh ')) {
        demoCorrections.push({
          original: 'teh',
          corrected: 'the',
          explanation: 'Spelling correction: "the" is the correct spelling.',
          type: 'spelling'
        });
      }
      if (lowerText.includes('dont')) {
        demoCorrections.push({
          original: 'dont',
          corrected: "don't",
          explanation: 'Contractions need an apostrophe. "Don\'t" is short for "do not".',
          type: 'punctuation'
        });
      }
      if (lowerText.includes('wont')) {
        demoCorrections.push({
          original: 'wont',
          corrected: "won't",
          explanation: 'Contractions need an apostrophe. "Won\'t" is short for "will not".',
          type: 'punctuation'
        });
      }
      if (lowerText.includes('cant')) {
        demoCorrections.push({
          original: 'cant',
          corrected: "can't",
          explanation: 'Contractions need an apostrophe. "Can\'t" is short for "cannot".',
          type: 'punctuation'
        });
      }
      if (lowerText.includes('alot')) {
        demoCorrections.push({
          original: 'alot',
          corrected: 'a lot',
          explanation: '"A lot" should be written as two separate words, not "alot".',
          type: 'spelling'
        });
      }
      if (lowerText.includes('recieve')) {
        demoCorrections.push({
          original: 'recieve',
          corrected: 'receive',
          explanation: 'Spelling correction: "receive" follows the "i before e except after c" rule.',
          type: 'spelling'
        });
      }

      if (demoCorrections.length > 0) {
        return (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <div style={{ 
              backgroundColor: '#fef3c7', 
              padding: '0.75rem', 
              marginBottom: '1rem',
              borderRadius: '0.375rem',
              border: '1px solid #fbbf24'
            }}>
              <p style={{ color: '#92400e', fontSize: '0.75rem', margin: 0 }}>
                📝 Demo Mode: Add your OpenAI API key to get AI-powered grammar checking
              </p>
            </div>
            {demoCorrections.map((correction, index) => (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  borderBottom: index < demoCorrections.length - 1 ? '1px solid #e5e7eb' : 'none',
                  backgroundColor: '#ffffff'
                }}
              >
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    display: 'inline-block',
                    marginBottom: '0.5rem'
                  }}>
                    {correction.type}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      backgroundColor: '#fee2e2', 
                      textDecoration: 'line-through',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '0.25rem'
                    }}>
                      {correction.original}
                    </span>
                    {' → '}
                    <span style={{ 
                      backgroundColor: '#d1fae5',
                      color: '#065f46',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '0.25rem',
                      fontWeight: '500'
                    }}>
                      {correction.corrected}
                    </span>
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                    {correction.explanation}
                  </p>
                  <ApplyButton
                    original={correction.original}
                    corrected={correction.corrected}
                    onApply={onApplyCorrection}
                    type="demo"
                  />
                </div>
              </div>
            ))}
          </div>
        );
      }
    }

        if (!hasAnyCorrections) {
      return (
        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
          <p style={{ color: '#16a34a', fontWeight: '500', marginBottom: '0.5rem' }}>
            No issues found
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Both AI services found your text grammatically correct!
          </p>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Modern AI Service Corrections */}
        {hasCorrections && (
          <>
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#f0f9ff',
              borderBottom: '1px solid #e0e7ff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1rem' }}>🤖</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e40af' }}>
                AI Service 1 (GPT-4o Advanced)
              </span>
              <span style={{
                backgroundColor: '#1e40af',
                color: 'white',
                padding: '0.125rem 0.375rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                {corrections.length}
              </span>
            </div>
            {corrections.map((correction, index) => (
              <div
                key={`modern-${index}`}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff'
                }}
              >
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    display: 'inline-block',
                    marginBottom: '0.5rem'
                  }}>
                    {correction.type || 'Grammar'}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      backgroundColor: '#fee2e2', 
                      textDecoration: 'line-through',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '0.25rem'
                    }}>
                      {correction.original}
                    </span>
                    {' → '}
                    <span style={{ 
                      backgroundColor: '#d1fae5',
                      color: '#065f46',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '0.25rem',
                      fontWeight: '500'
                    }}>
                      {correction.corrected}
                    </span>
                  </p>
                  {correction.explanation && (
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic' }}>
                      {correction.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Legacy AI Service Corrections */}
        {hasLegacyCorrections && (
          <>
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#f0fdf4',
              borderBottom: '1px solid #dcfce7',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1rem' }}>🎓</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#166534' }}>
                AI Service 2 (GPT-3.5 ESL Focus)
              </span>
              <span style={{
                backgroundColor: '#166534',
                color: 'white',
                padding: '0.125rem 0.375rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                {legacyCorrections.length}
              </span>
            </div>
            {legacyCorrections.map((correction, index) => (
              <div
                key={`legacy-${index}`}
                style={{
                  padding: '1rem',
                  borderBottom: index < legacyCorrections.length - 1 ? '1px solid #e5e7eb' : 'none',
                  backgroundColor: '#ffffff'
                }}
              >
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    display: 'inline-block',
                    marginBottom: '0.5rem'
                  }}>
                    {correction.type || 'Grammar'}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      backgroundColor: '#fee2e2', 
                      textDecoration: 'line-through',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '0.25rem'
                    }}>
                      {correction.original}
                    </span>
                    {' → '}
                    <span style={{ 
                      backgroundColor: '#d1fae5',
                      color: '#065f46',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '0.25rem',
                      fontWeight: '500'
                    }}>
                      {correction.corrected}
                    </span>
                  </p>
                  {correction.explanation && (
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic' }}>
                      {correction.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  const renderStats = () => {
    if (!hasStats) {
      return (
        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            No statistics available
          </p>
        </div>
      );
    }

    const statsData = [
      { label: 'Words', value: stats.words, icon: '📝' },
      { label: 'Characters', value: stats.characters, icon: '🔤' },
      { label: 'Sentences', value: stats.sentences, icon: '📄' },
      { label: 'Issues Found', value: corrections ? corrections.length : 0, icon: '🔍' }
    ];

    return (
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {statsData.map((stat, index) => (
            <div
              key={index}
              style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                {stat.value.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSuggestions = () => {
    if (aiLoading) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              border: '3px solid #e5e7eb',
              borderTopColor: '#10b981',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}
          />
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Getting AI suggestions...
          </p>
        </div>
      );
    }

    if (!hasAnySuggestions) {
      return (
        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
            No AI suggestions available
          </p>
          <button
            onClick={() => onManualCheck && onManualCheck()}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Get AI Suggestions
          </button>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Modern AI Service Suggestions */}
        {hasSuggestions && (
          <>
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#f0f9ff',
              borderBottom: '1px solid #e0e7ff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1rem' }}>🤖</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e40af' }}>
                AI Service 1 Tips
              </span>
              <span style={{
                backgroundColor: '#1e40af',
                color: 'white',
                padding: '0.125rem 0.375rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                {suggestions.length}
              </span>
            </div>
            {suggestions.map((suggestion, index) => (
              <div
                key={`modern-tip-${index}`}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff'
                }}
              >
                <div style={{
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  display: 'inline-block',
                  marginBottom: '0.5rem'
                }}>
                  Advanced Tip
                </div>
                <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5' }}>
                  {suggestion}
                </p>
              </div>
            ))}
          </>
        )}

        {/* Legacy AI Service Suggestions */}
        {hasLegacySuggestions && (
          <>
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#f0fdf4',
              borderBottom: '1px solid #dcfce7',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1rem' }}>🎓</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#166534' }}>
                AI Service 2 Tips
              </span>
              <span style={{
                backgroundColor: '#166534',
                color: 'white',
                padding: '0.125rem 0.375rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                {legacySuggestions.length}
              </span>
            </div>
            {legacySuggestions.map((suggestion, index) => (
              <div
                key={`legacy-tip-${index}`}
                style={{
                  padding: '1rem',
                  borderBottom: index < legacySuggestions.length - 1 ? '1px solid #e5e7eb' : 'none',
                  backgroundColor: '#ffffff'
                }}
              >
                <div style={{
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  display: 'inline-block',
                  marginBottom: '0.5rem'
                }}>
                  ESL Tip
                </div>
                <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5' }}>
                  {typeof suggestion === 'string' ? suggestion : suggestion.text}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  // Check if API key is configured
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const isApiKeyConfigured = apiKey && apiKey.startsWith('sk-');

  if (!hasContent) {
    return (
      <div style={{ 
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'fit-content'
      }}>
        {/* Score Placeholder */}
        <div style={{
          padding: '1rem',
          background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
          color: '#6b7280',
          textAlign: 'center',
          borderRadius: '0 0 1rem 1rem',
          marginBottom: '0.5rem'
        }}>
          <div style={{ 
            fontSize: '1.75rem', 
            fontWeight: '700',
            marginBottom: '0.25rem'
          }}>
            --
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Writing Score
          </div>
        </div>

        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📝</div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
            Grammar Assistant
          </h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Start typing in the editor to see your writing score and get grammar suggestions here.
            </p>
            {!isApiKeyConfigured && (
              <div style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #fbbf24',
                borderRadius: '0.375rem',
                padding: '1rem',
                marginTop: '1rem'
              }}>
                <h4 style={{ color: '#92400e', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  🔑 API Key Setup Required
                </h4>
                <p style={{ color: '#92400e', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                  To enable AI-powered grammar checking:
                </p>
                <ol style={{ color: '#92400e', fontSize: '0.75rem', marginLeft: '1rem', lineHeight: '1.4' }}>
                  <li>Get your API key from <a href="https://platform.openai.com/account/api-keys" target="_blank" style={{ color: '#1d4ed8' }}>OpenAI</a></li>
                  <li>Open the <code>.env</code> file in your project root</li>
                  <li>Replace <code>your-openai-api-key-here</code> with your actual API key</li>
                  <li>Restart the development server</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      );
    }

  return (
    <div style={{ 
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'fit-content'
    }}>
      {/* Writing Score Display */}
      {hasStats && stats.words > 0 && (
        <div style={{
          padding: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          borderRadius: '0 0 1rem 1rem',
          marginBottom: '0.5rem'
        }}>
          <div style={{ 
            fontSize: '1.75rem', 
            fontWeight: '700',
            marginBottom: '0.25rem'
          }}>
            {stats.overallScore}
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            fontWeight: '500',
            opacity: 0.9,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Writing Score
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.75rem',
            fontSize: '0.75rem',
            opacity: 0.8
          }}>
            <div>
              <div style={{ fontWeight: '600' }}>{stats.grammarScore}</div>
              <div>Grammar</div>
            </div>
            <div>
              <div style={{ fontWeight: '600' }}>{stats.spellingScore}</div>
              <div>Spelling</div>
            </div>
            <div>
              <div style={{ fontWeight: '600' }}>{stats.clarityScore}</div>
              <div>Clarity</div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f8fafc'
      }}>
                 <h3 style={{ 
           fontSize: '1rem', 
           fontWeight: '600', 
           color: '#1f2937',
           marginBottom: '0.75rem'
         }}>
           Grammar Assistant
         </h3>
        
        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {renderTabButton('corrections', 'Issues', hasAnyCorrections ? (corrections.length + legacyCorrections.length) : 0, false)}
          {renderTabButton('stats', 'Stats')}
          {renderTabButton('suggestions', 'AI Tips', hasAnySuggestions ? (suggestions.length + legacySuggestions.length) : 0, aiLoading)}
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'corrections' && renderCorrections()}
        {activeTab === 'stats' && renderStats()}
        {activeTab === 'suggestions' && renderSuggestions()}
      </div>

      {/* Actions */}
      {hasContent && (
        <div style={{
          padding: '1rem',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc'
        }}>
          <button
            onClick={() => onManualCheck && onManualCheck()}
            disabled={grammarLoading}
            style={{
              width: '100%',
              backgroundColor: grammarLoading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: grammarLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {grammarLoading ? 'Checking Grammar...' : '🔍 Check Grammar'}
          </button>
        </div>
      )}
    </div>
  );
};

export default GrammarSuggestions; 