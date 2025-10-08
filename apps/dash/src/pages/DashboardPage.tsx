import { useNavigate } from 'react-router-dom';
import { Container, Typography, AppBar, Toolbar, Grid, Button, Card } from '@wishlabs/shared';
import { User } from '@wishlabs/shared';
import { logOut } from '@wishlabs/firebase';

interface DashboardPageProps {
  user: User | null;
}

const DashboardPage = ({ user }: DashboardPageProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="py-12">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <Typography variant="h5" gutterBottom>
                Welcome, {user?.displayName || user?.email}!
              </Typography>
              <Typography paragraph color="text.secondary">
                Email: {user?.email}
              </Typography>
              <Button 
                variant="contained" 
                size="large" 
                color="primary"
                onClick={() => window.location.href = import.meta.env.VITE_GAME_URL || 'http://game.localhost:5173'}
                sx={{ mt: 2 }}
              >
                🎮 Play Game
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default DashboardPage;

