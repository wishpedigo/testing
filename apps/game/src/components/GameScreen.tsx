import { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Button, Card } from '@wishlabs/shared';
import { User } from '@wishlabs/shared';
import { saveGameScore, getUserScores, getTopScores } from '@wishlabs/firebase';
import Game from './Game';

interface GameScreenProps {
  user: User;
}

interface Score {
  id: string;
  userId: string;
  score: number;
  timestamp: Date;
}

const GameScreen = ({ user }: GameScreenProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [userScores, setUserScores] = useState<Score[]>([]);
  const [topScores, setTopScores] = useState<Score[]>([]);

  useEffect(() => {
    loadScores();
  }, [user]);

  const loadScores = async () => {
    try {
      const [userScoresData, topScoresData] = await Promise.all([
        getUserScores(user.uid),
        getTopScores(5),
      ]);
      setUserScores(userScoresData as Score[]);
      setTopScores(topScoresData as Score[]);
    } catch (error) {
      console.error('Failed to load scores:', error);
    }
  };

  const handleGameEnd = async (finalScore: number) => {
    setIsPlaying(false);
    setCurrentScore(finalScore);
    
    try {
      await saveGameScore(user.uid, finalScore);
      await loadScores();
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setCurrentScore(0);
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {isPlaying ? (
            <Game onGameEnd={handleGameEnd} />
          ) : (
            <Card>
              <Typography variant="h4" gutterBottom>
                Click & Score Game
              </Typography>
              <Typography paragraph color="text.secondary">
                Click the button as many times as you can in 10 seconds!
              </Typography>
              {currentScore > 0 && (
                <Typography variant="h5" color="primary" gutterBottom>
                  Your Score: {currentScore}
                </Typography>
              )}
              <Box className="mt-4">
                <Button variant="contained" size="large" onClick={startGame}>
                  {currentScore > 0 ? 'Play Again' : 'Start Game'}
                </Button>
              </Box>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Box className="space-y-4">
            <Card>
              <Typography variant="h6" gutterBottom>
                🏆 Top Scores
              </Typography>
              {topScores.length > 0 ? (
                <Box>
                  {topScores.map((score, index) => (
                    <Box key={score.id} className="py-2 border-b last:border-b-0">
                      <Typography variant="body2">
                        #{index + 1} - {score.score} points
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No scores yet. Be the first!
                </Typography>
              )}
            </Card>

            <Card>
              <Typography variant="h6" gutterBottom>
                📊 Your Best Scores
              </Typography>
              {userScores.length > 0 ? (
                <Box>
                  {userScores.slice(0, 5).map((score, index) => (
                    <Box key={score.id} className="py-2 border-b last:border-b-0">
                      <Typography variant="body2">
                        #{index + 1} - {score.score} points
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Play your first game to see your scores!
                </Typography>
              )}
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GameScreen;

