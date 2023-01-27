import { GraphQLID, GraphQLNonNull } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import { UserType } from '../UserType';
import { followUser } from '../UserService';
import { GraphQLContext } from '@/modules/graphql/types';
import { AuthError, BadRequestError } from '@/shared/AppErrors';

export const UserFollowMutation = mutationWithClientMutationId({
  name: 'FollowUser',
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
      throw new BadRequestError("You can't follow yourself");

    const { follower, followee } = await followUser(ctx.user.id, followeeId);

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
