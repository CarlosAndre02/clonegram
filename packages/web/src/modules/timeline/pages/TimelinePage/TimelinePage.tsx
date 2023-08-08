import {
  Center,
  Container,
  Flex,
  useDisclosure,
  Spinner
} from '@chakra-ui/react';
import { useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import InfiniteScroll from 'react-infinite-scroller';
import { useState } from 'react';

import { TimelineQuery } from '../../queries/TimelineQuery';
import { TimelineQuery as TimelineQueryType } from '../../queries/__generated__/TimelineQuery.graphql';
import { FeedFragment } from './FeedFragment';
import { FeedPaginationQuery } from './__generated__/FeedPaginationQuery.graphql';
import { TimelinePost } from './TimelinePost';
import { PostModal, Post } from '@/shared/PostModal/PostModal';
import { Header } from '@/shared/Header/Header';

export default function TimelinePage() {
  const query = useLazyLoadQuery<TimelineQueryType>(TimelineQuery, {});
  const { data, loadNext, isLoadingNext } = usePaginationFragment<
    FeedPaginationQuery,
    any
  >(FeedFragment, query);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onOpenModal = (node: any) => {
    setCurrentPost({ node });
    onOpen();
  };

  const loadMore = () => {
    if (isLoadingNext) {
      return;
    }
    loadNext(3);
  };

  const loaderComponent = (
    <Center key={0}>
      <Spinner size="md" thickness="5px" />
    </Center>
  );

  return (
    <>
      <Header me={query.me} />
      <Container maxW="870px" p="unset" mb="50px" pt="50px">
        <Center>
          <Flex direction="column" w="460px">
            <InfiniteScroll
              pageStart={0}
              loadMore={loadMore}
              hasMore={data.PostTimelineQuery.pageInfo.hasNextPage}
              loader={loaderComponent}
              useWindow
            >
              {data.PostTimelineQuery.edges.map(({ node }: any) => {
                return (
                  <TimelinePost
                    key={node.id}
                    onOpenPostModal={() => onOpenModal(node)}
                    post={node}
                  />
                );
              })}
            </InfiniteScroll>
          </Flex>
        </Center>
        <PostModal
          isOpenModal={isOpen}
          onCloseModal={() => {
            setCurrentPost(null);
            onClose();
          }}
          selectedPost={currentPost}
          meUsername={query.me?.username}
        />
      </Container>
    </>
  );
}
