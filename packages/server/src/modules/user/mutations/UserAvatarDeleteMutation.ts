import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import { UserModel } from '../UserModel';
import { UserType } from '../UserType';
import { GraphQLContext } from '@/modules/graphql/types';
import { deleteObjectFromS3 } from '@/services/S3Service';
import { AuthError } from '@/shared/AppErrors';

export const UserAvatarDeleteMutation = mutationWithClientMutationId({
  name: 'DeleteUserAvatar',
  description: 'Delete user avatar',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  mutateAndGetPayload: async ({ id }, ctx: GraphQLContext) => {
    if (!ctx.user)
      throw new AuthError('Sorry! You must be logged in to continue');

    const { id: userId } = fromGlobalId(id);
    if (ctx.user.id !== userId)
      throw new AuthError("Sorry! You're unauthorized to continue");

    const user = await UserModel.findOne({ _id: userId });
    if (!user) return { error: 'This user does not exist' };

    if (!user.avatar) {
      return { error: 'There is no avatar to delete' };
    }

    await deleteObjectFromS3(user.avatar.key);
    const userUpdated = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: { avatar: null } },
      { new: true }
    );

    return {
      user: userUpdated,
      error: null
    };
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: ({ user }) => user
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
