import { World, IWorld } from '../database/models/World'
import { TerrainGenerator, TerrainGenerationParams } from './TerrainGenerator'
import { BuildingGenerator, BuildingGenerationParams } from './BuildingGenerator'
import { CitizenGenerator, CitizenGenerationParams } from './CitizenGenerator'
import { Building } from '../simulation/entities/Building'
import { Citizen } from '../simulation/entities/Citizen'

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

export class WorldGenerator {
  async generateWorld(params: GenerationParams): Promise<IWorld> {
    const seed = params.seed || this.generateSeed()
    
    console.log(`🌍 Generating world "${params.name}" with seed ${seed}`)
    
    // Generate terrain
    console.log('🏔️ Generating terrain...')
    const terrainGenerator = new TerrainGenerator(seed)
    const terrainParams: TerrainGenerationParams = {
      gridWidth: params.gridWidth,
      gridHeight: params.gridHeight,
      terrainDensity: params.terrainDensity,
      seed
    }
    const terrainMap = terrainGenerator.generate(terrainParams)
    
    // Generate buildings
    console.log('🏠 Placing buildings...')
    const buildingGenerator = new BuildingGenerator(seed)
    const buildingParams: BuildingGenerationParams = {
      terrainMap,
      buildingDensity: params.buildingDensity,
      buildingTypeRatios: params.buildingTypeRatios,
      seed
    }
    const buildings = buildingGenerator.placeBuildingsOnTerrain(buildingParams)
    
    // Generate citizens
    console.log('👥 Creating citizens...')
    const citizenGenerator = new CitizenGenerator(seed)
    const citizenParams: CitizenGenerationParams = {
      citizenCount: params.citizenCount,
      personalityDistribution: params.personalityDistribution,
      seed
    }
    const citizens = citizenGenerator.generateCitizens(citizenParams)
    
    // Create world document
    const world = new World({
      name: params.name,
      gridWidth: params.gridWidth,
      gridHeight: params.gridHeight,
      seed,
      generationParams: {
        terrainDensity: params.terrainDensity,
        buildingDensity: params.buildingDensity,
        buildingTypeRatios: params.buildingTypeRatios,
        citizenCount: params.citizenCount,
        personalityDistribution: params.personalityDistribution
      },
      terrainMap,
      isActive: false // Will be set to true when activated
    })
    
    // Save to database
    console.log('💾 Saving world to database...')
    const savedWorld = await world.save()
    
    // Save buildings and citizens to their respective collections
    await this.saveBuildingsAndCitizens(savedWorld._id.toString(), buildings, citizens)
    
    console.log(`✅ World "${params.name}" generated successfully!`)
    console.log(`   - Terrain: ${params.gridWidth}x${params.gridHeight}`)
    console.log(`   - Buildings: ${buildings.length}`)
    console.log(`   - Citizens: ${citizens.length}`)
    
    return savedWorld
  }

  private generateSeed(): number {
    return Math.floor(Math.random() * 2147483647) // Max 32-bit integer
  }

  private async saveBuildingsAndCitizens(
    worldId: string, 
    buildings: Building[], 
    citizens: Citizen[]
  ): Promise<void> {
    const { Building: BuildingModel } = await import('../database/models/Building')
    const { Citizen: CitizenModel } = await import('../database/models/Citizen')
    
    // Save buildings
    const buildingDocs = buildings.map(building => ({
      townId: worldId,
      type: building.type,
      name: building.name,
      position: building.position,
      size: building.size,
      capacity: building.capacity,
      currentOccupants: building.currentOccupants
    }))
    
    if (buildingDocs.length > 0) {
      await BuildingModel.insertMany(buildingDocs)
    }
    
    // Save citizens
    const citizenDocs = citizens.map(citizen => ({
      townId: worldId,
      name: citizen.name,
      age: citizen.age,
      position: citizen.position,
      facing: citizen.facing,
      personality: citizen.personality,
      needs: citizen.needs,
      mood: citizen.mood,
      currentActivity: citizen.currentActivity,
      path: citizen.path
    }))
    
    if (citizenDocs.length > 0) {
      await CitizenModel.insertMany(citizenDocs)
    }
  }

  async getWorlds(): Promise<IWorld[]> {
    return await World.find().sort({ createdAt: -1 })
  }

  async getWorldById(worldId: string): Promise<IWorld | null> {
    return await World.findById(worldId)
  }

  async activateWorld(worldId: string): Promise<IWorld | null> {
    // Deactivate all worlds first
    await World.updateMany({}, { isActive: false })
    
    // Activate the specified world
    const world = await World.findByIdAndUpdate(
      worldId,
      { isActive: true },
      { new: true }
    )
    
    return world
  }

  async getActiveWorld(): Promise<IWorld | null> {
    return await World.findOne({ isActive: true })
  }

  async deleteWorld(worldId: string): Promise<boolean> {
    try {
      // Delete associated buildings and citizens
      const { Building: BuildingModel } = await import('../database/models/Building')
      const { Citizen: CitizenModel } = await import('../database/models/Citizen')
      
      await BuildingModel.deleteMany({ townId: worldId })
      await CitizenModel.deleteMany({ townId: worldId })
      
      // Delete the world
      await World.findByIdAndDelete(worldId)
      
      return true
    } catch (error) {
      console.error('Error deleting world:', error)
      return false
    }
  }
}
