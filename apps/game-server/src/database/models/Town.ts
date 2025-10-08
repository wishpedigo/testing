import mongoose, { Schema, Document } from 'mongoose'

export interface ITown extends Document {
  name: string
  gridWidth: number
  gridHeight: number
  createdAt: Date
}

const TownSchema = new Schema<ITown>({
  name: { type: String, required: true },
  gridWidth: { type: Number, required: true, default: 50 },
  gridHeight: { type: Number, required: true, default: 50 },
  createdAt: { type: Date, default: Date.now }
})

export const Town = mongoose.model<ITown>('Town', TownSchema)
