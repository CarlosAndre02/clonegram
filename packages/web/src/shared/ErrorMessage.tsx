import { Alert, AlertIcon, AlertTitle, CloseButton } from '@chakra-ui/react';

type ErrorMessageProps = {
  message: string;
  onCloseAlert: () => void;
};

export const ErrorMessage = ({ message, onCloseAlert }: ErrorMessageProps) => {
  return (
    <Alert status="error" variant="left-accent" my="2">
      <AlertIcon />
      <AlertTitle>{message}</AlertTitle>
      <CloseButton
        position="absolute"
        right="8px"
        top="8px"
        onClick={onCloseAlert}
      />
    </Alert>
  );
};
