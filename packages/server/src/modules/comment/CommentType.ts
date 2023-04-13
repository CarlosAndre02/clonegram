import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';
import {
  connectionDefinitions,
  timestampResolver
} from '@entria/graphql-mongo-helpers';

import { load } from './CommentLoader';
import { CommentDocument } from './CommentModel';
import {
  registerTypeLoader,
  nodeInterface
} from '@/modules/graphql/typeRegister';
import { UserType } from '@/modules/user/UserType';
import { getUserById } from '@/modules/user/UserService';

export const CommentType = new GraphQLObjectType<CommentDocument>({
  name: 'Comment',
  description: 'Comment data',
  fields: () => ({
    id: globalIdField('Comment'),
    user: {
      type: new GraphQLNonNull(UserType),
      resolve: (comment) => {
        return getUserById(comment.user.toString());
      }
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (comment) => comment.content
    },
    ...timestampResolver
  }),
  interfaces: () => [nodeInterface]
});

export const CommentConnection = connectionDefinitions({
  name: 'Comment',
  nodeType: CommentType
});

registerTypeLoader(CommentType, load);
