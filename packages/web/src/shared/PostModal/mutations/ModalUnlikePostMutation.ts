import { graphql } from 'react-relay';

export const ModalUnlikePostMutation = graphql`
  mutation ModalUnlikePostMutation($input: UnlikePostInput!) {
    PostUnlikeMutation(input: $input) {
      post {
        id
        likes_count
        liked_by_viewer
      }
    }
  }
`;
