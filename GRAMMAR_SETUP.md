# 🧠 Grammar Checking Setup Guide

## Overview
Your WordWise app now includes intelligent grammar checking powered by OpenAI, specifically designed for ESL (English as a Second Language) students. The system provides:

- **Real-time grammar corrections** with explanations
- **Writing score analysis** (Grammar, Clarity, Vocabulary)
- **Style and vocabulary suggestions**
- **One-click correction application**
- **Educational explanations** to help students learn

## 🔑 Step 1: Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Go to **API Keys** section
4. Click **"Create new secret key"**
5. Copy your API key (starts with `sk-...`)

## 📝 Step 2: Configure Environment Variables

Create a `.env` file in your project root directory:

```bash
# OpenAI Configuration
VITE_OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# Optional: Firebase Config (if you prefer env vars over hardcoded config)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

**Important Notes:**
- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore` file
- Use `VITE_` prefix for variables accessible in the browser

## 🚀 Step 3: Test Grammar Checking

1. **Start your app**: `npm run dev`
2. **Sign up/Login** to access the dashboard
3. **Create a new document**
4. **Start typing** - grammar suggestions will appear after 3 seconds
5. **Test with common ESL mistakes**:
   - "I am go to school" → Should suggest "I am going to school"
   - "a apple" → Should suggest "an apple"
   - "He don't like" → Should suggest "He doesn't like"

## 🎯 Features Included

### Real-time Analysis
- **Automatic checking** after user stops typing (3-second delay)
- **Writing scores** for Grammar, Clarity, and Vocabulary
- **Instant feedback** without manual triggers

### ESL-Focused Corrections
- **Article errors** (a/an/the usage)
- **Verb tense consistency**
- **Preposition corrections**
- **Sentence structure improvements**
- **Vocabulary enhancements**

### Educational Interface
- **Clear explanations** for each correction
- **Correction confidence scores**
- **Category tags** (grammar, spelling, style, vocabulary)
- **One-click application** of suggestions
- **Writing tips** specifically for ESL learners

### Performance Features
- **Debounced requests** to avoid API spam
- **Fallback samples** when API key is missing
- **Error handling** with graceful degradation
- **Loading states** and user feedback

## 💰 Cost Management

### OpenAI Pricing Tips:
- **GPT-3.5-turbo** is cost-effective for grammar checking
- **Average cost**: ~$0.002 per 1000 tokens (very affordable)
- **Set usage limits** in OpenAI dashboard
- **Monitor usage** regularly

### Example Usage Costs:
- **100 grammar checks/day**: ~$0.50/month
- **500 grammar checks/day**: ~$2.50/month
- **1000 grammar checks/day**: ~$5.00/month

## 🔧 Customization Options

### Adjust Grammar Check Sensitivity
In `src/contexts/GrammarContext.jsx`, modify the debounce delay:
```javascript
debounce(async (text) => {
  // Change 3000 to desired milliseconds
}, 3000)
```

### Modify AI Prompt
In `src/services/grammarService.js`, customize the `GRAMMAR_PROMPT` for different focus areas:
- Academic writing
- Business communication
- Creative writing
- Technical documentation

### Disable Grammar Checking
Users can toggle grammar checking on/off using the disable button in the suggestions panel.

## 🐛 Troubleshooting

### "Grammar checking temporarily unavailable"
- Check your OpenAI API key is correct
- Verify you have credits in your OpenAI account
- Check browser console for specific error messages

### No suggestions appearing
- Ensure text is at least 10 characters long
- Check that grammar checking is enabled (toggle button)
- Verify the API key is properly set in `.env`

### Suggestions are too slow/fast
- Adjust the debounce delay in `GrammarContext.jsx`
- Consider your internet connection speed
- Check OpenAI API response times

## 🔒 Security Considerations

### Production Deployment
- **Move API calls to backend** (currently using `dangerouslyAllowBrowser: true`)
- **Implement rate limiting** on your server
- **Validate user input** before sending to OpenAI
- **Add request logging** for monitoring

### Recommended Architecture:
```
Frontend → Your Backend API → OpenAI API
```

## 📊 Analytics & Monitoring

Track usage patterns:
- Number of grammar checks per user
- Most common error types
- User satisfaction with suggestions
- API response times and costs

## 🎓 Educational Benefits

The grammar checker is specifically designed for ESL students:

1. **Learning-focused explanations** rather than just corrections
2. **Common ESL mistake detection** (articles, verb tenses, etc.)
3. **Confidence building** through positive feedback
4. **Progressive difficulty** based on writing complexity
5. **Cultural context awareness** in suggestions

## 🚀 Next Steps

Once grammar checking is working:
1. **Gather user feedback** on suggestion quality
2. **Fine-tune prompts** based on user needs
3. **Add more languages** for multilingual support
4. **Implement caching** for common corrections
5. **Add grammar exercises** based on detected patterns

Your WordWise app is now a powerful ESL learning tool! 🎉 