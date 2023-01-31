import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import { PostType } from '../PostType';
import { updatePost } from '../PostService';
import { GraphQLContext } from '@/modules/graphql/types';
import { AuthError } from '@/shared/AppErrors';

export const PostUpdateMutation = mutationWithClientMutationId({
  name: 'UpdatePost',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    description: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ id, description }, ctx: GraphQLContext) => {
    if (!ctx.user)
      throw new AuthError('Sorry! You must be logged in to continue');

    const { id: postId } = fromGlobalId(id);
    const postUpdated = await updatePost({
      id: postId,
      user: ctx.user.id,
      description
    });

    return { post: postUpdated };
  },
  outputFields: {
    post: {
      type: PostType,
      resolve: ({ post }) => post
    }
  }
});
