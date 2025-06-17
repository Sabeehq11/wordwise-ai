// OpenAI GPT-4o service for grammar checking
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Get API key from environment variables
const getApiKey = () => {
  // In Vite, environment variables must be prefixed with VITE_ to be accessible in the browser
  // Set VITE_OPENAI_API_KEY in your .env file
  return import.meta.env.VITE_OPENAI_API_KEY;
};

// Check if OpenAI API is available
export const isOpenAIAvailable = () => {
  const apiKey = getApiKey();
  return !!apiKey;
};

// Generate a comprehensive grammar checking prompt
const createGrammarPrompt = (text) => {
  return `As an expert English grammar checker and ESL writing assistant, analyze the following text for grammar, spelling, punctuation, and style issues. 

Text to analyze:
"${text}"

Please return your analysis in the following JSON format:
{
  "corrections": [
    {
      "original": "the exact error text from the input",
      "corrected": "the suggested correction",
      "explanation": "brief explanation of why this is incorrect and how to fix it",
      "type": "grammar|spelling|punctuation|style|vocabulary",
      "offset": number (character position where error starts),
      "length": number (length of error text),
      "severity": "low|medium|high"
    }
  ],
  "stats": {
    "words": number,
    "sentences": number,
    "characters": number,
    "issues": number,
    "overallScore": number (0-100),
    "grammarScore": number (0-100),
    "spellingScore": number (0-100),
    "clarityScore": number (0-100)
  },
  "suggestions": [
    "general writing improvement suggestions"
  ]
}

Focus on:
- Grammar errors (subject-verb agreement, tense consistency, etc.)
- Spelling mistakes
- Punctuation issues
- Word choice and vocabulary improvements
- Sentence structure and clarity
- Common ESL mistakes

Be encouraging and educational in your explanations. If no errors are found, return an empty corrections array but still provide stats and positive feedback.`;
};

// Call OpenAI GPT-4o API for grammar checking
export const checkGrammarWithOpenAI = async (text) => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please create a .env file in your project root and add: VITE_OPENAI_API_KEY=your_api_key_here');
  }

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
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    console.log("🧪 Loaded API key:", apiKey);
    
    // Detect mobile device for timeout adjustments
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    console.log(`📱 Mobile device detected: ${isMobile}`);
    console.log(`🔍 Checking grammar for text (${text.length} chars):`, text.substring(0, 100) + '...');
    
    // Create fetch with timeout for mobile reliability
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, isMobile ? 15000 : 10000); // Longer timeout on mobile
    
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert English grammar checker and ESL writing assistant. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: createGrammarPrompt(text)
          }
        ],
        temperature: 0.1, // Low temperature for consistent, accurate corrections
        max_tokens: isMobile ? 1500 : 2000, // Smaller response on mobile for faster processing
        response_format: { type: "json_object" }
      })
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI API');
    }

    // Parse the JSON response
    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid response format from OpenAI');
    }

    // Validate and normalize the response
    return {
      corrections: result.corrections || [],
      stats: {
        words: result.stats?.words || countWords(text),
        sentences: result.stats?.sentences || countSentences(text),
        characters: result.stats?.characters || text.length,
        issues: result.corrections?.length || 0,
        overallScore: result.stats?.overallScore || 100,
        grammarScore: result.stats?.grammarScore || 100,
        spellingScore: result.stats?.spellingScore || 100,
        clarityScore: result.stats?.clarityScore || 100
      },
      suggestions: result.suggestions || []
    };

  } catch (error) {
    console.error('OpenAI API error:', error);
    
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
    
    // Provide helpful error messages for mobile users
    let errorMessage = error.message;
    if (error.name === 'AbortError') {
      errorMessage = isMobile ? 
        'Grammar check timed out. This might be due to slow network. Please try again.' :
        'Request timed out. Please try again.';
    } else if (!navigator.onLine) {
      errorMessage = 'No internet connection. Please check your network and try again.';
    }
    
    // Return basic stats even if API fails
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

// Helper functions for basic text statistics
const countWords = (text) => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const countSentences = (text) => {
  return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
};

// Test the OpenAI connection
export const testOpenAIConnection = async () => {
  try {
    const result = await checkGrammarWithOpenAI("This is a test sentence.");
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 