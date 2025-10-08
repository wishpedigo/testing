import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { connectDatabase } from './database/connection'
import { SimulationEngine } from './simulation/SimulationEngine'
import { GameSocket } from './websocket/gameSocket'
import adminRouter from './routes/admin'
import { config } from './config'

const app = express()
app.use(cors())
app.use(express.json())

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*' }
})

let simulation: SimulationEngine
let gameSocket: GameSocket

async function startServer() {
  try {
    // Connect to database
    await connectDatabase()
    
    // Initialize simulation engine
    simulation = new SimulationEngine()
    
    // Try to initialize with active world, or create a default one
    try {
      await simulation.initializeWithActiveWorld()
      console.log('🏘️ Paradise Valley simulation initialized with active world')
    } catch (error) {
      console.log('⚠️ No active world found, simulation will start when a world is created')
    }
    
    gameSocket = new GameSocket(io, simulation)
    
    // Add admin routes
    app.use('/api/admin', adminRouter)
    
    console.log('🏘️ Paradise Valley simulation engine ready')
    
    // Simulation loop - 30 ticks per second
    const tickInterval = 1000 / simulation.getTickRate()
    setInterval(() => {
      simulation.update(1 / simulation.getTickRate())
      gameSocket.broadcastStateUpdate()
    }, tickInterval)
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        simulation: 'running',
        citizens: simulation.getStateSnapshot().citizens.length,
        buildings: simulation.getStateSnapshot().buildings.length
      })
    })
    
    // Start server
    httpServer.listen(config.port, () => {
      console.log(`🚀 Game server running on port ${config.port}`)
      console.log(`🌐 WebSocket endpoint: ws://localhost:${config.port}`)
      console.log(`📊 Health check: http://localhost:${config.port}/health`)
    })
    
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down game server...')
  httpServer.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})

startServer()
