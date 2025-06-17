# 🔥 Firestore Database Setup Guide

Your WordWise app is ready to save documents, but you need to **enable Firestore Database** first.

## Step 1: Enable Firestore Database

1. **Visit your Firebase Console**: https://console.firebase.google.com/project/wordwiseai-15b77/firestore/databases

2. **Click "Create database"**

3. **Select "Start in test mode"** ✅
   - This allows read/write access for testing
   - We'll secure it later with proper rules

4. **Choose your region**
   - Select the region closest to your users
   - US (us-central1) is usually a good default

5. **Click "Done"**

## Step 2: Verify Setup

1. **Refresh your WordWise app** (localhost:5176)
2. **Try creating a new document**
3. **Check that it saves properly**

## Step 3: Security Rules (Optional - for production)

For production, replace the test rules with secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own documents
    match /documents/{docId} {
      allow read, write: if request.auth != null && 
                       request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                   request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Document Structure

Your documents will be stored with this structure:

```javascript
{
  id: "auto-generated-id",
  userId: "user-auth-id",
  title: "Document Title",
  content: "Document content...",
  wordCount: 150,
  charCount: 750,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Troubleshooting

### ❌ "Permission denied" errors
- Make sure Firestore is in **test mode**
- Check that you're logged in to the app

### ❌ "Collection doesn't exist" errors  
- Create your first document - collections are created automatically

### ❌ "Failed to load documents"
- Check browser console for detailed error messages
- Refresh the page and try again

## Cost Information

- **Free tier**: 1GB storage, 50K reads/day, 20K writes/day
- **Perfect for personal use and testing**
- You'll get warnings before hitting limits

---

## ✅ You're Done!

Once Firestore is enabled, your WordWise app will:
- ✅ Save documents automatically as you type
- ✅ Load your documents on the dashboard  
- ✅ Sync across devices when you login
- ✅ Work offline and sync when reconnected

**Need help?** Check the Firebase Console for your project status. 