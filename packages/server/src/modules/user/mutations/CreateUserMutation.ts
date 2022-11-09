import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { UserModel } from '../UserModel';
import { UserType } from '../UserType';

export const CreateUserMutation = mutationWithClientMutationId({
  name: 'CreateUser',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    fullname: {
      type: GraphQLString
    },
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ email, fullname, username, password }) => {
    const emailAlreadyExists = await UserModel.findOne({ email });
    if (emailAlreadyExists) {
      return {
        error: 'Email already exists'
      };
    }

    const usernameAlreadyExists = await UserModel.findOne({ username });
    if (usernameAlreadyExists) {
      return {
        error: 'Username already exists'
      };
    }

    const user = new UserModel({ email, fullname, username, password }).save();

    // TODO: Generate a access token

    return {
      user, // this will be changed
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
