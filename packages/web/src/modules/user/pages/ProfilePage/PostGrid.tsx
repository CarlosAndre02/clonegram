import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { ChatCircle, Heart } from 'phosphor-react';
import { useFragment } from 'react-relay';
import { useState } from 'react';

import { PostGridFragment } from './PostGridFragment';
import type {
  PostGridFragment_user$key,
  PostGridFragment_user$data
} from './__generated__/PostGridFragment_user.graphql';
import { PostGridMeFragment } from './PostGridMeFragment';
import type { PostGridMeFragment_user$key } from './__generated__/PostGridMeFragment_user.graphql';
import { PostModal } from '@/shared/PostModal/PostModal';

type PostGridProps = {
  GetUserQuery: PostGridFragment_user$key | null;
  me: PostGridMeFragment_user$key | null;
};

type Post = PostGridFragment_user$data['posts']['edges'][0];

export const PostGrid = ({ GetUserQuery, me }: PostGridProps) => {
  const data = useFragment(PostGridFragment, GetUserQuery);
  const meData = useFragment(PostGridMeFragment, me);
  const [post, setPost] = useState<Post | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <PostModal
        isOpenModal={isOpen}
        onCloseModal={onClose}
        selectedPost={post}
        authorUsername={data?.username}
        authorAvatarUrl={data?.avatarUrl}
        meUsername={meData?.username}
      />
    </>
  );
};
