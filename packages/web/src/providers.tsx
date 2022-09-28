import { ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};
