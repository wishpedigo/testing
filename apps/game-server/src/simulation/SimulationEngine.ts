import { GameState } from './GameState'
import { WorldGenerator } from '../generation/WorldGenerator'
import { config } from '../config'

export class SimulationEngine {
  state: GameState | null = null
  worldGenerator: WorldGenerator
  tickRate: number
  lastTick: number = 0
  isInitialized: boolean = false
  
  constructor() {
    this.worldGenerator = new WorldGenerator()
    this.tickRate = config.simulation.tickRate
  }

  async initializeWithWorld(worldId: string): Promise<void> {
    this.state = new GameState(worldId)
    await this.state.loadWorldFromDB()
    this.isInitialized = true
    console.log(`🎮 Simulation engine initialized with world ${worldId}`)
  }

  async initializeWithActiveWorld(): Promise<void> {
    const activeWorld = await this.worldGenerator.getActiveWorld()
    if (!activeWorld) {
      throw new Error('No active world found. Please create and activate a world first.')
    }
    await this.initializeWithWorld(activeWorld._id.toString())
  }
  
  update(deltaTime: number): void {
    if (!this.state || !this.isInitialized) return
    this.state.update(deltaTime)
  }
  
  getStateSnapshot() {
    if (!this.state || !this.isInitialized) {
      return {
        time: { time: new Date().toISOString(), timeString: 'Not initialized', dateString: 'Not initialized', hour: 0, isDay: false },
        weather: { weather: 'unknown', temperature: 0 },
        grid: { width: 0, height: 0 },
        citizens: [],
        buildings: [],
        items: []
      }
    }
    return this.state.toSnapshot()
  }
  
  getTickRate(): number {
    return this.tickRate
  }

  getWorldGenerator(): WorldGenerator {
    return this.worldGenerator
  }
}
