import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Button } from '@venue/shared';
import { User } from '@venue/shared';
import { logOut } from '@venue/firebase';

interface GameNavbarProps {
  user: User | null;
}

const GameNavbar = ({ user }: GameNavbarProps) => {
  const handleLogout = async () => {
    try {
      await logOut();
      window.location.reload();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#1a1a1a' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          🎮 Venue Game
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              {user.displayName || user.email}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default GameNavbar;

