import { GraphQLFieldConfig } from 'graphql';

import { UserType } from '../UserType';

export const me: GraphQLFieldConfig<any, any, any> = {
  type: UserType,
  resolve: (_, _args, context) => context.user
};
