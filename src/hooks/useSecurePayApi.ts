import { useCallback, useEffect, useState } from 'react';

import { securepayApi } from '../api/securepayApi';
import type {
  AccountReadiness,
  KSNumberProfile,
  PaymentReadyReadiness,
  SecureLinkSummary,
  SecurePayTransaction,
} from '../api/types';

type LoadState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

function useApiResource<T>(loader: () => Promise<T>): LoadState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loader();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load data');
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
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
