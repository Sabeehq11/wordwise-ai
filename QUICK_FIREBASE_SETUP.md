# 🚀 Quick Firebase Setup (5 minutes)

## ⚡ The Issue
You're seeing: `Firebase: Error (auth/api-key-not-valid)` because Firebase isn't configured yet.

## 🔧 Quick Fix (Choose ONE option)

### OPTION 1: Environment Variables (Recommended)

1. **Create `.env` file** in your project root (same folder as `package.json`):
   ```bash
   # Create the file
   touch .env
   ```

2. **Get Firebase config** (takes 2 minutes):
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project" → Name it "wordwise-ai" → Continue
   - Skip Google Analytics → Create project
   - In the dashboard, click the **Web icon** (`</>`)
   - App nickname: "wordwise-web" → Register app
   - **Copy the config values** from the code shown

3. **Add to `.env` file** (replace with your actual values):
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyD...
   VITE_FIREBASE_AUTH_DOMAIN=wordwise-ai-xxxxx.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=wordwise-ai-xxxxx
   VITE_FIREBASE_STORAGE_BUCKET=wordwise-ai-xxxxx.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   ```

4. **Enable Authentication**:
   - In Firebase Console → **Authentication** → **Get started**
   - **Sign-in method** tab → **Email/Password** → Enable → Save

5. **Enable Firestore**:
   - **Firestore Database** → **Create database**
   - **Start in test mode** → Next → Select location → Done

6. **Restart your app**:
   ```bash
   npm run dev
   ```

### OPTION 2: Direct Code Edit

1. **Get Firebase config** (same as step 2 above)

2. **Edit `src/firebase/config.js`** - Replace the placeholder values:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyD...", // Your actual API key
     authDomain: "wordwise-ai-xxxxx.firebaseapp.com",
     projectId: "wordwise-ai-xxxxx",
     storageBucket: "wordwise-ai-xxxxx.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```

3. **Enable Auth & Firestore** (same as steps 4-5 above)

## ✅ Test It Works

1. Visit your app: http://localhost:5176/
2. Click "Sign Up" and create a test account
3. You should be redirected to the dashboard
4. Try creating a document

## 🎯 What You'll Have After Setup

- ✅ **User registration/login** working
- ✅ **Document saving** to cloud database
- ✅ **Auto-save** while typing
- ✅ **User dashboard** with document management
- ✅ **Sample grammar suggestions** (Add OpenAI key for AI-powered suggestions)

## ❓ Still Having Issues?

### Common Problems:

**"Project ID is invalid"**
- Make sure you're using the exact Project ID from Firebase (not the display name)

**"API key invalid"**
- Copy the API key exactly, no extra spaces
- Make sure you created a **Web app** in Firebase (not Android/iOS)

**"Permission denied"**
- Check that Firestore is in **test mode** or rules allow read/write

### Get Help:
Check the browser console (F12) for specific error messages, they usually tell you exactly what's wrong!

---

**Once Firebase is working**, your app will be fully functional! The homepage OpenAI notice has been fixed too. 🎉 