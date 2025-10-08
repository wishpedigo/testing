import { Vector2, Size } from '../../types'

export class Building {
  id: string
  type: string
  name: string
  position: Vector2
  size: Size
  capacity: number
  currentOccupants: string[] = []
  
  constructor(id: string, type: string, name: string, position: Vector2, size: Size) {
    this.id = id
    this.type = type
    this.name = name
    this.position = position
    this.size = size
    this.capacity = this.calculateCapacity()
  }
  
  private calculateCapacity(): number {
    switch (this.type) {
      case 'house':
        return 4
      case 'shop':
        return 10
      case 'community':
        return 20
      default:
        return 0
    }
  }
  
  addOccupant(citizenId: string): boolean {
    if (this.currentOccupants.length < this.capacity) {
      this.currentOccupants.push(citizenId)
      return true
    }
    return false
  }
  
  removeOccupant(citizenId: string): void {
    this.currentOccupants = this.currentOccupants.filter(id => id !== citizenId)
  }
  
  isOccupied(): boolean {
    return this.currentOccupants.length > 0
  }
  
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      position: this.position,
      size: this.size,
      capacity: this.capacity,
      currentOccupants: this.currentOccupants
    }
  }
}
