import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString } from 'graphql';

import {
  getUserIdFromRefreshToken,
  refreshTokenExists,
  createAccessToken
} from '../AuthService';
import { BadRequestError } from '@/shared/AppErrors';

export const AuthRefreshTokenMutation = mutationWithClientMutationId({
  name: 'RefreshToken',
  inputFields: {
    refreshToken: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ refreshToken }) => {
    const userId = getUserIdFromRefreshToken(refreshToken);

    if (!refreshTokenExists(refreshToken, userId))
      throw new BadRequestError('Refresh token does not exist');

    const accessToken = createAccessToken(userId);
    return { accessToken };
  },
  outputFields: {
    accessToken: {
      type: GraphQLString,
      resolve: ({ accessToken }) => accessToken
    }
  }
});
