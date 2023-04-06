import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql';
import { globalIdField, connectionFromArray } from 'graphql-relay';
import {
  connectionDefinitions,
  connectionArgs
} from '@entria/graphql-mongo-helpers';

import { UserModel } from './UserModel';
import { load } from './UserLoader';
import { PostConnection } from '@/modules/post/PostType';
import { PostModel } from '@/modules/post/PostModel';
import {
  registerTypeLoader,
  nodeInterface
} from '@/modules/graphql/typeRegister';
import { GraphQLContext } from '@/modules/graphql/types';

export const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'User data',
  fields: () => ({
    id: globalIdField('User'),
    fullname: {
      type: GraphQLString,
      resolve: (user) => user.fullname
    },
    username: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user.username
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user.email
    },
    biography: {
      type: GraphQLString,
      resolve: (user) => user.biography
    },
    avatarUrl: {
      type: GraphQLString,
      resolve: (user) => user.avatar?.url
    },
    posts: {
      type: new GraphQLNonNull(PostConnection.connectionType),
      args: { ...connectionArgs },
      resolve: async (user, args) => {
        const posts = await PostModel.find({
          _id: { $in: user.posts }
        }).sort({ createdAt: -1 });
        return connectionFromArray(posts, args);
      }
    },
    followers: {
      type: new GraphQLNonNull(UserConnection.connectionType),
      args: { ...connectionArgs },
      resolve: async (user, args) => {
        const followers = await UserModel.find({
          _id: { $in: user.followers }
        });
        return connectionFromArray(followers, args);
      }
    },
    following: {
      type: new GraphQLNonNull(UserConnection.connectionType),
      args: { ...connectionArgs },
      resolve: async (user, args) => {
        const usersFollowing = await UserModel.find({
          _id: { $in: user.following }
        });
        return connectionFromArray(usersFollowing, args);
      }
    },
    followers_count: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (user) => user.followers.length
    },
    following_count: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (user) => user.following.length
    },
    posts_count: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (user) => user.posts.length
    },
    followed_by_viewer: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (user, _args, context: GraphQLContext) => {
        if (!context?.user || user.id === context?.user.id) return false;

        return user.followers.includes(context?.user.id);
      }
    }
  }),
  interfaces: () => [nodeInterface]
});

export const UserConnection = connectionDefinitions({
  name: 'User',
  nodeType: UserType
});

registerTypeLoader(UserType, load);
