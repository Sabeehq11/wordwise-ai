# WordWise AI - ESL Writing Assistant

A comprehensive writing assistant designed specifically for ESL (English as a Second Language) students, featuring real-time grammar checking, writing suggestions, and document management.

## 🌟 Features

### ✍️ Smart Grammar Checking
- **LanguageTool Integration**: Professional grammar and spelling detection
- **Real-time Analysis**: Instant feedback as you type
- **Multi-language Support**: English (US/UK), Spanish, French, German, Portuguese, Italian, Dutch, Polish, Russian
- **ESL-focused**: Specialized detection for common ESL mistakes

### 📝 Intelligent Writing Assistant
- **Grammar Corrections**: Comprehensive grammar and spelling suggestions
- **Multiple Options**: Up to 4 correction alternatives per issue
- **Detailed Explanations**: Clear explanations for each suggestion
- **Writing Statistics**: Track words, sentences, and improvement scores

### 💾 Text Persistence
- **Auto-save**: Text automatically saved to prevent loss
- **Local Storage**: Demo version saves text locally
- **Cloud Storage**: Authenticated users get Firebase cloud storage
- **Crash Recovery**: Text persists through page reloads

### 🎯 User Experience
- **Simple Interface**: Clean, distraction-free writing environment
- **One-click Corrections**: Easy application of suggestions
- **Mobile Responsive**: Works on all devices
- **Fast Performance**: Optimized for smooth writing experience

## 🚀 Quick Start

### Demo Version (No Sign-up Required)
1. Visit the homepage
2. Start typing in the editor
3. Get instant grammar suggestions
4. Apply corrections with one click
5. Text is automatically saved locally

### Full Version (With Account)
1. Sign up for a free account
2. Create and manage multiple documents
3. Access cloud storage and sync
4. Get advanced writing analytics

## 🛠️ Technical Implementation

### Grammar Engine
- **LanguageTool API**: Free, no API key required
- **Smart Categorization**: Issues sorted by type (spelling, grammar, vocabulary, etc.)
- **Confidence Scoring**: Reliability indicators for suggestions
- **Contextual Analysis**: Understanding of sentence context

### Text Processing
- **Simple Corrections**: Reliable string replacement system
- **Case-insensitive Matching**: Handles various text formats
- **Preserve Formatting**: Maintains original text structure
- **Error Handling**: Graceful failures with user feedback

### Data Persistence
- **localStorage**: Browser-based storage for demo users
- **Firebase**: Cloud storage for authenticated users
- **Auto-save**: 3-second debounce for optimal performance
- **Conflict Resolution**: Handles concurrent edits

## 🎨 User Interface

### Editor Features
- **Dual-panel Layout**: Editor on left, suggestions on right
- **Writing Statistics**: Real-time word count, character count, issues found
- **Status Indicators**: Service connectivity and grammar checking status
- **Language Selector**: Switch between supported languages
- **Clear Text**: One-click text clearing with confirmation

### Suggestion Panel
- **Categorized Issues**: Organized by error type with color coding
- **Multiple Corrections**: Primary suggestion plus alternatives  
- **Detailed Explanations**: Educational descriptions for each issue
- **Apply Buttons**: One-click correction application
- **Statistics Dashboard**: Writing quality scores and metrics

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account (for authentication and cloud functions)
- Git

### 🚀 Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/wordwise-ai.git
cd wordwise-ai
```

#### 2. Install Dependencies
```bash
# Install main project dependencies
npm install

# Install Firebase Functions dependencies
cd functions
npm install
cd ..
```

#### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Firebase configuration
# You'll need to add your Firebase config details
```

#### 4. Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Set up Firestore Database
4. Enable Functions (if using cloud functions)
5. Add your Firebase config to `.env` file

#### 5. Run the Development Server
```bash
# Start the React development server
npm run dev
```

Your app will be available at `http://localhost:5173`

#### 6. Firebase Functions Emulation (Optional)
To test Firebase Functions locally:

```bash
# Install Firebase CLI globally (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Start Firebase emulators
firebase emulators:start --only functions

# Or use the npm script in functions directory
cd functions
npm run serve
```

Functions will be available at `http://localhost:5001`

### 🔧 Development Workflow
1. **Frontend Development**: Use `npm run dev` for hot-reload React development
2. **Functions Development**: Use `firebase emulators:start` for local function testing
3. **Full Stack**: Run both commands in separate terminals for complete local development

## 📖 Usage Guide

### Writing with Grammar Assistance
1. **Start Writing**: Begin typing in the main editor
2. **Review Suggestions**: Check the right panel for grammar issues
3. **Apply Corrections**: Click "Apply" buttons to fix issues
4. **Track Progress**: Monitor your writing statistics

### Managing Documents (Authenticated Users)
1. **Create Document**: Click "New Document" in dashboard
2. **Auto-save**: Changes saved automatically every 3 seconds
3. **Manual Save**: Use the save button for immediate saving
4. **Document List**: Access all documents from dashboard

### Language Support
- Switch languages using the dropdown in suggestions panel
- Supports 10+ languages with native LanguageTool rules
- Automatic language detection for mixed content

## 🎯 Target Audience

### ESL Students
- **Beginner to Advanced**: Suitable for all skill levels
- **Common Mistakes**: Focuses on typical ESL challenges
- **Learning Tool**: Educational explanations for improvement

### Writers & Professionals
- **Clean Interface**: Distraction-free writing environment
- **Professional Quality**: LanguageTool professional engine
- **Multi-language**: Support for international users

### Educators
- **Teaching Tool**: Help students improve writing
- **Progress Tracking**: Monitor improvement over time
- **Classroom Ready**: Simple, reliable interface

## 🔒 Privacy & Security

- **Local Storage**: Demo version keeps data on your device
- **Firebase Security**: Enterprise-grade cloud storage
- **No Tracking**: No analytics or user behavior tracking
- **GDPR Compliant**: Respect for user privacy

## 🌐 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Responsive**: iOS and Android support
- **Progressive Web App**: Can be installed on devices
- **Offline Capable**: Basic functionality without internet

## 📱 Mobile Experience

- **Touch Optimized**: Designed for mobile writing
- **Responsive Layout**: Adapts to screen size
- **Keyboard Friendly**: Works with virtual keyboards
- **Gesture Support**: Natural mobile interactions

## 🎓 Educational Focus

### Grammar Categories
- **Spelling**: Typos and misspellings
- **Grammar**: Subject-verb agreement, tenses
- **Vocabulary**: Word choice and usage
- **Style**: Writing clarity and flow
- **Punctuation**: Comma usage, periods
- **Capitalization**: Proper noun capitalization

### Learning Features
- **Explanations**: Why corrections are suggested
- **Multiple Options**: Learn different ways to express ideas
- **Progress Tracking**: See improvement over time
- **Encouragement**: Positive feedback for good writing

## 🚀 Performance

- **Fast Loading**: Optimized bundle size
- **Smooth Typing**: No lag during writing
- **Efficient API**: Debounced grammar checking
- **Memory Management**: Prevents browser slowdown

## 🔧 Troubleshooting

### Common Issues
- **Text Disappearing**: Check localStorage is enabled
- **No Suggestions**: Verify internet connection
- **Slow Performance**: Clear browser cache
- **Login Issues**: Check Firebase configuration

### Support
- Check documentation files in project
- Review console for error messages
- Ensure latest browser version
- Verify network connectivity

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines and submit pull requests for any improvements.

## 📄 License

MIT License

Copyright (c) 2025 Sabeeh Qureshi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**WordWise AI** - Making English writing accessible for everyone! 🌍✍️
