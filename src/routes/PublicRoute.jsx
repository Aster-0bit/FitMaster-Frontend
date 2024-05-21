import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function PublicRoute() {
  const auth = useAuth();

  return auth.isAuthenticated ? <Navigate to="/app/dashboard" /> : <Outlet />;
}
