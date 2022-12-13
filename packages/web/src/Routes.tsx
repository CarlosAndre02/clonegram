import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const SignupPage = lazy(() => import('@/modules/auth/pages/SignupPage'));
const ProfilePage = lazy(() => import('@/modules/user/pages/ProfilePage'));
const ProfileEditPage = lazy(
  () => import('@/modules/user/pages/ProfileEditPage/ProfileEditPage')
);

export const AppRoutes = () => (
  <Routes>
    {/* <Route path="/" element={<Home />} /> */}
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/:username" element={<ProfilePage />} />
    <Route path="/profile/edit" element={<ProfileEditPage />} />
  </Routes>
);
