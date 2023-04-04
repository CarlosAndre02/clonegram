import { GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import { PostType } from '../PostType';
import { unlikePost } from '../PostService';
import { GraphQLContext } from '@/modules/graphql/types';
import { AuthError } from '@/shared/AppErrors';

export const PostUnlikeMutation = mutationWithClientMutationId({
  name: 'UnlikePost',
  inputFields: {
    postId: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  mutateAndGetPayload: async ({ postId }, ctx: GraphQLContext) => {
    if (!ctx.user)
      throw new AuthError('Sorry! You must be logged in to continue');

    const { id } = fromGlobalId(postId);
    const post = await unlikePost(id, ctx.user.id);

    return { post };
  },
  outputFields: {
    post: {
      type: PostType,
      resolve: ({ post }) => post
    }
  }
});
