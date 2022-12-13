import { Center, Spinner } from '@chakra-ui/react';

export function LoadingPage() {
  return (
    <Center w="100vw" h="100vh">
      <Spinner size="xl" thickness="5px" />
    </Center>
  );
}
