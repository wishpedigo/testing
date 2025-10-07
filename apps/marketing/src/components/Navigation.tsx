import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { Button } from '@venue/shared';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Our Venue
          </Typography>
          <Link to="/" style={{ textDecoration: 'none', marginRight: '16px' }}>
            <Button color="inherit">Home</Button>
          </Link>
          <Link to="/about" style={{ textDecoration: 'none', marginRight: '16px' }}>
            <Button color="inherit">About</Button>
          </Link>
          <a href="http://localhost:5174" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="secondary">
              Login
            </Button>
          </a>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;

