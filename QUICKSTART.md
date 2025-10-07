# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Firebase (One-time setup)

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com
   - Click "Add project"
   - Follow the setup wizard

2. **Enable Services**
   - **Authentication**: Go to Authentication > Sign-in method > Enable "Email/Password"
   - **Firestore**: Go to Firestore Database > Create database > Start in test mode

3. **Get Configuration**
   - Go to Project Settings (gear icon) > General
   - Scroll to "Your apps" > Click web icon (</>)
   - Copy the config values

4. **Create .env File**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and paste your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

### Step 3: Start the Apps

Open **3 separate terminals** and run:

**Terminal 1 - Marketing Site:**
```bash
npm run dev:marketing
```
Visit: http://localhost:5173

**Terminal 2 - Login App:**
```bash
npm run dev:login
```
Visit: http://localhost:5174

**Terminal 3 - Game App:**
```bash
npm run dev:game
```
Visit: http://localhost:5175

### Step 4: Test the Flow

1. Open http://localhost:5173 (Marketing site)
2. Click "Login" or "Get Started"
3. Create a new account on the sign-up page
4. After login, click "Launch Game"
5. Play the game and watch your scores get saved!

## 📁 What You Got

- ✅ **Marketing App** - Beautiful landing page with MUI + Tailwind
- ✅ **Login App** - Full authentication (signup, login, password reset)
- ✅ **Game App** - Click & score game with leaderboards
- ✅ **Shared Components** - Reusable UI components across all apps
- ✅ **Firebase Integration** - Auth + Database ready to go
- ✅ **TypeScript** - Full type safety
- ✅ **Monorepo** - Clean architecture with npm workspaces
- ✅ **Vercel Ready** - Deploy configuration included

## 🎮 How the Game Works

- 10-second clicking challenge
- Scores automatically saved to Firebase
- View your best scores
- Compete on the global leaderboard
- Must be logged in to play

## 🔧 Common Commands

```bash
# Start all apps (need 3 terminals)
npm run dev:marketing
npm run dev:login
npm run dev:game

# Build for production
npm run build:all

# Lint code
npm run lint

# Format code
npm run format
```

## 🚢 Deploy to Vercel

1. Push to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables (Firebase config)
5. Deploy! 🎉

## 💡 Tips

- The apps link to each other (marketing → login → game)
- All apps share the same Firebase project
- Scores persist across sessions
- Game logic is separated for future React Native mobile app

## 🆘 Need Help?

Check `SETUP.md` for detailed instructions and troubleshooting.

---

**You're all set! Happy coding! 🎉**

