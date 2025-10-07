#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { app, auth, db } from './firebase-config.js';

// Test users data
const testUsers = [
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
  }
];

// Sample game scores for each user
const generateScores = (userId, userLevel, bestScore) => {
  const scores = [];
  const baseScore = bestScore * 0.6; // Start at 60% of best score
  
  for (let i = 0; i < 10; i++) {
    const variation = Math.random() * 0.4; // ±20% variation
    const score = Math.floor(baseScore + (baseScore * variation));
    const timestamp = new Date(Date.now() - (i * 24 * 60 * 60 * 1000)); // Last 10 days
    
    scores.push({
      userId,
      score,
      timestamp,
      level: userLevel,
      gameMode: Math.random() > 0.5 ? 'classic' : 'speed',
      duration: Math.floor(Math.random() * 300) + 60 // 1-6 minutes
    });
  }
  
  return scores.sort((a, b) => b.score - a.score); // Sort by score descending
};

async function seedUsers() {
  console.log('🌱 Starting user seeding...');
  
  try {
    const createdUsers = [];
    
    for (const userData of testUsers) {
      try {
        console.log(`Creating user: ${userData.email}`);
        
        // Create user with email and password
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
        
        // Generate and add sample scores
        const scores = generateScores(user.uid, userData.profile.level, userData.profile.bestScore);
        
        for (const score of scores) {
          await addDoc(collection(db, 'scores'), score);
        }
        
        console.log(`✅ Added ${scores.length} scores for: ${userData.displayName}`);
        
        createdUsers.push({
          uid: user.uid,
          email: userData.email,
          displayName: userData.displayName
        });
        
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating user ${userData.email}:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 Seeding completed!');
    console.log(`Created ${createdUsers.length} users:`);
    createdUsers.forEach(user => {
      console.log(`  - ${user.displayName} (${user.email})`);
    });
    
    console.log('\n📊 Test users created:');
    console.log('Email: alice@example.com | Password: password123');
    console.log('Email: bob@example.com | Password: password123');
    console.log('Email: charlie@example.com | Password: password123');
    console.log('Email: diana@example.com | Password: password123');
    console.log('Email: eve@example.com | Password: password123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding
seedUsers().then(() => {
  console.log('\n✨ All done! You can now test login with any of the created users.');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
