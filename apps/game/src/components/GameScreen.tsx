import { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Button, Card } from '@wishlabs/shared';
import { User } from '@wishlabs/shared';
import { saveGameScore, getUserScores, getTopScores } from '@wishlabs/firebase';
import GameIframe from './GameIframe';

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
            <Box sx={{ height: '500px', width: '100%' }}>
              <GameIframe onGameEnd={handleGameEnd} />
            </Box>
          ) : (
            <Card>
              <Typography variant="h4" gutterBottom>
                Paradise Valley
              </Typography>
              <Typography paragraph color="text.secondary">
                Welcome to Paradise Valley, a small idealistic liberal town in the Pioneer Valley! 
                This is a living, breathing simulation that runs on a dedicated game server, 
                showing real East Coast time, weather patterns, and autonomous citizens moving 
                around on a grid-based town.
              </Typography>
              <Typography paragraph color="text.secondary">
                Watch as citizens with unique personalities wander around the town, their moods 
                changing based on their needs. The simulation runs 24/7 on the server, so the 
                town continues living even when you're not watching!
              </Typography>
              <Box className="mt-4">
                <Button variant="contained" size="large" onClick={startGame}>
                  Enter Paradise Valley
                </Button>
              </Box>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Box className="space-y-4">
            <Card>
              <Typography variant="h6" gutterBottom>
                🌅 Live Simulation Info
              </Typography>
              <Box>
                <Typography variant="body2" className="py-2">
                  • Real East Coast time
                </Typography>
                <Typography variant="body2" className="py-2">
                  • Grid-based movement
                </Typography>
                <Typography variant="body2" className="py-2">
                  • Seasonal weather
                </Typography>
                <Typography variant="body2" className="py-2">
                  • Autonomous citizens
                </Typography>
                <Typography variant="body2" className="py-2">
                  • Server-authoritative
                </Typography>
              </Box>
            </Card>

            <Card>
              <Typography variant="h6" gutterBottom>
                🏘️ Paradise Valley Buildings
              </Typography>
              <Box>
                <Typography variant="body2" className="py-2">
                  • Cozy House
                </Typography>
                <Typography variant="body2" className="py-2">
                  • Artisan Home
                </Typography>
                <Typography variant="body2" className="py-2">
                  • Local Co-op
                </Typography>
                <Typography variant="body2" className="py-2">
                  • Bookstore & Cafe
                </Typography>
                <Typography variant="body2" className="py-2">
                  • Progressive School
                </Typography>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GameScreen;

