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
        <Typography variant="h3" gutterBottom>
          Welcome, {user?.displayName || user?.email}!
        </Typography>

        <Grid container spacing={4} className="mt-8">
          <Grid item xs={12} md={6}>
            <Card>
              <Typography variant="h5" gutterBottom>
                🎮 Play Game
              </Typography>
              <Typography paragraph color="text.secondary">
                Jump into the action and start playing our exciting game!
              </Typography>
              <a href="http://localhost:5175" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">
                  Launch Game
                </Button>
              </a>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <Typography variant="h5" gutterBottom>
                👤 Your Profile
              </Typography>
              <Typography paragraph color="text.secondary">
                Email: {user?.email}
              </Typography>
              <Typography paragraph color="text.secondary">
                User ID: {user?.uid}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <Typography variant="h5" gutterBottom>
                🏆 Your Stats
              </Typography>
              <Typography color="text.secondary">
                Your game statistics and achievements will appear here once you start playing.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default DashboardPage;

