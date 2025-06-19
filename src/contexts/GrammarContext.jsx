import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { checkGrammarSecurely, isSecureGrammarAvailable, testSecureConnection } from '../services/secureGrammarService';
import { checkGrammar as checkGrammarWithLegacyService } from '../services/grammarService';

const GrammarContext = createContext();

export const useGrammar = () => {
  const context = useContext(GrammarContext);
  if (!context) {
    throw new Error('useGrammar must be used within a GrammarProvider');
  }
  return context;
};

export const GrammarProvider = ({ children }) => {
  const [corrections, setCorrections] = useState([]);
  const [legacyCorrections, setLegacyCorrections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [legacySuggestions, setLegacySuggestions] = useState([]);
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    sentences: 0,
    issues: 0,
    overallScore: 100,
    grammarScore: 100,
    spellingScore: 100,
    clarityScore: 100
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [serviceStatus, setServiceStatus] = useState('unknown');

  // Use refs to avoid unnecessary re-renders
  const debounceTimerRef = useRef(null);
  const lastCheckedTextRef = useRef('');

  // Check service availability on first load
  React.useEffect(() => {
    checkServiceAvailability();
  }, []);

  const checkServiceAvailability = async () => {
    try {
      // Check if secure grammar service is available
      const hasSecureService = isSecureGrammarAvailable();
      if (!hasSecureService) {
        setServiceStatus('unavailable');
        setError('Secure grammar service not available. Please deploy Firebase Functions.');
        return;
      }

      // Test the actual connection
      const testResult = await testSecureConnection();
      setServiceStatus(testResult.success ? 'available' : 'unavailable');
      
      if (!testResult.success) {
        setError(`Secure grammar service connection failed: ${testResult.error}`);
      } else {
        setError(''); // Clear any previous errors
      }
    } catch (error) {
      console.error('Secure grammar service availability check failed:', error);
      setServiceStatus('unavailable');
      setError('Failed to connect to secure grammar service. Please check your Firebase Functions deployment.');
    }
  };

  // AI-powered grammar check function using both services
  const performGrammarCheck = useCallback(async (text) => {
    console.log('🤖 performGrammarCheck called with text:', text.substring(0, 50) + '...');
    
    if (!text || text.trim().length < 3) { // Reduced minimum length for faster feedback
      console.log('❌ Text too short, skipping grammar check');
      setCorrections([]);
      setLegacyCorrections([]);
      setSuggestions([]);
      setLegacySuggestions([]);
      setStats({
        words: 0,
        characters: 0,
        sentences: 0,
        issues: 0,
        overallScore: 100,
        grammarScore: 100,
        spellingScore: 100,
        clarityScore: 100
      });
      return;
    }

    if (!isEnabled) {
      return;
    }

    // Don't check the same text again, but allow minor changes
    const textChanged = text !== lastCheckedTextRef.current;
    const hasSignificantChange = Math.abs(text.length - lastCheckedTextRef.current.length) > 5 || 
                                text.trim() !== lastCheckedTextRef.current.trim();
    
    if (!textChanged && !hasSignificantChange && (corrections.length > 0 || legacyCorrections.length > 0)) {
      return;
    }

    // Show subtle loading for auto-checks, full loading for manual checks
    setError('');
    lastCheckedTextRef.current = text;

    try {
      // Call both services simultaneously
      const [modernResult, legacyResult] = await Promise.allSettled([
        checkGrammarSecurely(text),
        checkGrammarWithLegacyService(text)
      ]);

      // Handle modern service results
      if (modernResult.status === 'fulfilled' && !modernResult.value.error) {
        const result = modernResult.value;
        setCorrections(result.corrections || []);
        setSuggestions(result.suggestions || []);
        
        // Update writing statistics from modern AI
        setStats(result.stats || {
          words: text.trim().split(/\s+/).length,
          characters: text.length,
          sentences: text.split(/[.!?]+/).filter(s => s.trim()).length,
          issues: (result.corrections?.length || 0) + (legacyResult.status === 'fulfilled' ? legacyResult.value.corrections?.length || 0 : 0),
          overallScore: 100,
          grammarScore: 100,
          spellingScore: 100,
          clarityScore: 100
        });
      } else {
        setCorrections([]);
        setSuggestions([]);
        if (modernResult.status === 'rejected') {
          console.error('Modern AI service failed:', modernResult.reason);
        }
      }

      // Handle legacy service results
      if (legacyResult.status === 'fulfilled') {
        const result = legacyResult.value;
        setLegacyCorrections(result.corrections || []);
        setLegacySuggestions(result.suggestions || []);
      } else {
        setLegacyCorrections([]);
        setLegacySuggestions([]);
        console.error('Legacy AI service failed:', legacyResult.reason);
      }

      // Set error only if both services failed
      if (modernResult.status === 'rejected' && legacyResult.status === 'rejected') {
        setError('Both AI grammar services are temporarily unavailable. Please try again later.');
      }

      // Still provide basic stats even if both services fail
      if (modernResult.status === 'rejected' && legacyResult.status === 'rejected') {
        setStats({
          words: text.trim().split(/\s+/).length,
          characters: text.length,
          sentences: text.split(/[.!?]+/).filter(s => s.trim()).length,
          issues: 0,
          overallScore: 100,
          grammarScore: 100,
          spellingScore: 100,
          clarityScore: 100
        });
      }

    } catch (err) {
      console.error('Grammar check failed:', err);
      setError('Grammar checking temporarily unavailable. Please try again.');
      
      // Still provide basic stats
      setStats({
        words: text.trim().split(/\s+/).length,
        characters: text.length,
        sentences: text.split(/[.!?]+/).filter(s => s.trim()).length,
        issues: 0,
        overallScore: 100,
        grammarScore: 100,
        spellingScore: 100,
        clarityScore: 100
      });
    } finally {
      setLoading(false);
    }
  }, [isEnabled]); // useCallback dependencies

  // Smart debounced grammar check function for real-time updates
  const checkTextGrammar = useCallback((text) => {
    console.log('🔍 checkTextGrammar called with text length:', text.length);
    
    // Detect if we're on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                     (window.innerWidth <= 768);
    
    // On mobile, be less aggressive about skipping during scroll
    if (!isMobile && document.body.classList.contains('scrolling')) {
      console.log('⏸️ Skipping grammar check during scroll (desktop only)');
      return;
    }
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Optimized delay for sub-2 second total response time
    const delay = 800; // 800ms delay + ~200-500ms processing = under 1.5 seconds total
    
    console.log('⏰ Setting timer for grammar check in', delay, 'ms');
    
    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      console.log('🚀 Timer fired! Running grammar check...');
      performGrammarCheck(text);
    }, delay);

  }, [performGrammarCheck]); // Removed corrections.length dependency to prevent re-renders

  // Manual grammar check (for button clicks) - always shows loading
  const checkGrammarNow = useCallback(async (text) => {
    if (!text || text.trim().length < 3) { // Reduced minimum length for faster feedback
      return;
    }
    
    // Clear any pending debounced check
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Force loading state for manual checks
    setLoading(true);
    setError('');
    lastCheckedTextRef.current = text;

    // Call the same function that handles both services
    await performGrammarCheck(text);
    
    // Note: loading state is handled by performGrammarCheck
  }, [performGrammarCheck]);

  // Clear all suggestions
  const clearSuggestions = useCallback(() => {
    setCorrections([]);
    setLegacyCorrections([]);
    setSuggestions([]);
    setLegacySuggestions([]);
    setStats({
      words: 0,
      characters: 0,
      sentences: 0,
      issues: 0,
      overallScore: 100,
      grammarScore: 100,
      spellingScore: 100,
      clarityScore: 100
    });
    setError('');
    lastCheckedTextRef.current = '';
  }, []);

  // Toggle grammar checking on/off
  const toggleGrammarChecking = useCallback(() => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    if (!newEnabled) {
      clearSuggestions();
    }
  }, [isEnabled, clearSuggestions]);

  // Apply a correction to text (placeholder - actual implementation in Editor)
  const applyCorrection = useCallback((original, corrected) => {
    return { original, corrected };
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Stable value object
  const value = React.useMemo(() => ({
    // State
    corrections,
    legacyCorrections,
    suggestions,
    legacySuggestions,
    stats,
    loading,
    error,
    isEnabled,
    serviceStatus,
    
    // Actions
    checkTextGrammar,
    checkGrammar: checkTextGrammar, // Alias for compatibility
    checkGrammarNow,
    applyCorrection,
    clearSuggestions,
    toggleGrammarChecking,
    checkServiceAvailability,
    
    // AI-specific features
    isAIEnabled: isOpenAIAvailable(),
    performAnalysis: checkGrammarNow // Explicit AI analysis trigger
  }), [
    corrections,
    legacyCorrections,
    suggestions,
    legacySuggestions,
    stats,
    loading,
    error,
    isEnabled,
    serviceStatus,
    checkTextGrammar,
    checkGrammarNow,
    applyCorrection,
    clearSuggestions,
    toggleGrammarChecking
  ]);

  return (
    <GrammarContext.Provider value={value}>
      {children}
    </GrammarContext.Provider>
  );
}; 