import { useCallback, useEffect, useState } from 'react';
import { useMutation } from 'react-relay';
import {
  GraphQLTaggedNode,
  MutationParameters,
  PayloadError,
  DeclarativeMutationConfig,
  SelectorStoreUpdater,
  UploadableMap
} from 'relay-runtime';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/modules/auth/AuthContext';
import { useRefreshToken } from '@/modules/auth/useRefreshToken';

type UseMutationConfig<TMutation extends MutationParameters> = {
  configs?: Array<DeclarativeMutationConfig>;
  onError?: (error: Error) => void | null;
  onCompleted?: (
    response: TMutation['response'],
    errors: readonly PayloadError[] | null | undefined
  ) => void | null;
  onUnsubscribe?: () => void | null;
  optimisticResponse?: any;
  optimisticUpdater?: SelectorStoreUpdater | null;
  updater?: SelectorStoreUpdater | null;
  uploadables?: UploadableMap;
  variables: TMutation['variables'];
};

type PayloadErrorExtension = PayloadError & {
  extensions: Record<string, string | number>;
};

export const useCustomMutation = <TMutation extends MutationParameters>(
  mutation: GraphQLTaggedNode
): [(config: UseMutationConfig<TMutation>) => void, boolean] => {
  const [shouldRetry, setShouldRetry] = useState(false);
  const [currentConfig, setCurrentConfig] =
    useState<UseMutationConfig<TMutation> | null>(null);
  const { logoutUser } = useAuth();
  const [refreshToken, isRefreshLoading] = useRefreshToken();
  const navigate = useNavigate();
  const [commitMutation, isInFlight] = useMutation<TMutation>(mutation);

  const commit = useCallback(
    (config: UseMutationConfig<TMutation>) => {
      commitMutation({
        ...config,
        onCompleted: (response, errors) => {
          const error = errors as PayloadErrorExtension[];
          if (error && error[0].extensions.statusCode === 401) {
            try {
              refreshToken();
              setCurrentConfig(config);
              setShouldRetry(true);
            } catch (_) {
              logoutUser();
              navigate('/');
            }
            return;
          }
          config.onCompleted && config.onCompleted(response, errors);
        }
      });
    },
    [commitMutation, logoutUser, navigate, refreshToken]
  );

  useEffect(() => {
    if (!isRefreshLoading && shouldRetry && currentConfig) {
      commitMutation(currentConfig);
      setShouldRetry(false);
    }
  }, [isRefreshLoading, shouldRetry, currentConfig, commitMutation]);

  return [commit, isInFlight];
};
