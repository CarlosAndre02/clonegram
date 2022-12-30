import { graphql } from 'react-relay';

export const LoginMutation = graphql`
  mutation LoginMutation($input: LoginUserInput!) {
    AuthLoginMutation(input: $input) {
      token {
        id
        accessToken
        refreshToken
        expiresDate
        user {
          username
        }
      }
    }
  }
`;
