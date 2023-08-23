import { ReactNode, Component, ErrorInfo } from 'react';
import {
  Center,
  Button,
  VStack,
  HStack,
  Text,
  Heading
} from '@chakra-ui/react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error: string | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps> {
  public state: State = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Center h="50vh">
          <VStack w="500px">
            <Heading as="h1" size="md">
              Something went wrong.
            </Heading>
            {this.state.error && (
              <Text w="100%" textAlign="center">
                Error: {this.state.error}
              </Text>
            )}
            <HStack>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Button>
                <a href="/logout">Logout</a>
              </Button>
            </HStack>
          </VStack>
        </Center>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
