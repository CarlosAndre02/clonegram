import { Suspense } from 'react';

import { Providers } from './providers';
import ErrorBoundary from './ErrorBoundary';
import { AppRoutes } from '@/routes/Routes';
import { LoadingPage } from '@/shared/LoadingPage';

export function App() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Providers>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </Providers>
    </Suspense>
  );
}
