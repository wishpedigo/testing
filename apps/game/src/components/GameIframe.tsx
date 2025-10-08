import { useEffect, useRef, useState } from 'react';
import { Box } from '@wishlabs/shared';

interface GameIframeProps {
  onGameEnd: (score: number) => void;
  gameUrl?: string;
}

const GameIframe = ({ onGameEnd, gameUrl }: GameIframeProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Default to the current app's URL if no gameUrl provided
  const defaultGameUrl = gameUrl || window.location.origin + '/game-embed';

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Listen for messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GAME_END') {
        onGameEnd(event.data.score);
      }
    };

    window.addEventListener('message', handleMessage);

    // Handle iframe load
    const handleLoad = () => {
      setIsLoaded(true);
    };

    iframe.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('message', handleMessage);
      iframe.removeEventListener('load', handleLoad);
    };
  }, [onGameEnd]);

  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '400px',
        position: 'relative',
        border: 'none',
        overflow: 'hidden'
      }}
    >
      <iframe
        ref={iframeRef}
        src={defaultGameUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: isLoaded ? 'block' : 'none'
        }}
        title="Game"
        allow="fullscreen"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
      {!isLoaded && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2c3e50',
            color: 'white',
            fontSize: '1.2rem'
          }}
        >
          Loading game...
        </Box>
      )}
    </Box>
  );
};

export default GameIframe;
