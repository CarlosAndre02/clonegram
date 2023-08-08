import {
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Image,
  Flex,
  Text,
  Avatar,
  Box,
  HStack,
  Input,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import { ChatCircle, DotsThreeOutline, Heart } from 'phosphor-react';
import { UseMutationConfig, useMutation } from 'react-relay';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import { ModalLikePostMutation } from './mutations/ModalLikePostMutation';
import { ModalLikePostMutation as ModalLikePostMutationType } from './mutations/__generated__/ModalLikePostMutation.graphql';
import { ModalUnlikePostMutation } from './mutations/ModalUnlikePostMutation';
import { ModalUnlikePostMutation as ModalUnlikePostMutationType } from './mutations/__generated__/ModalUnlikePostMutation.graphql';
import { ModalCommentPostMutation } from './mutations/ModalCommentPostMutation';
import { ModalCommentPostMutation as ModalCommentPostMutationType } from './mutations/__generated__/ModalCommentPostMutation.graphql';
import { Comment } from './Comment';
import { PostModalOptions } from './PostModalOptions';
import { useAuth } from '@/modules/auth/AuthContext';

type PostModalProps = {
  isOpenModal: boolean;
  onCloseModal: VoidFunction;
  selectedPost: any;
  meUsername: string | null | undefined;
};

export type Post = {
  node: {
    id: string;
    description: string | null | undefined;
    imageUrl: string;
    comments_count: number;
    likes_count: number;
    liked_by_viewer: boolean;
    createdAt: string | null;
    comments: any;
    user: {
      username: string | null | undefined;
      avatarUrl: string | null | undefined;
    };
  } | null;
} | null;

type CommentType = {
  node:
    | {
        id: string;
        user: {
          id: string;
          username: string;
          avatarUrl: string | null;
        };
        content: string;
        createdAt: string | null;
      }
    | null
    | undefined;
};

export const PostModal = ({
  isOpenModal,
  onCloseModal,
  selectedPost,
  meUsername
}: PostModalProps) => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const {
    isOpen: isModalOptionsOpen,
    onOpen: onOpenModalOptions,
    onClose: onCloseModalOptions
  } = useDisclosure();
  const [commitLikePost] = useMutation<ModalLikePostMutationType>(
    ModalLikePostMutation
  );
  const [commitUnlikePost] = useMutation<ModalUnlikePostMutationType>(
    ModalUnlikePostMutation
  );
  const [commitCommentPost, isCommentLoading] =
    useMutation<ModalCommentPostMutationType>(ModalCommentPostMutation);

  useEffect(() => {
    if (!selectedPost || post) return;
    setPost(selectedPost);

    if (!selectedPost?.node?.comments) return;
    setComments(selectedPost.node.comments.edges);
  }, [post, selectedPost]);

  const handleLikeButton = () => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    if (!post?.node) return;

    const likesCount = post.node.likes_count;
    const hasLiked = post.node.liked_by_viewer;

    const config: UseMutationConfig<ModalLikePostMutationType> &
      UseMutationConfig<ModalUnlikePostMutationType> = {
      variables: {
        input: {
          postId: post.node.id
        }
      },
      onCompleted: (_, error) => {
        if (error) {
          if (!post?.node) return;
          setPost({
            node: {
              ...post.node,
              likes_count: likesCount,
              liked_by_viewer: hasLiked
            }
          });
        }
      }
    };

    setPost({
      node: {
        ...post.node,
        likes_count: likesCount + (hasLiked ? -1 : 1),
        liked_by_viewer: !hasLiked
      }
    });

    const mutation = hasLiked ? commitUnlikePost : commitLikePost;
    mutation(config);
  };

  const handleComment = () => {
    if (!post?.node || !inputRef?.current?.value) return;

    if (inputRef.current.value.length < 3) return;

    commitCommentPost({
      variables: {
        input: {
          postId: post.node.id,
          content: inputRef.current.value
        }
      },
      onCompleted: ({ CommentCreateMutation }, error) => {
        if (error) {
          return;
        }

        if (inputRef.current) inputRef.current.value = '';
        setComments([
          {
            node: CommentCreateMutation?.comment
          },
          ...comments
        ]);
      }
    });
  };

  const onCloseModalCustom = useCallback(() => {
    setPost(null);
    onCloseModal();
  }, [onCloseModal]);

  return (
    <Modal size="5xl" isOpen={isOpenModal} onClose={onCloseModalCustom}>
      <ModalOverlay>
        <ModalCloseButton size="lg" color="white" />
      </ModalOverlay>
      <ModalContent m="30px 50px 20px" h={{ base: '720px', md: '650px' }}>
        <ModalBody p="0" h="100%">
          <Grid
            templateAreas={{
              base: '"header" "photo" "comments"',
              md: `"photo header"
                  "photo comments"`
            }}
            gridTemplateColumns={{ md: '60% 1fr' }}
            gridTemplateRows={{
              base: '50px 40% 1fr',
              md: '50px 1fr'
            }}
            w="100%"
            h="100%"
          >
            <GridItem area="photo">
              <Image
                src={post?.node?.imageUrl}
                alt="Post photo"
                minWidth="100%"
                h="100%"
                objectFit="cover"
              />
            </GridItem>
            <GridItem
              area="header"
              borderBottom="1px solid lightgray"
              borderLeft={{ md: '1px solid lightgray' }}
            >
              <Flex h="100%" px="15px" align="center" justify="space-between">
                <Flex align="center">
                  <Avatar
                    src={post?.node?.user.avatarUrl ?? undefined}
                    size="xs"
                    mr="15px"
                  />
                  <Text
                    fontSize="13px"
                    color="blackAlpha.800"
                    fontWeight="black"
                    transition="ease-in 0.1s"
                    _hover={{ color: 'blackAlpha.500' }}
                  >
                    {post?.node?.user.username}
                  </Text>
                </Flex>
                {post?.node?.user.username == meUsername && (
                  <>
                    <DotsThreeOutline
                      size={15}
                      weight="fill"
                      cursor="pointer"
                      onClick={onOpenModalOptions}
                    />
                    <PostModalOptions
                      isOpen={isModalOptionsOpen}
                      onClose={onCloseModalOptions}
                      postId={post?.node?.id ?? ''}
                    />
                  </>
                )}
              </Flex>
            </GridItem>
            <GridItem
              area="comments"
              borderLeft={{ md: '1px solid lightgray' }}
            >
              <Flex direction="column" h="100%">
                <Box
                  p="15px"
                  h={{ base: '230px', md: '450px' }}
                  overflowY="auto"
                  sx={{
                    '&::-webkit-scrollbar': {
                      display: 'none'
                    },
                    '&': {
                      '-ms-overflow-style': 'none',
                      'scrollbar-width': 'none'
                    }
                  }}
                >
                  <Comment
                    avatar={post?.node?.user.avatarUrl}
                    username={post?.node?.user.username}
                    content={post?.node?.description}
                    createdAt={post?.node?.createdAt}
                    onCloseModal={onCloseModal}
                  />
                  {comments?.map((edge) => {
                    return (
                      <Comment
                        key={edge?.node?.id}
                        avatar={edge?.node?.user.avatarUrl}
                        username={edge?.node?.user.username}
                        content={edge?.node?.content}
                        createdAt={edge?.node?.createdAt}
                        onCloseModal={onCloseModal}
                      />
                    );
                  })}
                </Box>
                <Box p="10px 15px" borderTop="1px solid lightgray">
                  <HStack mb="10px" spacing="3">
                    <Box>
                      <Heart
                        size="25"
                        cursor="pointer"
                        weight={
                          post?.node?.liked_by_viewer ? 'fill' : undefined
                        }
                        color={post?.node?.liked_by_viewer ? 'red' : undefined}
                        onClick={handleLikeButton}
                      />
                    </Box>
                    <ChatCircle
                      size="25"
                      color="black"
                      cursor="pointer"
                      onClick={() => inputRef.current?.focus()}
                    />
                  </HStack>
                  <Box
                    mb="5px"
                    fontSize="13px"
                    color="blackAlpha.800"
                    fontWeight="black"
                  >
                    {post?.node?.likes_count} curtida
                    {post?.node?.likes_count != 1 && 's'}
                  </Box>
                  <Box
                    mb="15px"
                    fontSize="9px"
                    color="gray"
                    textTransform="uppercase"
                  >
                    {`${moment(new Date(post?.node?.createdAt ?? '')).format(
                      'MMMM DD'
                    )}`}
                  </Box>
                  <Flex align="center">
                    <Input
                      ref={inputRef}
                      p="0"
                      fontSize="12px"
                      border="none"
                      placeholder="Adicione um comentário..."
                      _placeholder={{ color: 'gray', fontSize: '12px' }}
                      _focus={{ boxShadow: 'none' }}
                    />
                    <Button
                      size="xs"
                      variant="ghost"
                      color="#66bffa"
                      _hover={{ bg: 'none', color: '#002d4a' }}
                      onClick={handleComment}
                      isLoading={isCommentLoading}
                    >
                      Publicar
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            </GridItem>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
