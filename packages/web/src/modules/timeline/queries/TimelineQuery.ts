import { graphql } from 'react-relay';

export const TimelineQuery = graphql`
  query TimelineQuery {
    ...FeedFragment_query
    me {
      username
      ...HeaderFragment_user
    }
  }
`;
