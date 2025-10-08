import { GridManager } from './systems/GridManager'
import { TimeSystem } from './systems/TimeSystem'
import { WeatherSystem } from './systems/WeatherSystem'
import { Citizen } from './entities/Citizen'
import { Building } from './entities/Building'
import { GameStateSnapshot } from '../types'
import { World, IWorld } from '../database/models/World'
import { Building as BuildingModel } from '../database/models/Building'
import { Citizen as CitizenModel } from '../database/models/Citizen'
import { v4 as uuidv4 } from 'uuid'

export class GameState {
  worldId: string
  world: IWorld | null = null
  grid: GridManager
  time: TimeSystem
  weather: WeatherSystem
  citizens: Map<string, Citizen> = new Map()
  buildings: Map<string, Building> = new Map()
  
  constructor(worldId: string) {
    this.worldId = worldId
    this.grid = new GridManager(50, 50) // Default size, will be updated when world loads
    this.time = new TimeSystem()
    this.weather = new WeatherSystem()
  }

  async loadWorldFromDB(): Promise<void> {
    try {
      // Load world data
      this.world = await World.findById(this.worldId)
      if (!this.world) {
        throw new Error(`World with ID ${this.worldId} not found`)
      }

      // Update grid size
      this.grid = new GridManager(this.world.gridWidth, this.world.gridHeight)
      
      // Load terrain map
      this.loadTerrainMap()
      
      // Load buildings
      await this.loadBuildings()
      
      // Load citizens
      await this.loadCitizens()
      
      console.log(`✅ Loaded world "${this.world.name}" with ${this.buildings.size} buildings and ${this.citizens.size} citizens`)
    } catch (error) {
      console.error('❌ Failed to load world from database:', error)
      throw error
    }
  }
  
  private loadTerrainMap(): void {
    if (!this.world?.terrainMap) return

    // Clear existing grid
    this.grid.tiles.clear()
    
    // Load terrain from world data
    for (let y = 0; y < this.world.gridHeight; y++) {
      for (let x = 0; x < this.world.gridWidth; x++) {
        const terrainType = this.world.terrainMap[y][x] || 'grass'
        const key = this.grid.getKey(x, y)
        this.grid.tiles.set(key, new (this.grid.constructor as any).Tile(x, y, terrainType))
      }
    }
  }

  private async loadBuildings(): Promise<void> {
    const buildingDocs = await BuildingModel.find({ townId: this.worldId })
    
    this.buildings.clear()
    
    for (const doc of buildingDocs) {
      const building = new Building(
        doc._id.toString(),
        doc.type,
        doc.name,
        doc.position,
        doc.size
      )
      
      building.capacity = doc.capacity
      building.currentOccupants = doc.currentOccupants
      
      this.buildings.set(building.id, building)
      
      // Mark tiles as occupied by building
      this.grid.setBuilding(building.id, building.position.x, building.position.y, building.size.width, building.size.height)
    }
  }

  private async loadCitizens(): Promise<void> {
    const citizenDocs = await CitizenModel.find({ townId: this.worldId })
    
    this.citizens.clear()
    
    for (const doc of citizenDocs) {
      const citizen = new Citizen(
        doc._id.toString(),
        doc.name,
        doc.age,
        doc.position
      )
      
      citizen.facing = doc.facing
      citizen.personality = doc.personality
      citizen.needs = doc.needs
      citizen.mood = doc.mood
      citizen.currentActivity = doc.currentActivity
      citizen.path = doc.path
      
      this.citizens.set(citizen.id, citizen)
      
      // Add citizen to grid
      this.grid.addEntity(citizen.id, citizen.position.x, citizen.position.y)
    }
  }
  
  // Public methods for creating new entities (used by admin)
  createBuilding(type: string, name: string, position: { x: number; y: number }, size: { width: number; height: number }): Building {
    const id = uuidv4()
    const building = new Building(id, type, name, position, size)
    this.buildings.set(id, building)
    
    // Mark tiles as occupied by building
    this.grid.setBuilding(id, position.x, position.y, size.width, size.height)
    
    return building
  }
  
  createCitizen(name: string, age: number, position: { x: number; y: number }): Citizen {
    const id = uuidv4()
    const citizen = new Citizen(id, name, age, position)
    this.citizens.set(id, citizen)
    
    // Add citizen to grid
    this.grid.addEntity(id, position.x, position.y)
    
    return citizen
  }
  
  findRandomWalkablePosition(): { x: number; y: number } {
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
