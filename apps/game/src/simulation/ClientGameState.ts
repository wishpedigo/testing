import { GameStateSnapshot } from '../services/GameSocket'

export class ClientGameState {
  grid: { width: number; height: number } = { width: 50, height: 50 }
  citizens: any[] = []
  buildings: any[] = []
  time: any = null
  weather: any = null
  items: any[] = []
  
  updateFromServer(snapshot: GameStateSnapshot): void {
    this.citizens = snapshot.citizens
    this.buildings = snapshot.buildings
    this.time = snapshot.time
    this.weather = snapshot.weather
    this.grid = snapshot.grid
    this.items = snapshot.items
  }
  
  getCitizenById(id: string): any {
    return this.citizens.find(citizen => citizen.id === id)
  }
  
  getBuildingById(id: string): any {
    return this.buildings.find(building => building.id === id)
  }
  
  getCitizensAt(x: number, y: number): any[] {
    return this.citizens.filter(citizen => 
      citizen.position.x === x && citizen.position.y === y
    )
  }
  
  getBuildingsAt(x: number, y: number): any[] {
    return this.buildings.filter(building => {
      const pos = building.position
      const size = building.size
      return x >= pos.x && x < pos.x + size.width &&
             y >= pos.y && y < pos.y + size.height
    })
  }
}
