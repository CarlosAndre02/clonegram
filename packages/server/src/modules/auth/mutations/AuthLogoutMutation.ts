import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString } from 'graphql';

import { logoutUser } from '../AuthService';
import { AuthError } from '@/shared/AppErrors';

export const AuthLogoutMutation = mutationWithClientMutationId({
  name: 'LogoutUser',
  inputFields: {},
  mutateAndGetPayload: async (_, ctx) => {
    if (!ctx.user)
      throw new AuthError('Sorry! You must be logged in to continue');

    await logoutUser(ctx.user._id);

    return { deletedUserId: ctx.user.id };
  },
  outputFields: {
    deletedUserId: {
      type: GraphQLString,
      resolve: ({ deletedUserId }) => deletedUserId
    }
  }
});
