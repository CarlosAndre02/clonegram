import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useToast
} from '@chakra-ui/react';
import { useMutation } from 'react-relay';

import { ModalPostDeleteMutation } from './mutations/ModalPostDeleteMutation';
import { ModalPostDeleteMutation as ModalPostDeleteMutationType } from './mutations/__generated__/ModalPostDeleteMutation.graphql';

type PostModalOptionsProps = {
  isOpen: boolean;
  onClose: VoidFunction;
  postId: string;
};

export const PostModalOptions = ({
  isOpen,
  onClose,
  postId
}: PostModalOptionsProps) => {
  const toast = useToast();
  const [commitPostDelete, isPostDeleteLoading] =
    useMutation<ModalPostDeleteMutationType>(ModalPostDeleteMutation);

  const handleDeletePost = () => {
    commitPostDelete({
      variables: {
        input: {
          id: postId
        }
      },
      onCompleted: (_, error) => {
        if (error) {
          toast({
            title: error[0].message,
            status: 'error',
            duration: 4000,
            isClosable: true
          });
          return;
        }

        window.location.reload(); // TODO: maybe change this
        onClose();
      },
      onError: () => {
        toast({
          title: 'Um erro inesperado aconteceu. Tente novamente',
          status: 'error',
          duration: 4000,
          isClosable: true
        });
      }
    });
  };

  return (
    <Modal size="xs" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody p="0">
          <Button
            bg="transparent"
            w="100%"
            fontSize="14px"
            color="red"
            borderRadius="0.25px"
            _hover={{ bg: 'transparent' }}
            isLoading={isPostDeleteLoading}
            onClick={handleDeletePost}
          >
            Excluir
          </Button>
          <Button
            bg="transparent"
            w="100%"
            fontSize="14px"
            fontWeight="normal"
            borderTop="1px solid lightgrey"
            _hover={{ bg: 'transparent' }}
            onClick={onClose}
          >
            Cancelar
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
