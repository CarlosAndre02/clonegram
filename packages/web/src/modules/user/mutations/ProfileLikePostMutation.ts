import { graphql } from 'react-relay';

export const ProfileLikePostMutation = graphql`
  mutation ProfileLikePostMutation($input: LikePostInput!) {
    PostLikeMutation(input: $input) {
      post {
        id
        likes_count
        liked_by_viewer
      }
    }
  }
`;
