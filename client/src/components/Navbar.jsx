import { AppBar, Box, Button, Container, Toolbar, Typography, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PsychologyIcon from '@mui/icons-material/Psychology';

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isAuth = localStorage.getItem('authToken');
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    toast.success("Logged out successfully");
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: theme.palette.background.alt }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PsychologyIcon 
              sx={{ 
                fontSize: '2.5rem', 
                color: theme.palette.primary.main, 
                marginRight: '8px' 
              }} 
            />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: theme.palette.primary.main,
                textDecoration: 'none',
              }}
            >
              GENIE AI
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isAuth ? (
              <>
                <Button
                  component={Link}
                  to="/"
                  startIcon={<HomeIcon />}
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  Home
                </Button>
                <Button
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{
                    color: theme.palette.error.main,
                    '&:hover': {
                      backgroundColor: 'rgba(211, 47, 47, 0.04)',
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/register"
                  startIcon={<PersonAddIcon />}
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  Sign up
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  startIcon={<LoginIcon />}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    }
                  }}
                >
                  Sign in
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;