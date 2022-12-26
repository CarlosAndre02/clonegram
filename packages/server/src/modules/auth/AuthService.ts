import { sign } from 'jsonwebtoken';

import { AuthModel, IAuth, AuthDocument } from './AuthModel';
import { config } from '@/config/env';
import { addDays } from '@/shared/DateProvider';

export const createAccessToken = (userId: IAuth['user']): string => {
  return sign({ userId }, config.secretAccessToken ?? '', {
    expiresIn: config.expiresInAccessToken
  });
};

export const createRefreshToken = (userId: IAuth['user']): string => {
  return sign({ userId }, config.secretRefreshToken ?? '', {
    expiresIn: config.expiresInRefreshToken
  });
};

export const saveAuthenticatedUser = async ({
  user,
  refreshToken,
  expiresDate
}: IAuth): Promise<AuthDocument> => {
  return await new AuthModel({ user, refreshToken, expiresDate }).save();
};

export const authenticateUser = async (
  userId: IAuth['user']
): Promise<AuthDocument> => {
  const refreshToken = createRefreshToken(userId);

  const expiresDate = addDays(Number(config.expiresInRefreshTokenDays));

  return await saveAuthenticatedUser({
    user: userId,
    refreshToken,
    expiresDate
  });
};

export const logoutUser = async (user: string): Promise<void> => {
  await AuthModel.deleteMany({ user });
};
