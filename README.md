# Venue App Monorepo

A modern React monorepo for a venue application with marketing page, user authentication, and game functionality.

## Project Structure

```
testing/
├── apps/
│   ├── marketing/     # Public marketing website (port 5173)
│   ├── login/         # User authentication app (port 5174)
│   └── game/          # Single-player game app (port 5175)
├── packages/
│   ├── shared/        # Shared UI components, utilities, types
│   └── firebase/      # Firebase configuration and utilities
└── vercel.json        # Vercel deployment configuration
```

## Technology Stack

- **Build Tool**: Vite
- **Framework**: React 18 + TypeScript
- **Styling**: MUI + Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **Routing**: React Router v6
- **Monorepo**: npm workspaces
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account and project

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy `.env.example` to `.env` in the root directory
   - Fill in your Firebase credentials in `.env`

4. Start development servers:

```bash
# Run all apps
npm run dev:marketing  # Marketing site on http://localhost:5173
npm run dev:login      # Login app on http://localhost:5174
npm run dev:game       # Game app on http://localhost:5175

# Or run them individually in separate terminals
```

## Development

### Running Individual Apps

```bash
npm run dev:marketing    # Marketing website
npm run dev:login        # Authentication app
npm run dev:game         # Game app
```

### Building for Production

```bash
npm run build:all        # Build all apps
npm run build:marketing  # Build marketing app only
npm run build:login      # Build login app only
npm run build:game       # Build game app only
```

### Code Quality

```bash
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
```

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. Deploy!

The apps will be available at:
- Marketing: `https://yourdomain.com`
- Login: `https://yourdomain.com/login`
- Game: `https://yourdomain.com/game`

## Shared Packages

### @venue/shared

Contains:
- UI components (Button, Card, etc.)
- MUI theme configuration
- Shared utilities and types
- Common constants

### @venue/firebase

Contains:
- Firebase configuration
- Authentication helpers (signUp, signIn, logOut, etc.)
- Firestore utilities (CRUD operations)
- Game score management

## Future Enhancements

- Mobile app using React Native (game logic is separated for easy porting)
- Real-time multiplayer features
- More game types
- User profiles and achievements
- Social features

## License

Private - All rights reserved

