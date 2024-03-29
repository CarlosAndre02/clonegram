import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql';
import { connectionFromArray, globalIdField } from 'graphql-relay';
import {
  connectionDefinitions,
  connectionArgs,
  timestampResolver
} from '@entria/graphql-mongo-helpers';

import { load } from './PostLoader';
import { PostDocument } from './PostModel';
import {
  registerTypeLoader,
  nodeInterface
} from '@/modules/graphql/typeRegister';
import { GraphQLContext } from '@/modules/graphql/types';
import { UserType } from '@/modules/user/UserType';
import { getUserById } from '@/modules/user/UserService';
import { CommentConnection } from '@/modules/comment/CommentType';
import { CommentModel } from '@/modules/comment/CommentModel';

export const PostType = new GraphQLObjectType<PostDocument>({
  name: 'Post',
  description: 'Post data',
  fields: () => ({
    id: globalIdField('Post'),
    user: {
      type: new GraphQLNonNull(UserType),
      resolve: (post) => {
        return getUserById(post.user.toString());
      }
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (post) => post.description
    },
    imageUrl: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (post) => post.image.url
    },
    comments: {
      type: new GraphQLNonNull(CommentConnection.connectionType),
      args: { ...connectionArgs },
      resolve: async (post, args) => {
        const comments = await CommentModel.find({
          _id: { $in: post.comments }
        }).sort({ createdAt: -1 });
        return connectionFromArray(comments, args);
      }
    },
    comments_count: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (post) => post.comments.length
    },
    likes_count: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (post) => post.likes.length
    },
    liked_by_viewer: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (post, _args, context: GraphQLContext) => {
        if (!context.user) return false;

        return post.likes.some((like) => like.toString() === context?.user?.id);
      }
    },
    ...timestampResolver
  }),
  interfaces: () => [nodeInterface]
});

export const PostConnection = connectionDefinitions({
  name: 'Post',
  nodeType: PostType
});

registerTypeLoader(PostType, load);
