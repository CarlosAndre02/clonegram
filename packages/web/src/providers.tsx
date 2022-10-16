import { ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';
import { RelayEnvironmentProvider } from 'react-relay';
import { RelayEnvironment } from './RelayEnvironment';

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </RelayEnvironmentProvider>
  );
};
