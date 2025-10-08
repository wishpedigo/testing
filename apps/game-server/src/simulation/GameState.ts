import { GridManager } from './systems/GridManager'
import { TimeSystem } from './systems/TimeSystem'
import { WeatherSystem } from './systems/WeatherSystem'
import { Citizen } from './entities/Citizen'
import { Building } from './entities/Building'
import { GameStateSnapshot } from '../types'
import { v4 as uuidv4 } from 'uuid'

export class GameState {
  townId: string
  grid: GridManager
  time: TimeSystem
  weather: WeatherSystem
  citizens: Map<string, Citizen> = new Map()
  buildings: Map<string, Building> = new Map()
  
  constructor(townId: string, gridWidth: number, gridHeight: number) {
    this.townId = townId
    this.grid = new GridManager(gridWidth, gridHeight)
    this.time = new TimeSystem()
    this.weather = new WeatherSystem()
    
    this.initializeTown()
  }
  
  private initializeTown(): void {
    // Create some initial buildings
    this.createBuilding('house', 'Cozy House', { x: 10, y: 10 }, { width: 2, height: 2 })
    this.createBuilding('house', 'Artisan Home', { x: 15, y: 10 }, { width: 2, height: 2 })
    this.createBuilding('shop', 'Local Co-op', { x: 20, y: 10 }, { width: 3, height: 2 })
    this.createBuilding('shop', 'Bookstore & Cafe', { x: 25, y: 10 }, { width: 3, height: 2 })
    this.createBuilding('community', 'Progressive School', { x: 30, y: 10 }, { width: 4, height: 3 })
    
    // Create some initial citizens
    const names = ['Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Avery', 'Quinn', 'Taylor', 'Blake']
    for (let i = 0; i < 10; i++) {
      const name = names[i] || `Citizen${i + 1}`
      const age = 20 + Math.floor(Math.random() * 50)
      const position = this.findRandomWalkablePosition()
      this.createCitizen(name, age, position)
    }
  }
  
  private createBuilding(type: any, name: string, position: any, size: any): void {
    const id = uuidv4()
    const building = new Building(id, type, name, position, size)
    this.buildings.set(id, building)
    
    // Mark tiles as occupied by building
    this.grid.setBuilding(id, position.x, position.y, size.width, size.height)
  }
  
  private createCitizen(name: string, age: number, position: any): void {
    const id = uuidv4()
    const citizen = new Citizen(id, name, age, position)
    this.citizens.set(id, citizen)
    
    // Add citizen to grid
    this.grid.addEntity(id, position.x, position.y)
  }
  
  private findRandomWalkablePosition(): any {
    let attempts = 0
    while (attempts < 100) {
      const x = Math.floor(Math.random() * this.grid.width)
      const y = Math.floor(Math.random() * this.grid.height)
      
      if (this.grid.isWalkable(x, y)) {
        return { x, y }
      }
      attempts++
    }
    
    // Fallback to a known walkable position
    return { x: 5, y: 5 }
  }
  
  update(deltaTime: number): void {
    this.time.update(deltaTime)
    this.weather.update(this.time)
    
    // Update all citizens
    this.citizens.forEach(citizen => {
      citizen.update(deltaTime, this.grid)
    })
  }
  
  toSnapshot(): GameStateSnapshot {
    return {
      time: this.time.toJSON(),
      weather: this.weather.toJSON(),
      grid: {
        width: this.grid.width,
        height: this.grid.height
      },
      citizens: Array.from(this.citizens.values()).map(c => c.toJSON()),
      buildings: Array.from(this.buildings.values()).map(b => b.toJSON()),
      items: [] // No items in MVP 1
    }
  }
}
