import { graphql } from 'react-relay';

export const ProfileAvatarUpdateMutation = graphql`
  mutation ProfileAvatarUpdateMutation($input: UpdateUserAvatarInput!) {
    UserAvatarUpdateMutation(input: $input) {
      user {
        id
        avatarUrl
      }
      error
    }
  }
`;
