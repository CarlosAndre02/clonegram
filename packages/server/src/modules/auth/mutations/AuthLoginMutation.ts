import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { createAccessToken, authenticateUser } from '../AuthService';
import { AuthType } from '../AuthType';
import { getUserByEmail } from '@/modules/user/UserService';
import { BadRequestError } from '@/shared/AppErrors';

export const AuthLoginMutation = mutationWithClientMutationId({
  name: 'LoginUser',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ email, password }) => {
    const user = await getUserByEmail(email);
    if (!user) throw new BadRequestError('User does not exist');

    if (!user.isPasswordValid(password))
      throw new BadRequestError('Invalid credentials');

    const accessToken = createAccessToken(user.id);
    const authenticatedUser = await authenticateUser(user.id);
    authenticatedUser['accessToken'] = accessToken;

    return { token: authenticatedUser };
  },
  outputFields: {
    token: {
      type: AuthType,
      resolve: ({ token }) => token
    }
  }
});
