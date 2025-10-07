# Firebase Setup Guide

Complete guide to setting up Firebase for your venue app.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name (e.g., "venue-app")
4. Click **Continue**
5. Choose whether to enable Google Analytics (optional, recommended)
6. Click **Create project**
7. Wait for setup to complete, then click **Continue**

## Step 2: Register Your Web App

1. From the Firebase Console home, click the **Web icon** (`</>`)
2. Enter app nickname (e.g., "Venue Web App")
3. Check **"Also set up Firebase Hosting"** (optional)
4. Click **Register app**
5. **Copy the configuration object** - you'll need these values!

Example config:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "venue-app-xxxxx.firebaseapp.com",
  projectId: "venue-app-xxxxx",
  storageBucket: "venue-app-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

## Step 3: Enable Authentication

1. In the left sidebar, click **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Click **Email/Password**
5. Toggle **Enable** to ON
6. Click **Save**

### Optional: Configure Email Templates

1. Go to **Authentication > Templates**
2. Customize email templates for:
   - Password reset
   - Email address verification
   - Email address change

## Step 4: Set Up Cloud Firestore

1. In the left sidebar, click **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
   - Note: You'll need to update rules for production!
4. Choose a location (select closest to your users)
5. Click **Enable**

### Configure Security Rules (Important!)

1. Go to **Firestore Database > Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Scores collection
    match /scores/{scoreId} {
      // Anyone can read all scores (for leaderboard)
      allow read: if true;
      
      // Only authenticated users can create scores
      // And only with their own userId
      allow create: if request.auth != null 
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.keys().hasAll(['userId', 'score', 'timestamp']);
      
      // Users cannot update or delete scores
      allow update, delete: if false;
    }
    
    // Add more collections as needed
    // Example: user profiles
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

### Test Mode Warning

⚠️ **Important**: Test mode allows all reads/writes for 30 days!
- Perfect for development
- **MUST** update rules before production
- Set a calendar reminder!

## Step 5: Configure Your App

1. In your project root, copy the environment template:
```bash
cp .env.example .env
```

2. Edit `.env` file:
```env
# Replace these with your Firebase config values
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=venue-app-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=venue-app-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=venue-app-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

3. Save the file

⚠️ **Important**: Never commit `.env` to git! It's in `.gitignore`.

## Step 6: Test Your Setup

1. Start the login app:
```bash
npm run dev:login
```

2. Go to http://localhost:5174
3. Try signing up with a test email
4. Check Firebase Console > Authentication to see the new user
5. Try playing the game and check Firestore for score documents

## Production Security Rules

When you're ready for production, update Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Scores collection - production rules
    match /scores/{scoreId} {
      // Anyone can read scores
      allow read: if true;
      
      // Only authenticated users can create
      allow create: if isSignedIn()
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.score is number
                    && request.resource.data.score >= 0
                    && request.resource.data.score <= 1000  // Reasonable max
                    && request.resource.data.timestamp is timestamp;
      
      // No updates or deletes
      allow update, delete: if false;
    }
    
    // User profiles (if you add them)
    match /users/{userId} {
      allow read: if true;
      allow create: if isSignedIn() && isOwner(userId);
      allow update: if isSignedIn() && isOwner(userId);
      allow delete: if isSignedIn() && isOwner(userId);
    }
  }
}
```

## Firebase Pricing

### Free Tier (Spark Plan)
- **Authentication**: 10K verifications/month
- **Firestore**: 
  - 50K reads/day
  - 20K writes/day
  - 20K deletes/day
  - 1 GB storage
- **Perfect for**: Development and small apps

### Paid Tier (Blaze Plan)
- Pay as you go
- Free tier included
- Only pay for usage above free tier
- Add billing account in Firebase Console

**Typical small app costs**: $0-5/month

## Firestore Indexes

For complex queries, you may need to create indexes:

1. Firebase will show you the link in console errors
2. Or manually create in **Firestore Database > Indexes** tab

For this app, basic indexes are auto-created.

## Common Issues

### Issue: "Permission denied" errors
**Solution**: Check Firestore security rules

### Issue: "Firebase: Error (auth/invalid-api-key)"
**Solution**: Verify `.env` file has correct values

### Issue: Can't see users in Firebase Console
**Solution**: 
1. Check Authentication is enabled
2. Verify Email/Password provider is enabled

### Issue: Scores not saving
**Solution**:
1. Check Firestore is enabled
2. Check security rules allow writes
3. Verify user is authenticated

## Next Steps

1. ✅ Set up Firebase project
2. ✅ Enable Authentication
3. ✅ Enable Firestore
4. ✅ Configure security rules
5. ✅ Add credentials to `.env`
6. ✅ Test signup/login
7. ✅ Test game scores
8. 🔜 Deploy to production
9. 🔜 Update security rules for production
10. 🔜 Set up monitoring and alerts

## Useful Links

- [Firebase Console](https://console.firebase.google.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Pricing](https://firebase.google.com/pricing)

## Monitoring & Analytics

### Enable Performance Monitoring
1. Go to Firebase Console > Performance
2. Click **Get started**
3. Follow the instructions

### Enable Crashlytics (for mobile later)
Will be useful when you add React Native app

### Check Usage
- Firebase Console > Usage and billing
- Set up budget alerts
- Monitor daily usage

---

**You're all set!** 🎉 Your Firebase backend is ready to use.

