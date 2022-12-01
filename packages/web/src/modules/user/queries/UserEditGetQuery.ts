import { graphql } from 'react-relay';

export const UserEditGetQuery = graphql`
  query UserEditGetQuery($username: String!) {
    GetUserQuery(username: $username) {
      id
      fullname
      biography
    }
  }
`;
