import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo
} from 'react';
import { useMutation } from 'react-relay';
import { useNavigate } from 'react-router-dom';
import decodeJWT, { JwtPayload } from 'jwt-decode';

import { getToken, setToken, deleteToken } from './localStorage';
import { LogoutMutation } from './mutations/LogoutMutation';
import { LogoutMutation as LogoutMutationType } from './mutations/__generated__/LogoutMutation.graphql';
import { RefreshTokenMutation } from './mutations/RefreshTokenMutation';
import { RefreshTokenMutation as RefreshTokenMutationType } from './mutations/__generated__/RefreshTokenMutation.graphql';

export type UserToken = {
  accessToken: string | null;
  refreshToken: string | null;
  expiresDate: string | null;
};

type AuthContextType = {
  isLoggedIn: boolean;
  loginUser: (userPayload: UserToken) => void;
  logoutUser: (cb?: VoidFunction) => void;
  refreshToken: () => void;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<AuthContextType['isLoggedIn']>(
    () => !!getToken
  );
  const navigate = useNavigate();
  const [commitLogout] = useMutation<LogoutMutationType>(LogoutMutation);
  const [commitRefreshToken] =
    useMutation<RefreshTokenMutationType>(RefreshTokenMutation);

  const loginUser = useCallback<AuthContextType['loginUser']>(
    (userPayload: UserToken) => {
      setToken(userPayload);
      setIsLoggedIn(true);
    },
    []
  );

  const logoutUser = useCallback<AuthContextType['logoutUser']>(
    (cb) => {
      commitLogout({
        variables: {
          input: {}
        },
        onCompleted: (_, error) => {
          if (error) {
            navigate('/');
            return;
          }

          cb && cb();
        },
        onError: () => {
          navigate('/');
        }
      });

      deleteToken();
      setIsLoggedIn(false);
    },
    [commitLogout, navigate]
  );

  const refreshToken = useCallback<AuthContextType['refreshToken']>(() => {
    const userToken = getToken();
    if (!isLoggedIn || !userToken) return;

    commitRefreshToken({
      variables: {
        input: {
          refreshToken: userToken.refreshToken ?? ''
        }
      },
      onCompleted: ({ AuthRefreshTokenMutation }, error) => {
        if (error) {
          logoutUser(() => navigate('/'));
          return;
        }

        if (AuthRefreshTokenMutation?.accessToken) {
          const { refreshToken, expiresDate } = userToken;
          loginUser({
            accessToken: AuthRefreshTokenMutation?.accessToken,
            refreshToken,
            expiresDate
          });
        }
      }
    });
  }, [commitRefreshToken, isLoggedIn, loginUser, logoutUser, navigate]);

  useEffect(() => {
    const userToken = getToken();
    if (userToken?.accessToken) {
      const claims: JwtPayload = decodeJWT(userToken.accessToken);
      const expirationTimeInSeconds = claims.exp! * 1000;
      const now = new Date();
      if (expirationTimeInSeconds <= now.getTime()) {
        logoutUser(() => navigate('/'));
      }
    }

    const interval = setInterval(() => refreshToken(), 1000 * 60 * 14); // 14 minutes
    return () => clearInterval(interval);
  }, [isLoggedIn, logoutUser, navigate, refreshToken]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      isLoggedIn,
      loginUser,
      logoutUser,
      refreshToken
    }),
    [isLoggedIn, loginUser, logoutUser, refreshToken]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('You need to use the AuthProvider');
  }
  return context;
};
