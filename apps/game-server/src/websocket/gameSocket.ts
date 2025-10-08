import { Server as SocketIOServer } from 'socket.io'
import { SimulationEngine } from '../simulation/SimulationEngine'

export class GameSocket {
  private io: SocketIOServer
  private simulation: SimulationEngine
  
  constructor(io: SocketIOServer, simulation: SimulationEngine) {
    this.io = io
    this.simulation = simulation
    this.setupSocketHandlers()
  }
  
  private setupSocketHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(`🎮 Client connected: ${socket.id}`)
      
      // Send initial state to new client
      socket.emit('stateUpdate', this.simulation.getStateSnapshot())
      
      socket.on('disconnect', () => {
        console.log(`📤 Client disconnected: ${socket.id}`)
      })
    })
  }
  
  broadcastStateUpdate(): void {
    const snapshot = this.simulation.getStateSnapshot()
    this.io.emit('stateUpdate', snapshot)
  }
}
