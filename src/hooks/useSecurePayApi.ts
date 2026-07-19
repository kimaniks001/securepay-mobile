import { useCallback, useEffect, useState } from 'react';

import { getEnvironmentLabel, isApiEnvironmentReady } from '../api/config';
import { securepayApi } from '../api/securepayApi';
import type {
  AccountReadiness,
  KSNumberProfile,
  PaymentReadyReadiness,
  SecureLinkSummary,
  SecurePayTransaction,
} from '../api/types';

export type ApiLoadState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  modeLabel: string;
  isEnvironmentReady: boolean;
  refresh: () => Promise<void>;
  retry: () => Promise<void>;
};

function useApiResource<T>(loader: () => Promise<T>): ApiLoadState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const modeLabel = getEnvironmentLabel();
  const isEnvironmentReady = isApiEnvironmentReady();

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loader();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [loader]);

  const retry = refresh;

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, modeLabel, isEnvironmentReady, refresh, retry };
}

export function useKSNumberProfile() {
  return useApiResource<KSNumberProfile>(() => securepayApi.getKSNumberProfile());
}

export function useSecureLinks() {
  return useApiResource<SecureLinkSummary[]>(() => securepayApi.getSecureLinks());
}

export function useTransactionHistory() {
  return useApiResource<SecurePayTransaction[]>(() => securepayApi.getTransactionHistory());
}

export function useAccountReadiness() {
  return useApiResource<AccountReadiness>(() => securepayApi.getAccountReadiness());
}

export function usePaymentReadyReadiness() {
  return useApiResource<PaymentReadyReadiness>(() => securepayApi.getPaymentReadyReadiness());
}

export function useApiEnvironment() {
  return {
    mode: securepayApi.getMode(),
    requestedMode: securepayApi.getRequestedMode(),
    environmentLabel: securepayApi.getEnvironmentLabel(),
    isReady: securepayApi.isReady(),
    statusMessage: securepayApi.getStatusMessage(),
  };
}
