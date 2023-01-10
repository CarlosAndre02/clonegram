import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useMutation } from 'react-relay';
import { useNavigate } from 'react-router-dom';

import { LogoutMutation } from './mutations/LogoutMutation';
import { LogoutMutation as LogoutMutationType } from './mutations/__generated__/LogoutMutation.graphql';
import { getToken, setToken, deleteToken } from './localStorage';

export type UserToken = {
  accessToken: string | null;
  refreshToken: string | null;
  expiresDate: string | null;
};

type AuthContextType = {
  userToken: UserToken | null;
  loginUser: (userPayload: UserToken) => void;
  logoutUser: () => void;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [userToken, setUserToken] =
    useState<AuthContextType['userToken']>(null);
  const navigate = useNavigate();
  const [commitLogout] = useMutation<LogoutMutationType>(LogoutMutation);

  const loginUser = useCallback<AuthContextType['loginUser']>(
    (userPayload: UserToken) => {
      setToken(userPayload);
      setUserToken(userPayload);
    },
    []
  );

  const logoutUser = useCallback<AuthContextType['logoutUser']>(() => {
    commitLogout({
      variables: {
        input: {}
      },
      onCompleted: (_, error) => {
        if (error) throw new Error(error[0].message);
      },
      onError: () => {
        throw new Error('An unexpected error occurred');
      }
    });

    deleteToken();
    setUserToken(null);
  }, [commitLogout]);

  useEffect(() => {
    const userPayload = getToken();
    if (userPayload) {
      const expirationDate = new Date(userPayload.expiresDate ?? '').getTime();
      const currentDate = new Date().getTime();

      if (currentDate > expirationDate) {
        logoutUser();
        navigate('/');
        return;
      }

      setUserToken(userPayload);
    }
  }, [logoutUser, navigate]);

  return (
    <AuthContext.Provider value={{ userToken, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('You need to use the AuthProvider');
  }
  return context;
};
