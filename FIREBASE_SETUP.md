# 🔥 Firebase Setup Guide for WordWise

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: **`wordwise-ai`**
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Click on **Email/Password**
3. Enable **Email/Password**
4. Save

## Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (we'll update security rules later)
4. Select your preferred location
5. Click "Done"

## Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click **Web** icon (`</>`)
4. Register app name: **`wordwise-web`**
5. Copy the Firebase configuration object

## Step 5: Update Your App Configuration

Replace the content in `src/firebase/config.js` with your actual config:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration (REPLACE WITH YOUR ACTUAL CONFIG)
const firebaseConfig = {
  apiKey: "AIzaSyD...", // Your actual API key
  authDomain: "wordwise-ai-xxxxx.firebaseapp.com",
  projectId: "wordwise-ai-xxxxx",
  storageBucket: "wordwise-ai-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
```

## Step 6: Configure Firestore Security Rules

1. Go to **Firestore Database** > **Rules**
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own documents
    match /documents/{document} {
      allow read, write, update, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click "Publish"

## Step 7: Test Your App

1. Visit **http://localhost:5175**
2. Click "Sign Up" and create a test account
3. Login and test document creation
4. Verify documents save automatically

## 🔧 Troubleshooting

### If you get authentication errors:
- Double-check your Firebase config values
- Ensure Email/Password auth is enabled
- Check browser console for specific error messages

### If documents don't save:
- Verify Firestore rules are published
- Check if the database was created properly
- Look for console errors related to permissions

### If the app won't load:
- Make sure all Firebase config values are correct
- Check that your Firebase project is active
- Verify the API key and project ID match your project

## 🎯 Next Steps

Once Firebase is working:
- Test user registration and login
- Create and edit documents
- Verify auto-save functionality
- Ready for grammar checking integration! 