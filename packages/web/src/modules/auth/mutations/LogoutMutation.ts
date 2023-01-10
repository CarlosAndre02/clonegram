import { graphql } from 'react-relay';

export const LogoutMutation = graphql`
  mutation LogoutMutation($input: LogoutUserInput!) {
    AuthLogoutMutation(input: $input) {
      deletedUserId
    }
  }
`;
