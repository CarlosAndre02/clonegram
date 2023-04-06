import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import { connectionArgs, withFilter } from '@entria/graphql-mongo-helpers';

import { PostConnection } from '../PostType';
import PostLoader from '../PostLoader';
import { getUserById } from '@/modules/user/UserService';
import { GraphQLContext } from '@/modules/graphql/types';
import { AuthError } from '@/shared/AppErrors';

export const PostTimelineQuery: GraphQLFieldConfig<any, GraphQLContext, any> = {
  type: new GraphQLNonNull(PostConnection.connectionType),
  args: { ...connectionArgs },
  resolve: async (_, args, ctx) => {
    if (!ctx.user)
      throw new AuthError('Sorry! You must be logged in to continue');

    const user = await getUserById(ctx.user.id);
    user?.following.push(ctx.user.id);

    return await PostLoader.loadAll(
      ctx,
      withFilter(args, { user: { $in: user?.following } })
    );
  }
};
