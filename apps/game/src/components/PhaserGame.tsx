import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface PhaserGameProps {
  onGameEnd: (score: number) => void;
}

const PhaserGame = ({ onGameEnd }: PhaserGameProps) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    // Game configuration
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: '100%',
      height: '100%',
      parent: gameRef.current,
      backgroundColor: '#87CEEB', // Sky blue for Paradise Valley
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    // Create the game
    phaserGameRef.current = new Phaser.Game(config);

    // Game variables for Paradise Valley autonomous simulation
    let buildings: Phaser.GameObjects.Group;
    let trees: Phaser.GameObjects.Group;
    let roads: Phaser.GameObjects.Group;
    let people: Phaser.GameObjects.Group;
    let vehicles: Phaser.GameObjects.Group;
    
    // Real-time simulation variables
    let realTime: Date;
    let isDay: boolean;
    let weather: string;
    let temperature: number;
    let population = 50;
    let townActivity = 0;
    
    // UI elements
    let timeText: Phaser.GameObjects.Text;
    let dateText: Phaser.GameObjects.Text;
    let weatherText: Phaser.GameObjects.Text;
    let temperatureText: Phaser.GameObjects.Text;
    let populationText: Phaser.GameObjects.Text;
    let activityText: Phaser.GameObjects.Text;
    let scene: Phaser.Scene;
    
    // Simulation state
    let lastUpdateTime = 0;
    let lastWeatherUpdate = 0;

    function preload(this: Phaser.Scene) {
      // Create simple colored rectangles as sprites for Paradise Valley
      this.load.image('house', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
      this.load.image('shop', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
      this.load.image('school', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
      this.load.image('tree', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
      this.load.image('road', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    }

    function create(this: Phaser.Scene) {
      scene = this;
      
      // Initialize real-time simulation
      realTime = new Date();
      updateTimeAndWeather();
      
      // Create Paradise Valley background - overhead view
      updateBackground();
      
      // Create groups for town elements
      buildings = this.add.group();
      trees = this.add.group();
      roads = this.add.group();
      people = this.add.group();
      vehicles = this.add.group();

      // Create road network for Paradise Valley (overhead view)
      createRoadNetwork(this);

      // Create initial buildings for Paradise Valley in a grid layout
      const buildingSpacing = 120;
      const startX = 100;
      const startY = 100;
      
      // Row 1 - Residential
      createBuilding(this, startX, startY, 'house', 0x8B4513, 'Cozy House');
      createBuilding(this, startX + buildingSpacing, startY, 'house', 0x8B4513, 'Artisan Home');
      createBuilding(this, startX + buildingSpacing * 2, startY, 'house', 0x8B4513, 'Community House');
      createBuilding(this, startX + buildingSpacing * 3, startY, 'house', 0x8B4513, 'Eco Home');
      
      // Row 2 - Commercial
      createBuilding(this, startX, startY + buildingSpacing, 'shop', 0xFF6347, 'Local Co-op');
      createBuilding(this, startX + buildingSpacing, startY + buildingSpacing, 'shop', 0xFF6347, 'Bookstore & Cafe');
      createBuilding(this, startX + buildingSpacing * 2, startY + buildingSpacing, 'shop', 0xFF6347, 'Farmers Market');
      createBuilding(this, startX + buildingSpacing * 3, startY + buildingSpacing, 'shop', 0xFF6347, 'Art Gallery');
      
      // Row 3 - Community
      createBuilding(this, startX, startY + buildingSpacing * 2, 'school', 0x4169E1, 'Progressive School');
      createBuilding(this, startX + buildingSpacing, startY + buildingSpacing * 2, 'school', 0x4169E1, 'Community Center');
      createBuilding(this, startX + buildingSpacing * 2, startY + buildingSpacing * 2, 'school', 0x4169E1, 'Library');
      createBuilding(this, startX + buildingSpacing * 3, startY + buildingSpacing * 2, 'school', 0x4169E1, 'Health Clinic');

      // Create trees around town (overhead view - circular)
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 200;
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const tree = this.add.circle(x, y, 15, 0x228B22);
        trees.add(tree);
      }

      // Create UI elements for real-time simulation
      timeText = this.add.text(16, 16, '', {
        fontSize: '18px',
        color: '#000',
        backgroundColor: '#fff',
        padding: { x: 8, y: 4 }
      });

      dateText = this.add.text(16, 50, '', {
        fontSize: '16px',
        color: '#000',
        backgroundColor: '#fff',
        padding: { x: 8, y: 4 }
      });

      weatherText = this.add.text(16, 84, '', {
        fontSize: '16px',
        color: '#000',
        backgroundColor: '#fff',
        padding: { x: 8, y: 4 }
      });

      temperatureText = this.add.text(16, 118, '', {
        fontSize: '16px',
        color: '#000',
        backgroundColor: '#fff',
        padding: { x: 8, y: 4 }
      });

      populationText = this.add.text(this.cameras.main.width - 200, 16, '', {
        fontSize: '16px',
        color: '#000',
        backgroundColor: '#fff',
        padding: { x: 8, y: 4 }
      });

      activityText = this.add.text(this.cameras.main.width - 200, 50, '', {
        fontSize: '16px',
        color: '#000',
        backgroundColor: '#fff',
        padding: { x: 8, y: 4 }
      });

      // Add title
      this.add.text(this.cameras.main.width / 2 - 200, 16, 'Paradise Valley - Live Simulation', {
        fontSize: '18px',
        color: '#000',
        backgroundColor: '#fff',
        padding: { x: 8, y: 4 }
      });

      // Initialize autonomous town life
      initializeTownLife();
      
      // Start real-time simulation
      lastUpdateTime = Date.now();
    }

    function createRoadNetwork(scene: Phaser.Scene) {
      const buildingSpacing = 120;
      const startX = 100;
      const startY = 100;
      
      // Horizontal roads
      for (let i = 0; i <= 3; i++) {
        const roadY = startY - 20 + (i * buildingSpacing);
        const horizontalRoad = scene.add.rectangle(scene.cameras.main.width / 2, roadY, scene.cameras.main.width - 40, 20, 0x696969);
        roads.add(horizontalRoad);
      }
      
      // Vertical roads
      for (let i = 0; i <= 4; i++) {
        const roadX = startX - 20 + (i * buildingSpacing);
        const verticalRoad = scene.add.rectangle(roadX, scene.cameras.main.height / 2, 20, scene.cameras.main.height - 40, 0x696969);
        roads.add(verticalRoad);
      }
    }

    function createBuilding(scene: Phaser.Scene, x: number, y: number, type: string, color: number, name: string) {
      // Create building from overhead view - square/rectangular shapes
      let building: Phaser.GameObjects.Rectangle;
      if (type === 'house') {
        building = scene.add.rectangle(x, y, 60, 60, color); // Square houses
      } else if (type === 'shop') {
        building = scene.add.rectangle(x, y, 80, 60, color); // Rectangular shops
      } else if (type === 'school') {
        building = scene.add.rectangle(x, y, 100, 60, color); // Larger community buildings
      } else {
        building = scene.add.rectangle(x, y, 60, 60, color); // Default
      }
      
      building.setData('type', type);
      building.setData('name', name);
      building.setData('activity', 0);
      buildings.add(building);

      // Add building name label (smaller for overhead view)
      const label = scene.add.text(x, y + 45, name, {
        fontSize: '10px',
        color: '#000',
        backgroundColor: '#fff',
        padding: { x: 3, y: 1 }
      });
      label.setOrigin(0.5, 0);
      buildings.add(label);
    }

    function updateTimeAndWeather() {
      realTime = new Date();
      
      // Determine if it's day or night (East Coast time)
      const hour = realTime.getHours();
      isDay = hour >= 6 && hour < 20; // 6 AM to 8 PM is day
      
      // Simple weather simulation based on season and time
      const month = realTime.getMonth();
      const isWinter = month >= 11 || month <= 2;
      const isSummer = month >= 5 && month <= 8;
      
      // Temperature based on season and time of day
      let baseTemp = 20; // Base temperature in Celsius
      if (isWinter) baseTemp = 0;
      else if (isSummer) baseTemp = 25;
      
      // Cooler at night
      if (!isDay) baseTemp -= 5;
      
      temperature = baseTemp + (Math.random() - 0.5) * 10;
      
      // Weather conditions
      const weatherChance = Math.random();
      if (temperature < 0 && weatherChance < 0.3) {
        weather = 'Snow';
      } else if (weatherChance < 0.2) {
        weather = 'Rain';
      } else if (weatherChance < 0.4) {
        weather = 'Cloudy';
      } else {
        weather = 'Sunny';
      }
    }

    function updateBackground() {
      // Update background based on time of day
      let backgroundColor = 0x90EE90; // Default green
      
      if (!isDay) {
        backgroundColor = 0x2F2F2F; // Dark for night
      } else if (weather === 'Rain') {
        backgroundColor = 0x708090; // Gray for rain
      } else if (weather === 'Snow') {
        backgroundColor = 0xF0F8FF; // Light blue for snow
      }
      
      // Clear existing background and add new one
      scene.children.list.forEach(child => {
        if (child.getData('isBackground')) {
          child.destroy();
        }
      });
      
      const background = scene.add.rectangle(0, 0, scene.cameras.main.width, scene.cameras.main.height, backgroundColor);
      background.setOrigin(0, 0);
      background.setData('isBackground', true);
      scene.children.bringToTop(background);
    }

    function initializeTownLife() {
      // Create some initial people and vehicles
      for (let i = 0; i < 5; i++) {
        createPerson();
      }
      
      for (let i = 0; i < 3; i++) {
        createVehicle();
      }
    }

    function createPerson() {
      const x = Phaser.Math.Between(50, scene.cameras.main.width - 50);
      const y = Phaser.Math.Between(50, scene.cameras.main.height - 50);
      const person = scene.add.circle(x, y, 3, 0x0000FF);
      person.setData('speed', Phaser.Math.Between(10, 30));
      person.setData('direction', Phaser.Math.Between(0, 360));
      people.add(person);
    }

    function createVehicle() {
      const x = Phaser.Math.Between(50, scene.cameras.main.width - 50);
      const y = Phaser.Math.Between(50, scene.cameras.main.height - 50);
      const vehicle = scene.add.rectangle(x, y, 8, 4, 0xFF0000);
      vehicle.setData('speed', Phaser.Math.Between(20, 50));
      vehicle.setData('direction', Phaser.Math.Between(0, 360));
      vehicles.add(vehicle);
    }

    function updateTownActivity() {
      // Update people movement
      people.children.entries.forEach((person: any) => {
        const speed = person.getData('speed');
        const direction = person.getData('direction');
        
        // Simple movement
        const dx = Math.cos(direction * Math.PI / 180) * speed * 0.1;
        const dy = Math.sin(direction * Math.PI / 180) * speed * 0.1;
        
        person.x += dx;
        person.y += dy;
        
        // Bounce off edges
        if (person.x < 0 || person.x > scene.cameras.main.width) {
          person.setData('direction', 180 - direction);
        }
        if (person.y < 0 || person.y > scene.cameras.main.height) {
          person.setData('direction', -direction);
        }
      });
      
      // Update vehicle movement
      vehicles.children.entries.forEach((vehicle: any) => {
        const speed = vehicle.getData('speed');
        const direction = vehicle.getData('direction');
        
        const dx = Math.cos(direction * Math.PI / 180) * speed * 0.1;
        const dy = Math.sin(direction * Math.PI / 180) * speed * 0.1;
        
        vehicle.x += dx;
        vehicle.y += dy;
        
        // Bounce off edges
        if (vehicle.x < 0 || vehicle.x > scene.cameras.main.width) {
          vehicle.setData('direction', 180 - direction);
        }
        if (vehicle.y < 0 || vehicle.y > scene.cameras.main.height) {
          vehicle.setData('direction', -direction);
        }
      });
      
      // Calculate town activity based on time of day
      const hour = realTime.getHours();
      if (hour >= 7 && hour <= 9) {
        townActivity = 80; // Morning rush
      } else if (hour >= 12 && hour <= 14) {
        townActivity = 70; // Lunch time
      } else if (hour >= 17 && hour <= 19) {
        townActivity = 90; // Evening rush
      } else if (hour >= 22 || hour <= 6) {
        townActivity = 10; // Night time
      } else {
        townActivity = 40; // Regular activity
      }
    }

    function updateUI() {
      const timeString = realTime.toLocaleTimeString('en-US', { 
        timeZone: 'America/New_York',
        hour12: true 
      });
      const dateString = realTime.toLocaleDateString('en-US', { 
        timeZone: 'America/New_York',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      timeText.setText(`Time: ${timeString}`);
      dateText.setText(dateString);
      weatherText.setText(`Weather: ${weather}`);
      temperatureText.setText(`Temperature: ${Math.round(temperature)}°C`);
      populationText.setText(`Population: ${population}`);
      activityText.setText(`Activity: ${townActivity}%`);
    }


    function update(this: Phaser.Scene, time: number, delta: number) {
      const currentTime = Date.now();
      
      // Update every second for real-time simulation
      if (currentTime - lastUpdateTime >= 1000) {
        updateTimeAndWeather();
        updateBackground();
        updateTownActivity();
        updateUI();
        lastUpdateTime = currentTime;
      }
      
      // Update weather every 5 minutes
      if (currentTime - lastWeatherUpdate >= 300000) {
        updateTimeAndWeather();
        updateBackground();
        lastWeatherUpdate = currentTime;
      }
      
      // Continuous movement updates
      updateTownActivity();
    }

    // Handle window resize
    const handleResize = () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.scale.resize(
          gameRef.current!.clientWidth,
          gameRef.current!.clientHeight
        );
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [onGameEnd]);

  return (
    <div 
      ref={gameRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '400px',
        position: 'relative'
      }} 
    />
  );
};

export default PhaserGame;
