import { GraphQLID, GraphQLNonNull } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import { UserType } from '../UserType';
import { unfollowUser } from '../UserService';
import { GraphQLContext } from '@/modules/graphql/types';
import { AuthError, BadRequestError } from '@/shared/AppErrors';

export const UserUnfollowMutation = mutationWithClientMutationId({
  name: 'UnfollowUser',
  inputFields: {
    followeeId: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  mutateAndGetPayload: async (
    { followeeId: followeeGlobalId },
    ctx: GraphQLContext
  ) => {
    if (!ctx.user)
      throw new AuthError('Sorry! You must be logged in to continue');

    const { id: followeeId } = fromGlobalId(followeeGlobalId);
    if (ctx.user.id === followeeId)
      throw new BadRequestError("You can't unfollow yourself");

    const { follower, followee } = await unfollowUser(ctx.user.id, followeeId);

    return { follower, followee };
  },
  outputFields: {
    follower: {
      type: UserType,
      resolve: ({ follower }) => follower
    },
    followee: {
      type: UserType,
      resolve: ({ followee }) => followee
    }
  }
});
