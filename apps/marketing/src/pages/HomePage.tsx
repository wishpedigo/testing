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
          <a href="http://dash.localhost:5173" style={{ textDecoration: 'none' }}>
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
              🎯 Interactive Experiences
            </Typography>
            <Typography color="text.secondary">
              Engage with exciting interactive features and activities
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <Typography variant="h5" gutterBottom>
              👥 Community
            </Typography>
            <Typography color="text.secondary">
              Connect with others and be part of our growing community
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <Typography variant="h5" gutterBottom>
              📱 Mobile Ready
            </Typography>
            <Typography color="text.secondary">
              Access our platform on any device, anywhere, anytime
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;

