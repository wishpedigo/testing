# Database Seeding Scripts

This directory contains scripts to populate your Firebase database with test data.

## 🚀 Quick Start

### Prerequisites
1. Make sure your `.env` file is configured with Firebase credentials
2. Ensure Firebase Authentication and Firestore are enabled in your Firebase console

### Running the Scripts

```bash
# From the project root
npm run seed:users    # Creates 5 basic test users
npm run seed:all      # Creates 8 users with comprehensive test data
```

## 📊 What Gets Created

### Basic Users Script (`seed-users.js`)
- **5 test users** with realistic profiles
- **Sample game scores** for each user
- **User profiles** with avatars and bios

### Comprehensive Script (`seed-all.js`)
- **8 test users** including an admin user
- **Realistic game scores** with progression over time
- **Leaderboard entries** ranked by performance
- **Game statistics** and analytics data
- **Multiple game modes** (classic, speed, endurance, precision)

## 🔑 Test User Credentials

All test users use the password: `password123`

### Basic Users:
- `alice@example.com` - Expert level player
- `bob@example.com` - Intermediate casual gamer
- `charlie@example.com` - Master level speed runner
- `diana@example.com` - Advanced strategic player
- `eve@example.com` - Beginner eager to learn

### Comprehensive Users (includes above plus):
- `admin@example.com` - System administrator
- `frank@example.com` - Weekend warrior
- `grace@example.com` - Mobile gaming expert

## 📁 Database Structure

The scripts create the following Firestore collections:

### `users` collection
```javascript
{
  firstName: "Alice",
  lastName: "Johnson", 
  email: "alice@example.com",
  displayName: "Alice Johnson",
  avatar: "https://...",
  bio: "Game enthusiast...",
  joinDate: "2024-01-15",
  level: "Expert",
  totalGames: 45,
  bestScore: 1250,
  createdAt: "2024-...",
  updatedAt: "2024-..."
}
```

### `scores` collection
```javascript
{
  userId: "user_uid",
  score: 1250,
  timestamp: "2024-...",
  level: "Expert",
  gameMode: "classic",
  duration: 180,
  accuracy: 95,
  powerUps: 2,
  difficulty: "medium"
}
```

### `leaderboard` collection
```javascript
{
  userId: "user_uid",
  displayName: "Alice Johnson",
  score: 1250,
  level: "Expert", 
  rank: 1,
  avatar: "https://...",
  lastPlayed: "2024-..."
}
```

### `stats` collection
```javascript
{
  totalUsers: 8,
  totalGames: 300,
  averageScore: 1200,
  topScore: 2500,
  lastUpdated: "2024-..."
}
```

## 🛠️ Customization

You can modify the scripts to:
- Add more test users
- Change user profiles and avatars
- Adjust score ranges and game modes
- Add different user roles and permissions
- Create custom game statistics

## 🔄 Re-running Scripts

The scripts are idempotent - they won't create duplicate users if they already exist. You can safely run them multiple times.

## 🚨 Troubleshooting

### "Email already in use" errors
This is normal - the script skips users that already exist.

### Firebase connection errors
- Check your `.env` file has correct Firebase credentials
- Ensure Firebase project has Authentication and Firestore enabled
- Verify your Firebase project ID matches the one in your config

### Permission errors
- Make sure your Firestore security rules allow writes
- Check that your Firebase service account has proper permissions
