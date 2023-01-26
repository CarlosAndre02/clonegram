import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/modules/auth/AuthContext';

export function PublicOnlyRoute() {
  const { isLoggedIn } = useAuth();

  // TODO: Change redirect to timeline page
  return !isLoggedIn ? <Outlet /> : <Navigate to={'/profile/edit'} />;
}
