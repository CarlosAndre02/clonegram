import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import { CommentType } from '../CommentType';
import { createComment } from '../CommentService';
import {
  addCommentToPost,
  postAlreadyExists
} from '@/modules/post/PostService';
import { GraphQLContext } from '@/modules/graphql/types';
import { AuthError, BadRequestError } from '@/shared/AppErrors';

export const CommentCreateMutation = mutationWithClientMutationId({
  name: 'CreateComment',
  inputFields: {
    postId: {
      type: new GraphQLNonNull(GraphQLID)
    },
    content: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ postId, content }, ctx: GraphQLContext) => {
    if (!ctx.user)
      throw new AuthError('Sorry! You must be logged in to continue');

    const { id } = fromGlobalId(postId);
    if (!postAlreadyExists(id))
      throw new BadRequestError('Post does not exist');

    const comment = await createComment({ user: ctx.user.id, content });
    await addCommentToPost(id, comment.id);

    return { comment };
  },
  outputFields: {
    comment: {
      type: CommentType,
      resolve: ({ comment }) => comment
    }
  }
});
