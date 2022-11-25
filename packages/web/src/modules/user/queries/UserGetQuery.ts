import { graphql } from 'react-relay';

export const UserGetQuery = graphql`
  query UserGetQuery($username: String!) {
    GetUserQuery(username: $username) {
      id
      fullname
      username
      biography
      followers_count
      following_count
      posts_count
      followed_by_viewer
    }
  }
`;
