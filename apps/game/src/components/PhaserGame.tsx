import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { GameSocket } from '../services/GameSocket';
import { ClientGameState } from '../simulation/ClientGameState';
import { GridRenderer } from '../rendering/GridRenderer';

interface PhaserGameProps {
  onGameEnd: (score: number) => void;
}

const PhaserGame = ({ onGameEnd }: PhaserGameProps) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const gameSocketRef = useRef<GameSocket | null>(null);
  const gameStateRef = useRef<ClientGameState | null>(null);
  const rendererRef = useRef<GridRenderer | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    // Initialize game state and socket
    const gameState = new ClientGameState();
    const gameSocket = new GameSocket();
    gameStateRef.current = gameState;
    gameSocketRef.current = gameSocket;

    // Game configuration
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: '100%',
      height: '100%',
      parent: gameRef.current,
      backgroundColor: '#87CEEB',
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    // Create the game
    phaserGameRef.current = new Phaser.Game(config);

    function preload(this: Phaser.Scene) {
      // No assets needed for MVP 1 - using simple shapes
    }

    function create(this: Phaser.Scene) {
      // Initialize renderer
      const renderer = new GridRenderer(this, gameState);
      rendererRef.current = renderer;

      // Connect to game server
      gameSocket.connect();

      // Listen for state updates from server
      gameSocket.onStateUpdate((snapshot) => {
        gameState.updateFromServer(snapshot);
      });

      // Set up camera
      this.cameras.main.setBounds(0, 0, 1600, 1600); // 50x50 grid * 32px tiles
      this.cameras.main.setZoom(0.8);
      this.cameras.main.centerOn(800, 800);

      // Enable camera controls
      this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        if (pointer.rightButtonDown()) {
          this.cameras.main.startFollow(pointer);
        }
      });

      this.input.on('pointerup', () => {
        this.cameras.main.stopFollow();
      });

      // Mouse wheel zoom
      this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: any[], deltaX: number, deltaY: number, deltaZ: number) => {
        const zoom = this.cameras.main.zoom;
        const newZoom = Phaser.Math.Clamp(zoom + deltaY * 0.001, 0.3, 2);
        this.cameras.main.setZoom(newZoom);
      });
    }

    function update(this: Phaser.Scene, time: number, delta: number) {
      // Render the current state
      if (rendererRef.current) {
        rendererRef.current.render();
      }
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
      if (gameSocketRef.current) {
        gameSocketRef.current.disconnect();
      }
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
