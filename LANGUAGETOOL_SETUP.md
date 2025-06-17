# 🔍 LanguageTool Grammar Checking Setup Guide

## Overview
Your WordWise app now features **LanguageTool** integration for comprehensive grammar and spelling checking! LanguageTool is a powerful, multilingual grammar checker that provides:

- **Real-time grammar and spelling corrections**
- **Multi-language support** (10+ languages)
- **Detailed explanations** for each issue
- **Multiple correction suggestions**
- **Text highlighting** in the editor
- **Writing statistics and scores**
- **ESL-focused corrections**

## 🚀 Key Features

### ✅ **Free Service**
- No API key required for basic usage
- Uses LanguageTool's free public API
- Rate-limited but sufficient for most users
- Perfect for ESL students and educators

### 🌍 **Multi-Language Support**
- English (US/UK)
- Spanish, French, German
- Portuguese, Italian, Dutch
- Polish, Russian
- Easy language switching in the UI

### 🎯 **Smart Grammar Detection**
- **Spelling errors** - typos and misspellings
- **Grammar mistakes** - verb tenses, agreements
- **Style issues** - clarity and readability
- **Punctuation errors** - missing/incorrect punctuation
- **Vocabulary suggestions** - word choice improvements

### 📊 **Writing Analytics**
- **Writing scores** (Grammar, Spelling, Clarity, Overall)
- **Error rate tracking**
- **Word/sentence/paragraph counts**
- **Issue categorization**

## 🛠️ Setup Instructions

### 1. **No Configuration Required!**
The integration works out-of-the-box with LanguageTool's free API:
- No API keys needed
- No additional setup required
- Works immediately after starting the app

### 2. **Start Using Grammar Checking**
1. **Run your app**: `npm run dev`
2. **Sign up/Login** to access documents
3. **Create or open a document**
4. **Start typing** - corrections appear automatically after 2 seconds
5. **Click suggestions** to apply corrections

### 3. **Try These Examples**
Test with common mistakes:
```
- "I are going to school" → "I am going to school"
- "a apple" → "an apple"  
- "He don't like it" → "He doesn't like it"
- "Your very smart" → "You're very smart"
- "Recieve the package" → "Receive the package"
```

## 🎛️ How to Use

### **Automatic Checking**
- Grammar checking happens **automatically** as you type
- **2-second delay** after you stop typing
- **No manual action required**

### **Manual Checking**
- Click the **"🔍 Check"** button for immediate analysis
- Use **"🔍 Check Grammar Now"** in the suggestions panel
- Refresh analysis anytime

### **Language Selection**
- **Language dropdown** in the suggestions panel
- **Auto-detection** of text language
- **Switch languages** without losing your work

### **Applying Corrections**
- **Primary suggestion**: Click the green "Apply" button
- **Alternative options**: Click any alternate suggestion button
- **Multiple replacements**: Choose from several options when available

## 📱 User Interface Features

### **Text Highlighting**
Grammar issues are highlighted directly in the editor with:
- **Red underlines** for grammar errors
- **Purple underlines** for spelling mistakes
- **Blue underlines** for style issues
- **Green underlines** for vocabulary suggestions
- **Hover tooltips** showing explanations

### **Suggestions Panel**
- **Service status indicator** (Connected/Unavailable)
- **Language selector dropdown**
- **Writing statistics** with scores
- **Detailed issue explanations**
- **Category tags** (Grammar, Spelling, Style, etc.)
- **Multiple correction options**

### **Writing Statistics**
- **Word count**, sentence count, error rate
- **Scores**: Grammar (0-100), Spelling (0-100), Clarity (0-100), Overall
- **Issue breakdown** by category
- **Real-time updates** as you type

## ⚙️ Customization Options

### **Adjust Check Frequency**
In `src/contexts/GrammarContext.jsx`, modify the debounce delay:
```javascript
debounce(async (text) => {
  // Change 2000 to desired milliseconds (e.g., 1000 = 1 second)
}, 2000)
```

### **Change Default Language**
In `src/contexts/GrammarContext.jsx`, update the default:
```javascript
const [language, setLanguage] = useState('en-GB'); // Change from 'en-US'
```

### **Customize Rule Categories**
In `src/services/languageToolService.js`, modify enabled categories:
```javascript
// Focus on specific error types for ESL students
formData.append('enabledCategories', 'TYPOS,GRAMMAR,CONFUSED_WORDS,CASING');
```

### **Adjust Highlighting Colors**
In `src/index.css`, customize the grammar error styles:
```css
.grammar-error.grammar-spelling {
  background-color: rgba(124, 58, 237, 0.3); /* More/less opacity */
  border-bottom-color: #7c3aed;
}
```

## 🔧 Advanced Configuration

### **Premium LanguageTool API** (Optional)
For higher limits and additional features:

1. **Get API key**: Visit [LanguageTool Premium](https://languagetool.org/premium)
2. **Add to environment**: Create `.env` file:
```bash
VITE_LANGUAGETOOL_API_KEY=your-premium-api-key-here
```
3. **Update service**: The app will automatically use premium features when key is detected

### **Self-Hosted LanguageTool** (Advanced)
For complete privacy and control:
1. Install LanguageTool server locally
2. Update API URL in `src/services/languageToolService.js`:
```javascript
const LANGUAGETOOL_API_URL = 'http://localhost:8081/v2/check';
```

## 📊 Usage Limits & Performance

### **Free API Limits**
- **20 requests per minute per IP**
- **Maximum 40,000 characters per request**
- **All languages supported**
- **Perfect for individual use**

### **Performance Tips**
- **Automatic debouncing** prevents API spam
- **Efficient caching** reduces redundant requests
- **Smart error handling** with graceful fallbacks
- **Offline mode** shows basic statistics when API unavailable

## 🎓 Educational Benefits

### **Perfect for ESL Students**
- **Clear explanations** for each error
- **Multiple learning languages** supported
- **Progressive difficulty** understanding
- **Confidence building** through positive feedback

### **Writing Improvement Features**
- **Error pattern recognition**
- **Writing score tracking** over time
- **Category-specific feedback**
- **Encouraging messages** for good writing

## 🔍 Troubleshooting

### **"Grammar checking unavailable"**
- **Check internet connection**
- **Try manual check** button
- **Verify LanguageTool API status** at languagetool.org
- **Browser console** may show specific error details

### **No suggestions appearing**
- **Ensure text is at least 3 characters**
- **Check that grammar checking is enabled** (not disabled)
- **Try switching languages** if text is not in English
- **Manual check** button forces immediate analysis

### **Slow response times**
- **Free API may have delays** during peak usage
- **Reduce check frequency** by increasing debounce delay
- **Consider premium API** for faster response
- **Check network connection** speed

### **Highlighting not working**
- **Clear browser cache** and refresh
- **Check CSS styles** are loading properly
- **Ensure JavaScript is enabled**
- **Try different browser** if issues persist

## 🌟 Comparison: LanguageTool vs OpenAI

| Feature | LanguageTool | OpenAI |
|---------|--------------|--------|
| **Cost** | Free (with limits) | Paid API required |
| **Languages** | 10+ supported | English-focused |
| **Speed** | Very fast | Slower (AI processing) |
| **Accuracy** | Grammar-focused | Context-aware |
| **Offline** | Server required | API required |
| **ESL Features** | Excellent | Good with prompting |
| **Privacy** | Data processed by LanguageTool | Data sent to OpenAI |

## 🚀 Next Steps

1. **Test the integration** with various text samples
2. **Experiment with different languages**
3. **Customize highlighting colors** to your preference
4. **Monitor usage** and consider premium if needed
5. **Gather user feedback** on correction quality
6. **Add additional features** like:
   - Writing goal tracking
   - Error pattern analysis
   - Custom dictionaries
   - Collaborative editing

## 📈 Future Enhancements

Potential improvements you can add:
- **Plagiarism detection** integration
- **Style guide enforcement** (APA, MLA, etc.)
- **Vocabulary building** exercises
- **Writing analytics dashboard**
- **Team collaboration** features
- **Progress tracking** over time

---

Your WordWise app now provides **professional-grade grammar checking** completely free! 🎉

The LanguageTool integration offers:
- ✅ **Zero setup** - works immediately
- ✅ **Multi-language** support
- ✅ **Real-time feedback** with highlighting
- ✅ **Educational explanations**
- ✅ **Professional accuracy**

Perfect for ESL students, educators, and anyone wanting to improve their writing! 