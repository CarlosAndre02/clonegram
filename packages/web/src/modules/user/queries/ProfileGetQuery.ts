import { graphql } from 'react-relay';

export const ProfileGetQuery = graphql`
  query ProfileGetQuery($username: String!) {
    GetUserQuery(username: $username) {
      id
      fullname
      username
      biography
      avatarUrl
      followers_count
      following_count
      posts_count
      followed_by_viewer
    }
  }
`;
