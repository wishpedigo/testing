# Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         VENUE APP MONOREPO                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                           FRONTEND APPS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  Marketing App   │  │   Login App      │  │   Game App   │ │
│  │  Port: 5173      │  │   Port: 5174     │  │  Port: 5175  │ │
│  │                  │  │                  │  │              │ │
│  │  • Landing Page  │  │  • Sign Up       │  │  • Game UI   │ │
│  │  • Features      │  │  • Sign In       │  │  • Scores    │ │
│  │  • About         │  │  • Reset Pass    │  │  • Leaders   │ │
│  │  • Navigation    │  │  • Dashboard     │  │  • Auth Gate │ │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘ │
│           │                     │                    │         │
│           └─────────────────────┼────────────────────┘         │
│                                 │                              │
└─────────────────────────────────┼──────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SHARED PACKAGES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────┐  ┌──────────────────────────┐   │
│  │    @venue/shared          │  │   @venue/firebase        │   │
│  │                           │  │                          │   │
│  │  • UI Components          │  │  • Auth Functions        │   │
│  │    - Button               │  │    - signUp()            │   │
│  │    - Card                 │  │    - signIn()            │   │
│  │                           │  │    - logOut()            │   │
│  │  • Theme                  │  │                          │   │
│  │                           │  │  • Firestore Functions   │   │
│  │  • Utilities              │  │    - createDocument()    │   │
│  │    - formatDate()         │  │    - getDocument()       │   │
│  │    - truncateText()       │  │    - queryDocuments()    │   │
│  │                           │  │                          │   │
│  │  • TypeScript Types       │  │  • Game Functions        │   │
│  │    - User                 │  │    - saveGameScore()     │   │
│  │    - GameScore            │  │    - getUserScores()     │   │
│  │    - VenueInfo            │  │    - getTopScores()      │   │
│  └─────────────┬─────────────┘  └────────────┬─────────────┘   │
│                │                             │                 │
└────────────────┼─────────────────────────────┼─────────────────┘
                 │                             │
                 └──────────────┬──────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         FIREBASE (BaaS)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐          ┌──────────────────────┐    │
│  │   Authentication     │          │   Cloud Firestore    │    │
│  │                      │          │                      │    │
│  │  • Email/Password    │          │  • scores/           │    │
│  │  • User Sessions     │          │    - userId          │    │
│  │  • Password Reset    │          │    - score           │    │
│  │  • User Management   │          │    - timestamp       │    │
│  └──────────────────────┘          │    - level (opt)     │    │
│                                    └──────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER JOURNEY                           │
└─────────────────────────────────────────────────────────────────┘

    START
      │
      ▼
┌──────────────┐
│   Visit      │  localhost:5173
│  Marketing   │  
│   Website    │  • See features
└──────┬───────┘  • Read about venue
       │          • Browse content
       │
       │ Click "Login" or "Get Started"
       │
       ▼
┌──────────────┐
│   Login/     │  localhost:5174
│   Sign Up    │
│    Page      │  New User? → Sign Up Form
└──────┬───────┘  Existing? → Login Form
       │          Forgot? → Reset Password
       │
       │ Authenticate with Firebase
       │
       ▼
┌──────────────┐
│  Dashboard   │  localhost:5174/dashboard
│              │
│  • Profile   │  • See user info
│  • Stats     │  • View achievements
│  • Actions   │  • Access features
└──────┬───────┘
       │
       │ Click "Launch Game"
       │
       ▼
┌──────────────┐
│   Game App   │  localhost:5175
│              │
│  Check Auth  │  Not logged in? → Show login prompt
└──────┬───────┘  Logged in? → Show game
       │
       │ User authenticated
       │
       ▼
┌──────────────┐
│  Play Game   │  • 10-second timer
│              │  • Click counter
│  Click! →    │  • Real-time score
└──────┬───────┘
       │
       │ Game ends
       │
       ▼
┌──────────────┐
│ Save Score   │  → Firebase Firestore
│              │    (scores collection)
│ Show Results │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Leaderboards │  • Your best scores
│              │  • Global top scores
│  Play Again? │  • Ranking
└──────────────┘
```

## Component Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                      DEPENDENCY GRAPH                           │
└─────────────────────────────────────────────────────────────────┘

apps/marketing/
  ├── Dependencies:
  │   ├── @venue/shared (UI components, theme)
  │   ├── react-router-dom (navigation)
  │   └── Tailwind (styling)
  │
  └── External Links:
      └── localhost:5174 (Login app)


apps/login/
  ├── Dependencies:
  │   ├── @venue/shared (UI components, types)
  │   ├── @venue/firebase (auth functions)
  │   ├── react-router-dom (routing)
  │   └── Tailwind (styling)
  │
  └── External Links:
      └── localhost:5175 (Game app)


apps/game/
  ├── Dependencies:
  │   ├── @venue/shared (UI components, types)
  │   ├── @venue/firebase (auth + firestore)
  │   └── Tailwind (styling)
  │
  └── External Links:
      └── localhost:5174 (Login prompt)
```

## Data Models

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA STRUCTURES                         │
└─────────────────────────────────────────────────────────────────┘

User (TypeScript Interface)
├── uid: string
├── email: string | null
├── displayName: string | null
└── photoURL: string | null


GameScore (Firestore Document)
├── id: auto-generated
├── userId: string (references User.uid)
├── score: number
├── timestamp: Date
└── level?: number (optional)


VenueInfo (TypeScript Interface)
├── name: string
├── description: string
├── location: string
└── contact: string
```

## Build & Deploy Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT PIPELINE                        │
└─────────────────────────────────────────────────────────────────┘

Local Development
      │
      ▼
┌──────────────┐
│  Git Commit  │
└──────┬───────┘
       │
       │ git push
       │
       ▼
┌──────────────┐
│   GitHub     │
└──────┬───────┘
       │
       │ Webhook trigger
       │
       ▼
┌──────────────┐
│   Vercel     │
│              │
│  1. Clone    │
│  2. Install  │
│  3. Build    │
│     • npm install
│     • npm run build:all
│  4. Deploy   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│         Production URLs              │
│                                      │
│  • yourdomain.com/         → Marketing
│  • yourdomain.com/login    → Login
│  • yourdomain.com/game     → Game
└──────────────────────────────────────┘
```

## Tech Stack Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                         TECH STACK                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER                                              │
│ • React 18                                                      │
│ • TypeScript                                                    │
│  Components                                 │
│ • Tailwind CSS Utilities                                       │
└─────────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────────┐
│ ROUTING & STATE                                                 │
│ • React Router v6                                              │
│ • React Hooks (useState, useEffect)                            │
│ • Firebase Auth State Observer                                 │
└─────────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────────┐
│ BUSINESS LOGIC LAYER                                           │
│ • @venue/shared (utilities, types)                             │
│ • @venue/firebase (auth, database functions)                   │
│ • Game logic (separated for mobile port)                       │
└─────────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────────┐
│ DATA LAYER                                                      │
│ • Firebase Authentication                                       │
│ • Cloud Firestore                                              │
│ • Real-time listeners                                          │
└─────────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────────┐
│ BUILD & DEPLOY                                                  │
│ • Vite (bundler)                                               │
│ • npm workspaces (monorepo)                                    │
│ • Vercel (hosting)                                             │
│ • TypeScript (type checking)                                   │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure Tree

```
testing/
│
├── apps/
│   ├── marketing/              # Marketing website
│   │   ├── src/
│   │   │   ├── components/     # Navigation
│   │   │   ├── pages/          # Home, About
│   │   │   ├── App.tsx         # Router setup
│   │   │   └── main.tsx        # Entry point
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── login/                  # Authentication app
│   │   ├── src/
│   │   │   ├── components/     # ProtectedRoute
│   │   │   ├── pages/          # Login, Signup, Dashboard, etc.
│   │   │   ├── App.tsx         # Auth router
│   │   │   └── main.tsx        # Entry point
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── game/                   # Game application
│       ├── src/
│       │   ├── components/     # Game, GameScreen, Navbar, etc.
│       │   ├── App.tsx         # Game app
│       │   └── main.tsx        # Entry point
│       ├── package.json
│       └── vite.config.ts
│
├── packages/
│   ├── shared/                 # Shared UI & utilities
│   │   ├── src/
│   │   │   ├── components/     # Button, Card
│   │   │   ├── types/          # TypeScript interfaces
│   │   │   ├── utils/          # Helper functions
│   │   │   ├── theme.ts        # CSS-based theme
│   │   │   └── index.ts        # Exports
│   │   └── package.json
│   │
│   └── firebase/               # Firebase integration
│       ├── src/
│       │   ├── auth.ts         # Auth functions
│       │   ├── config.ts       # Firebase setup
│       │   ├── firestore.ts    # Database functions
│       │   └── index.ts        # Exports
│       └── package.json
│
├── package.json                # Root workspace config
├── tsconfig.json              # TypeScript config
├── tailwind.config.js         # Tailwind config
├── vercel.json                # Deployment config
├── .env.example               # Environment template
├── README.md                  # Main documentation
├── QUICKSTART.md              # Quick start guide
├── SETUP.md                   # Detailed setup
├── PROJECT_OVERVIEW.md        # Project details
└── ARCHITECTURE.md            # This file
```

---

This architecture supports:
- ✅ Scalability (easy to add new apps/packages)
- ✅ Maintainability (shared code, clear structure)
- ✅ Developer Experience (fast builds, hot reload)
- ✅ Type Safety (TypeScript throughout)
- ✅ Future Mobile App (separated business logic)
- ✅ Production Ready (optimized builds, deployment config)

