import { GraphQLObjectType, GraphQLString } from 'graphql';

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all queries',
  fields: {
    hello_world: {
      type: GraphQLString,
      resolve: () => 'Hello world'
    }
  }
});
