/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {defineSecret} = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const axios = require("axios");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// Define the OpenAI API key as a secure secret
const openaiApiKey = defineSecret("OPENAI_API_KEY");

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

// Helper functions for basic text statistics
const countWords = (text) => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const countSentences = (text) => {
  return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
};

exports.grammarCheck = onRequest(
  { secrets: [openaiApiKey], cors: true },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "Request body must contain a 'text' field." });
      }

      // Return basic stats for very short text
      if (text.trim().length < 10) {
        return res.status(200).json({
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
        });
      }

      logger.info("Received grammar check request", { textLength: text.length });

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert English grammar checker and ESL writing assistant. Always respond with valid JSON only."
            },
            {
              role: "user",
              content: createGrammarPrompt(text)
            }
          ],
          temperature: 0.1,
          max_tokens: 2000,
          response_format: { type: "json_object" }
        },
        {
          headers: {
            Authorization: `Bearer ${openaiApiKey.value()}`,
            "Content-Type": "application/json",
          },
          timeout: 30000 // 30 second timeout
        }
      );

      const content = response.data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response from OpenAI API');
      }

      // Parse the JSON response
      let result;
      try {
        result = JSON.parse(content);
      } catch (parseError) {
        logger.error('Failed to parse OpenAI response:', content);
        throw new Error('Invalid response format from OpenAI');
      }

      // Validate and normalize the response
      const normalizedResult = {
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

      logger.info("Grammar check completed successfully", { 
        issues: normalizedResult.stats.issues,
        overallScore: normalizedResult.stats.overallScore 
      });

      res.status(200).json(normalizedResult);

    } catch (err) {
      logger.error("Grammar check error:", err.response?.data || err.message);
      
      // Return fallback response with basic stats
      const { text } = req.body;
      const fallbackResponse = {
        corrections: [],
        stats: {
          words: text ? countWords(text) : 0,
          sentences: text ? countSentences(text) : 0,
          characters: text ? text.length : 0,
          issues: 0,
          overallScore: 100,
          grammarScore: 100,
          spellingScore: 100,
          clarityScore: 100
        },
        suggestions: [],
        error: "Grammar checking service temporarily unavailable. Please try again."
      };

      res.status(500).json(fallbackResponse);
    }
  }
);

// Test endpoint to verify the function is working
exports.testConnection = onRequest(
  { cors: true },
  async (req, res) => {
    res.status(200).json({ 
      status: "success", 
      message: "Grammar check service is running",
      timestamp: new Date().toISOString()
    });
  }
);

// Add function warming to prevent cold starts
exports.keepWarm = onSchedule("every 5 minutes", async (event) => {
  logger.info("Warming up grammar check function");
  return "Function kept warm";
});

// Lightweight health check for warming
exports.healthCheck = onRequest({ cors: true }, (req, res) => {
  res.status(200).json({ status: "warm", timestamp: new Date().toISOString() });
});
