import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { PrivateRoute } from './PrivateRoute';
import { PublicOnlyRoute } from './PublicRoute';

const SignupPage = lazy(() => import('@/modules/auth/pages/SignupPage'));
const LoginPage = lazy(() => import('@/modules/auth/pages/LoginPage'));
const ProfilePage = lazy(
  () => import('@/modules/user/pages/ProfilePage/ProfilePage')
);
const ProfileEditPage = lazy(
  () => import('@/modules/user/pages/ProfileEditPage/ProfileEditPage')
);
const TimelinePage = lazy(
  () => import('@/modules/timeline/pages/TimelinePage')
);

export const AppRoutes = () => (
  <Routes>
    <Route element={<PublicOnlyRoute />}>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Route>
    <Route element={<PrivateRoute />}>
      <Route path="/profile/edit" element={<ProfileEditPage />} />
      <Route path="/home" element={<TimelinePage />} />
    </Route>
    <Route path="/:username" element={<ProfilePage />} />
  </Routes>
);
