import { Avatar, Box, Flex, Link, Text, Image, HStack } from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';
import { Heart, ChatCircle } from 'phosphor-react';
import moment from 'moment';

type TimelinePostProps = {
  onOpenPostModal: VoidFunction;
  post: {
    user: {
      username: string;
      avatarUrl: string;
    };
    id: string;
    imageUrl: string;
    description: string;
    comments_count: number;
    likes_count: number;
    liked_by_viewer: boolean;
    createdAt: string;
    comments: {
      edges: {
        node: {
          user: {
            username: string;
          };
          content: string;
        };
      }[];
    };
  };
};

export const TimelinePost = ({ onOpenPostModal, post }: TimelinePostProps) => {
  return (
    <Box>
      <Box mb="20px">
        <Flex align="center" px="5px" mb="8px">
          <Avatar src={post.user.avatarUrl ?? undefined} size="sm" mr="15px" />
          <Link
            as={ReactLink}
            mr="9px"
            color="blackAlpha.800"
            fontSize="14px"
            fontWeight="black"
            transition="ease-in 0.1s"
            _hover={{ color: 'blackAlpha.500' }}
            to={`/${post.user.username}`}
          >
            {post.user.username}
          </Link>
          <Text color="gray" fontSize="14px">
            • {`${moment(new Date(post.createdAt ?? ''), 'MMDD').fromNow()}`}
          </Text>
        </Flex>
        <Box h="560px" mb="10px">
          <Image
            src={post.imageUrl}
            alt="Post photo"
            minWidth="100%"
            h="100%"
            objectFit="cover"
          />
        </Box>
        <HStack mb="10px" spacing="3">
          <Heart
            size="25"
            cursor="pointer"
            weight={post.liked_by_viewer ? 'fill' : undefined}
            color={post.liked_by_viewer ? 'red' : undefined}
            onClick={onOpenPostModal}
          />
          <ChatCircle
            size="25"
            color="black"
            cursor="pointer"
            onClick={onOpenPostModal}
          />
        </HStack>
        <Box mb="8px" fontSize="13px" color="blackAlpha.800" fontWeight="black">
          {post.likes_count} curtida
          {post.likes_count !== 1 && 's'}
        </Box>
        <Text fontSize="13px" mb="6px" wordBreak="break-word">
          <Link
            as={ReactLink}
            mr="6px"
            color="blackAlpha.800"
            fontWeight="black"
            transition="ease-in 0.1s"
            _hover={{ color: 'blackAlpha.500' }}
            to={`/${post.user.username}`}
          >
            {post.user.username}
          </Link>
          {post.description}
        </Text>
        {post.comments_count > 0 && (
          <>
            <Text
              mb="6px"
              w="fit-content"
              fontSize="13px"
              color="gray"
              cursor="pointer"
              onClick={onOpenPostModal}
            >
              Ver todos os comentários
            </Text>
            {post.comments.edges[0] && (
              <Text fontSize="13px" mb="6px" wordBreak="break-word">
                <Link
                  as={ReactLink}
                  mr="6px"
                  color="blackAlpha.800"
                  fontWeight="black"
                  transition="ease-in 0.1s"
                  _hover={{ color: 'blackAlpha.500' }}
                  to={`/${post.comments.edges[0].node.user.username}`}
                >
                  {post.comments.edges[0].node.user.username}
                </Link>
                {post.comments.edges[0].node.content}
              </Text>
            )}
            {post.comments.edges[1] && (
              <Text fontSize="13px" mb="6px" wordBreak="break-word">
                <Link
                  as={ReactLink}
                  mr="6px"
                  color="blackAlpha.800"
                  fontWeight="black"
                  transition="ease-in 0.1s"
                  _hover={{ color: 'blackAlpha.500' }}
                  to={`/${post.comments.edges[1].node.user.username}`}
                >
                  {post.comments.edges[1].node.user.username}
                </Link>
                {post.comments.edges[1].node.content}
              </Text>
            )}
          </>
        )}
      </Box>
      <Box
        className="divider"
        w="100%"
        mb="20px"
        borderBottom="1px solid lightgray"
      ></Box>
    </Box>
  );
};
