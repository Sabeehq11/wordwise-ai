// Secure grammar service that uses Firebase Functions
// This service calls your secure backend instead of exposing API keys

// Get your Firebase project URL - replace with your actual project ID
const FIREBASE_PROJECT_ID = 'wordwiseai-15b77'; // Replace with your actual project ID
const FUNCTIONS_URL = `https://us-central1-${FIREBASE_PROJECT_ID}.cloudfunctions.net`;

// Check if the secure grammar service is available
export const isSecureGrammarAvailable = () => {
  return true; // Always available since it uses your secure backend
};

// Call the secure Firebase Function for grammar checking
export const checkGrammarSecurely = async (text) => {
  if (!text || text.trim().length < 10) {
    return {
      corrections: [],
      stats: {
        words: 0,
        sentences: 0,
        characters: 0,
        issues: 0,
        overallScore: 100,
        grammarScore: 100,
        spellingScore: 100,
        clarityScore: 100
      },
      suggestions: []
    };
  }

  try {
    console.log(`🔒 Checking grammar securely for text (${text.length} chars):`, text.substring(0, 100) + '...');
    
    // Detect mobile device for timeout adjustments
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Create fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, isMobile ? 20000 : 15000); // Longer timeout for backend calls
    
    const response = await fetch(`${FUNCTIONS_URL}/grammarCheck`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({ text })
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Grammar service error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const result = await response.json();
    
    console.log('✅ Secure grammar check completed successfully', {
      issues: result.stats?.issues || 0,
      overallScore: result.stats?.overallScore || 100
    });

    return result;

  } catch (error) {
    console.error('Secure grammar service error:', error);
    
    // Enhanced mobile error logging
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      console.log('📱 Mobile-specific error details:', {
        name: error.name,
        message: error.message,
        networkState: navigator.onLine ? 'online' : 'offline',
        connection: navigator.connection ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt
        } : 'unknown'
      });
    }
    
    // Provide helpful error messages
    let errorMessage = error.message;
    if (error.name === 'AbortError') {
      errorMessage = isMobile ? 
        'Grammar check timed out. This might be due to slow network. Please try again.' :
        'Request timed out. Please try again.';
    } else if (!navigator.onLine) {
      errorMessage = 'No internet connection. Please check your network and try again.';
    }
    
    // Return fallback response with basic stats
    return {
      corrections: [],
      stats: {
        words: countWords(text),
        sentences: countSentences(text),
        characters: text.length,
        issues: 0,
        overallScore: 100,
        grammarScore: 100,
        spellingScore: 100,
        clarityScore: 100
      },
      suggestions: [],
      error: errorMessage
    };
  }
};

// Test the secure grammar service connection
export const testSecureConnection = async () => {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/testConnection`);
    const result = await response.json();
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Helper functions for basic text statistics
const countWords = (text) => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const countSentences = (text) => {
  return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
}; 