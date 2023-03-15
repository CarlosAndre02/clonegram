import { graphql } from 'react-relay';

export const CreatePostMutation = graphql`
  mutation CreatePostMutation($input: CreatePostInput!) {
    PostCreateMutation(input: $input) {
      post {
        id
        description
        imageUrl
        comments_count
        likes_count
        createdAt
        updatedAt
      }
    }
  }
`;
