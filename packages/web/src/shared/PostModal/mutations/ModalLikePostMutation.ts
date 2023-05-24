import { graphql } from 'react-relay';

export const ModalLikePostMutation = graphql`
  mutation ModalLikePostMutation($input: LikePostInput!) {
    PostLikeMutation(input: $input) {
      post {
        id
        likes_count
        liked_by_viewer
      }
    }
  }
`;
