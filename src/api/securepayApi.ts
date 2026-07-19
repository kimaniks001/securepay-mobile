import {
  apiConfig,
  assertApiModeAllowed,
  getEnvironmentLabel,
  isApiEnvironmentReady,
  isMockMode,
  isStagingMode,
} from './config';
import { guardMobileAction } from './mobileActionGuards';
import {
  mockCreateGroupSecureLinkDraft,
  mockCreateSecureLinkDraft,
  mockGetAccountReadiness,
  mockGetCurrentUser,
  mockGetKSNumberProfile,
  mockGetPaymentReadyReadiness,
  mockGetSecureLinkBySlug,
  mockGetSecureLinks,
  mockGetTransactionHistory,
} from './mockSecurepayApi';
import {
  stagingGetAccountReadiness,
  stagingGetCurrentUser,
  stagingGetKSNumberProfile,
  stagingGetPaymentReadyReadiness,
  stagingGetSecureLinkBySlug,
  stagingGetSecureLinks,
  stagingGetTransactionHistory,
} from './stagingSecurepayApi';
import type {
  AccountReadiness,
  ApiUser,
  GroupSecureLinkDetail,
  GroupSecureLinkDraftInput,
  KSNumberProfile,
  PaymentReadyReadiness,
  SecureLinkDetail,
  SecureLinkDraftInput,
  SecureLinkSummary,
  SecurePayTransaction,
} from './types';

function useMockBecauseUnsafe(): boolean {
  return isMockMode();
}

function useStagingReads(): boolean {
  return isStagingMode() && isApiEnvironmentReady();
}

async function guardWriteAttempt(): Promise<void> {
  const guard = guardMobileAction('release');
  if (!guard.allowed) {
    throw new Error(
      'This action is controlled by SecurePay backend and is not available from the mobile app.',
    );
  }
}

export const securepayApi = {
  getMode: () => apiConfig.effectiveMode,
  getRequestedMode: () => apiConfig.requestedMode,
  getEnvironmentLabel,
  isReady: () => isApiEnvironmentReady(),
  getStatusMessage: () => apiConfig.statusMessage,

  getCurrentUser: async (): Promise<ApiUser> => {
    assertApiModeAllowed();
    if (useMockBecauseUnsafe()) return mockGetCurrentUser();
    if (useStagingReads()) return stagingGetCurrentUser();
    return mockGetCurrentUser();
  },

  getKSNumberProfile: async (): Promise<KSNumberProfile> => {
    assertApiModeAllowed();
    if (useMockBecauseUnsafe()) return mockGetKSNumberProfile();
    if (useStagingReads()) return stagingGetKSNumberProfile();
    return mockGetKSNumberProfile();
  },

  getSecureLinks: async (): Promise<SecureLinkSummary[]> => {
    assertApiModeAllowed();
    if (useMockBecauseUnsafe()) return mockGetSecureLinks();
    if (useStagingReads()) return stagingGetSecureLinks();
    return mockGetSecureLinks();
  },

  getSecureLinkBySlug: async (slug: string): Promise<SecureLinkDetail | GroupSecureLinkDetail | null> => {
    assertApiModeAllowed();
    if (useMockBecauseUnsafe()) return mockGetSecureLinkBySlug(slug);
    if (useStagingReads()) return stagingGetSecureLinkBySlug(slug);
    return mockGetSecureLinkBySlug(slug);
  },

  createSecureLinkDraft: async (input: SecureLinkDraftInput): Promise<SecureLinkDetail> => {
    assertApiModeAllowed();
    await guardWriteAttempt();
    if (isMockMode()) return mockCreateSecureLinkDraft(input);
    throw new Error('API writes are disabled in Mobile Phase 3.');
  },

  createGroupSecureLinkDraft: async (
    input: GroupSecureLinkDraftInput,
  ): Promise<GroupSecureLinkDetail> => {
    assertApiModeAllowed();
    await guardWriteAttempt();
    if (isMockMode()) return mockCreateGroupSecureLinkDraft(input);
    throw new Error('API writes are disabled in Mobile Phase 3.');
  },

  getPaymentReadyReadiness: async (): Promise<PaymentReadyReadiness> => {
    assertApiModeAllowed();
    if (useMockBecauseUnsafe()) return mockGetPaymentReadyReadiness();
    if (useStagingReads()) return stagingGetPaymentReadyReadiness();
    return mockGetPaymentReadyReadiness();
  },

  getAccountReadiness: async (): Promise<AccountReadiness> => {
    assertApiModeAllowed();
    if (useMockBecauseUnsafe()) return mockGetAccountReadiness();
    if (useStagingReads()) return stagingGetAccountReadiness();
    return mockGetAccountReadiness();
  },

  getTransactionHistory: async (): Promise<SecurePayTransaction[]> => {
    assertApiModeAllowed();
    if (useMockBecauseUnsafe()) return mockGetTransactionHistory();
    if (useStagingReads()) return stagingGetTransactionHistory();
    return mockGetTransactionHistory();
  },
};

export type SecurePayApi = typeof securepayApi;
