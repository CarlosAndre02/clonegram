import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLUpload } from 'graphql-upload-cjs';
import crypto from 'crypto';

import { PostType } from '../PostType';
import { createPost } from '../PostService';
import { addPostToUser } from '@/modules/user/UserService';
import { GraphQLContext } from '@/modules/graphql/types';
import { uploadObjectToS3 } from '@/services/S3Service';
import { AuthError, BadRequestError } from '@/shared/AppErrors';

export const PostCreateMutation = mutationWithClientMutationId({
  name: 'CreatePost',
  inputFields: {
    description: {
      type: new GraphQLNonNull(GraphQLString)
    },
    file: {
      type: new GraphQLNonNull(GraphQLUpload)
    }
  },
  mutateAndGetPayload: async ({ description, file }, ctx: GraphQLContext) => {
    if (!ctx.user)
      throw new AuthError('Sorry! You must be logged in to continue');

    const { createReadStream, mimetype, filename } = await file;
    const mimetypeAllowed = ['image/jpeg', 'image/png'];

    if (!mimetypeAllowed.includes(mimetype))
      throw new BadRequestError('File mimetype not allowed');

    const fileReadStream = createReadStream();
    const random = crypto.randomBytes(16).toString('hex');
    const fileKey = `post/${random}-${filename}`;
    const responseUpload = await uploadObjectToS3(fileReadStream, fileKey);

    const post = await createPost({
      description,
      user: ctx.user.id,
      image: { key: fileKey, url: responseUpload?.Location }
    });

    await addPostToUser(ctx.user.id, post.id);

    return { post };
  },
  outputFields: {
    post: {
      type: PostType,
      resolve: ({ post }) => post
    }
  }
});
