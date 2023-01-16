import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/modules/auth/AuthContext';

export function PrivateRoute() {
  const { userToken } = useAuth();

  return userToken ? <Outlet /> : <Navigate to={'/'} />;
}
