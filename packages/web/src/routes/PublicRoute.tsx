import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/modules/auth/AuthContext';

export function PublicOnlyRoute() {
  const { userToken } = useAuth();

  // TODO: Change redirect to timeline page
  return !userToken ? <Outlet /> : <Navigate to={'/profile/edit'} />;
}
