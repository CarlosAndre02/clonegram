import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { UserModel } from '../UserModel';
import { UserType } from '../UserType';
import { followUserByUsername } from '../UserService';
import { authenticateUser } from '@/modules/auth/AuthService';
import { AuthType } from '@/modules/auth/AuthType';

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

    const user = await new UserModel({
      email,
      fullname,
      username,
      password
    }).save();

    const authenticatedUser = await authenticateUser(user.id);

    followUserByUsername(user.id, 'ronaldo');
    followUserByUsername(user.id, 'messi');
    followUserByUsername(user.id, 'neymar');

    return {
      user,
      token: authenticatedUser,
      error: null
    };
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: ({ user }) => user
    },
    token: {
      type: AuthType,
      resolve: ({ token }) => token
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
