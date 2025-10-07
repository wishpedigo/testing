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
          <Grid item xs={12} md={6}>
            <Card>
              <Typography paragraph color="text.secondary">
                Email: {user?.email}
              </Typography>
            </Card>
          </Grid>
      </Container>
    </>
  );
};

export default DashboardPage;

