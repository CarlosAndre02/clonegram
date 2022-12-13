import { graphql } from 'react-relay';

export const ProfileAvatarDeleteMutation = graphql`
  mutation ProfileAvatarDeleteMutation($input: DeleteUserAvatarInput!) {
    UserAvatarDeleteMutation(input: $input) {
      user {
        id
        avatarUrl
      }
      error
    }
  }
`;
