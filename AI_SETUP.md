# AI Setup Guide - WordWise Phase 2

## Overview

WordWise Phase 2 integrates OpenAI GPT-4o for intelligent, context-aware grammar checking and writing assistance. This provides more sophisticated analysis compared to traditional rule-based grammar checkers.

## Features

### AI-Powered Grammar Analysis
- **Context-aware corrections** using GPT-4o's understanding
- **Multiple error types** detected: grammar, spelling, punctuation, style, vocabulary
- **Detailed explanations** for each suggestion
- **Writing improvement tips** from the AI
- **Severity levels** for prioritizing fixes

### Smart Functionality
- **3-second debounce** for automatic analysis
- **Manual "Analyze" button** for on-demand checking
- **Real-time statistics** and scoring
- **Educational explanations** perfect for ESL learners

## Setup Instructions

### 1. Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account
3. Click "Create new secret key"
4. Copy the API key (starts with `sk-...`)

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```bash
# OpenAI Configuration
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here

# Firebase (optional - for user authentication)
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
# ... other Firebase config
```

### 3. Install Dependencies

The AI service uses the native `fetch` API, so no additional packages are required.

### 4. Start the Application

```bash
npm run dev
```

## Usage

### Automatic Analysis
- Type in the editor
- After 3 seconds of inactivity, AI analysis begins automatically
- Results appear in the right panel

### Manual Analysis
- Click the **"🤖 Analyze with AI"** button
- Instant analysis of current text
- More detailed feedback than automatic checks

### Understanding Results

#### Correction Types
- **Grammar**: Subject-verb agreement, tense issues
- **Spelling**: Misspelled words
- **Punctuation**: Missing or incorrect punctuation
- **Style**: Writing style improvements
- **Vocabulary**: Better word choices

#### Severity Levels
- **High**: Critical errors that affect meaning
- **Medium**: Important improvements
- **Low**: Style suggestions

## API Usage & Costs

### Token Usage
- Input text + prompt instructions count as input tokens
- AI response counts as output tokens
- Typical analysis: 200-500 tokens total

### Cost Estimation (GPT-4o pricing)
- Input: $0.005 per 1K tokens
- Output: $0.015 per 1K tokens
- Average analysis cost: $0.002-$0.005 per check

### Cost Management Tips
1. **Debounced checking** reduces unnecessary API calls
2. **Manual analysis** gives you control over when to use AI
3. **Disable auto-analysis** when not needed
4. **Set usage limits** in your OpenAI dashboard

## Error Handling

### Common Issues

**"API Key Required"**
- Ensure `VITE_OPENAI_API_KEY` is set correctly
- Restart the development server after adding the key

**"API Connection Failed"**
- Check your internet connection
- Verify API key is valid and has credits
- Check OpenAI service status

**"Rate Limit Exceeded"**
- You've hit OpenAI's rate limits
- Wait a few minutes before trying again
- Consider upgrading your OpenAI plan

## Customization

### Adjusting Analysis Prompt
Edit `src/services/openaiService.js` to modify the AI prompt:

```javascript
const createGrammarPrompt = (text) => {
  return `Your custom prompt here...`;
};
```

### Changing Response Format
Modify the JSON structure in the prompt to add/remove fields:

```javascript
{
  "corrections": [...],
  "stats": {...},
  "suggestions": [...],
  "customField": "your addition"
}
```

### Temperature Setting
Adjust creativity vs consistency in `checkGrammarWithOpenAI`:

```javascript
temperature: 0.1  // Lower = more consistent, Higher = more creative
```

## Integration with Existing Features

### Firebase Integration
- AI analysis works with authenticated users
- Results can be saved to user documents
- History tracking for improvement

### Educational Focus
- Explanations designed for ESL learners
- Encouraging, non-judgmental feedback
- Progressive difficulty adaptation

## Development Tips

### Testing
```javascript
import { testOpenAIConnection } from './services/openaiService';

// Test your setup
const result = await testOpenAIConnection();
console.log(result.success ? 'AI Ready!' : result.error);
```

### Debugging
Enable detailed logging by adding to your `.env`:
```bash
VITE_DEBUG_AI=true
```

### Performance Monitoring
Track API usage and response times:
```javascript
// Add to openaiService.js
console.time('AI Analysis');
const result = await checkGrammarWithOpenAI(text);
console.timeEnd('AI Analysis');
```

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all secrets
3. **Set up usage alerts** in OpenAI dashboard
4. **Rotate API keys** regularly
5. **Monitor API usage** for unexpected spikes

## Troubleshooting

### Development Issues
```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

### Production Deployment
Ensure environment variables are set in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Railway: Project → Variables

## Support

For issues with:
- **WordWise setup**: Check this guide and GitHub issues
- **OpenAI API**: Visit [OpenAI Help Center](https://help.openai.com/)
- **Billing questions**: OpenAI billing support

## What's Next?

Phase 2 provides the foundation for advanced features:
- **Custom writing styles** (academic, casual, business)
- **Multi-language support** enhancement
- **Writing analytics** and progress tracking
- **Team collaboration** features
- **Advanced AI models** as they become available

Happy writing! 🚀 