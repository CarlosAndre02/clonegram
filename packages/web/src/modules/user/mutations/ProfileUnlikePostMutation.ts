import { graphql } from 'react-relay';

export const ProfileUnlikePostMutation = graphql`
  mutation ProfileUnlikePostMutation($input: UnlikePostInput!) {
    PostUnlikeMutation(input: $input) {
      post {
        id
        likes_count
        liked_by_viewer
      }
    }
  }
`;
