import Phaser from 'phaser'
import { ClientGameState } from '../simulation/ClientGameState'

export class GridRenderer {
  private scene: Phaser.Scene
  private gameState: ClientGameState
  private tileSize: number = 32
  private citizenSprites: Map<string, Phaser.GameObjects.Circle> = new Map()
  private buildingSprites: Map<string, Phaser.GameObjects.Rectangle> = new Map()
  private uiTexts: Map<string, Phaser.GameObjects.Text> = new Map()
  
  constructor(scene: Phaser.Scene, gameState: ClientGameState) {
    this.scene = scene
    this.gameState = gameState
  }
  
  render(): void {
    this.renderGrid()
    this.renderBuildings()
    this.renderCitizens()
    this.renderUI()
  }
  
  private renderGrid(): void {
    // Clear existing grid
    this.scene.children.list.forEach(child => {
      if (child.getData('isGrid')) {
        child.destroy()
      }
    })
    
    // Draw grid background
    const gridBg = this.scene.add.rectangle(
      (this.gameState.grid.width * this.tileSize) / 2,
      (this.gameState.grid.height * this.tileSize) / 2,
      this.gameState.grid.width * this.tileSize,
      this.gameState.grid.height * this.tileSize,
      0x90EE90 // Light green
    )
    gridBg.setData('isGrid', true)
    
    // Draw grid lines
    for (let x = 0; x <= this.gameState.grid.width; x++) {
      const line = this.scene.add.line(
        x * this.tileSize,
        0,
        x * this.tileSize,
        0,
        x * this.tileSize,
        this.gameState.grid.height * this.tileSize,
        0x000000,
        0.1
      )
      line.setData('isGrid', true)
    }
    
    for (let y = 0; y <= this.gameState.grid.height; y++) {
      const line = this.scene.add.line(
        0,
        y * this.tileSize,
        0,
        y * this.tileSize,
        this.gameState.grid.width * this.tileSize,
        y * this.tileSize,
        0x000000,
        0.1
      )
      line.setData('isGrid', true)
    }
  }
  
  private renderBuildings(): void {
    // Remove old building sprites
    this.buildingSprites.forEach(sprite => sprite.destroy())
    this.buildingSprites.clear()
    
    // Render buildings
    this.gameState.buildings.forEach(building => {
      const pixelX = building.position.x * this.tileSize + (building.size.width * this.tileSize) / 2
      const pixelY = building.position.y * this.tileSize + (building.size.height * this.tileSize) / 2
      
      let color = 0x8B4513 // Default brown
      switch (building.type) {
        case 'house':
          color = 0x8B4513 // Brown
          break
        case 'shop':
          color = 0xFF6347 // Red
          break
        case 'community':
          color = 0x4169E1 // Blue
          break
      }
      
      const sprite = this.scene.add.rectangle(
        pixelX,
        pixelY,
        building.size.width * this.tileSize,
        building.size.height * this.tileSize,
        color
      )
      
      this.buildingSprites.set(building.id, sprite)
    })
  }
  
  private renderCitizens(): void {
    // Remove old citizen sprites
    this.citizenSprites.forEach(sprite => sprite.destroy())
    this.citizenSprites.clear()
    
    // Render citizens
    this.gameState.citizens.forEach(citizen => {
      const pixelX = citizen.position.x * this.tileSize + this.tileSize / 2
      const pixelY = citizen.position.y * this.tileSize + this.tileSize / 2
      
      // Color based on mood
      let color = 0x0000FF // Default blue
      switch (citizen.mood) {
        case 'happy':
          color = 0x00FF00 // Green
          break
        case 'neutral':
          color = 0x0000FF // Blue
          break
        case 'unhappy':
          color = 0xFF0000 // Red
          break
      }
      
      const sprite = this.scene.add.circle(pixelX, pixelY, 6, color)
      this.citizenSprites.set(citizen.id, sprite)
    })
  }
  
  private renderUI(): void {
    // Remove old UI texts
    this.uiTexts.forEach(text => text.destroy())
    this.uiTexts.clear()
    
    if (!this.gameState.time || !this.gameState.weather) return
    
    // Time display
    const timeText = this.scene.add.text(16, 16, `Time: ${this.gameState.time.timeString}`, {
      fontSize: '18px',
      color: '#000',
      backgroundColor: '#fff',
      padding: { x: 8, y: 4 }
    })
    this.uiTexts.set('time', timeText)
    
    // Date display
    const dateText = this.scene.add.text(16, 50, this.gameState.time.dateString, {
      fontSize: '14px',
      color: '#000',
      backgroundColor: '#fff',
      padding: { x: 8, y: 4 }
    })
    this.uiTexts.set('date', dateText)
    
    // Weather display
    const weatherText = this.scene.add.text(16, 84, `Weather: ${this.gameState.weather.weather} (${this.gameState.weather.temperature}°C)`, {
      fontSize: '16px',
      color: '#000',
      backgroundColor: '#fff',
      padding: { x: 8, y: 4 }
    })
    this.uiTexts.set('weather', weatherText)
    
    // Population display
    const populationText = this.scene.add.text(16, 118, `Population: ${this.gameState.citizens.length}`, {
      fontSize: '16px',
      color: '#000',
      backgroundColor: '#fff',
      padding: { x: 8, y: 4 }
    })
    this.uiTexts.set('population', populationText)
    
    // Title
    const titleText = this.scene.add.text(
      this.scene.cameras.main.width / 2 - 150,
      16,
      'Paradise Valley - Live Simulation',
      {
        fontSize: '18px',
        color: '#000',
        backgroundColor: '#fff',
        padding: { x: 8, y: 4 }
      }
    )
    this.uiTexts.set('title', titleText)
  }
  
  tileToPixel(x: number, y: number): { x: number; y: number } {
    return {
      x: x * this.tileSize + this.tileSize / 2,
      y: y * this.tileSize + this.tileSize / 2
    }
  }
}
