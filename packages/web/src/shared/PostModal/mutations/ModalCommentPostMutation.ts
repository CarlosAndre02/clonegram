import { graphql } from 'react-relay';

export const ModalCommentPostMutation = graphql`
  mutation ModalCommentPostMutation($input: CreateCommentInput!) {
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
