import mongoose, { Schema, Document } from 'mongoose'

export interface ICitizen extends Document {
  townId: mongoose.Types.ObjectId
  name: string
  age: number
  position: { x: number; y: number }
  facing: 'up' | 'down' | 'left' | 'right'
  
  personality: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  
  needs: {
    hunger: number
    sleep: number
    social: number
    hygiene: number
    fun: number
  }
  
  mood: 'happy' | 'neutral' | 'unhappy'
  currentActivity: string
  path: { x: number; y: number }[]
}

const CitizenSchema = new Schema<ICitizen>({
  townId: { type: Schema.Types.ObjectId, ref: 'Town', required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  facing: { type: String, enum: ['up', 'down', 'left', 'right'], default: 'down' },
  
  personality: {
    openness: { type: Number, min: 0, max: 1, default: 0.5 },
    conscientiousness: { type: Number, min: 0, max: 1, default: 0.5 },
    extraversion: { type: Number, min: 0, max: 1, default: 0.5 },
    agreeableness: { type: Number, min: 0, max: 1, default: 0.5 },
    neuroticism: { type: Number, min: 0, max: 1, default: 0.5 }
  },
  
  needs: {
    hunger: { type: Number, min: 0, max: 100, default: 50 },
    sleep: { type: Number, min: 0, max: 100, default: 50 },
    social: { type: Number, min: 0, max: 100, default: 50 },
    hygiene: { type: Number, min: 0, max: 100, default: 50 },
    fun: { type: Number, min: 0, max: 100, default: 50 }
  },
  
  mood: { type: String, enum: ['happy', 'neutral', 'unhappy'], default: 'neutral' },
  currentActivity: { type: String, default: 'idle' },
  path: [{ x: Number, y: Number }]
})

export const Citizen = mongoose.model<ICitizen>('Citizen', CitizenSchema)
