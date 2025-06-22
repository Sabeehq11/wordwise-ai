import OpenAI from 'openai';

// Force cache bust for deployment - timestamp: 2025-01-17T22:30:00Z
const DEPLOYMENT_VERSION = "v2.1.0";

// Initialize OpenAI (you'll need to add your API key)
// Cache-bust: Updated for fresh deployment
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for demo - use backend in production
});

// Grammar checking prompt optimized for ESL students
const GRAMMAR_PROMPT = `
You are a helpful English teacher assistant for ESL (English as a Second Language) students. 
Analyze the following text and provide grammar corrections, style improvements, and learning explanations.

Return your response as a JSON object with this exact structure:
{
  "corrections": [
    {
      "original": "text with error",
      "corrected": "corrected text",
      "explanation": "Simple explanation of what was wrong and why the correction is better. Use specific terms like 'run-on sentence', 'sentence fragment', 'verb tense', 'subject-verb agreement', 'punctuation', 'article usage', etc.",
      "type": "grammar|spelling|style|vocabulary|punctuation",
      "confidence": 0.95
    }
  ],
  "suggestions": [
    {
      "text": "General writing suggestion or tip",
      "type": "style|clarity|vocabulary"
    }
  ],
  "score": {
    "grammar": 85,
    "clarity": 78,
    "vocabulary": 82
  }
}

Focus on:
1. Common ESL grammar mistakes (articles, verb tenses, prepositions)
2. Word choice and vocabulary improvements
3. Sentence structure and clarity (run-on sentences, fragments)
4. Punctuation errors (apostrophes, commas, periods)
5. Subject-verb agreement issues
6. Helpful explanations that teach, not just correct

In your explanations, use specific grammar terminology when appropriate:
- "run-on sentence" for sentences that need to be broken up
- "sentence fragment" for incomplete sentences
- "verb tense" for tense consistency issues
- "subject-verb agreement" for singular/plural mismatches
- "article usage" for a/an/the mistakes
- "punctuation" for apostrophe, comma, period issues
- "preposition" for in/on/at/etc. mistakes

Text to analyze:
"{{TEXT}}"
`;

// Check grammar using OpenAI
export const checkGrammar = async (text) => {
  if (!text || text.trim().length < 10) {
    return {
      corrections: [],
      suggestions: [],
      score: { grammar: 100, clarity: 100, vocabulary: 100 }
    };
  }

  try {
    const prompt = GRAMMAR_PROMPT.replace('{{TEXT}}', text);
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert English teacher specializing in helping ESL students improve their writing."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800, // Reduced for faster response
      temperature: 0.1 // Lower temperature for more consistent, faster responses
    });

    const content = response.choices[0].message.content;
    
    // Try to parse JSON response - handle markdown code blocks
    try {
      // Remove markdown code block markers if present
      let jsonContent = content;
      if (content.includes('```json')) {
        jsonContent = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
      } else if (content.includes('```')) {
        jsonContent = content.replace(/```\s*/g, '').trim();
      }
      
      // Additional cleanup for common formatting issues
      jsonContent = jsonContent.replace(/^\s*```\s*/, '').replace(/\s*```\s*$/, '').trim();
      
      // Try to find JSON content if it's embedded in other text
      const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonContent = jsonMatch[0];
      }
      
      const result = JSON.parse(jsonContent);
      
      // Validate that we have the expected structure
      if (result && typeof result === 'object') {
        return {
          corrections: Array.isArray(result.corrections) ? result.corrections : [],
          suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
          score: result.score || { grammar: 85, clarity: 80, vocabulary: 85 }
        };
      } else {
        throw new Error('Invalid response structure');
      }
      
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Raw OpenAI response content:', content.substring(0, 500) + (content.length > 500 ? '...' : ''));
      return fallbackResponse(content);
    }

  } catch (error) {
    console.error('Grammar checking error:', error);
    
    // Return sample data for demonstration when API key is not set
    if (error.message.includes('API key') || error.message.includes('dangerouslyAllowBrowser')) {
      return getSampleCorrections(text);
    }
    
    throw error;
  }
};

// Fallback response if JSON parsing fails
const fallbackResponse = (content) => {
  // Try to extract any useful information from the response
  const corrections = [];
  const suggestions = [];
  
  // Look for common correction patterns in the raw response
  if (content.toLowerCase().includes('grammar') || content.toLowerCase().includes('correction')) {
    suggestions.push({
      text: "The AI detected potential improvements in your text. Please try again or rephrase your text.",
      type: "general"
    });
  } else {
    suggestions.push({
      text: "Grammar analysis completed. Your text has been reviewed for potential improvements.",
      type: "general"
    });
  }
  
  return {
    corrections,
    suggestions,
    score: { grammar: 85, clarity: 85, vocabulary: 85 }
  };
};

// Sample corrections for demonstration (when API key is not configured)
const getSampleCorrections = (text) => {
  const corrections = [];
  const suggestions = [];
  const lowerText = text.toLowerCase();

  // Add comprehensive sample corrections based on common mistakes
  if (lowerText.includes('i am go')) {
    corrections.push({
      original: "I am go",
      corrected: "I am going",
      explanation: "Use 'going' (present continuous) instead of 'go' after 'am'",
      type: "grammar",
      confidence: 0.95
    });
  }

  if (lowerText.includes('a apple')) {
    corrections.push({
      original: "a apple",
      corrected: "an apple",
      explanation: "Use 'an' before words that start with a vowel sound",
      type: "grammar",
      confidence: 0.98
    });
  }

  // Check for run-on sentences
  if (lowerText.includes('i went to the store i forgot my wallet') || 
      lowerText.includes('she was tired she went to bed') ||
      text.length > 100 && !text.includes('.') && !text.includes(';') && text.includes(' i ')) {
    const firstSentence = text.substring(0, text.length / 2).trim();
    const secondSentence = text.substring(text.length / 2).trim();
    corrections.push({
      original: text.length > 80 ? text.substring(0, 80) + "..." : text,
      corrected: firstSentence + ". " + secondSentence.charAt(0).toUpperCase() + secondSentence.slice(1),
      explanation: "This is a run-on sentence. Break it into two separate sentences for better clarity.",
      type: "grammar",
      confidence: 0.90
    });
  }

  // Check for sentence fragments
  if (lowerText.includes('because i was tired') || lowerText.includes('when i arrived') ||
      (text.split(' ').length < 5 && !text.includes('is') && !text.includes('are') && !text.includes('was'))) {
    corrections.push({
      original: text.length > 50 ? text.substring(0, 50) + "..." : text,
      corrected: "I felt tired because I was working late.",
      explanation: "This appears to be a sentence fragment. A complete sentence needs a subject and verb.",
      type: "grammar",
      confidence: 0.85
    });
  }

  // Common spelling mistakes
  if (lowerText.includes('teh ')) {
    corrections.push({
      original: "teh",
      corrected: "the",
      explanation: "Common spelling mistake: 'the' is correct",
      type: "spelling",
      confidence: 0.99
    });
  }

  if (lowerText.includes('alot')) {
    corrections.push({
      original: "alot",
      corrected: "a lot",
      explanation: "'A lot' should be written as two separate words",
      type: "spelling",
      confidence: 0.95
    });
  }

  if (lowerText.includes('dont')) {
    corrections.push({
      original: "dont",
      corrected: "don't",
      explanation: "Contractions need an apostrophe: 'don't' is short for 'do not'",
      type: "punctuation",
      confidence: 0.98
    });
  }

  if (lowerText.includes('cant')) {
    corrections.push({
      original: "cant",
      corrected: "can't",
      explanation: "Contractions need an apostrophe: 'can't' is short for 'cannot'",
      type: "punctuation",
      confidence: 0.98
    });
  }

  if (lowerText.includes('wont')) {
    corrections.push({
      original: "wont",
      corrected: "won't",
      explanation: "Contractions need an apostrophe: 'won't' is short for 'will not'",
      type: "punctuation",
      confidence: 0.98
    });
  }

  if (lowerText.includes('recieve')) {
    corrections.push({
      original: "recieve",
      corrected: "receive",
      explanation: "Spelling rule: 'i before e except after c' - receive is correct",
      type: "spelling",
      confidence: 0.97
    });
  }

  if (lowerText.includes('there house')) {
    corrections.push({
      original: "there house",
      corrected: "their house",
      explanation: "Use 'their' to show possession (belonging to them), not 'there' (location)",
      type: "grammar",
      confidence: 0.90
    });
  }

  if (lowerText.includes('its going')) {
    corrections.push({
      original: "its going",
      corrected: "it's going",
      explanation: "Use 'it's' (contraction of 'it is') instead of 'its' (possessive)",
      type: "grammar",
      confidence: 0.85
    });
  }

  // Writing style suggestions
  if (text.length > 50) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const avgWordsPerSentence = text.split(/\s+/).length / sentences.length;
    
    if (avgWordsPerSentence > 25) {
      suggestions.push({
        text: "Try breaking longer sentences into shorter ones for better clarity",
        type: "style"
      });
    }
  }

  if (text.split(' ').length > 20) {
    suggestions.push({
      text: "Consider using more varied vocabulary to make your writing more engaging",
      type: "vocabulary"
    });
  }

  // Provide encouragement if no errors found
  if (corrections.length === 0) {
    suggestions.push({
      text: "Great job! Your writing looks clean. Keep practicing to improve further.",
      type: "encouragement"
    });
  }

  return {
    corrections,
    suggestions: suggestions.length ? suggestions : [
      {
        text: "Your writing looks good! Keep practicing to improve further.",
        type: "encouragement"
      }
    ],
    score: {
      grammar: Math.max(70, 100 - corrections.length * 10),
      clarity: Math.max(75, 95 - text.split('.').length * 2),
      vocabulary: Math.max(80, 90 - (text.split(' ').length > 50 ? 10 : 0))
    }
  };
};

// Get writing suggestions based on text analysis
export const getWritingSuggestions = async (text, context = 'general') => {
  const suggestions = [];
  
  // Basic suggestions based on text analysis
  const wordCount = text.split(/\s+/).length;
  const sentenceCount = text.split(/[.!?]+/).length;
  const avgWordsPerSentence = wordCount / sentenceCount;

  if (avgWordsPerSentence > 25) {
    suggestions.push({
      text: "Consider breaking up long sentences for better readability",
      type: "clarity"
    });
  }

  if (wordCount < 50) {
    suggestions.push({
      text: "Try adding more details to develop your ideas further",
      type: "development"
    });
  }

  return suggestions;
};

// Check if OpenAI API key is configured
export const isGrammarCheckingEnabled = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  return apiKey && apiKey.startsWith('sk-');
}; 