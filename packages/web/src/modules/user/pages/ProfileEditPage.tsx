import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  Flex,
  Textarea,
  useToast
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { Field, Form, FormikProvider, useFormik } from 'formik';
import { useLazyLoadQuery, useMutation } from 'react-relay';
import { useState } from 'react';

import { UserEditGetQuery } from '../queries/UserEditGetQuery';
import { UserEditGetQuery as UserEditGetQueryType } from '../queries/__generated__/UserEditGetQuery.graphql';
import { UserUpdateMutation as UserUpdateMutationType } from '../mutations/__generated__/UserUpdateMutation.graphql';
import { UserUpdateMutation } from '../mutations/UserUpdateMutation';

export default function ProfileEditPage() {
  const toast = useToast();
  const username = 'messi123'; // TODO: This username should come from logged user
  const { GetUserQuery } = useLazyLoadQuery<UserEditGetQueryType>(
    UserEditGetQuery,
    {
      username: username ?? ''
    }
  );
  // not sure about this
  const [fullname, setFullname] = useState(GetUserQuery?.fullname ?? '');
  const [biography, setBiography] = useState(GetUserQuery?.biography ?? '');
  const [commitUserUpdate, isMutationLoading] =
    useMutation<UserUpdateMutationType>(UserUpdateMutation);

  const formik = useFormik({
    initialValues: {
      fullname: fullname,
      biography: biography
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
            id: GetUserQuery?.id ?? '',
            fullname: fullname || null,
            biography: biography || null
          }
        },
        onCompleted: ({ UserUpdateMutation }) => {
          if (UserUpdateMutation?.error) {
            toast({
              title: UserUpdateMutation?.error,
              status: 'error',
              duration: 2500,
              isClosable: true
            });
            return;
          }

          setFullname(UserUpdateMutation?.user?.fullname ?? '');
          setBiography(UserUpdateMutation?.user?.biography ?? '');

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
            <Flex direction={{ base: 'column', md: 'row' }}>
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
                isInvalid={formik.touched.fullname && !!formik.errors.fullname}
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
            <Flex direction={{ base: 'column', md: 'row' }} mt="25px">
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
  );
}
