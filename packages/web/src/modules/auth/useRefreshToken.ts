import { useCallback } from 'react';
import { useMutation } from 'react-relay';

import { useAuth } from './AuthContext';
import { RefreshTokenMutation } from './mutations/RefreshTokenMutation';
import { RefreshTokenMutation as RefreshTokenMutationType } from './mutations/__generated__/RefreshTokenMutation.graphql';

type RefreshToken = (cb?: VoidFunction, handleError?: VoidFunction) => void;

type useRefreshTokenType = {
  refreshToken: RefreshToken;
};

export const useRefreshToken = (): useRefreshTokenType => {
  const { userToken, loginUser } = useAuth();
  const [commitRefreshToken, isRefreshLoading] =
    useMutation<RefreshTokenMutationType>(RefreshTokenMutation);

  const refreshToken = useCallback<RefreshToken>(
    (cb, handleError) => {
      if (!userToken?.refreshToken)
        throw new Error('You must be logged in to continue');

      commitRefreshToken({
        variables: {
          input: {
            refreshToken: userToken.refreshToken ?? ''
          }
        },
        onCompleted: ({ AuthRefreshTokenMutation }, error) => {
          if (error) {
            handleError && handleError();
            return;
          }

          if (AuthRefreshTokenMutation?.accessToken) {
            const { refreshToken, expiresDate } = userToken;
            loginUser({
              accessToken: AuthRefreshTokenMutation?.accessToken,
              refreshToken,
              expiresDate
            });

            cb && cb();
          }
        },
        onError: () => {
          handleError && handleError();
        }
      });
    },
    [commitRefreshToken, loginUser, userToken]
  );

  return { refreshToken };
};
