import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/modules/auth/AuthContext';

export function PublicOnlyRoute() {
  const { isLoggedIn } = useAuth();

  return !isLoggedIn ? <Outlet /> : <Navigate to={'/home'} />;
}
