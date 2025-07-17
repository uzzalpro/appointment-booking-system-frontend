import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth';
import { jwtDecode } from 'jwt-decode'; // import default correctly
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // decoded token data
  const [userId, setUserId] = useState(null);   // user ID
  const [userType, setUserType] = useState(null); // user type
  const [fullName, setFullName] = useState(null);
  const [availableTimeslots, setAvailableTimeslots] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setUserId(decoded.sub || localStorage.getItem('user_id'));
        setUserType(decoded.user_type || localStorage.getItem('user_type'));
        setFullName(decoded.full_name || localStorage.getItem('full_name'));
        setAvailableTimeslots(decoded.available_timeslots || localStorage.getItem('available_timeslots'));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_type');
        localStorage.removeItem('full_name');
        localStorage.removeItem('available_timeslots');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const { data } = await apiLogin(credentials);
    const { access_token, id, user_type,full_name,available_timeslots } = data;

    // Save to localStorage
    localStorage.setItem('token', access_token);
    localStorage.setItem('user_id', id);
    localStorage.setItem('user_type', user_type);
    localStorage.setItem('full_name', full_name);
    localStorage.setItem('available_timeslots', available_timeslots);

    // Update state
    const decoded = jwtDecode(access_token);
    setUser(decoded);
    setUserId(id);
    setUserType(user_type);
    setFullName(full_name);
    setAvailableTimeslots(available_timeslots);

    redirectBasedOnRole(user_type);
  };

  const register = async (userData) => {
    const { data } = await apiRegister(userData);
    // You can handle registration response here if needed
    return data;
  };

  const logout = () => {
    apiLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_type');
    localStorage.removeItem('full_name');
    localStorage.removeItem('available_timeslots');

    setUser(null);
    setUserId(null);
    setUserType(null);
    setFullName(null);
    setAvailableTimeslots(null);

    navigate('/login');
  };

  const redirectBasedOnRole = (userType) => {
    switch(userType) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'doctor':
        navigate('/doctor/dashboard');
        break;
      case 'patient':
        navigate('/patient/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, userId, userType, availableTimeslots, fullName, login, register, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
