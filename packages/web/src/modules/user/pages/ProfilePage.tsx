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
import { useLazyLoadQuery, useMutation } from 'react-relay';
import { useParams, useNavigate, NavigateFunction } from 'react-router-dom';

import { ProfileGetQuery } from '../queries/ProfileGetQuery';
import { ProfileGetQuery as ProfileGetQueryType } from '../queries/__generated__/ProfileGetQuery.graphql';
import { ProfileFollowMutation } from '../mutations/ProfileFollowMutation';
import { ProfileFollowMutation as ProfileFollowMutationType } from '../mutations/__generated__/ProfileFollowMutation.graphql';
import { ProfileUnfollowMutation } from '../mutations/ProfileUnfollowMutation';
import { ProfileUnfollowMutation as ProfileUnfollowMutationType } from '../mutations/__generated__/ProfileUnfollowMutation.graphql';
import { useAuth } from '@/modules/auth/AuthContext';
import { Header } from '@/shared/Header/Header';

export default function ProfilePage() {
  const { username } = useParams();
  const { GetUserQuery, me } = useLazyLoadQuery<ProfileGetQueryType>(
    ProfileGetQuery,
    {
      username: username ?? ''
    },
    { fetchPolicy: 'store-and-network' }
  );
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [commitFollow, isFollowLoading] =
    useMutation<ProfileFollowMutationType>(ProfileFollowMutation);
  const [commitUnfollow, isUnfollowLoading] =
    useMutation<ProfileUnfollowMutationType>(ProfileUnfollowMutation);

  if (!GetUserQuery) {
    return (
      <>
        <Header me={me} />
        <Center height="90vh" fontSize="xl">
          Esse usuário não existe
        </Center>
      </>
    );
  }

  const handleFollowButton = () => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    const isFollowing = GetUserQuery.followed_by_viewer;
    const config = {
      variables: {
        input: {
          followeeId: GetUserQuery.id
        }
      },
      optimisticResponse: {
        UserFollowMutation: {
          followee: {
            id: GetUserQuery.id,
            followers_count:
              GetUserQuery.followers_count + (isFollowing ? -1 : 1),
            followed_by_viewer: !isFollowing
          }
        }
      }
    };

    const mutation = isFollowing ? commitUnfollow : commitFollow;
    mutation(config);
  };

  return (
    <>
      <Header me={me} />
      <Container maxW="870px" p="unset">
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
                <UnfollowButton
                  handleUnfollow={handleFollowButton}
                  isLoading={isUnfollowLoading}
                />
              ) : (
                <FollowButton
                  handleFollow={handleFollowButton}
                  isLoading={isFollowLoading}
                />
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
                publicaç{GetUserQuery.posts_count == 1 ? 'ão' : 'ões'}
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
      </Container>
    </>
  );
}

const FollowButton = ({
  handleFollow,
  isLoading
}: {
  handleFollow: VoidFunction;
  isLoading: boolean;
}) => (
  <Button
    fontSize="14px"
    bg="#0095f6"
    color="white"
    px="6"
    size="sm"
    _hover={{ bg: '#1aa0f7' }}
    isLoading={isLoading}
    onClick={handleFollow}
  >
    Seguir
  </Button>
);

const UnfollowButton = ({
  handleUnfollow,
  isLoading
}: {
  handleUnfollow: VoidFunction;
  isLoading: boolean;
}) => (
  <Button
    fontSize="14px"
    bg="#transparent"
    px="6"
    border="1px solid lightgray"
    size="sm"
    _hover={{ bg: 'transparent' }}
    isLoading={isLoading}
    onClick={handleUnfollow}
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
