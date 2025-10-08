export class TimeSystem {
  realTime: Date
  gameSpeed: number = 1
  
  constructor() {
    this.realTime = new Date()
  }
  
  update(deltaTime: number): void {
    this.realTime = new Date()
  }
  
  getHour(): number {
    return this.realTime.getHours()
  }
  
  isDay(): boolean {
    const hour = this.getHour()
    return hour >= 6 && hour < 20
  }
  
  getTimeString(): string {
    return this.realTime.toLocaleTimeString('en-US', { 
      timeZone: 'America/New_York',
      hour12: true 
    })
  }
  
  getDateString(): string {
    return this.realTime.toLocaleDateString('en-US', { 
      timeZone: 'America/New_York',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  toJSON() {
    return {
      time: this.realTime.toISOString(),
      timeString: this.getTimeString(),
      dateString: this.getDateString(),
      hour: this.getHour(),
      isDay: this.isDay()
    }
  }
}
