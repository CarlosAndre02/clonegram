import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql';
import { globalIdField } from 'graphql-relay';
import {
  connectionDefinitions,
  connectionArgs,
  withFilter
} from '@entria/graphql-mongo-helpers';

import {
  registerTypeLoader,
  nodeInterface
} from '@/modules/graphql/typeRegister';
import UserLoader, { load } from './UserLoader';
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
    // posts: {

    // }
    followers: {
      type: new GraphQLNonNull(UserConnection.connectionType),
      args: { ...connectionArgs },
      resolve: (user, args, context: GraphQLContext) => {
        return UserLoader.loadAll(
          context,
          withFilter(args, { following: user.id })
        );
      }
    },
    following: {
      type: new GraphQLNonNull(UserConnection.connectionType),
      args: { ...connectionArgs },
      resolve: async (user, args, context: GraphQLContext) => {
        return UserLoader.loadAll(
          context,
          withFilter(args, { followers: user.id })
        );
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
