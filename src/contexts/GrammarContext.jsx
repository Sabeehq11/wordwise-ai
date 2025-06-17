import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { checkGrammarWithOpenAI, isOpenAIAvailable, testOpenAIConnection } from '../services/openaiService';

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
  const [suggestions, setSuggestions] = useState([]);
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
      // Check if API key is available first
      const hasApiKey = isOpenAIAvailable();
      if (!hasApiKey) {
        setServiceStatus('unavailable');
        setError('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your environment variables.');
        return;
      }

      // Test the actual connection
      const testResult = await testOpenAIConnection();
      setServiceStatus(testResult.success ? 'available' : 'unavailable');
      
      if (!testResult.success) {
        setError(`OpenAI API connection failed: ${testResult.error}`);
      }
    } catch (error) {
      console.error('OpenAI service availability check failed:', error);
      setServiceStatus('unavailable');
      setError('Failed to connect to OpenAI API. Please check your configuration.');
    }
  };

  // AI-powered grammar check function
  const performGrammarCheck = useCallback(async (text) => {
    if (!text || text.trim().length < 10) {
      setCorrections([]);
      setSuggestions([]);
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
    if (!textChanged && corrections.length > 0) {
      return;
    }

    // Never show loading for automatic background checks
    // Loading only for manual button clicks or initial empty state
    setError('');
    lastCheckedTextRef.current = text;

    try {
      const result = await checkGrammarWithOpenAI(text);
      
      if (result.error) {
        setError(result.error);
        return;
      }

      // Update corrections and suggestions from AI
      setCorrections(result.corrections || []);
      setSuggestions(result.suggestions || []);
      
      // Update writing statistics from AI
      setStats(result.stats || {
        words: text.trim().split(/\s+/).length,
        characters: text.length,
        sentences: text.split(/[.!?]+/).filter(s => s.trim()).length,
        issues: result.corrections?.length || 0,
        overallScore: 100,
        grammarScore: 100,
        spellingScore: 100,
        clarityScore: 100
      });

    } catch (err) {
      console.error('AI grammar check failed:', err);
      setError('AI grammar checking temporarily unavailable. Please check your API key and try again.');
      
      // Still provide basic stats even if AI check fails
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
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Use shorter delay for better real-time experience
    const delay = corrections.length > 0 ? 1000 : 1500; // Faster updates when we have existing results
    
    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      performGrammarCheck(text);
    }, delay);

  }, [performGrammarCheck, corrections.length]); // Include corrections.length for adaptive timing

  // Manual grammar check (for button clicks) - always shows loading
  const checkGrammarNow = useCallback(async (text) => {
    if (!text || text.trim().length < 10) {
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

    try {
      const result = await checkGrammarWithOpenAI(text);
      
      if (result.error) {
        setError(result.error);
        return;
      }

      setCorrections(result.corrections || []);
      setSuggestions(result.suggestions || []);
      setStats(result.stats || {
        words: text.trim().split(/\s+/).length,
        characters: text.length,
        sentences: text.split(/[.!?]+/).filter(s => s.trim()).length,
        issues: result.corrections?.length || 0,
        overallScore: 100,
        grammarScore: 100,
        spellingScore: 100,
        clarityScore: 100
      });

    } catch (err) {
      console.error('Manual grammar check failed:', err);
      setError('Grammar checking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear all suggestions
  const clearSuggestions = useCallback(() => {
    setCorrections([]);
    setSuggestions([]);
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
    suggestions,
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
    suggestions,
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