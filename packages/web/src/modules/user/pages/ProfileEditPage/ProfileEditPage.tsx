import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  Flex,
  Textarea,
  useToast,
  Avatar,
  HStack,
  Box,
  useDisclosure
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { Field, Form, FormikProvider, useFormik } from 'formik';
import { useLazyLoadQuery, useMutation } from 'react-relay';

import { ProfileEditGetQuery } from '../../queries/ProfileEditGetQuery';
import { ProfileEditGetQuery as ProfileEditGetQueryType } from '../../queries/__generated__/ProfileEditGetQuery.graphql';
import { UserUpdateMutation } from '../../mutations/UserUpdateMutation';
import { UserUpdateMutation as UserUpdateMutationType } from '../../mutations/__generated__/UserUpdateMutation.graphql';
import { AvatarUploadModal } from './AvatarUploadModal';
import { Header } from '@/shared/Header';

export default function ProfileEditPage() {
  const { me } = useLazyLoadQuery<ProfileEditGetQueryType>(
    ProfileEditGetQuery,
    {}
  );
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [commitUserUpdate, isMutationLoading] =
    useMutation<UserUpdateMutationType>(UserUpdateMutation);

  const formik = useFormik({
    initialValues: {
      fullname: me?.fullname ?? '',
      biography: me?.biography ?? ''
    },
    validationSchema: Yup.object().shape({
      fullname: Yup.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
      biography: Yup.string().max(
        100,
        'Biografia deve ter no máximo 100 caracteres'
      )
    }),
    onSubmit: ({ fullname, biography }) => {
      commitUserUpdate({
        variables: {
          input: {
            id: me?.id ?? '',
            fullname: fullname || null,
            biography: biography || null
          }
        },
        onCompleted: ({ UserUpdateMutation }, error) => {
          if (UserUpdateMutation?.error || error) {
            const errorMessage = error
              ? error[0].message
              : UserUpdateMutation?.error;
            toast({
              title: errorMessage,
              status: 'error',
              duration: 2500,
              isClosable: true
            });
            return;
          }

          formik.setFieldValue(
            'fullname',
            UserUpdateMutation?.user?.fullname ?? ''
          );
          formik.setFieldValue(
            'biography',
            UserUpdateMutation?.user?.biography ?? ''
          );
          toast({
            title: 'Informações salvas.',
            status: 'success',
            duration: 2500,
            isClosable: true
          });
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
    }
  });

  return (
    <>
      <Header />
      <Container
        maxW="900px"
        w={{ base: '95vw', lg: 'unset' }}
        mt="25px"
        py="35px"
        px={{ base: '25px', md: '60px' }}
        border="1px solid lightgray"
        bg="white"
      >
        <FormikProvider value={formik}>
          <Form>
            <Flex direction="column">
              <HStack mb="25px" spacing="0">
                <Flex
                  w={{ base: 'max-content', md: '84px' }}
                  mr="37px"
                  justify="flex-end"
                  align="flex-start"
                >
                  <Avatar
                    w="38px"
                    h="38px"
                    bg="lightgrey"
                    src={me?.avatarUrl ?? undefined}
                  />
                </Flex>
                <Box>
                  <Text wordBreak="break-word">{me?.username}</Text>
                  <Button
                    h="max-content"
                    m="0"
                    p="0"
                    fontSize="13px"
                    bg="transparent"
                    color="#0095f6"
                    _hover={{ bg: 'initial', color: '#1c1e21' }}
                    _active={{ color: 'grey' }}
                    onClick={onOpen}
                  >
                    Alterar foto do perfil
                  </Button>
                  <AvatarUploadModal
                    isOpen={isOpen}
                    onClose={onClose}
                    userId={me?.id ?? ''}
                    hasAvatar={!!me?.avatarUrl}
                  />
                </Box>
              </HStack>
              <Flex direction={{ base: 'column', md: 'row' }} mb="25px">
                <Flex
                  w={{ base: 'max-content', md: '100px' }}
                  mr="35px"
                  mb="10px"
                  justify="flex-end"
                  align="flex-start"
                >
                  <Text fontSize="14px" fontWeight="bold">
                    Nome
                  </Text>
                </Flex>
                <FormControl
                  isInvalid={
                    formik.touched.fullname && !!formik.errors.fullname
                  }
                >
                  <Field
                    as={Input}
                    type="text"
                    name="fullname"
                    maxW="350px"
                    h="30px"
                    bg="transparent"
                    fontSize="14px"
                    border="1px solid"
                    borderColor="lightgray"
                    _focus={{ borderColor: 'gray' }}
                    _placeholder={{ color: 'gray' }}
                  />
                  <FormErrorMessage>{formik.errors.fullname}</FormErrorMessage>
                </FormControl>
              </Flex>
              <Flex direction={{ base: 'column', md: 'row' }}>
                <Flex
                  w={{ base: 'max-content', md: '100px' }}
                  mr="35px"
                  mb="10px"
                  justify="flex-end"
                  align="flex-start"
                >
                  <Text fontSize="14px" fontWeight="bold">
                    Biografia
                  </Text>
                </Flex>
                <FormControl
                  isInvalid={
                    formik.touched.biography && !!formik.errors.biography
                  }
                >
                  <Field
                    as={Textarea}
                    type="text"
                    name="biography"
                    resize="none"
                    maxW="350px"
                    h="60px"
                    fontSize="14px"
                    border="1px solid"
                    borderColor="lightgray"
                    _focus={{ borderColor: 'gray' }}
                    _placeholder={{ color: 'gray' }}
                  />
                  <FormErrorMessage>{formik.errors.biography}</FormErrorMessage>
                </FormControl>
              </Flex>
              <Button
                type="submit"
                w={{ md: '60px' }}
                maxW="350px"
                ml={{ md: '120px' }}
                mt="15px"
                p="15px"
                bg="#0095f6"
                color="white"
                size="xs"
                isLoading={isMutationLoading}
                _hover={{ bg: '#4db5f9' }}
              >
                Enviar
              </Button>
            </Flex>
          </Form>
        </FormikProvider>
      </Container>
    </>
  );
}
