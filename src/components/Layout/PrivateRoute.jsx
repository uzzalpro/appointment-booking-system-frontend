// src/components/Layout/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.user_type)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;