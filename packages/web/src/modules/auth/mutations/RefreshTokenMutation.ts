import { graphql } from 'react-relay';

export const RefreshTokenMutation = graphql`
  mutation RefreshTokenMutation($input: RefreshTokenInput!) {
    AuthRefreshTokenMutation(input: $input) {
      accessToken
    }
  }
`;
