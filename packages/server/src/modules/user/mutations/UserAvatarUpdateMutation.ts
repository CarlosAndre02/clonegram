import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLUpload } from 'graphql-upload-cjs';

import { UserModel } from '../UserModel';
import { GraphQLContext } from '@/modules/graphql/types';
import { uploadObjectToS3, deleteObjectFromS3 } from '@/services/S3Service';

export const UserAvatarUpdateMutation = mutationWithClientMutationId({
  name: 'UpdateUserAvatar',
  description: 'Create or update user avatar',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    file: {
      type: new GraphQLNonNull(GraphQLUpload)
    }
  },
  mutateAndGetPayload: async ({ id, file }, ctx: GraphQLContext) => {
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

    const { createReadStream, mimetype } = await file;
    const mimetypeAllowed = ['image/jpeg', 'image/png'];

    if (!mimetypeAllowed.includes(mimetype)) {
      return {
        error: 'File mimetype not allowed'
      };
    }

    if (user.avatarUrl) {
      await deleteObjectFromS3(`avatar/${user._id}`);
    }

    const fileReadStream = createReadStream();
    const responseUpload = await uploadObjectToS3(
      fileReadStream,
      `avatar/${user._id}`
    );

    const userUpdated = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: { avatarUrl: responseUpload?.Location } },
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
