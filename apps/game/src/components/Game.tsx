import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Button, Card } from '@venue/shared';

interface GameProps {
  onGameEnd: (score: number) => void;
}

const Game = ({ onGameEnd }: GameProps) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onGameEnd(score);
    }
  }, [timeLeft, score, onGameEnd]);

  const handleClick = () => {
    setScore(score + 1);
  };

  return (
    <Card>
      <Box className="text-center">
        <Typography variant="h3" gutterBottom>
          Time Left: {timeLeft}s
        </Typography>
        <Typography variant="h4" color="primary" gutterBottom>
          Score: {score}
        </Typography>
        <Box className="mt-8">
          <Button
            variant="contained"
            size="large"
            onClick={handleClick}
            sx={{
              fontSize: '2rem',
              padding: '2rem 4rem',
              minHeight: '150px',
              minWidth: '300px',
            }}
          >
            CLICK ME!
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary" className="mt-8">
          Click as fast as you can!
        </Typography>
      </Box>
    </Card>
  );
};

export default Game;

