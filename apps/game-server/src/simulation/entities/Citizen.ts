import { Vector2, Personality, Needs } from '../../types'

export class Citizen {
  id: string
  name: string
  age: number
  position: Vector2
  facing: string = 'down'
  
  personality: Personality
  needs: Needs
  mood: string = 'neutral'
  currentActivity: string = 'idle'
  path: Vector2[] = []
  
  constructor(id: string, name: string, age: number, position: Vector2) {
    this.id = id
    this.name = name
    this.age = age
    this.position = position
    
    // Random personality
    this.personality = {
      openness: Math.random(),
      conscientiousness: Math.random(),
      extraversion: Math.random(),
      agreeableness: Math.random(),
      neuroticism: Math.random()
    }
    
    // Initial needs
    this.needs = {
      hunger: 50 + Math.random() * 20,
      sleep: 50 + Math.random() * 20,
      social: 50 + Math.random() * 20,
      hygiene: 50 + Math.random() * 20,
      fun: 50 + Math.random() * 20
    }
  }
  
  update(deltaTime: number, gridManager: any): void {
    // Decay needs slowly
    this.needs.hunger = Math.max(0, this.needs.hunger - deltaTime * 0.1)
    this.needs.sleep = Math.max(0, this.needs.sleep - deltaTime * 0.05)
    this.needs.social = Math.max(0, this.needs.social - deltaTime * 0.02)
    this.needs.hygiene = Math.max(0, this.needs.hygiene - deltaTime * 0.03)
    this.needs.fun = Math.max(0, this.needs.fun - deltaTime * 0.02)
    
    // Update mood based on needs
    const avgNeeds = Object.values(this.needs).reduce((a, b) => a + b) / 5
    if (avgNeeds < 30) this.mood = 'unhappy'
    else if (avgNeeds > 70) this.mood = 'happy'
    else this.mood = 'neutral'
    
    // Simple random movement
    this.randomWalk(gridManager)
  }
  
  private randomWalk(gridManager: any): void {
    // 10% chance to change direction each update
    if (Math.random() < 0.1) {
      const directions: string[] = ['up', 'down', 'left', 'right']
      this.facing = directions[Math.floor(Math.random() * directions.length)]
    }
    
    // Try to move in facing direction
    let newX = this.position.x
    let newY = this.position.y
    
    switch (this.facing) {
      case 'up':
        newY = Math.max(0, this.position.y - 1)
        break
      case 'down':
        newY = Math.min(gridManager.height - 1, this.position.y + 1)
        break
      case 'left':
        newX = Math.max(0, this.position.x - 1)
        break
      case 'right':
        newX = Math.min(gridManager.width - 1, this.position.x + 1)
        break
    }
    
    // Move if the new position is walkable
    if (gridManager.isWalkable(newX, newY)) {
      gridManager.moveEntity(this.id, this.position.x, this.position.y, newX, newY)
      this.position = { x: newX, y: newY }
    } else {
      // Turn around if blocked
      const oppositeDirections: { [key: string]: string } = {
        up: 'down',
        down: 'up',
        left: 'right',
        right: 'left'
      }
      this.facing = oppositeDirections[this.facing]
    }
  }
  
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      position: this.position,
      facing: this.facing,
      mood: this.mood,
      currentActivity: this.currentActivity,
      needs: this.needs
    }
  }
}
