import { graphql } from 'react-relay';

export const ProfileCommentPostMutation = graphql`
  mutation ProfileCommentPostMutation($input: CreateCommentInput!) {
    CommentCreateMutation(input: $input) {
      comment {
        id
        user {
          id
          username
          avatarUrl
        }
        content
        createdAt
        updatedAt
      }
    }
  }
`;
