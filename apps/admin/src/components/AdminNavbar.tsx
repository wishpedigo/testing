import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logOut } from '@wishlabs/firebase';
import { User, AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Menu, MenuItemComponent } from '@wishlabs/shared';

interface AdminNavbarProps {
  user: User;
}

export default function AdminNavbar({ user }: AdminNavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await logOut();
    handleClose();
  };

  const navItems = [
    { path: '/world-generation', label: 'World Generation', icon: '🏔️' },
    { path: '/users', label: 'Users', icon: '👥' },
    { path: '/monitoring', label: 'Monitoring', icon: '📊' },
    { path: '/data-tools', label: 'Data Tools', icon: '🔧' },
  ];

  return (
    <AppBar position="fixed" className="z-50">
      <Toolbar>
        <Typography variant="h6" className="flex-grow">
          Paradise Valley Admin
        </Typography>
        
        <Box className="flex gap-1 mr-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="outline"
              onClick={() => navigate(item.path)}
              className={`${location.pathname === item.path ? 'bg-white bg-opacity-10' : ''}`}
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </Button>
          ))}
        </Box>

        <IconButton
          size="large"
          onClick={handleMenu}
        >
          {user.photoURL ? (
            <Avatar src={user.photoURL} sx={{ width: 32, height: 32 }} />
          ) : (
            <span>👤</span>
          )}
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItemComponent disabled>
            <Typography variant="body2">
              {user.displayName || user.email}
            </Typography>
          </MenuItemComponent>
          <MenuItemComponent onClick={handleSignOut}>
            <span className="mr-1">🚪</span>
            Sign Out
          </MenuItemComponent>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
