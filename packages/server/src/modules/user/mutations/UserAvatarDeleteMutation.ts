import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import { UserModel } from '../UserModel';
import { GraphQLContext } from '@/modules/graphql/types';
import { deleteObjectFromS3 } from '@/services/S3Service';

export const UserAvatarDeleteMutation = mutationWithClientMutationId({
  name: 'DeleteUserAvatar',
  description: 'Delete user avatar',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  mutateAndGetPayload: async ({ id }, ctx: GraphQLContext) => {
    // TODO: Uncomment when login is implemented
    // if (!ctx.user) {
    //   return {
    //     error: 'Sorry! You must be logged in to continue'
    //   };
    // }

    const { id: userId } = fromGlobalId(id);
    // if (ctx.user._id !== userId) {
    //   return {
    //     error: "Sorry! You're unauthorized to continue"
    //   };
    // }

    const user = await UserModel.findOne({ _id: userId });
    if (!user) return { error: 'This user does not exist' };

    if (!user.avatarUrl) {
      return { error: 'There is no avatar to delete' };
    }

    await deleteObjectFromS3(`avatar/${user._id}`);
    const userUpdated = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: { avatarUrl: null } },
      { new: true }
    );

    return {
      avatarUrl: userUpdated?.avatarUrl,
      error: null
    };
  },
  outputFields: {
    avatarUrl: {
      type: GraphQLString,
      resolve: ({ avatarUrl }) => avatarUrl
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
