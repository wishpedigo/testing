import { Container, Typography, Box, Button, Card } from '@wishlabs/shared';

const LoginPrompt = () => {
  return (
    <Container maxWidth="sm" className="py-16">
      <Card>
        <Typography variant="h4" component="h1" gutterBottom className="text-center">
          Welcome to the Game!
        </Typography>
        <Typography variant="body1" color="text.secondary" className="text-center mb-6">
          Please log in to start playing and save your progress
        </Typography>
        <Box className="text-center">
          <a href="http://localhost:5174" style={{ textDecoration: 'none' }}>
            <Button variant="contained" size="large" color="primary">
              Go to Login
            </Button>
          </a>
        </Box>
      </Card>
    </Container>
  );
};

export default LoginPrompt;

