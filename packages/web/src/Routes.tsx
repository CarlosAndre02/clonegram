import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const SignupPage = lazy(() => import('@/modules/auth/pages/SignupPage'));

export const AppRoutes = () => (
  <Routes>
    {/* <Route path="/" element={<Home />} /> */}
    <Route path="/signup" element={<SignupPage />} />
  </Routes>
);
