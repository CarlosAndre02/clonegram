import { GraphQLObjectType, GraphQLString } from 'graphql';

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root of all mutations',
  fields: {
    hello_world: {
      type: GraphQLString,
      resolve: () => 'Hello world from mutation'
    }
  }
});
