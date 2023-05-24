import { graphql } from 'react-relay';

export const ModalPostDeleteMutation = graphql`
  mutation ModalPostDeleteMutation($input: DeletePostInput!) {
    PostDeleteMutation(input: $input) {
      post {
        id @deleteRecord
      }
    }
  }
`;
