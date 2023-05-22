import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  InputProps,
  Text,
  VStack,
  Link,
  Center
} from '@chakra-ui/react';
import { Field, Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useNavigate, Link as ReactLink } from 'react-router-dom';
import { useMutation } from 'react-relay';

import { LoginMutation } from '../mutations/LoginMutation';
import { LoginMutation as LoginMutationType } from '../mutations/__generated__/LoginMutation.graphql';
import { useAuth } from '../AuthContext';
import clonegramLogo from '@/assets/clonegram-logo.png';
import { ErrorMessage } from '@/shared/ErrorMessage';

export default function LoginPage() {
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [commitLogin, isMutationLoading] =
    useMutation<LoginMutationType>(LoginMutation);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('Email inválido')
        .required('Email é obrigatório'),
      password: Yup.string()
        .min(8, 'Senha deve ter pelo menos 8 caracteres')
        .required('Senha é obrigatório')
    }),
    onSubmit: (formValues) => {
      commitLogin({
        variables: {
          input: {
            ...formValues
          }
        },
        onCompleted: ({ AuthLoginMutation }, error) => {
          if (error) {
            setError(error[0].message);
            return;
          }

          if (AuthLoginMutation?.token) {
            const { accessToken, refreshToken, expiresDate } =
              AuthLoginMutation.token;
            loginUser({ accessToken, refreshToken, expiresDate });
            navigate('/home');
          }
        },
        onError: () => {
          setError('Um erro inesperado aconteceu. Tente novamente');
        }
      });
    }
  });

  const handleClose = useCallback(() => {
    setError('');
  }, []);

  return (
    <>
      <Box
        bg={{ base: 'transparent', md: 'white' }}
        border={{ base: 'none', md: '2px solid rgb(219, 219, 219)' }}
        borderRadius="1px"
        mt="35px"
        mx="auto"
        p="50px 40px 35px"
        maxWidth="350px"
      >
        <VStack spacing="20px">
          <Image src={clonegramLogo} alt="Clonegram Logo" w="175px" />
        </VStack>

        {!!error && <ErrorMessage message={error} onCloseAlert={handleClose} />}

        <FormikProvider value={formik}>
          <Form>
            <VStack mt="20px" spacing="8px">
              <InputField
                type="email"
                name="email"
                placeholder="Email"
                error={formik.errors.email}
                wasTouched={formik.touched.email}
              />
              <InputField
                type="password"
                name="password"
                placeholder="Senha"
                error={formik.errors.password}
                wasTouched={formik.touched.password}
              />
              <Button
                type="submit"
                w="100%"
                bg="#0095f6"
                color="white"
                size="sm"
                isLoading={isMutationLoading}
                _hover={{ bg: '#4db5f9' }}
              >
                Entrar
              </Button>
            </VStack>
          </Form>
        </FormikProvider>
      </Box>
      <Center
        bg={{ base: 'transparent', md: 'white' }}
        border={{ base: 'none', md: '2px solid rgb(219, 219, 219)' }}
        borderRadius="1px"
        mt="10px"
        mx="auto"
        p="15px"
        maxWidth="350px"
      >
        <Text fontSize="15px">
          Não tem uma conta?{' '}
          <Link as={ReactLink} to="/signup" color="#0095f6">
            Cadastre-se
          </Link>
        </Text>
      </Center>
    </>
  );
}

type InputFieldProps = InputProps & {
  error: string | undefined;
  wasTouched: boolean | undefined;
};

const InputField = ({ error, wasTouched, ...rest }: InputFieldProps) => (
  <FormControl isInvalid={wasTouched && !!error}>
    <Field
      {...rest}
      as={Input}
      bg="#fafafa"
      fontSize="14px"
      border="1px solid"
      borderColor="lightgray"
      _focus={{ borderColor: 'gray' }}
      _placeholder={{ color: 'gray' }}
    />
    <FormErrorMessage>{error}</FormErrorMessage>
  </FormControl>
);
