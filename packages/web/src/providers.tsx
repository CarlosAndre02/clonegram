import { ReactNode } from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

import { theme } from '@/theme';
import { RelayEnvironment } from '@/relay/RelayEnvironment';
import { AuthContextProvider } from '@/modules/auth/AuthContext';

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <AuthContextProvider>{children}</AuthContextProvider>
        </ChakraProvider>
      </BrowserRouter>
    </RelayEnvironmentProvider>
  );
};
