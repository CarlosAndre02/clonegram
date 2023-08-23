import { useNavigate } from 'react-router-dom';

import { LoadingPage } from './LoadingPage';
import { useAuth } from '@/modules/auth/AuthContext';

export default function LogoutComponent() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  logoutUser(() => {
    navigate('/');
  });

  return <LoadingPage />;
}
