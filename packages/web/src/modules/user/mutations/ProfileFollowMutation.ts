import { graphql } from 'react-relay';

export const ProfileFollowMutation = graphql`
  mutation ProfileFollowMutation($input: FollowUserInput!) {
    UserFollowMutation(input: $input) {
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
