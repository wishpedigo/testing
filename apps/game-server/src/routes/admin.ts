import { Router, Request, Response } from 'express'
import { WorldGenerator, GenerationParams } from '../generation/WorldGenerator'
import { SimulationEngine } from '../simulation/SimulationEngine'
import { Building as BuildingModel } from '../database/models/Building'
import { Citizen as CitizenModel } from '../database/models/Citizen'

const router = Router()

// Initialize world generator
const worldGenerator = new WorldGenerator()

// POST /api/admin/worlds/generate
router.post('/worlds/generate', async (req: Request, res: Response) => {
  try {
    const params: GenerationParams = req.body
    
    // Validate required parameters
    if (!params.name || !params.gridWidth || !params.gridHeight) {
      return res.status(400).json({ 
        error: 'Missing required parameters: name, gridWidth, gridHeight' 
      })
    }

    // Validate parameter ranges
    if (params.gridWidth < 20 || params.gridWidth > 200) {
      return res.status(400).json({ 
        error: 'gridWidth must be between 20 and 200' 
      })
    }

    if (params.gridHeight < 20 || params.gridHeight > 200) {
      return res.status(400).json({ 
        error: 'gridHeight must be between 20 and 200' 
      })
    }

    if (params.citizenCount < 5 || params.citizenCount > 100) {
      return res.status(400).json({ 
        error: 'citizenCount must be between 5 and 100' 
      })
    }

    console.log(`🌍 Admin: Generating world "${params.name}"`)
    
    const world = await worldGenerator.generateWorld(params)
    
    res.json({
      success: true,
      worldId: world._id,
      message: `World "${params.name}" generated successfully`,
      world: {
        id: world._id,
        name: world.name,
        gridWidth: world.gridWidth,
        gridHeight: world.gridHeight,
        seed: world.seed,
        isActive: world.isActive,
        createdAt: world.createdAt
      }
    })
  } catch (error) {
    console.error('❌ Admin: World generation failed:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to generate world',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// GET /api/admin/worlds
router.get('/worlds', async (req: Request, res: Response) => {
  try {
    const worlds = await worldGenerator.getWorlds()
    
    res.json({
      success: true,
      worlds: worlds.map(world => ({
        id: world._id,
        name: world.name,
        gridWidth: world.gridWidth,
        gridHeight: world.gridHeight,
        seed: world.seed,
        isActive: world.isActive,
        createdAt: world.createdAt,
        citizenCount: 0, // Will be populated by separate query
        buildingCount: 0 // Will be populated by separate query
      }))
    })
  } catch (error) {
    console.error('❌ Admin: Failed to fetch worlds:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch worlds'
    })
  }
})

// PUT /api/admin/worlds/:id/activate
router.put('/worlds/:id/activate', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const world = await worldGenerator.activateWorld(id)
    
    if (!world) {
      return res.status(404).json({
        success: false,
        error: 'World not found'
      })
    }

    // TODO: Restart simulation engine with new world
    // This would require access to the simulation engine instance
    
    res.json({
      success: true,
      message: `World "${world.name}" activated`,
      world: {
        id: world._id,
        name: world.name,
        isActive: world.isActive
      }
    })
  } catch (error) {
    console.error('❌ Admin: Failed to activate world:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to activate world'
    })
  }
})

// GET /api/admin/citizens
router.get('/citizens', async (req: Request, res: Response) => {
  try {
    const { worldId, sort, filter, page = 1, limit = 50 } = req.query
    
    let query: any = {}
    if (worldId) {
      query.townId = worldId
    }
    
    // Apply filters
    if (filter) {
      const filterObj = JSON.parse(filter as string)
      if (filterObj.mood) {
        query.mood = filterObj.mood
      }
      if (filterObj.activity) {
        query.currentActivity = filterObj.activity
      }
    }
    
    // Apply sorting
    let sortObj: any = { name: 1 }
    if (sort) {
      const sortParams = JSON.parse(sort as string)
      sortObj = sortParams
    }
    
    // Pagination
    const skip = (Number(page) - 1) * Number(limit)
    
    const citizens = await CitizenModel.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
    
    const total = await CitizenModel.countDocuments(query)
    
    res.json({
      success: true,
      citizens: citizens.map(citizen => ({
        id: citizen._id,
        name: citizen.name,
        age: citizen.age,
        position: citizen.position,
        facing: citizen.facing,
        mood: citizen.mood,
        currentActivity: citizen.currentActivity,
        needs: citizen.needs,
        personality: citizen.personality
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error('❌ Admin: Failed to fetch citizens:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch citizens'
    })
  }
})

// GET /api/admin/metrics
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    // Get basic metrics
    const worldCount = await worldGenerator.getWorlds().then(worlds => worlds.length)
    const citizenCount = await CitizenModel.countDocuments()
    const buildingCount = await BuildingModel.countDocuments()
    
    // Get active world info
    const activeWorld = await worldGenerator.getActiveWorld()
    
    res.json({
      success: true,
      metrics: {
        worlds: {
          total: worldCount,
          active: activeWorld ? activeWorld.name : null
        },
        citizens: {
          total: citizenCount
        },
        buildings: {
          total: buildingCount
        },
        system: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          timestamp: new Date().toISOString()
        }
      }
    })
  } catch (error) {
    console.error('❌ Admin: Failed to fetch metrics:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metrics'
    })
  }
})

// POST /api/admin/data/export
router.post('/data/export', async (req: Request, res: Response) => {
  try {
    const { worldId, format = 'json' } = req.body
    
    if (!worldId) {
      return res.status(400).json({
        success: false,
        error: 'worldId is required'
      })
    }

    // Get world data
    const world = await worldGenerator.getWorldById(worldId)
    if (!world) {
      return res.status(404).json({
        success: false,
        error: 'World not found'
      })
    }

    // Get buildings and citizens
    const buildings = await BuildingModel.find({ townId: worldId })
    const citizens = await CitizenModel.find({ townId: worldId })

    const exportData = {
      world: {
        id: world._id,
        name: world.name,
        gridWidth: world.gridWidth,
        gridHeight: world.gridHeight,
        seed: world.seed,
        generationParams: world.generationParams,
        terrainMap: world.terrainMap,
        isActive: world.isActive,
        createdAt: world.createdAt
      },
      buildings: buildings.map(b => ({
        id: b._id,
        type: b.type,
        name: b.name,
        position: b.position,
        size: b.size,
        capacity: b.capacity,
        currentOccupants: b.currentOccupants
      })),
      citizens: citizens.map(c => ({
        id: c._id,
        name: c.name,
        age: c.age,
        position: c.position,
        facing: c.facing,
        personality: c.personality,
        needs: c.needs,
        mood: c.mood,
        currentActivity: c.currentActivity,
        path: c.path
      }))
    }

    if (format === 'csv') {
      // TODO: Implement CSV export
      res.status(501).json({
        success: false,
        error: 'CSV export not yet implemented'
      })
    } else {
      res.json({
        success: true,
        format: 'json',
        data: exportData
      })
    }
  } catch (error) {
    console.error('❌ Admin: Export failed:', error)
    res.status(500).json({
      success: false,
      error: 'Export failed'
    })
  }
})

export default router
