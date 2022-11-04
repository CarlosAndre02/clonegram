import { Suspense } from 'react';
import { Spinner } from '@chakra-ui/react';

import { Providers } from '@/providers';
import { AppRoutes } from '@/Routes';

export function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Providers>
        <AppRoutes />
      </Providers>
    </Suspense>
  );
}
