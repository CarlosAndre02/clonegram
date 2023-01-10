import { graphql } from 'react-relay';

export const ProfileEditGetQuery = graphql`
  query ProfileEditGetQuery {
    me {
      id
      username
      fullname
      biography
      avatarUrl
    }
  }
`;
