import mongoose, { Schema, Document } from 'mongoose'

export interface IBuilding extends Document {
  townId: mongoose.Types.ObjectId
  type: 'house' | 'shop' | 'community'
  name: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  capacity: number
  currentOccupants: string[]
}

const BuildingSchema = new Schema<IBuilding>({
  townId: { type: Schema.Types.ObjectId, ref: 'Town', required: true },
  type: { type: String, enum: ['house', 'shop', 'community'], required: true },
  name: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  size: {
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  capacity: { type: Number, default: 0 },
  currentOccupants: [{ type: String }]
})

export const Building = mongoose.model<IBuilding>('Building', BuildingSchema)
