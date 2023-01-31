import { GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import { PostType } from '../PostType';
import { deletePost } from '../PostService';
import { removePostFromUser } from '@/modules/user/UserService';
import { GraphQLContext } from '@/modules/graphql/types';
import { deleteObjectFromS3 } from '@/services/S3Service';
import { AuthError } from '@/shared/AppErrors';

export const PostDeleteMutation = mutationWithClientMutationId({
  name: 'DeletePost',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  mutateAndGetPayload: async ({ id }, ctx: GraphQLContext) => {
    if (!ctx.user)
      throw new AuthError('Sorry! You must be logged in to continue');

    const { id: postId } = fromGlobalId(id);
    const postDeleted = await deletePost(postId, ctx.user.id);

    await deleteObjectFromS3(postDeleted.image.key);
    await removePostFromUser(ctx.user.id, postDeleted.id);

    return { post: postDeleted };
  },
  outputFields: {
    post: {
      type: PostType,
      resolve: ({ post }) => post
    }
  }
});
