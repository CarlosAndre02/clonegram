import { graphql } from 'react-relay';

export const PostGridFragment = graphql`
  fragment PostGridFragment_user on User {
    avatarUrl
    username
    posts {
      edges {
        node {
          id
          description
          imageUrl
          comments_count
          likes_count
          liked_by_viewer
          createdAt
          updatedAt
        }
      }
    }
  }
`;
