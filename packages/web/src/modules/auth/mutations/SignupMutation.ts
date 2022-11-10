import { graphql } from 'react-relay';

export const SignupMutation = graphql`
  mutation SignupMutation($input: CreateUserInput!) {
    CreateUserMutation(input: $input) {
      user {
        id
        username
        fullname
        email
      }
      error
    }
  }
`;
