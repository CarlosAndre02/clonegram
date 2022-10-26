import { GraphQLObjectType } from 'graphql';

import { nodeField, nodesField } from '../modules/graphql/typeRegister';

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all queries',
  fields: () => ({
    node: nodeField,
    nodes: nodesField
  })
});
