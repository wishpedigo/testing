#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { app, auth, db } from './firebase-config.js';

// Extended test users with more variety
const testUsers = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    displayName: 'Admin User',
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'System administrator and game moderator',
      joinDate: new Date('2024-01-01'),
      level: 'Master',
      totalGames: 100,
      bestScore: 2500,
      role: 'admin'
    }
  },
  {
    email: 'alice@example.com',
    password: 'password123',
    displayName: 'Alice Johnson',
    profile: {
      firstName: 'Alice',
      lastName: 'Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Game enthusiast and competitive player',
      joinDate: new Date('2024-01-15'),
      level: 'Expert',
      totalGames: 45,
      bestScore: 1250
    }
  },
  {
    email: 'bob@example.com',
    password: 'password123',
    displayName: 'Bob Smith',
    profile: {
      firstName: 'Bob',
      lastName: 'Smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Casual gamer who loves challenges',
      joinDate: new Date('2024-02-03'),
      level: 'Intermediate',
      totalGames: 23,
      bestScore: 890
    }
  },
  {
    email: 'charlie@example.com',
    password: 'password123',
    displayName: 'Charlie Brown',
    profile: {
      firstName: 'Charlie',
      lastName: 'Brown',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Speed runner and high score hunter',
      joinDate: new Date('2024-01-28'),
      level: 'Master',
      totalGames: 67,
      bestScore: 2100
    }
  },
  {
    email: 'diana@example.com',
    password: 'password123',
    displayName: 'Diana Prince',
    profile: {
      firstName: 'Diana',
      lastName: 'Prince',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'Strategic player and team leader',
      joinDate: new Date('2024-03-10'),
      level: 'Advanced',
      totalGames: 34,
      bestScore: 1560
    }
  },
  {
    email: 'eve@example.com',
    password: 'password123',
    displayName: 'Eve Wilson',
    profile: {
      firstName: 'Eve',
      lastName: 'Wilson',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      bio: 'New to gaming but eager to learn',
      joinDate: new Date('2024-03-20'),
      level: 'Beginner',
      totalGames: 8,
      bestScore: 420
    }
  },
  {
    email: 'frank@example.com',
    password: 'password123',
    displayName: 'Frank Miller',
    profile: {
      firstName: 'Frank',
      lastName: 'Miller',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bio: 'Weekend warrior and achievement collector',
      joinDate: new Date('2024-02-15'),
      level: 'Intermediate',
      totalGames: 31,
      bestScore: 980
    }
  },
  {
    email: 'grace@example.com',
    password: 'password123',
    displayName: 'Grace Lee',
    profile: {
      firstName: 'Grace',
      lastName: 'Lee',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      bio: 'Mobile gaming expert and streamer',
      joinDate: new Date('2024-03-05'),
      level: 'Expert',
      totalGames: 52,
      bestScore: 1380
    }
  }
];

// Generate realistic game scores
const generateScores = (userId, userLevel, bestScore, totalGames) => {
  const scores = [];
  const baseScore = bestScore * 0.4; // Start at 40% of best score for progression
  
  for (let i = 0; i < Math.min(totalGames, 20); i++) {
    // Progressive improvement over time
    const progressFactor = 1 + (i / totalGames) * 0.6; // 60% improvement over time
    const variation = (Math.random() - 0.5) * 0.3; // ±15% random variation
    const score = Math.floor(baseScore * progressFactor * (1 + variation));
    
    // Generate timestamp (spread over last 30 days)
    const daysAgo = Math.floor(Math.random() * 30);
    const timestamp = new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000));
    
    // Different game modes
    const gameModes = ['classic', 'speed', 'endurance', 'precision'];
    const gameMode = gameModes[Math.floor(Math.random() * gameModes.length)];
    
    scores.push({
      userId,
      score: Math.max(score, 50), // Minimum score of 50
      timestamp,
      level: userLevel,
      gameMode,
      duration: Math.floor(Math.random() * 400) + 30, // 30 seconds to 7 minutes
      accuracy: Math.floor(Math.random() * 30) + 70, // 70-100% accuracy
      powerUps: Math.floor(Math.random() * 5), // 0-4 power-ups used
      difficulty: Math.random() > 0.7 ? 'hard' : Math.random() > 0.4 ? 'medium' : 'easy'
    });
  }
  
  return scores.sort((a, b) => b.score - a.score); // Sort by score descending
};

// Generate leaderboard entries
const generateLeaderboard = (users) => {
  const leaderboard = [];
  
  users.forEach((user, index) => {
    leaderboard.push({
      userId: user.uid,
      displayName: user.displayName,
      score: user.profile.bestScore,
      level: user.profile.level,
      rank: index + 1,
      avatar: user.profile.avatar,
      lastPlayed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Last week
    });
  });
  
  return leaderboard.sort((a, b) => b.score - a.score);
};

async function seedAll() {
  console.log('🌱 Starting comprehensive database seeding...');
  
  try {
    const createdUsers = [];
    
    // Create users
    for (const userData of testUsers) {
      try {
        console.log(`Creating user: ${userData.email}`);
        
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          userData.email, 
          userData.password
        );
        
        const user = userCredential.user;
        console.log(`✅ Created user: ${user.uid}`);
        
        // Create user profile document
        await setDoc(doc(db, 'users', user.uid), {
          ...userData.profile,
          email: userData.email,
          displayName: userData.displayName,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`✅ Created profile for: ${userData.displayName}`);
        
        createdUsers.push({
          uid: user.uid,
          email: userData.email,
          displayName: userData.displayName,
          profile: userData.profile
        });
        
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating user ${userData.email}:`, error.message);
        }
      }
    }
    
    // Generate and add scores for each user
    console.log('\n📊 Generating game scores...');
    for (const user of createdUsers) {
      const scores = generateScores(
        user.uid, 
        user.profile.level, 
        user.profile.bestScore, 
        user.profile.totalGames
      );
      
      for (const score of scores) {
        await addDoc(collection(db, 'scores'), score);
      }
      
      console.log(`✅ Added ${scores.length} scores for: ${user.displayName}`);
    }
    
    // Create leaderboard
    console.log('\n🏆 Creating leaderboard...');
    const leaderboard = generateLeaderboard(createdUsers);
    
    for (const entry of leaderboard) {
      await addDoc(collection(db, 'leaderboard'), {
        ...entry,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    console.log(`✅ Created leaderboard with ${leaderboard.length} entries`);
    
    // Create game statistics
    console.log('\n📈 Creating game statistics...');
    const gameStats = {
      totalUsers: createdUsers.length,
      totalGames: createdUsers.reduce((sum, user) => sum + user.profile.totalGames, 0),
      averageScore: Math.floor(createdUsers.reduce((sum, user) => sum + user.profile.bestScore, 0) / createdUsers.length),
      topScore: Math.max(...createdUsers.map(user => user.profile.bestScore)),
      lastUpdated: new Date()
    };
    
    await setDoc(doc(db, 'stats', 'game'), gameStats);
    console.log('✅ Created game statistics');
    
    console.log('\n🎉 Comprehensive seeding completed!');
    console.log(`\n📊 Summary:`);
    console.log(`  - Users created: ${createdUsers.length}`);
    console.log(`  - Total scores: ${createdUsers.reduce((sum, user) => sum + user.profile.totalGames, 0)}`);
    console.log(`  - Leaderboard entries: ${leaderboard.length}`);
    
    console.log('\n🔑 Test user credentials:');
    testUsers.forEach(user => {
      console.log(`  - ${user.email} | ${user.password} (${user.profile.level})`);
    });
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding
seedAll().then(() => {
  console.log('\n✨ All done! Your Firebase database is now populated with test data.');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
