# Venue App - Project Overview

## 🎯 What This Is

A complete, production-ready monorepo for a venue application with:
- Marketing website
- User authentication system
- Interactive game platform
- Shared component library
- Firebase backend integration
- Ready for Vercel deployment

## 📊 Architecture

### Monorepo Structure
```
testing/
├── apps/                       # Separate Vite apps
│   ├── marketing/             # Public-facing website
│   ├── login/                 # Authentication portal
│   └── game/                  # Game application
│
├── packages/                   # Shared code
│   ├── shared/                # UI components, utilities, types
│   └── firebase/              # Backend integration
│
└── Config files               # Shared tooling
```

### Technology Decisions

**Why Monorepo?**
- Share code between apps (components, utilities, types)
- Single source of truth for dependencies
- Easier to maintain and scale
- Better for future mobile app (React Native can share business logic)

**Why Vite?**
- Lightning-fast development server
- Optimal production builds
- Better DX than Create React App
- Native ESM support

**Why Custom Components + Tailwind?**
- Custom Components: Lightweight, no external dependencies
- Tailwind: Utility-first for consistent styling
- Full control over design system
- Configured to work together harmoniously

**Why Firebase?**
- No backend code needed
- Authentication built-in
- Real-time database
- Scales automatically
- Free tier is generous

**Why npm workspaces?**
- Simple, no extra tooling (vs Turborepo, Lerna)
- Native to npm (v7+)
- Perfect for this project size
- Easy to upgrade to Turborepo later if needed

## 🏗️ Apps Breakdown

### Marketing App (Port 5173)
**Purpose**: Public-facing website to attract users

**Features**:
- Hero section with CTA
- Features showcase
- About page
- Navigation
- Links to login app

**Key Files**:
- `src/pages/HomePage.tsx` - Main landing
- `src/pages/AboutPage.tsx` - About content
- `src/components/Navigation.tsx` - Header nav

### Login App (Port 5174)
**Purpose**: Handle all user authentication

**Features**:
- User registration with email/password
- Login functionality
- Password reset via email
- Protected routes
- User dashboard
- Session management

**Key Files**:
- `src/pages/LoginPage.tsx` - Sign in
- `src/pages/SignUpPage.tsx` - Registration
- `src/pages/ForgotPasswordPage.tsx` - Reset password
- `src/pages/DashboardPage.tsx` - User home
- `src/components/ProtectedRoute.tsx` - Route guard

### Game App (Port 5175)
**Purpose**: Interactive gaming experience

**Features**:
- Simple click & score game
- 10-second time limit
- Real-time score tracking
- Personal best scores
- Global leaderboard
- Firebase score persistence
- Requires authentication

**Key Files**:
- `src/components/Game.tsx` - Game logic
- `src/components/GameScreen.tsx` - Game UI + scores
- `src/components/LoginPrompt.tsx` - Auth gate
- `src/components/GameNavbar.tsx` - Game header

**Game Design**:
- Single-player (as requested)
- Business logic separated from UI
- Easy to port to React Native
- Extendable for more game types

## 📦 Shared Packages

### @venue/shared
**Purpose**: Reusable UI and utilities

**Exports**:
- `Button` - Custom button component
- `Card` - Custom card component
- `Typography` - Text component with variants
- `Container`, `Grid`, `Box` - Layout components
- `TextField`, `Alert` - Form components
- `AppBar`, `Toolbar` - Navigation components
- `theme` - CSS-based theme configuration
- `formatDate`, `truncateText`, `sleep` - Utilities
- `User`, `GameScore`, `VenueInfo` - TypeScript types

**Why?**
- DRY principle
- Consistent UI across apps
- Type safety
- Easy to extend

### @venue/firebase
**Purpose**: Backend integration layer

**Exports**:
- `auth`, `db`, `app` - Firebase instances
- `signUp`, `signIn`, `logOut` - Auth functions
- `resetPassword`, `observeAuthState` - Auth utilities
- `createDocument`, `getDocument`, etc. - Firestore CRUD
- `saveGameScore`, `getUserScores`, `getTopScores` - Game-specific

**Why?**
- Single Firebase configuration
- Consistent API across apps
- Type-safe database operations
- Easy to add new features

## 🔄 Data Flow

### User Journey
```
1. Marketing Site (5173)
   ↓ Click "Login"
2. Login App (5174)
   ↓ Sign up/in → Firebase Auth
3. Dashboard
   ↓ Click "Launch Game"
4. Game App (5175)
   ↓ Play game
5. Scores → Firebase Firestore
   ↓ Query scores
6. Leaderboards updated
```

### Authentication Flow
```
Login/Signup → Firebase Auth → Token Stored
                      ↓
          All apps observe auth state
                      ↓
       User state synced across apps
```

### Score Flow
```
Game ends → saveGameScore()
              ↓
         Firebase Firestore
              ↓
    getUserScores() + getTopScores()
              ↓
         Update UI
```

## 🎨 Design System

### Colors (Dark Theme)
- Primary: Blue (#90caf9)
- Secondary: Pink (#f48fb1)
- Background: Dark (#121212)
- Paper: Dark Gray (#1e1e1e)
- Text: White (#ffffff)
- Text Secondary: Gray (#b3b3b3)
- Can be customized in `packages/shared/src/theme.ts`

### Typography
- System fonts for performance
- Custom typography variants (h1-h6, body1, body2, caption)
- Responsive sizing

### Layout
- Container maxWidth: lg (1280px)
- Custom Grid system (12-column)
- Responsive breakpoints

## 🔐 Security Considerations

### Frontend
- Environment variables for Firebase config
- Protected routes requiring authentication
- Client-side validation

### Firebase Rules (TODO)
Add these to Firebase console:

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scores/{scoreId} {
      // Anyone can read scores
      allow read: if true;
      // Only authenticated users can create their own scores
      allow write: if request.auth != null 
                  && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## 🚀 Deployment Strategy

### Vercel (Recommended)
- Configured in `vercel.json`
- Automatic deployments from git
- Environment variables in dashboard
- CDN included

### Routing
- `/` → Marketing app
- `/login/*` → Login app
- `/game/*` → Game app

### Environment Variables
Must be set in Vercel:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## 🔮 Future Roadmap

### Phase 1 (Current) ✅
- Marketing site
- User authentication
- Single-player game
- Score tracking

### Phase 2 (Next)
- Mobile app (React Native)
  - Share `@venue/firebase` package
  - Share business logic
  - Native UI components
- More game types
- User profiles
- Achievements system

### Phase 3 (Future)
- Social features
- Real-time multiplayer
- Tournaments
- In-app purchases
- Push notifications

## 📝 Development Workflow

### Adding a New Feature

1. **Shared Component**
   ```bash
   # Add to packages/shared/src/components/
   # Export from packages/shared/src/index.ts
   ```

2. **Firebase Function**
   ```bash
   # Add to packages/firebase/src/
   # Export from packages/firebase/src/index.ts
   ```

3. **Use in App**
   ```typescript
   import { YourComponent } from '@venue/shared';
   import { yourFunction } from '@venue/firebase';
   ```

### Code Quality
- TypeScript for type safety
- ESLint for code standards
- Prettier for formatting
- Git hooks recommended (husky + lint-staged)

## 🐛 Common Issues & Solutions

### Import Errors
**Problem**: Can't resolve `@venue/shared`
**Solution**: Run `npm install` from root

### Port Conflicts
**Problem**: Port already in use
**Solution**: Change port in app's `vite.config.ts`

### Firebase Connection
**Problem**: Firebase errors
**Solution**: 
1. Check `.env` file exists
2. Verify Firebase config
3. Enable Auth + Firestore in console

### Build Errors
**Problem**: TypeScript errors
**Solution**: 
1. Check `tsconfig.json` references
2. Run `npm run build:all`
3. Check for missing types

## 📚 Learning Resources

- [Vite Docs](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS Components](https://tailwindcss.com/docs/components)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase Docs](https://firebase.google.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

### Code Style
- Use TypeScript
- Follow existing patterns
- Add types for everything
- Keep components small
- Separate business logic from UI

### Testing (TODO)
Recommended setup:
- Vitest for unit tests
- React Testing Library
- Cypress for E2E

## 📄 License

Private - All rights reserved

---

Built with ❤️ for your venue

