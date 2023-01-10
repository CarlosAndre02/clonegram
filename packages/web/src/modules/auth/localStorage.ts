import { UserToken } from './AuthContext';

export const getToken = (): UserToken | null => {
  const userPayload = localStorage.getItem('Clonegram_userTokens');
  return userPayload ? JSON.parse(userPayload) : null;
};

export const setToken = (token: UserToken) => {
  localStorage.setItem('Clonegram_userTokens', JSON.stringify(token));
};

export const deleteToken = () => {
  localStorage.removeItem('Clonegram_userTokens');
};
