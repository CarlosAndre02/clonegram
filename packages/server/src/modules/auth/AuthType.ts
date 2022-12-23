import { GraphQLObjectType, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { load } from './AuthLoader';
import {
  registerTypeLoader,
  nodeInterface
} from '@/modules/graphql/typeRegister';
import { UserType } from '@/modules/user/UserType';
import { getUserById } from '@/modules/user/UserService';

export const AuthType = new GraphQLObjectType({
  name: 'Auth',
  description: 'Auth data',
  fields: () => ({
    id: globalIdField('Auth'),
    user: {
      type: UserType,
      resolve: (auth) => {
        return getUserById(auth.user);
      }
    },
    accessToken: {
      type: GraphQLString,
      resolve: (auth) => auth.accessToken
    },
    refreshToken: {
      type: GraphQLString,
      resolve: (auth) => auth.refreshToken
    },
    expiresDate: {
      type: GraphQLString,
      resolve: (auth) => auth.expiresDate
    }
  }),
  interfaces: () => [nodeInterface]
});

registerTypeLoader(AuthType, load);
