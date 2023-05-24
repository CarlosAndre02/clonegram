import { Avatar, Box, Flex, Text, Link } from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';
import moment from 'moment';

type CommentProps = {
  avatar: string | null | undefined;
  username: string | null | undefined;
  content: string | null | undefined;
  createdAt: string | null | undefined;
  onCloseModal?: VoidFunction;
};

export const Comment = ({
  avatar,
  username,
  content,
  createdAt,
  onCloseModal
}: CommentProps) => {
  return (
    <Flex align="center" mb="4">
      <Avatar
        src={avatar ?? undefined}
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
            onClick={onCloseModal}
            to={`/${username}`}
          >
            {username}
          </Link>
          {content}
        </Text>
        <Text fontSize="10px" color="gray">
          {`${moment(new Date(createdAt ?? ''), 'MMDD').fromNow()}`}
        </Text>
      </Box>
    </Flex>
  );
};
