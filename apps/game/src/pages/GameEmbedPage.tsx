import { useEffect } from 'react';
import PhaserGame from '../components/PhaserGame';

const GameEmbedPage = () => {
  useEffect(() => {
    // Set up message communication with parent window
    const handleGameEnd = (score: number) => {
      // Send message to parent window
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'GAME_END',
          score: score
        }, window.location.origin);
      }
    };

    // Make handleGameEnd available globally for the PhaserGame component
    (window as any).handleGameEnd = handleGameEnd;

    return () => {
      delete (window as any).handleGameEnd;
    };
  }, []);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      margin: 0, 
      padding: 0,
      overflow: 'hidden',
      backgroundColor: '#2c3e50'
    }}>
      <PhaserGame onGameEnd={(window as any).handleGameEnd} />
    </div>
  );
};

export default GameEmbedPage;
