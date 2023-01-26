import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button,
  Input,
  useToast
} from '@chakra-ui/react';
import { useRef, ChangeEvent } from 'react';
import { useMutation } from 'react-relay';

import { ProfileAvatarUpdateMutation } from '../../mutations/ProfileAvatarUpdateMutation';
import { ProfileAvatarUpdateMutation as ProfileAvatarUpdateMutationType } from '../../mutations/__generated__/ProfileAvatarUpdateMutation.graphql';
import { ProfileAvatarDeleteMutation } from '../../mutations/ProfileAvatarDeleteMutation';
import { ProfileAvatarDeleteMutation as ProfileAvatarDeleteMutationType } from '../../mutations/__generated__/ProfileAvatarDeleteMutation.graphql';

type AvatarUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  hasAvatar: boolean;
};

export function AvatarUploadModal({
  isOpen,
  onClose,
  userId,
  hasAvatar
}: AvatarUploadModalProps) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [commitAvatarUpdate, isAvatarUpdateLoading] =
    useMutation<ProfileAvatarUpdateMutationType>(ProfileAvatarUpdateMutation);
  const [commitAvatarDelete, isAvatarDeleteLoading] =
    useMutation<ProfileAvatarDeleteMutationType>(ProfileAvatarDeleteMutation);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    commitAvatarUpdate({
      variables: {
        input: {
          id: userId,
          file: null
        }
      },
      uploadables: {
        file: event.target.files[0]
      },
      onCompleted: ({ UserAvatarUpdateMutation }, error) => {
        if (UserAvatarUpdateMutation?.error || error) {
          const errorMessage = error
            ? error[0].message
            : UserAvatarUpdateMutation?.error;
          toast({
            title: errorMessage,
            status: 'error',
            duration: 4000,
            isClosable: true
          });
          return;
        }

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

  const handleDeleteAvatar = () => {
    commitAvatarDelete({
      variables: {
        input: {
          id: userId
        }
      },
      onCompleted: ({ UserAvatarDeleteMutation }, error) => {
        if (UserAvatarDeleteMutation?.error || error) {
          const errorMessage = error
            ? error[0].message
            : UserAvatarDeleteMutation?.error;
          toast({
            title: errorMessage,
            status: 'error',
            duration: 4000,
            isClosable: true
          });
          return;
        }

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
        <ModalHeader textAlign="center" fontWeight="normal" fontSize="17px">
          Alterar foto do perfil
        </ModalHeader>
        <ModalBody p="0">
          <Input
            type="file"
            accept="image/png, image/jpeg"
            hidden
            ref={inputRef}
            onChange={handleFileChange}
          />
          <Button
            bg="transparent"
            w="100%"
            fontSize="14px"
            color="#0095f6"
            borderTop="1px solid lightgrey"
            borderRadius="0.25px"
            _hover={{ bg: 'transparent' }}
            isLoading={isAvatarUpdateLoading}
            onClick={() => inputRef.current?.click()}
          >
            Carregar foto
          </Button>

          {hasAvatar && (
            <Button
              bg="transparent"
              w="100%"
              fontSize="14px"
              color="red"
              borderTop="1px solid lightgrey"
              borderRadius="0.25px"
              _hover={{ bg: 'transparent' }}
              isLoading={isAvatarDeleteLoading}
              onClick={handleDeleteAvatar}
            >
              Remover foto atual
            </Button>
          )}
        </ModalBody>

        <ModalFooter p="0">
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
