import { graphql } from 'react-relay';

export const UserUpdateMutation = graphql`
  mutation UserUpdateMutation($input: UpdateUserInput!) {
    UserUpdateMutation(input: $input) {
      user {
        id
        fullname
        biography
      }
      error
    }
  }
`;
