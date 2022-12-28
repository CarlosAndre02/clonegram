import jwt, { JwtPayload } from 'jsonwebtoken';

import { AuthModel, IAuth, AuthDocument } from './AuthModel';
import { UserDocument } from '@/modules/user/UserModel';
import { getUserById } from '@/modules/user/UserService';
import { config } from '@/config/env';
import { addDays } from '@/shared/DateProvider';

export const createAccessToken = (userId: IAuth['user'] | string): string => {
  return jwt.sign({ userId }, config.secretAccessToken ?? '', {
    expiresIn: config.expiresInAccessToken
  });
};

export const createRefreshToken = (userId: IAuth['user'] | string): string => {
  return jwt.sign({ userId }, config.secretRefreshToken ?? '', {
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

export const getUserByAccessToken = async (
  jwtToken: string
): Promise<UserDocument | null> => {
  const [, token] = jwtToken.split(' ');

  const data = jwt.verify(token, config.secretAccessToken || '') as JwtPayload;
  return await getUserById(data.userId);
};

export const getUserIdFromRefreshToken = (token: string): string => {
  const data = jwt.verify(token, config.secretRefreshToken || '') as JwtPayload;
  return data.userId;
};

export const refreshTokenExists = (
  refreshToken: string,
  user: string
): boolean => {
  return !!AuthModel.exists({ refreshToken, user });
};
