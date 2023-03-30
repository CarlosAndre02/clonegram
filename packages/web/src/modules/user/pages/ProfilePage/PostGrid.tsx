import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { ChatCircle, DotsThreeOutline, Heart } from 'phosphor-react';
import { useRef, useState } from 'react';
import { useFragment } from 'react-relay';
import { Link as ReactLink } from 'react-router-dom';
import moment from 'moment';

import { PostGridFragment } from './PostGridFragment';
import type {
  PostGridFragment_user$key,
  PostGridFragment_user$data
} from './__generated__/PostGridFragment_user.graphql';
import { PostGridMeFragment } from './PostGridMeFragment';
import type { PostGridMeFragment_user$key } from './__generated__/PostGridMeFragment_user.graphql';
import { PostModalOptions } from './PostModalOptions';

type PostGridProps = {
  GetUserQuery: PostGridFragment_user$key | null;
  me: PostGridMeFragment_user$key | null;
};

type Post = PostGridFragment_user$data['posts']['edges'][0];

export const PostGrid = ({ GetUserQuery, me }: PostGridProps) => {
  const [post, setPost] = useState<Post | null>(null);
  const data = useFragment(PostGridFragment, GetUserQuery);
  const meData = useFragment(PostGridMeFragment, me);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOptionsOpen,
    onOpen: onOpenModalOptions,
    onClose: onCloseModalOptions
  } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);

  const onOpenPostModal = (postModal: Post) => {
    setPost(postModal);
    onOpen();
  };

  return (
    <>
      <Grid templateColumns="repeat(3, 1fr)" gap={{ base: 1, md: 5 }}>
        {data?.posts?.edges?.map((edge) => {
          return (
            <GridItem
              key={edge?.node?.id ?? ''}
              className="grid-item"
              h={{ base: '140px', sm: '200px', md: '270px' }}
              cursor="pointer"
              position="relative"
              onClick={() => {
                edge && onOpenPostModal(edge);
              }}
            >
              <Image
                src={edge?.node?.imageUrl}
                alt="Post photo"
                minWidth="100%"
                h="100%"
                objectFit="cover"
              />
              <Box
                w="100%"
                h="100%"
                bg="#262626"
                opacity="0.5"
                position="absolute"
                top="0"
                bottom="0"
                left="0"
                right="0"
                visibility="hidden"
                sx={{
                  '.grid-item:hover &': { visibility: 'visible' }
                }}
                zIndex="1"
              ></Box>
              <Center
                h="100%"
                position="absolute"
                top="0"
                bottom="0"
                left="0"
                right="0"
                visibility="hidden"
                sx={{
                  '.grid-item:hover &': { visibility: 'visible' }
                }}
                zIndex="2"
              >
                <Flex align="center" direction={{ base: 'column', md: 'row' }}>
                  <Flex align="center" mr={{ base: 'unset', md: '30px' }}>
                    <Heart size="22" color="white" weight="fill" />
                    <Text ml="6px" fontSize="17px" color="white">
                      {edge?.node?.likes_count}
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <ChatCircle size="22" color="white" weight="fill" />
                    <Text ml="6px" fontSize="17px" color="white">
                      {edge?.node?.comments_count}
                    </Text>
                  </Flex>
                </Flex>
              </Center>
            </GridItem>
          );
        })}
      </Grid>
      <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
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
                      src={data?.avatarUrl ?? undefined}
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
                      {data?.username}
                    </Text>
                  </Flex>
                  {data?.username == meData?.username && (
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
                    <Flex align="center">
                      <Avatar
                        src={data?.avatarUrl ?? undefined}
                        size="xs"
                        mr="15px"
                        mt="5px"
                        alignSelf="flex-start"
                      />
                      <Box>
                        <Text fontSize="13px" wordBreak="break-word">
                          <Link
                            as={ReactLink}
                            mr="6px"
                            color="blackAlpha.800"
                            fontWeight="black"
                            transition="ease-in 0.1s"
                            _hover={{ color: 'blackAlpha.500' }}
                            to={`/${data?.username}`}
                          >
                            {data?.username}
                          </Link>
                          {post?.node?.description}
                        </Text>
                        <Text fontSize="10px" color="gray">
                          {`${moment(
                            new Date(post?.node?.createdAt ?? ''),
                            'MMDD'
                          ).fromNow()}`}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                  <Box p="10px 15px" borderTop="1px solid lightgray">
                    <HStack mb="10px" spacing="3">
                      <Heart size="25" color="black" cursor="pointer" />
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
    </>
  );
};
