import { graphql } from 'react-relay';

export const PostGridMeFragment = graphql`
  fragment PostGridMeFragment_user on User {
    username
  }
`;
