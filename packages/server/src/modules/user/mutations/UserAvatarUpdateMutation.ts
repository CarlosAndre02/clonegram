import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLUpload } from 'graphql-upload-cjs';
import crypto from 'crypto';

import { UserModel } from '../UserModel';
import { GraphQLContext } from '@/modules/graphql/types';
import { uploadObjectToS3, deleteObjectFromS3 } from '@/services/S3Service';
import { UserType } from '../UserType';

export const UserAvatarUpdateMutation = mutationWithClientMutationId({
  name: 'UpdateUserAvatar',
  description: 'Create or update user avatar',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    file: {
      type: GraphQLUpload
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

    const { createReadStream, mimetype, filename } = await file;

    const mimetypeAllowed = ['image/jpeg', 'image/png'];
    if (!mimetypeAllowed.includes(mimetype)) {
      return {
        error: 'File mimetype not allowed'
      };
    }

    if (user.avatar?.key) {
      await deleteObjectFromS3(user.avatar.key);
    }

    const fileReadStream = createReadStream();
    const random = crypto.randomBytes(16).toString('hex');
    const fileKey = `avatar/${random}-${filename}`;
    const responseUpload = await uploadObjectToS3(fileReadStream, fileKey);

    const userUpdated = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          avatar: {
            key: fileKey,
            url: responseUpload?.Location
          }
        }
      },
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
