export class WeatherSystem {
  currentWeather: string = 'sunny'
  temperature: number = 20
  lastUpdate: number = 0
  
  update(timeSystem: any): void {
    const now = Date.now()
    if (now - this.lastUpdate < 300000) return // Update every 5 minutes
    
    this.lastUpdate = now
    this.updateWeather(timeSystem.realTime)
  }
  
  private updateWeather(date: Date): void {
    const month = date.getMonth()
    const isWinter = month >= 11 || month <= 2
    const isSummer = month >= 5 && month <= 8
    
    let baseTemp = 20
    if (isWinter) baseTemp = 0
    else if (isSummer) baseTemp = 25
    
    this.temperature = baseTemp + (Math.random() - 0.5) * 10
    
    const rand = Math.random()
    if (this.temperature < 0 && rand < 0.3) {
      this.currentWeather = 'snow'
    } else if (rand < 0.2) {
      this.currentWeather = 'rain'
    } else if (rand < 0.4) {
      this.currentWeather = 'cloudy'
    } else {
      this.currentWeather = 'sunny'
    }
  }
  
  toJSON() {
    return {
      weather: this.currentWeather,
      temperature: Math.round(this.temperature)
    }
  }
}
