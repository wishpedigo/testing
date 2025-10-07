// Shared types across all apps

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface GameScore {
  userId: string;
  score: number;
  timestamp: Date;
  level?: number;
}

export interface VenueInfo {
  name: string;
  description: string;
  location: string;
  contact: string;
}

