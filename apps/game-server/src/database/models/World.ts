import mongoose, { Schema, Document } from 'mongoose'

export interface IWorld extends Document {
  name: string
  gridWidth: number
  gridHeight: number
  seed: number
  generationParams: {
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
  terrainMap: string[][]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const WorldSchema = new Schema<IWorld>({
  name: { type: String, required: true },
  gridWidth: { type: Number, required: true, default: 50 },
  gridHeight: { type: Number, required: true, default: 50 },
  seed: { type: Number, required: true },
  generationParams: {
    terrainDensity: {
      water: { type: Number, required: true, default: 0.1 },
      road: { type: Number, required: true, default: 0.2 },
      grass: { type: Number, required: true, default: 0.7 }
    },
    buildingDensity: { type: Number, required: true, default: 0.3 },
    buildingTypeRatios: {
      house: { type: Number, required: true, default: 0.6 },
      shop: { type: Number, required: true, default: 0.3 },
      community: { type: Number, required: true, default: 0.1 }
    },
    citizenCount: { type: Number, required: true, default: 20 },
    personalityDistribution: {
      openness: [{ type: Number }, { type: Number }],
      conscientiousness: [{ type: Number }, { type: Number }],
      extraversion: [{ type: Number }, { type: Number }],
      agreeableness: [{ type: Number }, { type: Number }],
      neuroticism: [{ type: Number }, { type: Number }]
    }
  },
  terrainMap: [[String]],
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Ensure only one world is active at a time
WorldSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    )
  }
  this.updatedAt = new Date()
  next()
})

export const World = mongoose.model<IWorld>('World', WorldSchema)
