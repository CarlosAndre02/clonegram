import { Suspense } from 'react';

import { Providers } from '@/providers';
import { AppRoutes } from '@/routes/Routes';
import { LoadingPage } from '@/shared/LoadingPage';

export function App() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Providers>
        <AppRoutes />
      </Providers>
    </Suspense>
  );
}
