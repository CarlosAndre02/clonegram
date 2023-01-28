import { graphql } from 'react-relay';

export const ProfileUnfollowMutation = graphql`
  mutation ProfileUnfollowMutation($input: UnfollowUserInput!) {
    UserUnfollowMutation(input: $input) {
      follower {
        id
        following_count
      }
      followee {
        id
        followers_count
        followed_by_viewer
      }
    }
  }
`;
