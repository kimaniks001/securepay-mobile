import { getSafeErrorMessage, toThrownError } from './apiErrors';
import { apiConfig, isApiEnvironmentReady } from './config';
import { gatewayEndpoints } from './endpoints';
import { httpGet } from './httpClient';
import {
  mapAccountReadiness,
  mapApiUser,
  mapGroupSecureLinkDetail,
  mapKSNumberProfile,
  mapPaymentReadyReadinessDto,
  mapSecureLinkDetail,
  mapSecureLinkList,
  mapTransactionHistory,
} from './mappers';
import {
  mockGetAccountReadiness,
  mockGetCurrentUser,
  mockGetKSNumberProfile,
  mockGetPaymentReadyReadiness,
  mockGetSecureLinkBySlug,
  mockGetSecureLinks,
  mockGetTransactionHistory,
} from './mockSecurepayApi';
import type {
  AccountReadiness,
  ApiUser,
  GroupSecureLinkDetail,
  KSNumberProfile,
  PaymentReadyReadiness,
  SecureLinkDetail,
  SecureLinkSummary,
  SecurePayTransaction,
} from './types';

async function withStagingFallback<T>(
  loader: () => Promise<T>,
  fallback: () => Promise<T>,
): Promise<T> {
  if (!isApiEnvironmentReady() || !apiConfig.baseUrl) {
    return fallback();
  }

  try {
    return await loader();
  } catch {
    return fallback();
  }
}

async function fetchJson<T>(path: string, mapper: (raw: unknown) => T): Promise<T> {
  const result = await httpGet<unknown>(path);
  if (!result.ok) {
    throw toThrownError(result.error);
  }
  return mapper(result.data);
}

export async function stagingGetCurrentUser(): Promise<ApiUser> {
  return withStagingFallback(
    () => fetchJson(gatewayEndpoints.currentUser, mapApiUser),
    mockGetCurrentUser,
  );
}

export async function stagingGetKSNumberProfile(): Promise<KSNumberProfile> {
  return withStagingFallback(
    () => fetchJson(gatewayEndpoints.ksNumberProfile, mapKSNumberProfile),
    mockGetKSNumberProfile,
  );
}

export async function stagingGetSecureLinks(): Promise<SecureLinkSummary[]> {
  return withStagingFallback(
    () => fetchJson(gatewayEndpoints.secureLinks, mapSecureLinkList),
    mockGetSecureLinks,
  );
}

export async function stagingGetSecureLinkBySlug(
  slug: string,
): Promise<SecureLinkDetail | GroupSecureLinkDetail | null> {
  return withStagingFallback(
    async () => {
      const detailResult = await httpGet<unknown>(gatewayEndpoints.secureLinkBySlug(slug));
      if (detailResult.ok) {
        const record = detailResult.data as Record<string, unknown>;
        const kind = String(record.kind ?? record.type ?? '').toLowerCase();
        if (kind.includes('group')) {
          return mapGroupSecureLinkDetail(detailResult.data);
        }
        return mapSecureLinkDetail(detailResult.data);
      }

      if (detailResult.error.category === 'not_found') {
        const groupResult = await httpGet<unknown>(gatewayEndpoints.groupSecureLinkBySlug(slug));
        if (groupResult.ok) {
          return mapGroupSecureLinkDetail(groupResult.data);
        }
        if (groupResult.error.category === 'not_found') {
          return null;
        }
        throw toThrownError(groupResult.error);
      }

      throw toThrownError(detailResult.error);
    },
    () => mockGetSecureLinkBySlug(slug),
  );
}

export async function stagingGetPaymentReadyReadiness(): Promise<PaymentReadyReadiness> {
  return withStagingFallback(
    () => fetchJson(gatewayEndpoints.paymentReadyReadiness, mapPaymentReadyReadinessDto),
    mockGetPaymentReadyReadiness,
  );
}

export async function stagingGetAccountReadiness(): Promise<AccountReadiness> {
  return withStagingFallback(
    () => fetchJson(gatewayEndpoints.accountReadiness, mapAccountReadiness),
    mockGetAccountReadiness,
  );
}

export async function stagingGetTransactionHistory(): Promise<SecurePayTransaction[]> {
  return withStagingFallback(
    () => fetchJson(gatewayEndpoints.transactionHistory, mapTransactionHistory),
    mockGetTransactionHistory,
  );
}

export function getStagingApiDiagnostics() {
  return {
    mode: apiConfig.effectiveMode,
    baseUrl: apiConfig.baseUrl,
    environmentLabel: apiConfig.environmentLabel,
    status: apiConfig.status,
    statusMessage: apiConfig.statusMessage,
    endpoints: gatewayEndpoints,
  };
}

export function formatStagingErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return getSafeErrorMessage({
    category: 'unknown_error',
    message: 'Unable to load staging data.',
  });
}
