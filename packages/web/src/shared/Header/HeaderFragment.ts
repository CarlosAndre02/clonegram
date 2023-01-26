import { graphql } from 'react-relay';

export const HeaderFragment = graphql`
  fragment HeaderFragment_user on User {
    username
    avatarUrl
  }
`;
