import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getUserById } from '../../api/users';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout, userId, userType } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [existingImage, setExistingImage] = useState(null);
  const [userFullName, setUserFullName] = useState('');
 const getDashboardPath = () => {
    return `/${userType}/dashboard`;
  };
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await getUserById(userId);
        setUserFullName(data?.full_name || user?.full_name || '');
        setExistingImage(data?.imageUrl || null);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, user?.full_name]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to={getDashboardPath()}  sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            Clinic Management
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>Loading...</Typography>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to={getDashboardPath()}  sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Clinic Management
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar 
                  src={existingImage || undefined}
                  sx={{ width: 40, height: 40 }}
                >
                  {!existingImage && (userFullName.charAt(0) || '')}
                </Avatar>
                
              </Box>
              <Button color="inherit" component={Link} to="/profile">
                Profile
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;