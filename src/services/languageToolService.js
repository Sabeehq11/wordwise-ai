// Static grammar suggestions service for demonstration

// Languages supported by LanguageTool
export const SUPPORTED_LANGUAGES = {
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'pt': 'Portuguese',
  'it': 'Italian',
  'nl': 'Dutch',
  'pl': 'Polish',
  'ru': 'Russian'
};

// Rule categories for different types of issues
const RULE_CATEGORIES = {
  'TYPOS': 'spelling',
  'GRAMMAR': 'grammar',
  'PUNCTUATION': 'punctuation',
  'CASING': 'capitalization',
  'REDUNDANCY': 'style',
  'STYLE': 'style',
  'COLLOQUIALISMS': 'style',
  'CONFUSED_WORDS': 'vocabulary',
  'PLAIN_ENGLISH': 'clarity',
  'COMPOUNDING': 'grammar'
};

// Static grammar suggestions for demonstration
const DEMO_SUGGESTIONS = [
  {
    original: "I am go",
    corrected: "I am going",
    explanation: "Use the present continuous tense 'am going' instead of 'am go' for ongoing actions.",
    type: "grammar",
    confidence: 0.9,
    offset: 0,
    length: 6,
    replacements: [{ value: "I am going" }, { value: "I go" }],
    ruleId: "DEMO_VERB_FORM",
    category: "Grammar"
  },
  {
    original: "a apple",
    corrected: "an apple",
    explanation: "Use 'an' before words that start with a vowel sound, like 'apple'.",
    type: "grammar",
    confidence: 0.95,
    offset: 10,
    length: 7,
    replacements: [{ value: "an apple" }],
    ruleId: "DEMO_ARTICLE",
    category: "Grammar"
  },
  {
    original: "there",
    corrected: "their",
    explanation: "Use 'their' to show possession (belonging to them), not 'there' (location).",
    type: "vocabulary",
    confidence: 0.8,
    offset: 25,
    length: 5,
    replacements: [{ value: "their" }, { value: "they're" }],
    ruleId: "DEMO_CONFUSED_WORDS",
    category: "Confused Words"
  },
  {
    original: "alot",
    corrected: "a lot",
    explanation: "'A lot' should be written as two separate words, not 'alot'.",
    type: "spelling",
    confidence: 0.9,
    offset: 35,
    length: 4,
    replacements: [{ value: "a lot" }],
    ruleId: "DEMO_SPELLING",
    category: "Spelling"
  },
  {
    original: "dont",
    corrected: "don't",
    explanation: "Contractions need an apostrophe. 'Don't' is short for 'do not'.",
    type: "punctuation",
    confidence: 0.95,
    offset: 45,
    length: 4,
    replacements: [{ value: "don't" }, { value: "do not" }],
    ruleId: "DEMO_APOSTROPHE",
    category: "Punctuation"
  },
  {
    original: "to makret the",
    corrected: "to the market",
    explanation: "In English, determiners like 'the' come before the noun. Also check spelling of 'market'.",
    type: "grammar",
    confidence: 0.85,
    offset: 55,
    length: 13,
    replacements: [{ value: "to the market" }, { value: "to market" }],
    ruleId: "DEMO_WORD_ORDER",
    category: "Word Order"
  }
];

// Check text with static suggestions
export const checkWithLanguageTool = async (text, language = 'en-US', enabledOnly = false) => {
  if (!text || text.trim().length < 3) {
    return {
      matches: [],
      corrections: [],
      suggestions: [],
      language: language
    };
  }

  // Simulate API delay for realistic behavior
  await new Promise(resolve => setTimeout(resolve, 300));

  // Filter suggestions based on text content
  const relevantSuggestions = DEMO_SUGGESTIONS.filter(suggestion => {
    const lowerText = text.toLowerCase();
    const searchTerm = suggestion.original.toLowerCase();
    return lowerText.includes(searchTerm);
  });

  // If no specific matches, show some general suggestions for demonstration
  let corrections = relevantSuggestions;
  if (corrections.length === 0 && text.trim().length > 10) {
    // Show a random selection of 2-3 suggestions for demo purposes
    corrections = DEMO_SUGGESTIONS.slice(0, Math.min(3, DEMO_SUGGESTIONS.length));
  }

  // Generate writing suggestions based on detected patterns
  const suggestions = generateWritingSuggestions(corrections, text);

  return {
    matches: corrections,
    corrections: corrections,
    suggestions,
    language: 'English (Demo)',
    detectedLanguage: language
  };
};

// No longer needed - using static demo data with predefined types

// Demo suggestions are now defined above - no manual detection needed

// Generate writing suggestions based on detected issues
const generateWritingSuggestions = (corrections, text) => {
  const suggestions = [];
  const wordCount = text.split(/\s+/).length;
  const sentenceCount = text.split(/[.!?]+/).length;

  // Spelling suggestions
  const spellingErrors = corrections.filter(c => c.type === 'spelling').length;
  if (spellingErrors > 2) {
    suggestions.push({
      text: "Consider using a spell checker or proofreading your text more carefully",
      type: "spelling",
      priority: "high"
    });
  }

  // Grammar suggestions
  const grammarErrors = corrections.filter(c => c.type === 'grammar').length;
  if (grammarErrors > 3) {
    suggestions.push({
      text: "Review grammar rules, especially subject-verb agreement and verb tenses",
      type: "grammar",
      priority: "high"
    });
  }

  // Style suggestions based on text length
  if (wordCount > 0) {
    const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);
    
    if (avgWordsPerSentence > 25) {
      suggestions.push({
        text: "Try breaking up long sentences for better readability",
        type: "style",
        priority: "medium"
      });
    }
    
    if (avgWordsPerSentence < 8 && wordCount > 50) {
      suggestions.push({
        text: "Consider combining some short sentences for better flow",
        type: "style",
        priority: "low"
      });
    }
  }

  // Vocabulary suggestions
  const vocabularyIssues = corrections.filter(c => c.type === 'vocabulary').length;
  if (vocabularyIssues > 0) {
    suggestions.push({
      text: "Great job on vocabulary! Keep expanding your word choice",
      type: "vocabulary",
      priority: "low"
    });
  }

  // Encouragement for clean writing
  if (corrections.length === 0 && wordCount > 20) {
    suggestions.push({
      text: "Excellent work! Your writing is clear and error-free",
      type: "encouragement",
      priority: "low"
    });
  }

  return suggestions;
};

// Get writing statistics
export const getWritingStats = (text, corrections = []) => {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
  
  // Calculate error rates
  const errorRate = words > 0 ? (corrections.length / words) * 100 : 0;
  const spellingErrors = corrections.filter(c => c.type === 'spelling').length;
  const grammarErrors = corrections.filter(c => c.type === 'grammar').length;
  
  // Calculate writing scores (0-100)
  const grammarScore = Math.max(0, 100 - (grammarErrors * 10));
  const spellingScore = Math.max(0, 100 - (spellingErrors * 15));
  const clarityScore = Math.max(0, 100 - (errorRate * 2));
  
  return {
    words,
    characters,
    sentences,
    paragraphs,
    errorRate: Math.round(errorRate * 10) / 10,
    scores: {
      grammar: Math.round(grammarScore),
      spelling: Math.round(spellingScore),
      clarity: Math.round(clarityScore),
      overall: Math.round((grammarScore + spellingScore + clarityScore) / 3)
    },
    errorBreakdown: {
      spelling: spellingErrors,
      grammar: grammarErrors,
      style: corrections.filter(c => c.type === 'style').length,
      vocabulary: corrections.filter(c => c.type === 'vocabulary').length,
      total: corrections.length
    }
  };
};

// Check if grammar service is available (always true for demo)
export const isLanguageToolAvailable = async () => {
  // Simulate brief check delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return true; // Demo service is always available
};

// Demo version - no premium features needed 