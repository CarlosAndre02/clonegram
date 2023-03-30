import { graphql } from 'react-relay';

export const ProfilePostDeleteMutation = graphql`
  mutation ProfilePostDeleteMutation($input: DeletePostInput!) {
    PostDeleteMutation(input: $input) {
      post {
        id @deleteRecord
      }
    }
  }
`;
