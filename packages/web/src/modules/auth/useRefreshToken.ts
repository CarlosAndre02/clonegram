import { useCallback } from 'react';
import { useMutation } from 'react-relay';

import { useAuth } from './AuthContext';
import { RefreshTokenMutation } from './mutations/RefreshTokenMutation';
import { RefreshTokenMutation as RefreshTokenMutationType } from './mutations/__generated__/RefreshTokenMutation.graphql';

type RefreshToken = () => void;

export const useRefreshToken = (): [() => void, boolean] => {
  const { userToken, loginUser } = useAuth();
  const [commitRefreshToken, isRefreshLoading] =
    useMutation<RefreshTokenMutationType>(RefreshTokenMutation);

  const refreshToken = useCallback<RefreshToken>(() => {
    if (!userToken?.refreshToken)
      throw new Error('You must be logged in to continue');

    commitRefreshToken({
      variables: {
        input: {
          refreshToken: userToken.refreshToken ?? ''
        }
      },
      onCompleted: ({ AuthRefreshTokenMutation }, error) => {
        if (error) throw new Error(error[0].message);
        if (AuthRefreshTokenMutation?.accessToken) {
          const { refreshToken, expiresDate } = userToken;
          loginUser({
            accessToken: AuthRefreshTokenMutation?.accessToken,
            refreshToken,
            expiresDate
          });
        }
      },
      onError: () => {
        throw new Error('An unexpected error occurred');
      }
    });
  }, [commitRefreshToken, loginUser, userToken]);

  return [refreshToken, isRefreshLoading];
};
