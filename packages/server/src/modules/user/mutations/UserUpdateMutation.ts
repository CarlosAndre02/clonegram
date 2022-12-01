import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import { UserModel } from '../UserModel';
import { UserType } from '../UserType';
import { GraphQLContext } from '@/modules/graphql/types';

export const UserUpdateMutation = mutationWithClientMutationId({
  name: 'UpdateUser',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    fullname: {
      type: GraphQLString
    },
    biography: {
      type: GraphQLString
    }
  },
  mutateAndGetPayload: async (
    { id, fullname, biography },
    ctx: GraphQLContext
  ) => {
    // TODO: Uncomment when login is implemented
    // if (!ctx.user) {
    //   return {
    //     error: 'Sorry! You must be logged in to continue'
    //   };
    // }

    const { id: userId } = fromGlobalId(id);
    // if (ctx.user._id !== userId) {
    //   return {
    //     error: "Sorry! You're unauthorized to continue"
    //   };
    // }

    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: { fullname, biography } },
      { new: true, runValidators: true }
    );

    if (!user) return { error: 'User does not exist' };

    return {
      user,
      error: null
    };
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: ({ user }) => user
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
