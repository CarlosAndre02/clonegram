import {
  Box,
  Flex,
  Image,
  Button,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  Icon
} from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { House } from 'phosphor-react';
import { useFragment } from 'react-relay';
import { useNavigate, Link as ReactLink } from 'react-router-dom';

import { HeaderFragment } from './HeaderFragment';
import type {
  HeaderFragment_user$key,
  HeaderFragment_user$data
} from './__generated__/HeaderFragment_user.graphql';
import { useAuth } from '@/modules/auth/AuthContext';
import clonegramLogo from '@/assets/clonegram-logo.png';

type HeaderProps = {
  me: HeaderFragment_user$key | null;
};

export function Header({ me }: HeaderProps) {
  const data = useFragment(HeaderFragment, me);

  return (
    <Box borderBottom="1px solid lightgray" bg="white">
      <Flex
        maxW="870px"
        m="0 auto"
        h="50px"
        px="15px"
        align="center"
        justify="space-between"
      >
        <ReactLink to="/">
          <Image src={clonegramLogo} alt="Clonegram Logo" w="120px" h="27px" />
        </ReactLink>
        {data ? <ButtonsLoggedIn data={data} /> : <ButtonsNotLoggedIn />}
      </Flex>
    </Box>
  );
}

const ButtonsLoggedIn = ({ data }: { data: HeaderFragment_user$data }) => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  return (
    <Flex align="center">
      <Icon
        as={House}
        boxSize="7"
        weight="bold"
        cursor="pointer"
        borderRadius="100%"
        transition="0.2s ease-in"
        _hover={{ bg: '#f2f2f2' }}
        onClick={() => window.location.reload()}
      />
      <PlusSquareIcon
        boxSize="7"
        mx="30px"
        cursor="pointer"
        transition="0.2s ease-in"
        _hover={{ bg: '#f2f2f2' }}
        onClick={() => window.location.reload()}
      />
      <Popover>
        <PopoverTrigger>
          <Avatar
            as="button"
            src={data.avatarUrl || undefined}
            bg="lightgray"
            size="xs"
            cursor="pointer"
          />
        </PopoverTrigger>
        <PopoverContent w="140px">
          <PopoverBody p="0">
            <VStack spacing="0">
              <PopoverOption onClick={() => navigate(`/${data.username}`)}>
                Perfil
              </PopoverOption>
              <PopoverOption onClick={() => navigate('/profile/edit')}>
                Configurações
              </PopoverOption>
              <PopoverOption onClick={() => logoutUser(() => navigate('/'))}>
                Sair
              </PopoverOption>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};

const ButtonsNotLoggedIn = () => {
  return (
    <Box>
      <Button
        size="sm"
        bg="#0095f6"
        color="white"
        mr="10px"
        _hover={{ bg: '#4db5f9' }}
      >
        <ReactLink to="/">Entrar</ReactLink>
      </Button>
      <Button size="sm" color="#0095f6" variant="ghost">
        <ReactLink to="/signup">Cadastre-se</ReactLink>
      </Button>
    </Box>
  );
};

const PopoverOption = ({
  children,
  onClick
}: {
  children: string;
  onClick: VoidFunction;
}) => {
  return (
    <Button
      w="100%"
      fontSize="14px"
      fontWeight="normal"
      bg="white"
      borderRadius="0"
      borderBottom="1px solid lightgray"
      _hover={{ bg: '#f2f2f2' }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
