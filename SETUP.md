# Setup Instructions

## Initial Setup

Your venue app monorepo has been successfully created! Follow these steps to get started:

### 1. Install Dependencies

Make sure you have Node.js 18+ installed. Then run:

```bash
npm install
```

This will install all dependencies for the monorepo and all workspace packages.

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use an existing one
3. Enable **Authentication** with Email/Password sign-in method
4. Enable **Cloud Firestore** database
5. Get your Firebase configuration from Project Settings > General

### 3. Set Up Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Start Development Servers

Run each app in a separate terminal:

```bash
# Terminal 1 - Marketing site
npm run dev:marketing
# Opens on http://localhost:5173

# Terminal 2 - Dashboard app
npm run dev:dash
# Opens on http://dash.localhost:5173

```

## Project Structure

```
testing/
├── apps/
│   ├── marketing/     # Marketing website - Port 5173
│   └── dash/          # Dashboard & Authentication app - dash.localhost:5173
├── packages/
│   ├── shared/        # Shared UI components (Custom + Tailwind)
│   └── firebase/      # Firebase utilities
└── vercel.json        # Deployment config
```

## Key Features Implemented

### Marketing App (Port 5173)
- Landing page with hero section
- Features showcase
- About page
- Navigation with links to login app
- Responsive design with custom components + Tailwind

### Dashboard App (dash.localhost:5173)
- User registration (sign up)
- User login (sign in)
- Password reset functionality
- Protected routes
- User dashboard with profile info

### Shared Packages
- **@venue/shared**: Reusable UI components, theme, utilities, types
- **@venue/firebase**: Firebase auth, Firestore operations

## User Flow

1. User visits marketing site (localhost:5173)
2. Clicks "Login" → Goes to dashboard app (dash.localhost:5173)
3. Signs up or logs in
4. Accesses dashboard with profile info

## Next Steps

### Firebase Setup
Make sure to configure Firebase Security Rules for Firestore based on your data model.

### Production Deployment

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Future Enhancements

- Mobile app (React Native)
- User achievements system
- Social features

## Troubleshooting

### Port Already in Use
If a port is already in use, you can change it in each app's `vite.config.ts`:
```typescript
server: {
  port: 5176, // Change to your preferred port
}
```

### Firebase Connection Issues
- Verify `.env` file exists and has correct values
- Check Firebase project settings
- Ensure Authentication and Firestore are enabled

### Module Resolution Issues
If you see import errors, try:
```bash
npm install
npm run build:all
```

## Scripts Reference

```bash
# Development
npm run dev:marketing    # Start marketing app
npm run dev:dash         # Start dashboard app

# Building
npm run build:marketing  # Build marketing app
npm run build:dash       # Build dashboard app
npm run build:all        # Build all apps

# Code Quality
npm run lint            # Run ESLint
npm run format          # Run Prettier
```

Enjoy building your venue app! 🎮🚀

