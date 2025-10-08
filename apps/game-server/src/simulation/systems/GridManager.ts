import { Vector2, TerrainType } from '../../types'

export class Tile {
  x: number
  y: number
  terrain: string
  buildingId?: string
  entities: string[] = []
  
  constructor(x: number, y: number, terrain: string) {
    this.x = x
    this.y = y
    this.terrain = terrain
  }
  
  isWalkable(): boolean {
    return this.terrain !== 'water' && !this.buildingId
  }
}

export class GridManager {
  width: number
  height: number
  tiles: Map<string, Tile> = new Map()
  
  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.initializeTiles()
  }
  
  private initializeTiles(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const key = this.getKey(x, y)
        this.tiles.set(key, new Tile(x, y, 'grass'))
      }
    }
  }
  
  private getKey(x: number, y: number): string {
    return `${x},${y}`
  }
  
  getTile(x: number, y: number): Tile | undefined {
    return this.tiles.get(this.getKey(x, y))
  }
  
  isWalkable(x: number, y: number): boolean {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return false
    }
    const tile = this.getTile(x, y)
    return tile ? tile.isWalkable() : false
  }
  
  getEntitiesAt(x: number, y: number): string[] {
    const tile = this.getTile(x, y)
    return tile ? tile.entities : []
  }
  
  addEntity(entityId: string, x: number, y: number): boolean {
    if (!this.isWalkable(x, y)) return false
    
    const tile = this.getTile(x, y)
    if (tile && !tile.entities.includes(entityId)) {
      tile.entities.push(entityId)
      return true
    }
    return false
  }
  
  removeEntity(entityId: string, x: number, y: number): void {
    const tile = this.getTile(x, y)
    if (tile) {
      tile.entities = tile.entities.filter(id => id !== entityId)
    }
  }
  
  moveEntity(entityId: string, fromX: number, fromY: number, toX: number, toY: number): boolean {
    if (!this.isWalkable(toX, toY)) return false
    
    this.removeEntity(entityId, fromX, fromY)
    return this.addEntity(entityId, toX, toY)
  }
  
  setBuilding(buildingId: string, x: number, y: number, width: number, height: number): void {
    for (let dy = 0; dy < height; dy++) {
      for (let dx = 0; dx < width; dx++) {
        const tile = this.getTile(x + dx, y + dy)
        if (tile) {
          tile.buildingId = buildingId
        }
      }
    }
  }
}
