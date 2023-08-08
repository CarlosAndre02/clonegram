import { graphql } from 'react-relay';

export const FeedFragment = graphql`
  fragment FeedFragment_query on Query
  @argumentDefinitions(
    first: { type: Int, defaultValue: 3 }
    after: { type: String }
  )
  @refetchable(queryName: "FeedPaginationQuery") {
    PostTimelineQuery(first: $first, after: $after)
      @connection(key: "Feed_PostTimelineQuery", filters: []) {
      endCursorOffset
      startCursorOffset
      count
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          user {
            id
            username
            avatarUrl
          }
          imageUrl
          description
          comments_count
          likes_count
          liked_by_viewer
          createdAt
          comments {
            edges {
              node {
                id
                user {
                  id
                  username
                  avatarUrl
                }
                content
                createdAt
              }
            }
          }
        }
      }
    }
  }
`;
