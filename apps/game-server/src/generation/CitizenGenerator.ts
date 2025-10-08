import { Citizen } from '../simulation/entities/Citizen'
import { v4 as uuidv4 } from 'uuid'

export interface CitizenGenerationParams {
  citizenCount: number
  personalityDistribution: {
    openness: [number, number]
    conscientiousness: [number, number]
    extraversion: [number, number]
    agreeableness: [number, number]
    neuroticism: [number, number]
  }
  seed: number
}

export class CitizenGenerator {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  generateCitizens(params: CitizenGenerationParams): Citizen[] {
    const { citizenCount, personalityDistribution } = params
    const citizens: Citizen[] = []
    
    const names = this.getNamePool()
    
    for (let i = 0; i < citizenCount; i++) {
      const name = this.selectRandomName(names, i)
      const age = this.generateAge()
      const position = this.findRandomWalkablePosition()
      const personality = this.generatePersonality(personalityDistribution)
      
      const citizen = new Citizen(uuidv4(), name, age, position)
      
      // Override the randomly generated personality with our controlled one
      citizen.personality = personality
      
      citizens.push(citizen)
    }
    
    return citizens
  }

  private generateAge(): number {
    // Generate realistic age distribution
    const rand = Math.random()
    
    if (rand < 0.15) {
      // 15% children (5-17)
      return 5 + Math.floor(Math.random() * 13)
    } else if (rand < 0.25) {
      // 10% young adults (18-25)
      return 18 + Math.floor(Math.random() * 8)
    } else if (rand < 0.70) {
      // 45% adults (26-55)
      return 26 + Math.floor(Math.random() * 30)
    } else if (rand < 0.90) {
      // 20% middle-aged (56-70)
      return 56 + Math.floor(Math.random() * 15)
    } else {
      // 10% seniors (71-85)
      return 71 + Math.floor(Math.random() * 15)
    }
  }

  private generatePersonality(distribution: CitizenGenerationParams['personalityDistribution']) {
    return {
      openness: this.generateTraitValue(distribution.openness),
      conscientiousness: this.generateTraitValue(distribution.conscientiousness),
      extraversion: this.generateTraitValue(distribution.extraversion),
      agreeableness: this.generateTraitValue(distribution.agreeableness),
      neuroticism: this.generateTraitValue(distribution.neuroticism),
    }
  }

  private generateTraitValue(range: [number, number]): number {
    const [min, max] = range
    // Use normal distribution centered in the range
    const center = (min + max) / 2
    const spread = (max - min) / 6 // 3 standard deviations cover most of the range
    
    // Box-Muller transform for normal distribution
    const u1 = Math.random()
    const u2 = Math.random()
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    
    const value = center + z0 * spread
    
    // Clamp to [0, 1] range
    return Math.max(0, Math.min(1, value))
  }

  private findRandomWalkablePosition(): { x: number; y: number } {
    // For now, return a random position within a reasonable range
    // In the full implementation, this would check against the terrain map
    return {
      x: Math.floor(Math.random() * 50),
      y: Math.floor(Math.random() * 50)
    }
  }

  private selectRandomName(namePool: string[], usedCount: number): string {
    if (usedCount < namePool.length) {
      return namePool[usedCount]
    }
    
    // If we've used all names, generate variations
    const baseName = namePool[Math.floor(Math.random() * namePool.length)]
    const variations = ['', ' Jr.', ' II', ' III']
    const variation = variations[usedCount % variations.length]
    
    return baseName + variation
  }

  private getNamePool(): string[] {
    return [
      // Gender-neutral names popular in progressive communities
      'Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Avery', 'Quinn',
      'Taylor', 'Blake', 'Cameron', 'Drew', 'Emery', 'Finley', 'Hayden',
      'Jamie', 'Kendall', 'Logan', 'Parker', 'Reese', 'Sage', 'Skyler',
      
      // Traditional names
      'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'James',
      'Isabella', 'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Henry',
      'Mia', 'Alexander', 'Harper', 'Mason', 'Evelyn', 'Michael',
      
      // Nature-inspired names
      'River', 'Sky', 'Forest', 'Ocean', 'Meadow', 'Brook', 'Sage', 'Willow',
      'Aspen', 'Cedar', 'Luna', 'Phoenix', 'Rain', 'Storm', 'Sunny',
      
      // Creative/artistic names
      'Artemis', 'Atlas', 'Clementine', 'Dahlia', 'Indigo', 'Jasper',
      'Luna', 'Orion', 'Poppy', 'River', 'Sage', 'Violet', 'Zephyr'
    ]
  }
}
