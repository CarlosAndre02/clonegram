import { extendTheme } from '@chakra-ui/react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/700.css';

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#fafafa'
      },
      '.root': {
        minHeight: '100vh'
      }
    }
  },
  fonts: {
    heading: 'Roboto, sans-serif',
    body: 'Roboto, sans-serif'
  }
});
