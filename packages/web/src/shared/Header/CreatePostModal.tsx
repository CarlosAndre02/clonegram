import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  Box,
  Center,
  VStack,
  Image,
  Flex,
  Textarea,
  Avatar,
  useToast
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useDropzone } from 'react-dropzone';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useMutation } from 'react-relay';

import { CreatePostMutation } from './CreatePostMutation';
import { CreatePostMutation as CreatePostMutationType } from './__generated__/CreatePostMutation.graphql';
import createPostImage from '@/assets/create-post-image.svg';

type CreatePostModalProps = {
  isOpen: boolean;
  onClose: VoidFunction;
  user: {
    avatar: string | null | undefined;
    username: string;
  };
};

type Photo = {
  src: Blob;
  url: string;
};

type ModalStep = 'UploadPhoto' | 'PostPhoto';

export const CreatePostModal = ({
  isOpen,
  onClose,
  user
}: CreatePostModalProps) => {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [description, setDescription] = useState('');
  const [modalStep, setModalStep] = useState<ModalStep>('UploadPhoto');
  const toast = useToast();
  const [commitPostCreate, isPostCreateLoading] =
    useMutation<CreatePostMutationType>(CreatePostMutation);

  const onDropAccepted = useCallback((acceptedFiles: any[]) => {
    setPhoto({
      src: acceptedFiles[0],
      url: URL.createObjectURL(acceptedFiles[0])
    });
    setModalStep('PostPhoto');
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    maxFiles: 1,
    accept: {
      'image/*': ['.png', '.jpeg']
    },
    onDropAccepted
  });

  const resetModalStates = useCallback(() => {
    setPhoto(null);
    setModalStep('UploadPhoto');
  }, []);

  const closeModal = useCallback(() => {
    onClose();
    resetModalStates();
  }, [resetModalStates, onClose]);

  const handlePostCreate = useCallback(() => {
    if (!photo || description.length < 3) return;

    commitPostCreate({
      variables: {
        input: {
          description,
          file: null
        }
      },
      uploadables: {
        file: photo.src
      },
      onCompleted: (_, error) => {
        if (error) return;

        closeModal();
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
  }, [photo, description, commitPostCreate, closeModal, toast]);

  const modalSize: Record<ModalStep, any> = {
    UploadPhoto: {
      maxW: '500px',
      height: '500px'
    },
    PostPhoto: {
      maxW: '850px',
      height: '550px'
    }
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay>
        <ModalCloseButton size="lg" color="white" />
      </ModalOverlay>
      <ModalContent
        maxW={modalSize[modalStep].maxW}
        h={modalSize[modalStep].height}
        mx="15px"
      >
        <ModalHeader p="0" borderBottom="1px solid lightgray">
          <Flex
            w="100%"
            h="100%"
            p="8px"
            align="center"
            justify={modalStep == 'UploadPhoto' ? 'center' : 'space-between'}
          >
            {modalStep == 'PostPhoto' && (
              <Button
                size="xs"
                variant="ghost"
                _hover={{ bg: 'none' }}
                onClick={resetModalStates}
              >
                <ArrowBackIcon boxSize="6" />
              </Button>
            )}
            <Text fontSize="14px" fontWeight="semibold" textAlign="center">
              Criar nova publicação
            </Text>
            {modalStep == 'PostPhoto' && (
              <Button
                size="xs"
                variant="ghost"
                color="#0095f6"
                fontSize="13px"
                fontWeight="normal"
                _hover={{ bg: 'none', color: '#1D3C78' }}
                isDisabled={isPostCreateLoading}
                onClick={handlePostCreate}
              >
                Compartilhar
              </Button>
            )}
          </Flex>
        </ModalHeader>
        <ModalBody p="0">
          {modalStep == 'UploadPhoto' ? (
            <UploadPhotoStep
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              open={open}
            />
          ) : (
            <PostPhotoStep
              photo={photo}
              avatar={user.avatar}
              username={user.username}
              description={description}
              setDescription={setDescription}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const UploadPhotoStep = ({
  getRootProps,
  getInputProps,
  open
}: {
  getRootProps: any;
  getInputProps: any;
  open: any;
}) => (
  <Center {...getRootProps()} w="100%" h="100%" outline="none">
    <VStack spacing="4">
      <input {...getInputProps()} />
      <Image src={createPostImage} />
      <Text>Arraste as fotos e os vídeos aqui</Text>
      <Button
        w="80%"
        bg="#0095f6"
        color="white"
        size="xs"
        _hover={{ bg: '#4db5f9' }}
        onClick={open}
      >
        Selecionar do computador
      </Button>
    </VStack>
  </Center>
);

const PostPhotoStep = ({
  photo,
  avatar,
  username,
  description,
  setDescription
}: {
  photo: Photo | null;
  avatar: string | null | undefined;
  username: string;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
}) => (
  <Flex h="509px">
    <Box w="65%" borderRight="1px solid lightgray">
      <Image
        src={photo?.url}
        alt="Post photo"
        minWidth="100%"
        h="100%"
        objectFit="cover"
        borderBottomLeftRadius="6px"
      />
    </Box>
    <Box p="15px" w="35%" h="100%">
      <Flex align="center">
        <Avatar src={avatar ?? undefined} size="xs" mr="15px" />
        <Text wordBreak="break-word" fontSize="13px">
          {username}
        </Text>
      </Flex>
      <Textarea
        mt="20px"
        p="0"
        w="100%"
        h="300px"
        resize="none"
        border="none"
        placeholder="Escreva uma legenda..."
        _placeholder={{ color: 'gray', fontSize: '14px' }}
        _focus={{ boxShadow: 'none' }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </Box>
  </Flex>
);
