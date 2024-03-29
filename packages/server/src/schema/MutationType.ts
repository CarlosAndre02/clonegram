import { GraphQLObjectType } from 'graphql';

import * as userMutations from '@/modules/user/mutations';
import * as authMutations from '@/modules/auth/mutations';
import * as postMutations from '@/modules/post/mutations';
import * as commentMutations from '@/modules/comment/mutations';

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root of all mutations',
  fields: () => ({
    ...userMutations,
    ...authMutations,
    ...postMutations,
    ...commentMutations
  })
});
