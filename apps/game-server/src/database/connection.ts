import mongoose from 'mongoose'
import { config } from '../config'

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(config.mongodbUri)
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect()
    console.log('📤 Disconnected from MongoDB')
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error)
  }
}
