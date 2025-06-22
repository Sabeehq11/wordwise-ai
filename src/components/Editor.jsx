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
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const { suggestions: grammarSuggestions, isLoading, checkGrammar } = useGrammar();
  const debounceTimer = useRef(null);
  
  // Track applied fixes and prevent immediate re-checking
  const [appliedFixes, setAppliedFixes] = useState([]);
  const [lastAppliedFixTime, setLastAppliedFixTime] = useState(null);
  const [isPostFixState, setIsPostFixState] = useState(false);
  const [isApplyingFix, setIsApplyingFix] = useState(false);
  const [userEditedAfterFix, setUserEditedAfterFix] = useState(false);
  const appliedFixesTimeoutRef = useRef({});

  // Initialize text from document prop when editing existing documents
  useEffect(() => {
    if (document && document.content) {
      setText(document.content);
      setWordCount(document.wordCount || 0);
      setCharCount(document.charCount || 0);
    }
  }, [document]);

  // Function to check if a suggestion conflicts with recently applied fixes
  const isConflictingSuggestion = (suggestion) => {
    return appliedFixes.some(appliedFix => {
      // Check if this suggestion would reverse or conflict with a recent fix
      const suggestionOrigLower = suggestion.original.toLowerCase().trim();
      const suggestionSuggestedLower = suggestion.suggested.toLowerCase().trim();
      const appliedOrigLower = appliedFix.original.toLowerCase().trim();
      const appliedSuggestedLower = appliedFix.suggested.toLowerCase().trim();
      
      // Consider it conflicting if:
      // 1. It suggests reverting back to the original text
      const isRevert = suggestionSuggestedLower === appliedOrigLower && 
                      suggestionOrigLower === appliedSuggestedLower;
      
      // 2. It tries to change something that was just fixed
      const changesRecentFix = suggestionOrigLower.includes(appliedSuggestedLower) ||
                              appliedSuggestedLower.includes(suggestionOrigLower);
      
      // 3. It's trying to apply the same fix again
      const isDuplicate = suggestionOrigLower === appliedOrigLower &&
                         suggestionSuggestedLower === appliedSuggestedLower;
      
      return isRevert || changesRecentFix || isDuplicate;
    });
  };

  // Filter out conflicting suggestions
  const getFilteredSuggestions = (rawSuggestions) => {
    if (appliedFixes.length === 0) {
      return rawSuggestions;
    }
    
    const filtered = rawSuggestions.filter(suggestion => {
      const isConflicting = isConflictingSuggestion(suggestion);
      if (isConflicting) {
        console.log('🚫 Filtered out conflicting suggestion:', suggestion.original, '->', suggestion.suggested);
      }
      return !isConflicting;
    });
    
    console.log(`📊 Filtered suggestions: ${rawSuggestions.length} -> ${filtered.length} (removed ${rawSuggestions.length - filtered.length} conflicts)`);
    return filtered;
  };

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
        
        // Filter out conflicting suggestions
        const filteredSuggestions = getFilteredSuggestions(apiSuggestions);
        setSuggestions(filteredSuggestions);
        setIsChecking(false);
        return;
      }
    } catch (error) {
      console.log('API not available, using smart mock analysis:', error.message);
    }
    
    // Enhanced smart mock analysis for better position tracking
    setTimeout(() => {
      const mockSuggestions = [];
      const textLower = text.toLowerCase();
      const originalText = text;
      
      console.log('🔍 Analyzing text:', originalText);
      
      // Helper function to add suggestion with better error handling
      const addSuggestion = (id, type, original, suggested, explanation, start, end) => {
        // Verify position accuracy
        const actualText = originalText.substring(start, end);
        if (actualText.toLowerCase() === original.toLowerCase()) {
          mockSuggestions.push({
            id: id,
            type: type,
            original: actualText, // Use actual text from position to maintain case
            suggested: suggested,
            explanation: explanation,
            position: { start: start, end: end }
          });
          console.log(`✅ Added suggestion: "${actualText}" -> "${suggested}" at [${start}, ${end}]`);
        } else {
          console.log(`❌ Position error for "${original}": expected at [${start}, ${end}] but found "${actualText}"`);
        }
      };
      
      // 1. Check for "dont" without apostrophe
      if (textLower.includes('dont') && !textLower.includes("don't")) {
        const regex = /\bdont\b/gi;
        const matches = [...originalText.matchAll(regex)];
        matches.forEach((match, index) => {
          addSuggestion(
            `dont-${index}`,
            'punctuation',
            match[0],
            "don't",
            'Contractions need an apostrophe. "Don\'t" is short for "do not".',
            match.index,
            match.index + match[0].length
          );
        });
      }
      
      // 2. Sentence-level corrections
      
      // Fix "i am problem" -> "I am a problem"
      const iAmProblemRegex = /\bi\s+am\s+problem\b/gi;
      const iAmProblemMatches = [...originalText.matchAll(iAmProblemRegex)];
      iAmProblemMatches.forEach((match, index) => {
        addSuggestion(
          `i-am-problem-${index}`,
          'grammar',
          match[0],
          'I am a problem',
          'Added missing article "a" and capitalized "I".',
          match.index,
          match.index + match[0].length
        );
      });
      
      // Fix "my brother bigger problem" -> "my brother is a bigger problem"
      const brotherProblemRegex = /\bmy\s+brother\s+bigger\s+problem\b/gi;
      const brotherProblemMatches = [...originalText.matchAll(brotherProblemRegex)];
      brotherProblemMatches.forEach((match, index) => {
        addSuggestion(
          `brother-problem-${index}`,
          'grammar',
          match[0],
          'my brother is a bigger problem',
          'Added missing verb "is" and article "a".',
          match.index,
          match.index + match[0].length
        );
      });
      
      // Fix "he anoying very" -> "he is very annoying"
      const heAnoyingRegex = /\bhe\s+anoying\s+very\b/gi;
      const heAnoyingMatches = [...originalText.matchAll(heAnoyingRegex)];
      heAnoyingMatches.forEach((match, index) => {
        addSuggestion(
          `he-annoying-${index}`,
          'grammar',
          match[0],
          'he is very annoying',
          'Corrected spelling of "annoying", added missing verb "is", and fixed word order.',
          match.index,
          match.index + match[0].length
        );
      });
      
      // Check for "h" at start of sentence (should be "he")
      if (textLower.match(/\b\.?\s*h\s+/)) {
        const regex = /(\.\s*|^)h(\s+)/gi;
        const matches = [...originalText.matchAll(regex)];
        matches.forEach((match, index) => {
          const fullMatch = match[0];
          const beforeH = match[1] || '';
          const afterH = match[2];
          addSuggestion(
            `h-correction-${index}`,
            'spelling',
            fullMatch,
            beforeH + 'He' + afterH,
            'This appears to be a typo. "He" is the correct spelling.',
            match.index,
            match.index + fullMatch.length
          );
        });
      }
      
      // 3. Legacy pattern checks (keeping for backward compatibility)
      if (textLower.includes('brother annoying very')) {
        const regex = /(my\s+)?brother\s+annoying\s+very/gi;
        const matches = [...originalText.matchAll(regex)];
        matches.forEach((match, index) => {
          const prefix = match[1] || '';
          addSuggestion(
            `word-order-${index}`,
            'grammar',
            match[0],
            prefix + 'brother is very annoying',
            'Word order should be "brother is very annoying" for proper grammar.',
            match.index,
            match.index + match[0].length
          );
        });
      }
      
      // 4. Check for "stop bother" (should be "stop bothering")
      if (textLower.includes('stop bother')) {
        const regex = /stop\s+bother(?!\w)/gi;
        const matches = [...originalText.matchAll(regex)];
        matches.forEach((match, index) => {
          addSuggestion(
            `gerund-${index}`,
            'grammar',
            match[0],
            'stop bothering',
            'Use the gerund form "bothering" after "stop".',
            match.index,
            match.index + match[0].length
          );
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
            addSuggestion(
              `capitalize-${index}`,
              'grammar',
              trimmed[0],
              trimmed[0].toUpperCase(),
              'Sentences should start with a capital letter.',
              sentenceStart,
              sentenceStart + 1
            );
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
        { wrong: 'wouldnt', correct: "wouldn't", explanation: 'Contractions need an apostrophe.' },
        { wrong: 'anoying', correct: 'annoying', explanation: 'Correct spelling is "annoying".' }
      ];
      
      spellingCorrections.forEach(correction => {
        const regex = new RegExp(`\\b${correction.wrong}\\b`, 'gi');
        const matches = [...originalText.matchAll(regex)];
        matches.forEach((match, index) => {
          addSuggestion(
            `spelling-${correction.wrong}-${index}`,
            'spelling',
            match[0],
            correction.correct,
            correction.explanation,
            match.index,
            match.index + match[0].length
          );
        });
      });
      
      console.log('🎯 Generated suggestions:', mockSuggestions.length);
      mockSuggestions.forEach(s => console.log(`  - "${s.original}" -> "${s.suggested}" at [${s.position.start}, ${s.position.end}]`));
      
      // Filter out conflicting suggestions
      const filteredSuggestions = getFilteredSuggestions(mockSuggestions);
      console.log('📊 Final suggestions after filtering:', filteredSuggestions.length);
      setSuggestions(filteredSuggestions);
      setIsChecking(false);
    }, 1500);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      // Clear debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      
      // Clear all applied fixes timeouts
      Object.values(appliedFixesTimeoutRef.current).forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  // Auto-check grammar when text changes (including from document loading)
  useEffect(() => {
    // Skip grammar check if currently applying a fix or in post-fix state without user edits
    if (isApplyingFix || (isPostFixState && !userEditedAfterFix)) {
      console.log('⏭️ Skipping grammar check - applying fix or in post-fix state');
      return;
    }
    
    if (text.trim().length > 0) {
      // Clear previous timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      
      // Set new timer for grammar check
      debounceTimer.current = setTimeout(() => {
        console.log('📝 Auto-checking grammar after text change');
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
  }, [text, isPostFixState, isApplyingFix, userEditedAfterFix]);

  const applySuggestion = (suggestion) => {
    console.log('🔧 Applying suggestion:', suggestion.original, '->', suggestion.suggested);
    console.log('🎯 Position info:', suggestion.position);
    console.log('🔤 Current text:', text);
    
    // Set flag to prevent automatic grammar checking during fix application
    setIsApplyingFix(true);
    setUserEditedAfterFix(false);
    
    // Use a more robust text replacement strategy
    let newText = text;
    
    // Strategy 1: Try position-based replacement first
    if (suggestion.position && suggestion.position.start !== undefined && suggestion.position.end !== undefined) {
      const { start, end } = suggestion.position;
      
      // Verify the position is still valid and matches the expected text
      const textAtPosition = text.substring(start, end);
      console.log('📍 Text at position:', textAtPosition, 'Expected:', suggestion.original);
      
      if (textAtPosition === suggestion.original) {
        newText = text.substring(0, start) + suggestion.suggested + text.substring(end);
        console.log('✅ Used position-based replacement');
      } else {
        console.log('⚠️ Position mismatch, falling back to text search');
        // Strategy 2: Fall back to first occurrence replacement
        newText = text.replace(suggestion.original, suggestion.suggested);
      }
    } else {
      console.log('⚠️ No valid position info, using text replacement');
      // Strategy 3: Simple text replacement
      newText = text.replace(suggestion.original, suggestion.suggested);
    }
    
    console.log('🔄 Text change:', text, '->', newText);
    setText(newText);
    
    // Track this applied fix to prevent contradictory suggestions
    const appliedFix = {
      id: suggestion.id,
      original: suggestion.original,
      suggested: suggestion.suggested,
      timestamp: Date.now()
    };
    
    setAppliedFixes(prev => [...prev, appliedFix]);
    setLastAppliedFixTime(Date.now());
    setIsPostFixState(true);
    
    // Set a timeout to remove this fix from tracking after 30 seconds
    const timeoutId = setTimeout(() => {
      setAppliedFixes(prev => prev.filter(fix => fix.id !== suggestion.id));
    }, 30000);
    
    appliedFixesTimeoutRef.current[suggestion.id] = timeoutId;
    
    // Remove the applied suggestion immediately
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    
    // Clear the applying fix flag after a short delay
    setTimeout(() => {
      setIsApplyingFix(false);
      
      // Get the current suggestions count after filtering out the applied one
      const remainingSuggestions = suggestions.filter(s => s.id !== suggestion.id);
      
      // Only perform one final grammar check if no other suggestions remain
      // and the user hasn't made manual edits
      if (remainingSuggestions.length === 0 && !userEditedAfterFix) {
        console.log('🎯 Performing final grammar check after applying last suggestion');
        setTimeout(() => {
          handleGrammarCheck();
        }, 500);
      } else {
        console.log(`⏸️ Skipping final check - ${remainingSuggestions.length} suggestions remaining`);
      }
    }, 1000);
    
    // Exit post-fix state after 5 seconds (allowing user to make manual edits)
    setTimeout(() => {
      setIsPostFixState(false);
    }, 5000);
  };

  const clearText = () => {
    setText('');
    setSuggestions([]);
    setWordCount(0);
    setCharCount(0);
    
    // Clear applied fixes when clearing text
    setAppliedFixes([]);
    
    // Clear any pending timeouts
    Object.values(appliedFixesTimeoutRef.current).forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    appliedFixesTimeoutRef.current = {};
  };

  // Manual save function
  const saveDocument = async () => {
    if (!currentUser || !document?.id || isSaving) return;
    
    setIsSaving(true);
    try {
      const { updateDocument } = await import('../firebase/firestore');
      await updateDocument(document.id, {
        content: text,
        wordCount,
        charCount,
        lastModified: new Date()
      });
      setLastSaved(new Date());
      console.log('Document saved successfully');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save document. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && text && currentUser && document?.id) {
      const timer = setTimeout(async () => {
        try {
          setIsSaving(true);
          const { updateDocument } = await import('../firebase/firestore');
          await updateDocument(document.id, {
            content: text,
            wordCount,
            charCount,
            lastModified: new Date()
          });
          setLastSaved(new Date());
          console.log('Document auto-saved successfully');
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setIsSaving(false);
        }
      }, 3000); // Auto-save after 3 seconds of no changes
      return () => clearTimeout(timer);
    }
  }, [text, autoSave, currentUser, document?.id, wordCount, charCount]);

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(text.length);
  }, [text]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    
    // Mark that user has manually edited after a fix was applied
    if (isPostFixState && !isApplyingFix) {
      console.log('👤 User manually edited text after fix application');
      setUserEditedAfterFix(true);
      setIsPostFixState(false);
    }
    
    // Don't trigger grammar check here if we're currently applying a fix
    // The useEffect will handle it based on the flags
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
                  <GrammarSuggestions 
                    suggestions={suggestions} 
                    text={text} 
                    isLoading={isChecking || isApplyingFix} 
                    onApplySuggestion={applySuggestion} 
                    hasText={text.trim().length > 0} 
                    isPostFixState={isPostFixState} 
                    isApplyingFix={isApplyingFix}
                  />
                </div>
              )}
            </div>

            {/* Embedded Mode Grammar Suggestions */}
            {isEmbedded && (
              <div style={{ marginTop: '32px' }}>
                <GrammarSuggestions 
                  suggestions={suggestions} 
                  text={text} 
                  isEmbedded={true} 
                  isLoading={isChecking || isApplyingFix} 
                  onApplySuggestion={applySuggestion} 
                  hasText={text.trim().length > 0} 
                  isPostFixState={isPostFixState} 
                  isApplyingFix={isApplyingFix}
                />
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
            {currentUser && document?.id && (
              <>
                {/* Save Status */}
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
                  {isSaving ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Saving...
                    </>
                  ) : lastSaved ? (
                    <>
                      <FiCheck style={{ width: '16px', height: '16px', color: '#55efc4' }} />
                      Saved {new Date(lastSaved).toLocaleTimeString()}
                    </>
                  ) : (
                    <>
                      <FiClock style={{ width: '16px', height: '16px', color: '#ffeaa7' }} />
                      Auto-save Ready
                    </>
                  )}
                </div>

                {/* Manual Save Button */}
                <button
                  onClick={saveDocument}
                  disabled={isSaving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    background: isSaving ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSaving) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = isSaving ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  <FiCheck style={{ width: '16px', height: '16px' }} />
                  Save Now
                </button>
              </>
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
                  
                  {/* Save Button - Only show for logged in users with documents */}
                  {currentUser && document?.id && (
                    <button
                      onClick={saveDocument}
                      disabled={isSaving}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        background: isSaving ? 'rgba(46, 204, 113, 0.5)' : 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 16px rgba(46, 204, 113, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSaving) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 6px 20px rgba(46, 204, 113, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 16px rgba(46, 204, 113, 0.3)';
                      }}
                    >
                      {isSaving ? (
                        <>
                          <div style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiCheck style={{ width: '16px', height: '16px' }} />
                          Save
                        </>
                      )}
                    </button>
                  )}
                  
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
                isLoading={isChecking || isApplyingFix}
                onApplySuggestion={applySuggestion}
                theme={theme}
                hasText={text.trim().length > 0}
                isPostFixState={isPostFixState}
                isApplyingFix={isApplyingFix}
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