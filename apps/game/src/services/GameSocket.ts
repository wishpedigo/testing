import { io, Socket } from 'socket.io-client'

export interface GameStateSnapshot {
  time: any
  weather: any
  grid: {
    width: number
    height: number
  }
  citizens: any[]
  buildings: any[]
  items: any[]
}

export class GameSocket {
  private socket: Socket
  private connected: boolean = false

  constructor() {
    this.socket = io('http://localhost:3001', {
      transports: ['websocket']
    })
    
    this.socket.on('connect', () => {
      console.log('🎮 Connected to game server')
      this.connected = true
    })
    
    this.socket.on('disconnect', () => {
      console.log('📤 Disconnected from game server')
      this.connected = false
    })
    
    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error)
    })
  }

  onStateUpdate(callback: (state: GameStateSnapshot) => void): void {
    this.socket.on('stateUpdate', callback)
  }

  connect(): void {
    if (!this.connected) {
      this.socket.connect()
    }
  }

  disconnect(): void {
    this.socket.disconnect()
  }

  isConnected(): boolean {
    return this.connected
  }
}
