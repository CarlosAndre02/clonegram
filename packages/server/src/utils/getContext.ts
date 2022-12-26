import Koa from 'koa';

import { GraphQLContext } from '@/modules/graphql/types';
import { getDataloaders } from '@/modules/graphql/loaderRegister';
import { getUserByAccessToken } from '@/modules/auth/AuthService';

export const getContext = async (
  context: Koa.Context
): Promise<GraphQLContext> => {
  const token = context.headers['authorization'];
  const user = token ? await getUserByAccessToken(token) : null;

  return {
    user,
    dataloaders: getDataloaders()
  };
};
