import { apiConfig, assertApiModeAllowed, isMockMode } from './config';
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

async function notImplemented(mode: string): Promise<never> {
  throw new Error(
    `${mode} API calls are not enabled in Phase 2. SecurePay mobile uses mock mode by default.`,
  );
}

export const securepayApi = {
  getMode: () => apiConfig.mode,

  getCurrentUser: async (): Promise<ApiUser> => {
    assertApiModeAllowed();
    if (isMockMode()) {
      return mockGetCurrentUser();
    }
    return notImplemented(apiConfig.mode);
  },

  getKSNumberProfile: async (): Promise<KSNumberProfile> => {
    assertApiModeAllowed();
    if (isMockMode()) {
      return mockGetKSNumberProfile();
    }
    return notImplemented(apiConfig.mode);
  },

  getSecureLinks: async (): Promise<SecureLinkSummary[]> => {
    assertApiModeAllowed();
    if (isMockMode()) {
      return mockGetSecureLinks();
    }
    return notImplemented(apiConfig.mode);
  },

  getSecureLinkBySlug: async (slug: string): Promise<SecureLinkDetail | null> => {
    assertApiModeAllowed();
    if (isMockMode()) {
      return mockGetSecureLinkBySlug(slug);
    }
    return notImplemented(apiConfig.mode);
  },

  createSecureLinkDraft: async (input: SecureLinkDraftInput): Promise<SecureLinkDetail> => {
    assertApiModeAllowed();
    if (isMockMode()) {
      return mockCreateSecureLinkDraft(input);
    }
    return notImplemented(apiConfig.mode);
  },

  createGroupSecureLinkDraft: async (
    input: GroupSecureLinkDraftInput,
  ): Promise<GroupSecureLinkDetail> => {
    assertApiModeAllowed();
    if (isMockMode()) {
      return mockCreateGroupSecureLinkDraft(input);
    }
    return notImplemented(apiConfig.mode);
  },

  getPaymentReadyReadiness: async (): Promise<PaymentReadyReadiness> => {
    assertApiModeAllowed();
    if (isMockMode()) {
      return mockGetPaymentReadyReadiness();
    }
    return notImplemented(apiConfig.mode);
  },

  getAccountReadiness: async (): Promise<AccountReadiness> => {
    assertApiModeAllowed();
    if (isMockMode()) {
      return mockGetAccountReadiness();
    }
    return notImplemented(apiConfig.mode);
  },

  getTransactionHistory: async (): Promise<SecurePayTransaction[]> => {
    assertApiModeAllowed();
    if (isMockMode()) {
      return mockGetTransactionHistory();
    }
    return notImplemented(apiConfig.mode);
  },
};

export type SecurePayApi = typeof securepayApi;
