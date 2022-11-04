import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  InputProps,
  Text,
  VStack
} from '@chakra-ui/react';
import { Field, Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useCallback, useState } from 'react';

import clonegramLogo from '@/assets/clonegram-logo.png';
import { ErrorMessage } from '@/shared/ErrorMessage';

export default function SignupPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      fullname: '',
      username: '',
      password: ''
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('Email inválido')
        .required('Email é obrigatório'),
      fullname: Yup.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
      username: Yup.string()
        .min(3, 'Nome de usuário deve ter pelo menos 3 caracteres')
        .max(20, 'Nome de usuário deve ter no máximo 20 caracteres')
        .required('Nome de usuário é obrigatório'),
      password: Yup.string()
        .min(8, 'Senha deve ter pelo menos 8 caracteres')
        .required('Senha é obrigatório')
    }),
    onSubmit: (values) => {
      // TODO: implement submit feature
      setIsLoading(true);
      console.log(values);
      setIsLoading(false);
    }
  });

  const handleClose = useCallback(() => {
    setError('');
  }, []);

  return (
    <Box
      bg={{ base: 'transparent', md: 'white' }}
      border={{ base: 'none', md: '2px solid rgb(219, 219, 219)' }}
      borderRadius="1px"
      mt="35px"
      mx="auto"
      p="50px 40px"
      maxWidth="350px"
    >
      <VStack spacing="20px">
        <Image src={clonegramLogo} alt="Clonegram Logo" w="175px" />
        <Text
          w="88%"
          color="#8e8e8e"
          textAlign="center"
          fontWeight="semibold"
          fontSize="17px"
        >
          Cadastre-se para ver fotos dos seus amigos.
        </Text>
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
              type="text"
              name="fullname"
              placeholder="Nome Completo"
              error={formik.errors.fullname}
              wasTouched={formik.touched.fullname}
            />
            <InputField
              type="text"
              name="username"
              placeholder="Nome de usuário"
              error={formik.errors.username}
              wasTouched={formik.touched.username}
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
              isLoading={isLoading}
              _hover={{ bg: '#4db5f9' }}
            >
              Cadastre-se
            </Button>
          </VStack>
        </Form>
      </FormikProvider>
    </Box>
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
