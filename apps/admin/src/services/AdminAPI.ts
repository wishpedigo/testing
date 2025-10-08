import { io, Socket } from 'socket.io-client'

export interface GenerationParams {
  name: string
  gridWidth: number
  gridHeight: number
  seed?: number
  terrainDensity: {
    water: number
    road: number
    grass: number
  }
  buildingDensity: number
  buildingTypeRatios: {
    house: number
    shop: number
    community: number
  }
  citizenCount: number
  personalityDistribution: {
    openness: [number, number]
    conscientiousness: [number, number]
    extraversion: [number, number]
    agreeableness: [number, number]
    neuroticism: [number, number]
  }
}

export interface World {
  id: string
  name: string
  gridWidth: number
  gridHeight: number
  seed: number
  isActive: boolean
  createdAt: string
  citizenCount?: number
  buildingCount?: number
}

export interface Citizen {
  id: string
  name: string
  age: number
  position: { x: number; y: number }
  facing: string
  mood: string
  currentActivity: string
  needs: {
    hunger: number
    sleep: number
    social: number
    hygiene: number
    fun: number
  }
  personality: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
}

export interface Metrics {
  worlds: {
    total: number
    active: string | null
  }
  citizens: {
    total: number
  }
  buildings: {
    total: number
  }
  system: {
    uptime: number
    memory: any
    timestamp: string
  }
}

export class AdminAPI {
  private baseUrl: string
  private socket: Socket | null = null

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl
  }

  // World Generation
  async generateWorld(params: GenerationParams): Promise<{ success: boolean; worldId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/worlds/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to generate world:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async getWorlds(): Promise<{ success: boolean; worlds?: World[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/worlds`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to fetch worlds:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async activateWorld(worldId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/worlds/${worldId}/activate`, {
        method: 'PUT',
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to activate world:', error)
      return { success: false, error: 'Network error' }
    }
  }

  // Citizens
  async getCitizens(options: {
    worldId?: string
    sort?: any
    filter?: any
    page?: number
    limit?: number
  } = {}): Promise<{ success: boolean; citizens?: Citizen[]; pagination?: any; error?: string }> {
    try {
      const params = new URLSearchParams()
      if (options.worldId) params.append('worldId', options.worldId)
      if (options.sort) params.append('sort', JSON.stringify(options.sort))
      if (options.filter) params.append('filter', JSON.stringify(options.filter))
      if (options.page) params.append('page', options.page.toString())
      if (options.limit) params.append('limit', options.limit.toString())

      const response = await fetch(`${this.baseUrl}/api/admin/citizens?${params}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to fetch citizens:', error)
      return { success: false, error: 'Network error' }
    }
  }

  // Metrics
  async getMetrics(): Promise<{ success: boolean; metrics?: Metrics; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/metrics`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
      return { success: false, error: 'Network error' }
    }
  }

  // Data Export
  async exportData(worldId: string, format: 'json' | 'csv' = 'json'): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/data/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ worldId, format }),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to export data:', error)
      return { success: false, error: 'Network error' }
    }
  }

  // WebSocket connection for real-time updates
  connectWebSocket(): void {
    if (this.socket) {
      this.socket.disconnect()
    }

    this.socket = io(this.baseUrl, {
      transports: ['websocket']
    })

    this.socket.on('connect', () => {
      console.log('🔌 Admin: Connected to game server WebSocket')
    })

    this.socket.on('disconnect', () => {
      console.log('📤 Admin: Disconnected from game server WebSocket')
    })

    this.socket.on('connect_error', (error) => {
      console.error('❌ Admin: WebSocket connection error:', error)
    })
  }

  onStateUpdate(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('stateUpdate', callback)
    }
  }

  disconnectWebSocket(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`)
      return response.ok
    } catch (error) {
      return false
    }
  }
}
