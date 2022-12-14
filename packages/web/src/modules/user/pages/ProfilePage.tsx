import {
  Avatar,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  Text
} from '@chakra-ui/react';
import { useLazyLoadQuery } from 'react-relay';
import { useParams, useNavigate, NavigateFunction } from 'react-router-dom';

import { ProfileGetQuery } from '../queries/ProfileGetQuery';
import { ProfileGetQuery as ProfileGetQueryType } from '../queries/__generated__/ProfileGetQuery.graphql';

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { GetUserQuery, me } = useLazyLoadQuery<ProfileGetQueryType>(
    ProfileGetQuery,
    {
      username: username ?? ''
    }
  );

  return (
    <Container maxW="870px" p="unset">
      {GetUserQuery ? (
        <Flex p="40px 20px 110px" position="relative">
          <Center minW={{ md: '30%' }} mr="30px">
            <Avatar
              w={{ base: '100px', md: '160px' }}
              h={{ base: '100px', md: '160px' }}
              src={GetUserQuery.avatarUrl || undefined}
            />
          </Center>
          <Flex direction="column">
            <Flex align="center" mb="25px">
              <Heading
                as="h2"
                fontSize="28px"
                fontWeight="light"
                mr="8"
                wordBreak="break-word"
                noOfLines={1}
              >
                {GetUserQuery.username}
              </Heading>
              {GetUserQuery.username == me?.username ? (
                <EditProfileButton navigator={navigate} />
              ) : GetUserQuery.followed_by_viewer ? (
                <UnfollowButton />
              ) : (
                <FollowButton />
              )}
            </Flex>

            <HStack
              mb={{ md: '25px' }}
              p={{ base: '8px 30px', md: 'unset' }}
              justify={{ base: 'space-between', md: 'unset' }}
              spacing="50px"
              fontSize={{ base: '14px', md: '16px' }}
              borderY={{ base: '1px solid lightgray', md: 'unset' }}
              position={{ base: 'absolute', md: 'static' }}
              left="0"
              right="0"
              bottom="0"
            >
              <Text
                textAlign="center"
                overflowWrap="normal"
                w={{ base: '60px', md: 'auto' }}
              >
                <Text as="span" fontWeight="semibold">
                  {GetUserQuery.posts_count}
                </Text>{' '}
                publica??{GetUserQuery.posts_count == 1 ? '??o' : '??es'}
              </Text>
              <Text
                textAlign="center"
                overflowWrap="normal"
                w={{ base: '60px', md: 'auto' }}
              >
                <Text as="span" fontWeight="semibold">
                  {GetUserQuery.followers_count}
                </Text>{' '}
                seguidor{GetUserQuery.followers_count != 1 && 'es'}
              </Text>
              <Text
                textAlign="center"
                overflowWrap="normal"
                w={{ base: '60px', md: 'auto' }}
              >
                <Text as="span" fontWeight="semibold">
                  {GetUserQuery.following_count}
                </Text>{' '}
                seguindo
              </Text>
            </HStack>

            {!!GetUserQuery.fullname && (
              <Text fontWeight="semibold" wordBreak="break-word">
                {GetUserQuery.fullname}
              </Text>
            )}
            {!!GetUserQuery.biography && (
              <Text wordBreak="break-word">{GetUserQuery.biography}</Text>
            )}
          </Flex>
          {/* <Divider borderColor="lightgray" /> */}
        </Flex>
      ) : (
        <Center height="100vh" fontSize="xl">
          Esse usu??rio n??o existe
        </Center>
      )}
    </Container>
  );
}

const FollowButton = () => (
  <Button
    fontSize="14px"
    bg="#0095f6"
    color="white"
    px="6"
    size="sm"
    isLoading={false}
    _hover={{ bg: '#1aa0f7' }}
  >
    Seguir
  </Button>
);

const UnfollowButton = () => (
  <Button
    fontSize="14px"
    bg="#transparent"
    px="6"
    border="1px solid lightgray"
    size="sm"
    isLoading={false}
    _hover={{ bg: 'transparent' }}
  >
    Seguindo
  </Button>
);

const EditProfileButton = ({ navigator }: { navigator: NavigateFunction }) => (
  <Button
    fontSize="14px"
    bg="#transparent"
    px="6"
    border="1px solid lightgray"
    size="sm"
    isLoading={false}
    _hover={{ bg: 'transparent' }}
    onClick={() => navigator('/profile/edit')}
  >
    Editar Perfil
  </Button>
);
