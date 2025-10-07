import { Container, Typography, Box, Grid, Button, Card } from '@wishlabs/shared';

const HomePage = () => {
  return (
    <Container maxWidth="lg" className="py-12">
      {/* Hero Section */}
      <Box className="text-center mb-16">
        <Typography variant="h2" component="h1" gutterBottom className="font-bold">
          Welcome to Our Venue
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Experience entertainment like never before
        </Typography>
        <Box className="mt-8">
          <a href="http://localhost:5174" style={{ textDecoration: 'none' }}>
            <Button variant="contained" size="large" color="primary">
              Get Started
            </Button>
          </a>
        </Box>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <Typography variant="h5" gutterBottom>
              🎮 Interactive Games
            </Typography>
            <Typography color="text.secondary">
              Play exciting single-player games and compete for high scores
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <Typography variant="h5" gutterBottom>
              🏆 Leaderboards
            </Typography>
            <Typography color="text.secondary">
              Track your progress and see how you rank against other players
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <Typography variant="h5" gutterBottom>
              📱 Mobile Ready
            </Typography>
            <Typography color="text.secondary">
              Coming soon - play on any device, anywhere, anytime
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;

