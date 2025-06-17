import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// Option 1: Replace these placeholder values with your actual Firebase config
// Option 2: Set environment variables in .env file (see instructions below)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCQyut9ProDYvpFmYA_IReVtnzRYwb9Kos",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "wordwiseai-15b77.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "wordwiseai-15b77",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "wordwiseai-15b77.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "904608129405",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:904608129405:web:32499a26213c813240ec14"
};

// Check if Firebase is properly configured
const isFirebaseConfigured = !firebaseConfig.apiKey.includes('your-') && 
                             !firebaseConfig.projectId.includes('your-');

if (!isFirebaseConfigured) {
  console.error(`
🔥 FIREBASE CONFIGURATION REQUIRED 🔥

You need to configure Firebase before you can use authentication and database features.

Quick Setup Options:

OPTION 1 - Direct Configuration:
1. Go to https://console.firebase.google.com/
2. Create a project called "wordwise-ai"
3. Enable Authentication (Email/Password) and Firestore
4. Get your config from Project Settings > Your apps > Web app
5. Replace the placeholder values in src/firebase/config.js

OPTION 2 - Environment Variables:
1. Create a .env file in your project root
2. Add these lines with your actual Firebase values:

VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id

3. Restart your development server: npm run dev

For detailed instructions, see FIREBASE_SETUP.md
  `);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Export configuration status
export const isConfigured = isFirebaseConfigured;

export default app; 