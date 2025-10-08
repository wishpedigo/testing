import { Building } from '../simulation/entities/Building'
import { v4 as uuidv4 } from 'uuid'

export interface BuildingGenerationParams {
  terrainMap: string[][]
  buildingDensity: number
  buildingTypeRatios: {
    house: number
    shop: number
    community: number
  }
  seed: number
}

export class BuildingGenerator {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  placeBuildingsOnTerrain(params: BuildingGenerationParams): Building[] {
    const { terrainMap, buildingDensity, buildingTypeRatios } = params
    const buildings: Building[] = []
    
    const gridHeight = terrainMap.length
    const gridWidth = terrainMap[0].length
    
    // Calculate total number of buildings based on density
    const totalTiles = gridWidth * gridHeight
    const walkableTiles = this.countWalkableTiles(terrainMap)
    const totalBuildings = Math.floor(walkableTiles * buildingDensity)
    
    // Calculate building counts by type
    const houseCount = Math.floor(totalBuildings * buildingTypeRatios.house)
    const shopCount = Math.floor(totalBuildings * buildingTypeRatios.shop)
    const communityCount = Math.floor(totalBuildings * buildingTypeRatios.community)
    
    // Generate buildings by type
    buildings.push(...this.generateBuildingsByType(terrainMap, 'house', houseCount, this.getHouseNames()))
    buildings.push(...this.generateBuildingsByType(terrainMap, 'shop', shopCount, this.getShopNames()))
    buildings.push(...this.generateBuildingsByType(terrainMap, 'community', communityCount, this.getCommunityNames()))
    
    return buildings
  }

  private countWalkableTiles(terrainMap: string[][]): number {
    let count = 0
    for (let y = 0; y < terrainMap.length; y++) {
      for (let x = 0; x < terrainMap[y].length; x++) {
        if (terrainMap[y][x] !== 'water') {
          count++
        }
      }
    }
    return count
  }

  private generateBuildingsByType(
    terrainMap: string[][], 
    type: string, 
    count: number, 
    namePool: string[]
  ): Building[] {
    const buildings: Building[] = []
    const gridHeight = terrainMap.length
    const gridWidth = terrainMap[0].length
    const usedPositions = new Set<string>()
    
    let attempts = 0
    const maxAttempts = count * 10 // Prevent infinite loops
    
    while (buildings.length < count && attempts < maxAttempts) {
      attempts++
      
      // Find a random walkable position
      const position = this.findRandomWalkablePosition(terrainMap, usedPositions)
      if (!position) continue
      
      const { x, y } = position
      const size = this.getBuildingSize(type)
      
      // Check if the building fits
      if (this.canPlaceBuilding(terrainMap, x, y, size.width, size.height, usedPositions)) {
        // Mark positions as used
        for (let dy = 0; dy < size.height; dy++) {
          for (let dx = 0; dx < size.width; dx++) {
            usedPositions.add(`${x + dx},${y + dy}`)
          }
        }
        
        // Create building
        const name = this.selectRandomName(namePool, buildings.length)
        const building = new Building(
          uuidv4(),
          type,
          name,
          { x, y },
          size
        )
        
        buildings.push(building)
      }
    }
    
    return buildings
  }

  private findRandomWalkablePosition(
    terrainMap: string[][], 
    usedPositions: Set<string>
  ): { x: number; y: number } | null {
    const gridHeight = terrainMap.length
    const gridWidth = terrainMap[0].length
    
    for (let attempts = 0; attempts < 100; attempts++) {
      const x = Math.floor(Math.random() * gridWidth)
      const y = Math.floor(Math.random() * gridHeight)
      
      if (terrainMap[y][x] !== 'water' && !usedPositions.has(`${x},${y}`)) {
        return { x, y }
      }
    }
    
    return null
  }

  private canPlaceBuilding(
    terrainMap: string[][],
    x: number,
    y: number,
    width: number,
    height: number,
    usedPositions: Set<string>
  ): boolean {
    const gridHeight = terrainMap.length
    const gridWidth = terrainMap[0].length
    
    // Check bounds
    if (x + width > gridWidth || y + height > gridHeight) {
      return false
    }
    
    // Check if all tiles are walkable and not used
    for (let dy = 0; dy < height; dy++) {
      for (let dx = 0; dx < width; dx++) {
        const checkX = x + dx
        const checkY = y + dy
        
        if (terrainMap[checkY][checkX] === 'water' || usedPositions.has(`${checkX},${checkY}`)) {
          return false
        }
      }
    }
    
    return true
  }

  private getBuildingSize(type: string): { width: number; height: number } {
    switch (type) {
      case 'house':
        return { width: 2, height: 2 }
      case 'shop':
        return { width: 3, height: 2 }
      case 'community':
        return { width: 4, height: 3 }
      default:
        return { width: 2, height: 2 }
    }
  }

  private selectRandomName(namePool: string[], usedCount: number): string {
    if (usedCount < namePool.length) {
      return namePool[usedCount]
    }
    
    // If we've used all names, generate variations
    const baseName = namePool[Math.floor(Math.random() * namePool.length)]
    const variations = ['', ' II', ' III', ' East', ' West', ' North', ' South', ' Central']
    const variation = variations[usedCount % variations.length]
    
    return baseName + variation
  }

  private getHouseNames(): string[] {
    return [
      'Cozy Cottage',
      'Artisan Home',
      'Garden House',
      'Sunny Villa',
      'Peaceful Place',
      'Harmony House',
      'Green Haven',
      'Meadow View',
      'Riverside Home',
      'Mountain Retreat',
      'Valley House',
      'Forest Cottage',
      'Hilltop Home',
      'Lakeside Villa',
      'Prairie House'
    ]
  }

  private getShopNames(): string[] {
    return [
      'Local Co-op',
      'Bookstore & Cafe',
      'Farmers Market',
      'Art Gallery',
      'Community Store',
      'Green Grocer',
      'Craft Workshop',
      'Organic Market',
      'Vintage Shop',
      'Health Food Store',
      'Bike Shop',
      'Flower Shop',
      'Bakery',
      'Coffee House',
      'Thrift Store'
    ]
  }

  private getCommunityNames(): string[] {
    return [
      'Progressive School',
      'Community Center',
      'Public Library',
      'Health Clinic',
      'Town Hall',
      'Recreation Center',
      'Cultural Center',
      'Senior Center',
      'Youth Center',
      'Meditation Hall',
      'Community Garden',
      'Sports Complex',
      'Arts Center',
      'Learning Center',
      'Wellness Center'
    ]
  }
}
