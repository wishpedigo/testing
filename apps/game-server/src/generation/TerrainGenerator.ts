import { createNoise2D } from 'simplex-noise'

export interface TerrainGenerationParams {
  gridWidth: number
  gridHeight: number
  terrainDensity: {
    water: number
    road: number
    grass: number
  }
  seed: number
}

export class TerrainGenerator {
  private noise2D: (x: number, y: number) => number

  constructor(seed: number) {
    this.noise2D = createNoise2D(() => seed)
  }

  generate(params: TerrainGenerationParams): string[][] {
    const { gridWidth, gridHeight, terrainDensity } = params
    const terrain: string[][] = []

    // Initialize terrain with grass
    for (let y = 0; y < gridHeight; y++) {
      terrain[y] = []
      for (let x = 0; x < gridWidth; x++) {
        terrain[y][x] = 'grass'
      }
    }

    // Generate water bodies using noise
    this.generateWaterBodies(terrain, params)
    
    // Generate road network
    this.generateRoadNetwork(terrain, params)
    
    // Ensure grass fills remaining space
    this.ensureGrassCoverage(terrain, params)

    return terrain
  }

  private generateWaterBodies(terrain: string[][], params: TerrainGenerationParams): void {
    const { gridWidth, gridHeight, terrainDensity } = params
    const waterThreshold = 1 - terrainDensity.water

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        // Use multiple octaves of noise for more interesting water shapes
        const noise1 = this.noise2D(x * 0.1, y * 0.1)
        const noise2 = this.noise2D(x * 0.05, y * 0.05) * 0.5
        const combinedNoise = noise1 + noise2

        if (combinedNoise > waterThreshold) {
          terrain[y][x] = 'water'
        }
      }
    }

    // Clean up isolated water tiles
    this.cleanupIsolatedTiles(terrain, 'water', 2)
  }

  private generateRoadNetwork(terrain: string[][], params: TerrainGenerationParams): void {
    const { gridWidth, gridHeight, terrainDensity } = params
    const roadThreshold = 1 - terrainDensity.road

    // Generate main roads (horizontal and vertical)
    this.generateMainRoads(terrain, params)
    
    // Generate secondary roads using noise
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        if (terrain[y][x] === 'water') continue // Don't place roads on water

        const noise = this.noise2D(x * 0.2, y * 0.2)
        if (noise > roadThreshold && Math.random() < 0.3) {
          terrain[y][x] = 'road'
        }
      }
    }

    // Connect isolated road segments
    this.connectRoadSegments(terrain, params)
  }

  private generateMainRoads(terrain: string[][], params: TerrainGenerationParams): void {
    const { gridWidth, gridHeight } = params

    // Horizontal main roads
    const horizontalRoads = Math.floor(gridHeight / 8)
    for (let i = 1; i < horizontalRoads; i++) {
      const y = Math.floor((gridHeight / horizontalRoads) * i)
      for (let x = 0; x < gridWidth; x++) {
        if (terrain[y][x] !== 'water') {
          terrain[y][x] = 'road'
        }
      }
    }

    // Vertical main roads
    const verticalRoads = Math.floor(gridWidth / 8)
    for (let i = 1; i < verticalRoads; i++) {
      const x = Math.floor((gridWidth / verticalRoads) * i)
      for (let y = 0; y < gridHeight; y++) {
        if (terrain[y][x] !== 'water') {
          terrain[y][x] = 'road'
        }
      }
    }
  }

  private connectRoadSegments(terrain: string[][], params: TerrainGenerationParams): void {
    const { gridWidth, gridHeight } = params

    // Find road segments and connect them
    for (let y = 1; y < gridHeight - 1; y++) {
      for (let x = 1; x < gridWidth - 1; x++) {
        if (terrain[y][x] === 'road') {
          // Check if this road tile is isolated
          const neighbors = [
            terrain[y-1][x], terrain[y+1][x],
            terrain[y][x-1], terrain[y][x+1]
          ]
          
          const roadNeighbors = neighbors.filter(t => t === 'road').length
          
          if (roadNeighbors === 0) {
            // Connect to nearest road
            this.connectToNearestRoad(terrain, x, y, params)
          }
        }
      }
    }
  }

  private connectToNearestRoad(terrain: string[][], startX: number, startY: number, params: TerrainGenerationParams): void {
    const { gridWidth, gridHeight } = params
    const maxDistance = 5

    for (let distance = 1; distance <= maxDistance; distance++) {
      for (let dy = -distance; dy <= distance; dy++) {
        for (let dx = -distance; dx <= distance; dx++) {
          if (Math.abs(dx) !== distance && Math.abs(dy) !== distance) continue

          const x = startX + dx
          const y = startY + dy

          if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) continue

          if (terrain[y][x] === 'road') {
            // Create a path between start and target
            this.createPath(terrain, startX, startY, x, y)
            return
          }
        }
      }
    }
  }

  private createPath(terrain: string[][], x1: number, y1: number, x2: number, y2: number): void {
    let x = x1
    let y = y1

    while (x !== x2 || y !== y2) {
      if (terrain[y][x] !== 'water') {
        terrain[y][x] = 'road'
      }

      if (x < x2) x++
      else if (x > x2) x--
      else if (y < y2) y++
      else if (y > y2) y--
    }
  }

  private cleanupIsolatedTiles(terrain: string[][], tileType: string, minNeighbors: number): void {
    const gridHeight = terrain.length
    const gridWidth = terrain[0].length

    for (let y = 1; y < gridHeight - 1; y++) {
      for (let x = 1; x < gridWidth - 1; x++) {
        if (terrain[y][x] === tileType) {
          const neighbors = [
            terrain[y-1][x], terrain[y+1][x],
            terrain[y][x-1], terrain[y][x+1],
            terrain[y-1][x-1], terrain[y-1][x+1],
            terrain[y+1][x-1], terrain[y+1][x+1]
          ]
          
          const sameTypeNeighbors = neighbors.filter(t => t === tileType).length
          
          if (sameTypeNeighbors < minNeighbors) {
            terrain[y][x] = 'grass'
          }
        }
      }
    }
  }

  private ensureGrassCoverage(terrain: string[][], params: TerrainGenerationParams): void {
    const { gridWidth, gridHeight, terrainDensity } = params
    const targetGrassRatio = terrainDensity.grass

    // Count current terrain types
    let grassCount = 0
    let totalCount = 0

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        if (terrain[y][x] === 'grass') grassCount++
        totalCount++
      }
    }

    const currentGrassRatio = grassCount / totalCount

    // If we need more grass, convert some roads to grass
    if (currentGrassRatio < targetGrassRatio) {
      const neededGrass = Math.floor((targetGrassRatio - currentGrassRatio) * totalCount)
      let converted = 0

      for (let y = 0; y < gridHeight && converted < neededGrass; y++) {
        for (let x = 0; x < gridWidth && converted < neededGrass; x++) {
          if (terrain[y][x] === 'road' && Math.random() < 0.3) {
            terrain[y][x] = 'grass'
            converted++
          }
        }
      }
    }
  }
}
