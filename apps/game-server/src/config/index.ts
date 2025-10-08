import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: process.env.PORT || 3001,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/paradise-valley',
  nodeEnv: process.env.NODE_ENV || 'development',
  simulation: {
    tickRate: 30, // ticks per second
    gridWidth: 50,
    gridHeight: 50
  }
}
