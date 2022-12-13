import { graphql } from 'react-relay';

export const ProfileEditGetQuery = graphql`
  query ProfileEditGetQuery($username: String!) {
    GetUserQuery(username: $username) {
      id
      username
      fullname
      biography
      avatarUrl
    }
  }
`;
