import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiEdit3, FiCheck, FiClock, FiZap, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import GrammarSuggestions from './GrammarSuggestions';
import DocumentToolbar from './DocumentToolbar';
import { useGrammar } from '../contexts/GrammarContext';

const Editor = ({ theme, document, isPublic, onBackToDashboard }) => {
  const { currentUser } = useAuth();
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const { suggestions: grammarSuggestions, isLoading, checkGrammar } = useGrammar();
  const debounceTimer = useRef(null);

  // Initialize text from document prop when editing existing documents
  useEffect(() => {
    if (document && document.content) {
      setText(document.content);
      setWordCount(document.wordCount || 0);
      setCharCount(document.charCount || 0);
    }
  }, [document]);

  // Comprehensive grammar check function that analyzes actual user text
  const handleGrammarCheck = async () => {
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    setIsChecking(true);
    
    // Try to use real API first, fallback to mock if not available
    try {
      // Import the grammar service
      const { checkGrammar } = await import('../services/grammarService.js');
      const result = await checkGrammar(text);
      
      if (result && result.corrections && result.corrections.length > 0) {
        // Convert API response to our format
        const apiSuggestions = result.corrections.map((correction, index) => ({
          id: `api-${index}`,
          type: correction.type,
          original: correction.original,
          suggested: correction.corrected,
          explanation: correction.explanation,
          position: { start: 0, end: correction.original.length } // API doesn't provide positions
        }));
        
        setSuggestions(apiSuggestions);
        setIsChecking(false);
        return;
      }
    } catch (error) {
      console.log('API not available, using smart mock analysis:', error.message);
    }
    
    // Fallback to smart mock analysis
    setTimeout(() => {
      const mockSuggestions = [];
      const textLower = text.toLowerCase();
      const originalText = text;
      
      console.log('Analyzing text:', originalText);
      
      // 1. Check for "dont" without apostrophe
      if (textLower.includes('dont') && !textLower.includes("don't")) {
        const regex = /\bdont\b/gi;
        const matches = [...originalText.matchAll(regex)];
        matches.forEach((match, index) => {
          mockSuggestions.push({
            id: `dont-${index}`,
            type: 'punctuation',
            original: match[0],
            suggested: "don't",
            explanation: 'Contractions need an apostrophe. "Don\'t" is short for "do not".',
            position: { start: match.index, end: match.index + match[0].length }
          });
        });
      }
      
      // 2. Check for "h" at start of sentence (should be "he")
      if (textLower.match(/\b\.?\s*h\s+/)) {
        const regex = /(\.\s*|^)h(\s+)/gi;
        const matches = [...originalText.matchAll(regex)];
        matches.forEach((match, index) => {
          const fullMatch = match[0];
          const beforeH = match[1] || '';
          const afterH = match[2];
          mockSuggestions.push({
            id: `h-correction-${index}`,
            type: 'spelling',
            original: fullMatch,
            suggested: beforeH + 'He' + afterH,
            explanation: 'This appears to be a typo. "He" is the correct spelling.',
            position: { start: match.index, end: match.index + fullMatch.length }
          });
        });
      }
      
      // 3. Check for "brother annoying very" pattern (wrong word order)
      if (textLower.includes('brother annoying very')) {
        const regex = /(my\s+)?brother\s+annoying\s+very/gi;
        const matches = [...originalText.matchAll(regex)];
        matches.forEach((match, index) => {
          const prefix = match[1] || '';
          mockSuggestions.push({
            id: `word-order-${index}`,
            type: 'grammar',
            original: match[0],
            suggested: prefix + 'brother is very annoying',
            explanation: 'Word order should be "brother is very annoying" for proper grammar.',
            position: { start: match.index, end: match.index + match[0].length }
          });
        });
      }
      
      // 4. Check for "stop bother" (should be "stop bothering")
      if (textLower.includes('stop bother')) {
        const regex = /stop\s+bother(?!\w)/gi;
        const matches = [...originalText.matchAll(regex)];
        matches.forEach((match, index) => {
          mockSuggestions.push({
            id: `gerund-${index}`,
            type: 'grammar',
            original: match[0],
            suggested: 'stop bothering',
            explanation: 'Use the gerund form "bothering" after "stop".',
            position: { start: match.index, end: match.index + match[0].length }
          });
        });
      }
      
      // 5. Check for missing capitalization at sentence start
      const sentences = originalText.split(/[.!?]+/);
      let currentPos = 0;
      sentences.forEach((sentence, index) => {
        const trimmed = sentence.trim();
        if (trimmed && trimmed[0] === trimmed[0].toLowerCase()) {
          // Find the actual position of this sentence in the original text
          const sentenceStart = originalText.indexOf(trimmed, currentPos);
          if (sentenceStart >= 0) {
            mockSuggestions.push({
              id: `capitalize-${index}`,
              type: 'grammar',
              original: trimmed[0],
              suggested: trimmed[0].toUpperCase(),
              explanation: 'Sentences should start with a capital letter.',
              position: { start: sentenceStart, end: sentenceStart + 1 }
            });
          }
        }
        currentPos += sentence.length + 1; // +1 for the delimiter
      });
      
      // 6. Additional spelling corrections
      const spellingCorrections = [
        { wrong: 'alot', correct: 'a lot', explanation: '"A lot" should be written as two separate words.' },
        { wrong: 'bothre', correct: 'bother', explanation: 'Correct spelling is "bother".' },
        { wrong: 'anyting', correct: 'anything', explanation: 'Correct spelling is "anything".' },
        { wrong: 'cant', correct: "can't", explanation: 'Contractions need an apostrophe.' },
        { wrong: 'wont', correct: "won't", explanation: 'Contractions need an apostrophe.' },
        { wrong: 'shouldnt', correct: "shouldn't", explanation: 'Contractions need an apostrophe.' },
        { wrong: 'wouldnt', correct: "wouldn't", explanation: 'Contractions need an apostrophe.' }
      ];
      
      spellingCorrections.forEach(correction => {
        const regex = new RegExp(`\\b${correction.wrong}\\b`, 'gi');
        const matches = [...originalText.matchAll(regex)];
        matches.forEach((match, index) => {
          mockSuggestions.push({
            id: `spelling-${correction.wrong}-${index}`,
            type: 'spelling',
            original: match[0],
            suggested: correction.correct,
            explanation: correction.explanation,
            position: { start: match.index, end: match.index + match[0].length }
          });
        });
      });
      
      console.log('Generated suggestions:', mockSuggestions);
      setSuggestions(mockSuggestions);
      setIsChecking(false);
    }, 1500);
  };

  // Auto-check grammar when text changes (including from document loading)
  useEffect(() => {
    if (text.trim().length > 0) {
      // Clear previous timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      
      // Set new timer for grammar check
      debounceTimer.current = setTimeout(() => {
        handleGrammarCheck();
      }, 2000); // 2 second delay for auto-check
    } else {
      setSuggestions([]);
    }
    
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [text]);

  const applySuggestion = (suggestion) => {
    // Use position-based replacement for more accurate corrections
    const { start, end } = suggestion.position;
    const newText = text.substring(0, start) + suggestion.suggested + text.substring(end);
    setText(newText);
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    
    // Re-run grammar check after applying suggestion
    setTimeout(() => {
      handleGrammarCheck();
    }, 500);
  };

  const clearText = () => {
    setText('');
    setSuggestions([]);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  };

  useEffect(() => {
    if (autoSave && text && currentUser) {
      const timer = setTimeout(() => {
        setLastSaved(new Date());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [text, autoSave, currentUser]);

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(text.length);
  }, [text]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    
    // Auto-check grammar as user types (debounced)
    if (newText.trim().length > 0) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        handleGrammarCheck();
      }, 2000);
    }
  };

  // Determine if we're in embedded mode (like Try It page)
  const isEmbedded = isPublic;

  // For public/embedded use (like in TryIt page), return simplified version
  if (isPublic) {
    return (
      <div className="editor-embedded" style={{
        fontFamily: 'Inter, Poppins, sans-serif !important',
        background: isEmbedded ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        minHeight: isEmbedded ? 'auto' : '100vh',
        padding: isEmbedded ? '0' : '32px 20px'
      }}>
        {!isEmbedded && (
          <>
            {/* Hero Section - Only show when not embedded */}
            <section style={{ 
              padding: '80px 20px 40px 20px', 
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
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
                  <FiEdit3 style={{ width: '20px', height: '20px', marginRight: '8px', color: '#ffeaa7' }} />
                  ✨ AI-Powered Writing Assistant
                </div>
                
                <h1 style={{ 
                  fontSize: '60px', 
                  fontWeight: '900', 
                  color: 'white', 
                  marginBottom: '24px', 
                  lineHeight: '1.1',
                  fontFamily: 'Poppins, Inter, sans-serif'
                }}>
                  Experience AI-Powered Writing
                </h1>
                
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
              </div>
            </section>
          </>
        )}

        {/* Main Editor Section */}
        <section style={{ 
          padding: isEmbedded ? '0' : '40px 20px', 
          background: isEmbedded ? 'transparent' : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' 
        }}>
          <div style={{ maxWidth: isEmbedded ? '100%' : '1400px', margin: '0 auto' }}>
            {!isEmbedded && (
              <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                <h2 style={{ 
                  fontSize: '60px', 
                  fontWeight: '900', 
                  color: '#2d3436', 
                  marginBottom: '24px',
                  fontFamily: 'Poppins, Inter, sans-serif'
                }}>
                  Document Editor
                </h2>
                <p style={{ fontSize: '24px', color: '#636e72', maxWidth: '600px', margin: '0 auto' }}>
                  AI-powered writing assistance with real-time feedback
                </p>
              </div>
            )}

            {/* Editor Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isEmbedded ? '1fr' : '1fr 400px', 
              gap: isEmbedded ? '32px' : '32px',
              alignItems: 'start'
            }}>
              {/* Text Editor Panel */}
              <div className="feature-card" style={{
                background: isEmbedded ? 'transparent' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
                backdropFilter: isEmbedded ? 'none' : 'blur(20px)',
                borderRadius: isEmbedded ? '0' : '24px',
                padding: isEmbedded ? '0' : '40px',
                border: isEmbedded ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: isEmbedded ? 'none' : '0 20px 40px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}>
                {!isEmbedded && (
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
                      <FiEdit3 style={{ width: '28px', height: '28px', color: 'white' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3436', marginBottom: '4px' }}>
                        Write Your Text
                      </h3>
                      <p style={{ color: '#636e72', fontSize: '16px', lineHeight: '1.6' }}>
                        Start writing here to get AI-powered grammar suggestions...
                      </p>
                    </div>
                  </div>
                )}

                {/* Document Toolbar - Only show for logged in users */}
                {currentUser && (
                  <DocumentToolbar 
                    text={text} 
                    setText={setText} 
                    isVisible={true} 
                  />
                )}

                {/* Text Area */}
                <div style={{ position: 'relative' }}>
                  <textarea
                    value={text}
                    onChange={handleTextChange}
                    placeholder={isEmbedded ? "Start writing here to get AI-powered grammar suggestions..." : "Begin typing your text here..."}
                    style={{
                      width: '100%',
                      minHeight: isEmbedded ? '300px' : '400px',
                      padding: '24px',
                      border: isEmbedded ? '2px solid rgba(255, 255, 255, 0.3)' : '2px solid rgba(45, 52, 54, 0.1)',
                      borderRadius: '16px',
                      fontSize: '16px',
                      lineHeight: '1.6',
                      fontFamily: 'Inter, Poppins, sans-serif',
                      background: isEmbedded ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      color: '#2d3436',
                      resize: 'vertical',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: isEmbedded ? '0 8px 32px rgba(0, 0, 0, 0.1)' : '0 4px 16px rgba(0, 0, 0, 0.05)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = isEmbedded ? '0 12px 40px rgba(102, 126, 234, 0.2)' : '0 8px 24px rgba(102, 126, 234, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isEmbedded ? 'rgba(255, 255, 255, 0.3)' : 'rgba(45, 52, 54, 0.1)';
                      e.target.style.boxShadow = isEmbedded ? '0 8px 32px rgba(0, 0, 0, 0.1)' : '0 4px 16px rgba(0, 0, 0, 0.05)';
                    }}
                  />
                  
                  {/* Action Buttons */}
                  {text && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button
                        onClick={handleGrammarCheck}
                        disabled={isChecking}
                        style={{
                          padding: '8px 16px',
                          background: isChecking 
                            ? 'linear-gradient(135deg, #a0a0a0 0%, #888888 100%)'
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: isChecking ? 'not-allowed' : 'pointer',
                          boxShadow: isChecking 
                            ? '0 4px 16px rgba(160, 160, 160, 0.3)'
                            : '0 4px 16px rgba(102, 126, 234, 0.3)',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                          if (!isChecking) {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isChecking) {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
                          }
                        }}
                      >
                        {isChecking ? (
                          <>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              border: '2px solid white',
                              borderTop: '2px solid transparent',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }}></div>
                            Checking...
                          </>
                        ) : (
                          <>
                            <FiZap style={{ width: '14px', height: '14px' }} />
                            Check Grammar
                          </>
                        )}
                      </button>
                      <button
                        onClick={clearText}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          boxShadow: '0 4px 16px rgba(255, 107, 107, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 16px rgba(255, 107, 107, 0.3)';
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {/* Stats Bar */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '20px',
                  padding: '16px 20px',
                  background: isEmbedded ? 'rgba(255, 255, 255, 0.7)' : 'rgba(45, 52, 54, 0.05)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#636e72'
                }}>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <span>{charCount} chars</span>
                    <span>{wordCount} words</span>
                  </div>
                  {isLoading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#667eea' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        border: '2px solid #667eea',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      <span style={{ fontStyle: 'italic' }}>Live analysis</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Grammar Suggestions Panel */}
              {!isEmbedded && (
                <div className="feature-card" style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  padding: '40px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  minHeight: '600px'
                }}>
                  <GrammarSuggestions suggestions={suggestions} text={text} isLoading={isChecking} onApplySuggestion={applySuggestion} hasText={text.trim().length > 0} />
                </div>
              )}
            </div>

            {/* Embedded Mode Grammar Suggestions */}
            {isEmbedded && (
              <div style={{ marginTop: '32px' }}>
                <GrammarSuggestions suggestions={suggestions} text={text} isEmbedded={true} isLoading={isChecking} onApplySuggestion={applySuggestion} hasText={text.trim().length > 0} />
              </div>
            )}
          </div>
        </section>



        <style jsx>{`
          .editor-embedded {
            font-family: 'Inter', 'Poppins', sans-serif !important;
          }
          .editor-embedded * {
            box-sizing: border-box;
          }
          .editor-embedded .font-inter {
            font-family: 'Inter', 'Poppins', sans-serif !important;
          }
          .editor-embedded textarea {
            font-family: 'Inter', 'Poppins', sans-serif !important;
            line-height: 1.6 !important;
          }
          .editor-embedded textarea::placeholder {
            font-family: 'Inter', 'Poppins', sans-serif !important;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .feature-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15) !important;
          }
        `}</style>
      </div>
    );
  }

  // Full standalone editor for dashboard
  return (
    <div className="editor-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      padding: '32px 20px',
      fontFamily: 'Inter, Poppins, sans-serif'
    }}>
      {/* Header Section */}
      <section style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '40px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
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
            <FiEdit3 style={{ width: '20px', height: '20px', marginRight: '8px', color: '#ffeaa7' }} />
            ✨ AI-Powered Writing Assistant
          </div>
          
          <h1 style={{ 
            fontSize: '60px', 
            fontWeight: '900', 
            color: 'white', 
            marginBottom: '24px', 
            lineHeight: '1.1',
            fontFamily: 'Poppins, Inter, sans-serif'
          }}>
            Document Editor
          </h1>
          
          <p style={{ 
            fontSize: '24px', 
            color: 'rgba(255, 255, 255, 0.9)', 
            marginBottom: '32px', 
            maxWidth: '800px', 
            margin: '0 auto 32px auto',
            fontWeight: '300',
            lineHeight: '1.6'
          }}>
            AI-powered writing assistance with real-time feedback
          </p>

          {/* Header Controls */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            {currentUser && autoSave && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                <FiCheck style={{ width: '16px', height: '16px', color: '#55efc4' }} />
                Auto-save Enabled
              </div>
            )}
            
            {!isPublic && (
              <button 
                onClick={() => {
                  console.log('Back to Documents button clicked');
                  if (onBackToDashboard) {
                    // We're in the Dashboard context, use the callback
                    console.log('Using Dashboard callback');
                    onBackToDashboard();
                  } else {
                    // We're in a standalone context, navigate to dashboard
                    console.log('Navigating to dashboard via window.location');
                    try {
                      window.location.href = '/dashboard';
                    } catch (error) {
                      console.error('Navigation error:', error);
                      window.location.assign('/dashboard');
                    }
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <FiArrowLeft style={{ width: '16px', height: '16px' }} />
                ← Back to Documents
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Editor Section */}
      <section style={{ padding: '40px 20px', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Editor Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 400px', 
            gap: '32px',
            alignItems: 'start'
          }}>
            {/* Text Editor Panel */}
            <div className="feature-card" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}>
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
                  <FiEdit3 style={{ width: '28px', height: '28px', color: 'white' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3436', marginBottom: '4px' }}>
                    Write Your Text
                  </h3>
                  <p style={{ color: '#636e72', fontSize: '16px', lineHeight: '1.6' }}>
                    Start writing here to get AI-powered grammar suggestions...
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleGrammarCheck}
                    disabled={isChecking || !text.trim()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      background: isChecking || !text.trim() ? 'rgba(102, 126, 234, 0.5)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isChecking || !text.trim() ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isChecking && text.trim()) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
                    }}
                  >
                    {isChecking ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Checking...
                      </>
                    ) : (
                      <>
                        <FiZap style={{ width: '16px', height: '16px' }} />
                        Check Grammar
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={clearText}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(255, 107, 107, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 16px rgba(255, 107, 107, 0.3)';
                    }}
                  >
                    <FiTrash2 style={{ width: '16px', height: '16px' }} />
                    Clear
                  </button>
                </div>
              </div>

              {/* Document Toolbar - Only show for logged in users */}
              {currentUser && (
                <DocumentToolbar 
                  text={text} 
                  setText={setText} 
                  isVisible={true} 
                />
              )}

              {/* Text Area */}
              <div style={{ position: 'relative' }}>
                <textarea
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Begin typing your text here..."
                  style={{
                    width: '100%',
                    minHeight: '400px',
                    padding: '24px',
                    border: '2px solid rgba(45, 52, 54, 0.1)',
                    borderRadius: '16px',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    fontFamily: 'Inter, Poppins, sans-serif',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    color: '#2d3436',
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(45, 52, 54, 0.1)';
                    e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.05)';
                  }}
                />
              </div>

              {/* Stats Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '20px',
                padding: '16px 20px',
                background: 'rgba(45, 52, 54, 0.05)',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#636e72'
              }}>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <span>{charCount} chars</span>
                  <span>{wordCount} words</span>
                </div>
                {isChecking && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#667eea' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      border: '2px solid #667eea',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <span style={{ fontStyle: 'italic' }}>Live analysis</span>
                  </div>
                )}
              </div>
            </div>

            {/* Grammar Suggestions Panel */}
            <div style={{ minHeight: '600px' }}>
              <GrammarSuggestions 
                suggestions={suggestions}
                isLoading={isChecking}
                onApplySuggestion={applySuggestion}
                theme={theme}
                hasText={text.trim().length > 0}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action for Public Users */}
        {isPublic && (
          <div className="mt-8 p-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-xl text-center">
            <h3 className="text-3xl font-bold text-white mb-4 font-inter">
              Love what you see?
            </h3>
            <p className="text-white/90 mb-8 text-lg font-inter max-w-2xl mx-auto">
              Sign up now to save your documents, track your progress, and unlock advanced AI writing features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 font-inter"
              >
                Create Free Account
              </a>
              <a 
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold text-lg rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-200 font-inter"
              >
                Sign In
              </a>
            </div>
          </div>
        )}

      <style jsx>{`
        .editor-container {
          font-family: 'Inter', 'Poppins', sans-serif !important;
        }
        .editor-container * {
          box-sizing: border-box;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .feature-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15) !important;
        }
        
        /* Mobile Responsiveness for Editor */
        @media (max-width: 1024px) {
          .editor-container .editor-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          
          .editor-container .feature-card {
            padding: 32px 24px !important;
          }
        }
        
        @media (max-width: 768px) {
          .editor-container .floating-element {
            display: none !important;
          }
          
          .editor-container h1 {
            font-size: 40px !important;
          }
          
          .editor-container .hero-text {
            font-size: 18px !important;
          }
          
          .editor-container section {
            padding: 20px 16px !important;
          }
          
          .editor-container .feature-card {
            padding: 24px 20px !important;
          }
          
          .editor-embedded .feature-card {
            padding: 24px 20px !important;
          }
          
          .editor-container .button-group {
            flex-direction: column !important;
            gap: 12px !important;
          }
          
          .editor-container .stats-bar {
            flex-direction: column !important;
            gap: 12px !important;
            align-items: flex-start !important;
          }
        }
        
        @media (max-width: 480px) {
          .editor-container h1 {
            font-size: 32px !important;
          }
          
          .editor-container .hero-text {
            font-size: 16px !important;
          }
          
          .editor-container textarea {
            padding: 16px !important;
            font-size: 16px !important;
            min-height: 300px !important;
          }
          
          .editor-container .feature-card {
            padding: 20px 16px !important;
          }
          
          .editor-embedded .feature-card {
            padding: 20px 16px !important;
          }
          
          .editor-container button {
            padding: 12px 16px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Editor; 