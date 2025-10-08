export interface Vector2 {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Position {
  x: number
  y: number
}

export interface Personality {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

export interface Needs {
  hunger: number
  sleep: number
  social: number
  hygiene: number
  fun: number
}

export interface GameStateSnapshot {
  time: any
  weather: any
  grid: {
    width: number
    height: number
  }
  citizens: any[]
  buildings: any[]
  items: any[]
}

export type Direction = 'up' | 'down' | 'left' | 'right'
export type Mood = 'happy' | 'neutral' | 'unhappy'
export type WeatherType = 'sunny' | 'cloudy' | 'rain' | 'snow'
export type BuildingType = 'house' | 'shop' | 'community'
export type TerrainType = 'grass' | 'road' | 'water' | 'dirt'
