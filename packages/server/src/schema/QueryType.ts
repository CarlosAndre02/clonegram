import { GraphQLObjectType } from 'graphql';

import { nodeField, nodesField } from '../modules/graphql/typeRegister';
import * as userQueries from '@/modules/user/queries';

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all queries',
  fields: () => ({
    node: nodeField,
    nodes: nodesField,
    ...userQueries
  })
});
