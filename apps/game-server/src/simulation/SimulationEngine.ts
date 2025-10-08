import { GameState } from './GameState'
import { config } from '../config'

export class SimulationEngine {
  state: GameState
  tickRate: number
  lastTick: number = 0
  
  constructor(townId: string) {
    this.state = new GameState(townId, config.simulation.gridWidth, config.simulation.gridHeight)
    this.tickRate = config.simulation.tickRate
  }
  
  update(deltaTime: number): void {
    this.state.update(deltaTime)
  }
  
  getStateSnapshot() {
    return this.state.toSnapshot()
  }
  
  getTickRate(): number {
    return this.tickRate
  }
}
